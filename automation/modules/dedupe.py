import requests
from config import Config, logger

def is_topic_tracked(topic: str) -> bool:
    """Checks if any keyword in the topic cluster is already in Strapi titles."""
    if not Config.STRAPI_URL or not Config.STRAPI_API_TOKEN:
        return False
        
    url = f"{Config.STRAPI_URL}/api/blog-posts"
    headers = {"Authorization": f"Bearer {Config.STRAPI_API_TOKEN}"}
    
    keywords = [k.strip() for k in topic.split('|')]
    
    for kw in keywords:
        params = {"filters[title][$containsi]": kw}
        try:
            response = requests.get(url, headers=headers, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            if len(data.get("data", [])) > 0:
                logger.info(f"Dedup caught: Keyword '{kw}' already exists in a Strapi post title.")
                return True
        except Exception as e:
            logger.error(f"Error checking dedup for '{kw}': {e}")
            
    return False
