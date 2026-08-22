import os
import json
import time
import requests
import xml.etree.ElementTree as ET
from google.oauth2 import service_account
from google.auth.transport.requests import AuthorizedSession

# Configuration for cryptoairdropai.com
SERVICE_ACCOUNT_FILE = os.path.join(os.path.dirname(__file__), 'cosmic-mariner-503804-c4-981c45ff145b.json')
SITEMAP_URL = "https://cryptoairdropai.com/sitemap.xml"

# The scope required for Google Indexing API
SCOPES = ["https://www.googleapis.com/auth/indexing"]
ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"

def get_urls_from_sitemap(sitemap_url=SITEMAP_URL):
    """Fetches and parses all URLs from the live production sitemap.xml."""
    print(f"Fetching sitemap from: {sitemap_url}...")
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    try:
        resp = requests.get(sitemap_url, headers=headers, timeout=15)
        resp.raise_for_status()
        xml_data = resp.text
        
        if "<?xml" in xml_data:
            xml_data = xml_data[xml_data.find("<?xml"):]
            
        root = ET.fromstring(xml_data)
        namespace = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        
        urls = []
        for url in root.findall('sm:url/sm:loc', namespace):
            if url.text:
                urls.append(url.text.strip())
        return urls
    except Exception as e:
        print(f"Error fetching/parsing sitemap: {e}")
        return []

def get_authorized_session():
    """Authenticates the service account and returns an authorized HTTP session."""
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    return AuthorizedSession(credentials)

def submit_url_for_indexing(session, url, action="URL_UPDATED"):
    """
    Submits a single URL to the Google Indexing API.
    """
    payload = {
        "url": url,
        "type": action
    }
    
    response = session.post(ENDPOINT, data=json.dumps(payload))
    
    if response.status_code == 200:
        print(f"[+] Success (200): {url} submitted for Google indexing.")
    elif response.status_code == 403:
        print(f"[-] Permission Denied (403) for {url}. Ensure Service Account is Owner in GSC.")
    elif response.status_code == 429:
        print(f"[-] Quota Exceeded (429) for {url}. Daily API quota reached.")
    else:
        print(f"[-] Error {response.status_code}: {response.text}")
    
    return response.status_code

if __name__ == "__main__":
    urls_to_submit = get_urls_from_sitemap()
    print(f"Discovered {len(urls_to_submit)} URLs in live sitemap.")
    
    if urls_to_submit:
        try:
            session = get_authorized_session()
            print("Successfully authenticated via Google Service Account.")
        except Exception as e:
            print(f"Failed to authenticate: {e}")
            exit(1)
            
        success_count = 0
        error_count = 0
        
        # Process discovered URLs
        urls_to_process = urls_to_submit[:200]
        
        print(f"\n--- Submitting {len(urls_to_process)} URLs to Google Search Indexing API ---")
        for i, url in enumerate(urls_to_process):
            status = submit_url_for_indexing(session, url, "URL_UPDATED")
            if status == 200:
                success_count += 1
            else:
                error_count += 1
                if status == 403 or status == 429:
                    print("Stopping execution due to fatal API error.")
                    break
            
            time.sleep(0.3)
            
        print(f"\nFinished. Successfully submitted: {success_count}. Errors: {error_count}.")

