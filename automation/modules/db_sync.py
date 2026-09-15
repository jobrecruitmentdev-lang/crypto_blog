import os
import json
import urllib.request
import urllib.parse
from config import Config, logger

API_BASE = "https://cryptoairdropai.com/api"
API_SECRET = "cryptoairdropai_master_secret_2026_xyz"

def sync_project_to_mysql(project_dict: dict) -> bool:
    """Inserts or updates a single project in Hostinger MySQL via API."""
    try:
        url = f"{API_BASE}/projects.php"
        data = json.dumps(project_dict).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "Content-Type": "application/json",
                "X-Api-Key": API_SECRET,
                "User-Agent": "CryptoAirdropAI-Automation/1.0"
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=15) as res:
            res_data = json.loads(res.read().decode("utf-8"))
            if res_data.get("success"):
                logger.info(f"[DB SYNC] Project '{project_dict.get('slug')}' synced to MySQL!")
                return True
    except urllib.error.HTTPError as e:
        # If already exists (409), attempt PUT update
        if e.code == 409:
            try:
                put_url = f"{API_BASE}/projects.php?slug={urllib.parse.quote(project_dict.get('slug', ''))}"
                req = urllib.request.Request(
                    put_url,
                    data=data,
                    headers={
                        "Content-Type": "application/json",
                        "X-Api-Key": API_SECRET,
                        "User-Agent": "CryptoAirdropAI-Automation/1.0"
                    },
                    method="PUT"
                )
                with urllib.request.urlopen(req, timeout=15) as res:
                    logger.info(f"[DB SYNC] Project '{project_dict.get('slug')}' updated in MySQL!")
                    return True
            except Exception as put_err:
                logger.error(f"[DB SYNC ERROR] Failed to update project {project_dict.get('slug')}: {put_err}")
                return False
        logger.error(f"[DB SYNC ERROR] HTTP {e.code} for project {project_dict.get('slug')}: {e.read().decode('utf-8', errors='ignore')}")
    except Exception as err:
        logger.error(f"[DB SYNC ERROR] Failed to sync project {project_dict.get('slug')}: {err}")
    return False

def sync_article_to_mysql(article_dict: dict) -> bool:
    """Inserts or updates a single article in Hostinger MySQL via API."""
    try:
        url = f"{API_BASE}/articles.php"
        data = json.dumps(article_dict).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "Content-Type": "application/json",
                "X-Api-Key": API_SECRET,
                "User-Agent": "CryptoAirdropAI-Automation/1.0"
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=15) as res:
            res_data = json.loads(res.read().decode("utf-8"))
            if res_data.get("success"):
                logger.info(f"[DB SYNC] Article '{article_dict.get('slug')}' synced to MySQL!")
                return True
    except urllib.error.HTTPError as e:
        # If already exists (409), attempt PUT update
        if e.code == 409:
            try:
                put_url = f"{API_BASE}/articles.php?slug={urllib.parse.quote(article_dict.get('slug', ''))}"
                req = urllib.request.Request(
                    put_url,
                    data=data,
                    headers={
                        "Content-Type": "application/json",
                        "X-Api-Key": API_SECRET,
                        "User-Agent": "CryptoAirdropAI-Automation/1.0"
                    },
                    method="PUT"
                )
                with urllib.request.urlopen(req, timeout=15) as res:
                    logger.info(f"[DB SYNC] Article '{article_dict.get('slug')}' updated in MySQL!")
                    return True
            except Exception as put_err:
                logger.error(f"[DB SYNC ERROR] Failed to update article {article_dict.get('slug')}: {put_err}")
                return False
        logger.error(f"[DB SYNC ERROR] HTTP {e.code} for article {article_dict.get('slug')}: {e.read().decode('utf-8', errors='ignore')}")
    except Exception as err:
        logger.error(f"[DB SYNC ERROR] Failed to sync article {article_dict.get('slug')}: {err}")
    return False

def sync_batch_to_mysql(projects: list, intelligence: list, guides: list):
    """Syncs lists of projects and articles into Hostinger MySQL."""
    logger.info(f"[+] Starting batch sync to MySQL: {len(projects)} projects, {len(intelligence)} intel, {len(guides)} guides...")
    p_ok = sum(1 for p in projects if sync_project_to_mysql(p))
    i_ok = sum(1 for a in intelligence if sync_article_to_mysql(a))
    g_ok = sum(1 for g in guides if sync_article_to_mysql(g))
    logger.info(f"[+] Batch sync completed! Projects: {p_ok}/{len(projects)}, Intel: {i_ok}/{len(intelligence)}, Guides: {g_ok}/{len(guides)}")
    return (p_ok, i_ok, g_ok)
