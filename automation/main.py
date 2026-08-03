import time
from config import logger
from modules.sheets import sheets_manager
from modules.strapi_client import check_slug, create_blog_post, verify_live
from modules.dedupe import is_topic_tracked
from modules.serper import search_google, format_context
from modules.market_data import get_market_data
from modules.groq_llm import generate_blog_and_seo, title_to_slug
from modules.image import generate_and_upload_image

BLOGS_PER_RUN = 1

def main():
    logger.info("=== Starting CryptoDrop Blog Automation ===")

    # 1. Fetch pending topics from Google Sheet
    pending_topics = sheets_manager.get_pending_topics(limit=15)

    if not pending_topics:
        logger.info("No pending topics found. Exiting.")
        return

    # 2. Filter out keywords already published
    candidates = []
    for item in pending_topics:
        topic = item["topic"]
        if is_topic_tracked(topic):
            logger.info(f"Skipping '{topic}': already tracked in Strapi.")
            sheets_manager.update_status(item["row"], "published")
            continue
        candidates.append(item)
        if len(candidates) >= 5:
            break

    if not candidates:
        logger.info("No new topics to process. Exiting.")
        return

    logger.info(f"Processing cluster of {len(candidates)} keyword(s).")

    # 3. Process the combined topic
    keywords = [c["topic"] for c in candidates]
    row_indices = [c["row"] for c in candidates]
    
    combined_topic = " | ".join(keywords)
    slug = None
    generated_data = None

    logger.info(f"--- Processing Combined Topic: {combined_topic} ---")

    try:
        # Step A: Search for fresh context + market data
        search_results = []
        for kw in keywords[:2]:
            search_results.extend(search_google(kw))
            search_results.extend(get_market_data(kw))
            
        seen_links = set()
        unique_results = []
        for r in search_results:
            if r.get("link") and r.get("link") not in seen_links:
                seen_links.add(r.get("link"))
                unique_results.append(r)

        context_str = format_context(unique_results)
        real_links = [r["link"] for r in unique_results]

        # Step B: Generate SEO title, slug, HTML, FAQs, category
        generated_data = generate_blog_and_seo(combined_topic, context_str, real_links)

        title = generated_data["title"]
        slug = generated_data.get("slug") or title_to_slug(title)

        # Step C: Check slug availability in Strapi
        if not check_slug(slug):
            slug = f"{slug}-ultimate-guide"
            logger.info(f"Slug taken, trying fallback: {slug}")
            if not check_slug(slug):
                logger.warning(f"Fallback slug also taken, skipping cluster: {combined_topic}")
                for row_idx in row_indices:
                    sheets_manager.update_status(row_idx, "slug_conflict")
                return

        # Step D: Generate & upload image
        featured_media_id = generate_and_upload_image(combined_topic, slug=slug)

        # Step E: Publish to Strapi (Draft by default unless AUTO_PUBLISH=true)
        success = create_blog_post(
            slug=slug,
            title=title,
            html_content=generated_data["html"],
            seo=generated_data["seo"],
            featured_media_id=featured_media_id,
            category_name=generated_data.get("category")
        )

        if not success:
            raise ValueError("Failed to create blog post in Strapi")

        # Step F: Verify live / set status
        from config import Config
        is_live = verify_live(slug) if Config.AUTO_PUBLISH else False
        status = "Published" if is_live else "Drafted, pending review"
        
        url_logged = f"{Config.SITE_URL}/blog/{slug}"

        if Config.AUTO_PUBLISH:
            if is_live:
                logger.info(f"Live: {url_logged}")
            else:
                logger.warning(f"Verification failed for: {slug}")
        else:
            logger.info(f"Draft created successfully for: {slug}")

        # Step G: Update Google Sheet
        for row_idx in row_indices:
            sheets_manager.update_status(row_idx, status)
            
        sheets_manager.log_result(
            keyword=combined_topic,
            topic=title,
            information=f"{len(generated_data['html'].split())} words, {len(generated_data.get('faqs', []))} FAQs",
            meta_title=generated_data["seo"].get("meta_title", ""),
            meta_description=generated_data["seo"].get("meta_description", ""),
            slug=slug,
            status=status,
            url=url_logged
        )

    except Exception as e:
        logger.error(f"Error processing '{combined_topic}': {e}", exc_info=True)
        for row_idx in row_indices:
            sheets_manager.update_status(row_idx, "Error")
        sheets_manager.log_result(
            keyword=combined_topic,
            topic=(generated_data or {}).get("title", ""),
            information=str(e),
            meta_title="",
            meta_description="",
            slug=slug or "",
            status="Error",
            url=""
        )

    logger.info("=== Blog Automation Finished ===")

if __name__ == "__main__":
    main()
