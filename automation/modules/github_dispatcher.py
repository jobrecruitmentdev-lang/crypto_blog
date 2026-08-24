import os
import requests
from config import Config, logger

GITHUB_REPO = os.getenv("GITHUB_REPO", "jobrecruitmentdev-lang/crypto_blog")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN") or os.getenv("GITHUB_DISPATCH_TOKEN")

def trigger_github_release_dispatch(release_id: str, post_id: str, slug: str) -> bool:
    """
    Sends a repository_dispatch event to GitHub Actions to trigger the production build & deployment pipeline.
    """
    if not GITHUB_TOKEN:
        logger.warning("[!] GITHUB_TOKEN not configured in environment. Skipping remote GitHub dispatch.")
        logger.info(f"[*] Local dispatch simulation: release_id={release_id}, post_id={post_id}, slug={slug}")
        return True

    url = f"https://api.github.com/repos/{GITHUB_REPO}/dispatches"
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    payload = {
        "event_type": "publish_blog_post",
        "client_payload": {
            "release_id": release_id,
            "post_id": post_id,
            "slug": slug
        }
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        if response.status_code == 204:
            logger.info(f"[+] Successfully dispatched GitHub Actions release for {slug} (Release: {release_id})")
            return True
        else:
            logger.error(f"[-] GitHub dispatch failed ({response.status_code}): {response.text}")
            return False
    except Exception as e:
        logger.error(f"[-] GitHub dispatch request error: {e}")
        return False
