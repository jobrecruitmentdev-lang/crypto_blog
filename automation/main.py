import os
import sys
import time
import argparse
from config import Config, logger
from modules.supabase_uploader import check_slug, stage_blog_post
from modules.groq_llm import generate_blog_and_seo, title_to_slug
from modules.content_validator import validate_content_payload
from modules.claim_verifier import verify_claims_and_urls
from modules.internal_linker import inject_internal_links
from modules.github_dispatcher import trigger_github_release_dispatch

# High-Intent Curated 2026 Airdrop Keyword Clusters
CURATED_KEYWORD_QUEUE = [
    "Berachain V2 BGT Proof of Liquidity Airdrop Farming Guide",
    "Story Protocol Intellectual Property Testnet Airdrop Strategy",
    "Fuel Network Layer 2 High Speed Execution Testnet Playbook",
    "Babylon Bitcoin Staking Mainnet Distribution & Points Guide",
    "Eclipse SVM Ethereum Layer 2 Early Positioning Checklist",
    "Symbiotic Restaking Network Allocation & Strategy Guide",
    "Initia Interwoven Rollup Network Incentivized Public Testnet"
]

def run_pipeline(dry_run: bool = False):
    logger.info("=======================================================")
    logger.info("🚀 Starting CryptoDrop Production AI Publishing Engine")
    logger.info("=======================================================")

    # 1. Topic Discovery
    pending_topic = None
    row_idx = None

    try:
        from modules.sheets import sheets_manager
        pending = sheets_manager.get_pending_topics(limit=5)
        if pending:
            pending_topic = pending[0]["topic"]
            row_idx = pending[0]["row"]
            logger.info(f"[+] Loaded topic from Google Sheets: {pending_topic}")
    except Exception as e:
        logger.info(f"[*] Google Sheets inactive ({e}). Checking curated queue.")

    if not pending_topic:
        for kw in CURATED_KEYWORD_QUEUE:
            s = title_to_slug(kw)
            if check_slug(s):
                pending_topic = kw
                break
        if not pending_topic:
            pending_topic = CURATED_KEYWORD_QUEUE[0]

    logger.info(f"🎯 Target Topic: {pending_topic}")

    # 2. Live Fact & Market Grounding Layer
    context_str = ""
    verified_urls = []
    
    # 2a. Serper Live Search Context
    try:
        from modules.serper import search_google, format_context
        if Config.SERPER_API_KEY:
            search_results = search_google(pending_topic)
            context_str += format_context(search_results) + "\n\n"
            verified_urls.extend([r["link"] for r in search_results if r.get("link")])
    except Exception as e:
        logger.warning(f"Search context lookup skipped: {e}")

    # 2b. DeFiLlama TVL + CoinGecko Quantitative Grounding
    try:
        from modules.market_data import get_market_data
        kw_root = pending_topic.split()[0]
        market_metrics = get_market_data(kw_root)
        if market_metrics:
            logger.info(f"📊 Extracted {len(market_metrics)} on-chain data points from DeFiLlama/CoinGecko")
            context_str += "### Verified On-Chain & Market Evidence (DeFiLlama / CoinGecko):\n"
            for m in market_metrics:
                context_str += f"- {m['title']}: {m['snippet']} (Ref: {m['link']})\n"
                if m.get("link"):
                    verified_urls.append(m["link"])
            context_str += "\n"
    except Exception as e:
        logger.warning(f"Market data grounding skipped: {e}")

    grounding_payload = {
        "verified_urls": verified_urls,
        "contract_addresses": []
    }

    # 3. LLM Generation via Groq
    logger.info("🧠 Generating AEO/GEO structured article with Groq LLM...")
    generated_data = generate_blog_and_seo(pending_topic, context_str, verified_urls)

    title = generated_data["title"]
    slug = generated_data["slug"]
    raw_html = generated_data["html"]
    seo = generated_data["seo"]
    category = generated_data.get("category", "Ecosystem Alpha")

    # 4. Deterministic BeautifulSoup Internal Linker
    logger.info("🔗 Injecting deterministic internal link mesh...")
    linked_html, linked_entities = inject_internal_links(raw_html, current_slug=slug)
    logger.info(f"[+] Injected {len(linked_entities)} canonical internal links: {[e['anchor_text'] for e in linked_entities]}")

    payload = {
        "title": title,
        "slug": slug,
        "html": linked_html,
        "seo": seo,
        "author_slug": "ai-intelligence-engine"
    }

    # 5. Pre-Ingestion Content & Claim Quality Gates
    logger.info("🛡️ Running 14-point content quality & claim validator...")
    is_valid_content, content_errors = validate_content_payload(payload, grounding_payload)
    is_valid_claims, claim_errors = verify_claims_and_urls(linked_html, grounding_payload)

    all_errors = content_errors + claim_errors
    if not (is_valid_content and is_valid_claims):
        logger.error("❌ Content Validation Failed with the following errors:")
        for err in all_errors:
            logger.error(f"  -> {err}")
        return False

    logger.info("✅ 14-point quality and claim validation PASSED!")

    if dry_run:
        logger.info("[*] DRY RUN mode enabled. Skipping Supabase insert and GitHub dispatch.")
        logger.info(f"[*] Title: {title}")
        logger.info(f"[*] Slug: {slug}")
        logger.info(f"[*] HTML length: {len(linked_html)} characters")
        return True

    # 6. Stage in Supabase PostgreSQL
    logger.info("⚡ Staging article in Supabase (status='staged')...")
    post_id, release_id, success = stage_blog_post(
        slug=slug,
        title=title,
        html_content=linked_html,
        seo=seo,
        linked_entities=linked_entities,
        category_name=category
    )

    if not success:
        logger.error("❌ Failed to stage post in Supabase.")
        return False

    # 7. Trigger GitHub Actions CI/CD Pipeline
    logger.info(f"🚀 Triggering GitHub Actions Release Pipeline (Release ID: {release_id})...")
    dispatched = trigger_github_release_dispatch(release_id=release_id, post_id=post_id, slug=slug)

    if dispatched:
        logger.info("=======================================================")
        logger.info(f"🎉 Pipeline Complete! Release {release_id} queued for build & live verification.")
        logger.info("=======================================================")
        if row_idx is not None:
            try:
                from modules.sheets import sheets_manager
                sheets_manager.update_status(row_idx, "Staged")
            except Exception:
                pass

        # 8. Instant Search Discovery Broadcast (Google Indexing API + IndexNow)
        try:
            from modules.submit_indexing import notify_search_engines
            post_url = f"{Config.SITE_URL}/blog/{slug}/"
            logger.info(f"📡 Broadcasting new article to search engines: {post_url}")
            notify_search_engines([post_url])
        except Exception as e:
            logger.warning(f"Search discovery notification note: {e}")

        return True
    else:
        logger.error("[-] GitHub dispatch failed.")
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Run validation without staging or dispatching")
    args = parser.parse_args()
    
    run_pipeline(dry_run=args.dry_run)
