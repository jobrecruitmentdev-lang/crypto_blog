import requests
from config import Config, logger

def check_slug(slug: str) -> bool:
    """Returns True if slug is AVAILABLE, False if TAKEN."""
    if not Config.STRAPI_URL or not Config.STRAPI_API_TOKEN:
        logger.warning("No STRAPI config found, assuming slug is available (mock mode).")
        return True

    url = f"{Config.STRAPI_URL}/api/blog-posts"
    headers = {"Authorization": f"Bearer {Config.STRAPI_API_TOKEN}"}
    params = {"filters[slug][$eq]": slug}

    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        return len(data.get("data", [])) == 0
    except Exception as e:
        logger.error(f"Error checking slug in Strapi: {e}")
        return False

def upload_media(image_bytes: bytes, filename: str, mime: str) -> str:
    """Uploads media to Strapi and returns the media ID."""
    if not Config.STRAPI_URL or not Config.STRAPI_API_TOKEN:
        logger.warning("No STRAPI config, skipping upload.")
        return None

    url = f"{Config.STRAPI_URL}/api/upload"
    headers = {"Authorization": f"Bearer {Config.STRAPI_API_TOKEN}"}
    files = {"files": (filename, image_bytes, mime)}

    try:
        response = requests.post(url, headers=headers, files=files, timeout=30)
        response.raise_for_status()
        data = response.json()
        if isinstance(data, list) and len(data) > 0:
            return data[0].get("id")
        return None
    except Exception as e:
        logger.error(f"Error uploading media to Strapi: {e}")
        return None

def create_blog_post(slug, title, html_content, seo, featured_media_id, category_name):
    """Creates a blog post in Strapi (Draft by default)."""
    if not Config.STRAPI_URL or not Config.STRAPI_API_TOKEN:
        logger.warning("No STRAPI config, skipping post creation.")
        return True

    url = f"{Config.STRAPI_URL}/api/blog-posts"
    headers = {
        "Authorization": f"Bearer {Config.STRAPI_API_TOKEN}",
        "Content-Type": "application/json"
    }

    from datetime import datetime
    published_at = datetime.utcnow().isoformat() if Config.AUTO_PUBLISH else None

    payload = {
        "data": {
            "title": title,
            "slug": slug,
            "excerpt": seo.get("meta_description", ""),
            "body": html_content,
            "tag": category_name,
            "seoTitle": seo.get("meta_title", ""),
            "seoDescription": seo.get("meta_description", ""),
            "author": "CryptoDrop Research Desk",
            "publishedAt": published_at
        }
    }
    
    if featured_media_id:
        payload["data"]["coverImage"] = featured_media_id

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        return True
    except Exception as e:
        logger.error(f"Error creating blog post in Strapi: {e}")
        if 'response' in locals():
            logger.error(f"Strapi response: {response.text}")
        return False

def verify_live(slug: str) -> bool:
    """Verifies if the post is live on the frontend site."""
    if not Config.SITE_URL:
        return False
    url = f"{Config.SITE_URL}/blog/{slug}"
    try:
        response = requests.get(url, timeout=10)
        return response.status_code == 200
    except:
        return False
