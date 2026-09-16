import os
import sys
import json
import time
import argparse
import xml.etree.ElementTree as ET
import urllib.request
import urllib.error

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

# -------------------------------------------------------------
# Configuration & Constants
# -------------------------------------------------------------
HOST = os.getenv("SITE_HOST", "cryptoairdropai.com")
INDEXNOW_KEY = os.getenv("INDEXNOW_KEY", "c0e8a7f93b5d4e1a82649f2b87e651d3")
KEY_LOCATION = f"https://{HOST}/{INDEXNOW_KEY}.txt"
INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"

GOOGLE_SCOPES = ["https://www.googleapis.com/auth/indexing"]
GOOGLE_ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

# -------------------------------------------------------------
# URL Discovery Helpers
# -------------------------------------------------------------
def get_urls_from_sitemap(sitemap_path: str = None) -> list[str]:
    """
    Parses URLs from local sitemap.xml if available, or falls back to live production sitemap.
    """
    if not sitemap_path:
        local_sitemap = os.path.join(PROJECT_ROOT, "web", "out", "sitemap.xml")
        if os.path.exists(local_sitemap):
            sitemap_path = local_sitemap

    urls = []

    # 1. Try local sitemap file
    if sitemap_path and os.path.exists(sitemap_path):
        try:
            tree = ET.parse(sitemap_path)
            root = tree.getroot()
            for elem in root.findall("{http://www.sitemaps.org/schemas/sitemap/0.9}url"):
                loc = elem.find("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")
                if loc is not None and loc.text:
                    urls.append(loc.text.strip())
            if urls:
                print(f"[+] Loaded {len(urls)} URLs from local sitemap: {sitemap_path}")
                return urls
        except Exception as e:
            print(f"[-] Error reading local sitemap: {e}")

    # 2. Try fetching from live production sitemap
    live_sitemap_url = f"https://{HOST}/sitemap.xml"
    print(f"[*] Fetching live sitemap from {live_sitemap_url}...")
    try:
        req = urllib.request.Request(
            live_sitemap_url,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) IndexingBot/1.0"}
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            xml_data = resp.read().decode("utf-8")
            if "<?xml" in xml_data:
                xml_data = xml_data[xml_data.find("<?xml"):]
            root = ET.fromstring(xml_data)
            namespace = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
            for loc in root.findall('sm:url/sm:loc', namespace):
                if loc.text:
                    urls.append(loc.text.strip())
            if urls:
                print(f"[+] Loaded {len(urls)} URLs from live sitemap.")
                return urls
    except Exception as e:
        print(f"[-] Error fetching live sitemap: {e}")

    # Fallback to core routes if sitemap parsing fails
    if not urls:
        urls = [f"https://{HOST}/", f"https://{HOST}/blog/", f"https://{HOST}/guides/", f"https://{HOST}/projects/"]

    return urls

# -------------------------------------------------------------
# Google Indexing API
# -------------------------------------------------------------
def get_google_service_account_credentials():
    """
    Discovers Google Service Account credentials from env var or known paths.
    """
    env_cred = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    candidate_paths = [
        env_cred if env_cred else None,
        os.path.join(PROJECT_ROOT, "cosmic-mariner-503804-c4-981c45ff145b.json"),
        os.path.join(PROJECT_ROOT, "automation", "credentials", "service_account.json"),
        r"C:\hk\DUMP\big_fish_SAGEO\cosmic-mariner-503804-c4-981c45ff145b.json",
    ]

    for path in candidate_paths:
        if path and os.path.exists(path):
            try:
                from google.oauth2 import service_account
                from google.auth.transport.requests import AuthorizedSession
                creds = service_account.Credentials.from_service_account_file(
                    path, scopes=GOOGLE_SCOPES
                )
                session = AuthorizedSession(creds)
                return session, path
            except Exception as e:
                print(f"[-] Error initializing credentials from {path}: {e}")

    return None, None

def submit_google_indexing(urls: list[str]) -> tuple[int, int]:
    """
    Submits a list of URLs to Google Search Indexing API (URL_UPDATED).
    """
    session, cred_path = get_google_service_account_credentials()
    if not session:
        print("[!] Google Indexing API skipped: No valid Google Service Account credentials found.")
        return 0, 0

    print(f"\n[*] Submitting {len(urls)} URLs to Google Search Indexing API (using {os.path.basename(cred_path)})...")
    success_count = 0
    error_count = 0

    for i, url in enumerate(urls):
        payload = {
            "url": url,
            "type": "URL_UPDATED"
        }
        try:
            resp = session.post(GOOGLE_ENDPOINT, data=json.dumps(payload))
            if resp.status_code == 200:
                success_count += 1
                print(f"  [+] Google (200): {url}")
            elif resp.status_code == 429:
                print(f"  [-] Google Quota Exceeded (429) at {url}. Halting further Google submissions.")
                error_count += (len(urls) - i)
                break
            else:
                error_count += 1
                print(f"  [-] Google Error ({resp.status_code}): {url} -> {resp.text[:100]}")
        except Exception as ex:
            error_count += 1
            print(f"  [-] Google Request Exception for {url}: {ex}")

        # Pace requests to respect rate limits
        if i < len(urls) - 1:
            time.sleep(0.25)

    print(f"[✓] Google Indexing API Complete. Success: {success_count}, Errors: {error_count}")
    return success_count, error_count

# -------------------------------------------------------------
# IndexNow (Bing, Yandex, AI Engines)
# -------------------------------------------------------------
def submit_indexnow(urls: list[str]) -> bool:
    """
    Submits a batch of URLs to IndexNow protocol (Bing, Copilot, Yandex, Seznam, Naver).
    """
    if not urls:
        print("[!] No URLs provided for IndexNow submission.")
        return False

    # IndexNow API accepts max 10,000 URLs per payload
    batch_urls = urls[:10000]
    print(f"\n[*] Submitting {len(batch_urls)} URLs to IndexNow ({INDEXNOW_ENDPOINT})...")

    payload = {
        "host": HOST,
        "key": INDEXNOW_KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": batch_urls
    }

    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "CryptoAirdropAI-IndexingPipeline/2.0"
    }

    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(INDEXNOW_ENDPOINT, data=data, headers=headers, method='POST')

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            status = resp.status
            if status in [200, 202]:
                print(f"[✓] IndexNow SUCCESS ({status}): {len(batch_urls)} URLs received and queued for crawling across Bing, Yandex, Seznam, Naver & Copilot.")
                return True
            else:
                print(f"[-] IndexNow Response ({status}): {resp.read().decode('utf-8')}")
                return False
    except urllib.error.HTTPError as e:
        if e.code in [200, 202]:
            print(f"[✓] IndexNow SUCCESS ({e.code}): URLs received and queued.")
            return True
        else:
            print(f"[-] IndexNow HTTP Error {e.code}: {e.read().decode('utf-8')}")
            return False
    except Exception as ex:
        print(f"[-] IndexNow Connection error: {ex}")
        return False

# -------------------------------------------------------------
# Unified Search Engine Notifier
# -------------------------------------------------------------
def notify_search_engines(urls: list[str] = None) -> dict:
    """
    Broadcasts URLs to both IndexNow and Google Search Indexing API.
    """
    if not urls:
        urls = get_urls_from_sitemap()

    if not urls:
        print("[-] No URLs to notify.")
        return {"indexnow": False, "google": (0, 0)}

    print("=" * 65)
    print(f"📡 BROADCASTING {len(urls)} URLS TO SEARCH ENGINES & AI CRAWLERS")
    print("=" * 65)

    # 1. IndexNow (Instant batch notification)
    indexnow_ok = submit_indexnow(urls)

    # 2. Google Search Indexing API (Per-URL push)
    google_success, google_errors = submit_google_indexing(urls)

    print("=" * 65)
    print(f"🏁 Broadcast summary: IndexNow: {'OK' if indexnow_ok else 'FAILED'} | Google: {google_success} OK, {google_errors} Errors")
    print("=" * 65)

    return {
        "indexnow": indexnow_ok,
        "google": (google_success, google_errors)
    }

# -------------------------------------------------------------
# CLI Entrypoint
# -------------------------------------------------------------
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Submit URLs to Google Search Console and IndexNow")
    parser.add_argument("--url", help="Single URL to submit for indexing")
    parser.add_argument("--all", action="store_true", help="Submit all URLs from sitemap.xml")
    parser.add_argument("--discovery", action="store_true", help="Run discovery notification for sitemap URLs (CI/CD mode)")
    args = parser.parse_args()

    if args.url:
        notify_search_engines([args.url])
    elif args.all or args.discovery:
        notify_search_engines()
    else:
        # Default behavior: notify all sitemap URLs
        notify_search_engines()
