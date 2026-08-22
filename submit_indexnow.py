import json
import requests
import xml.etree.ElementTree as ET

# 1. Configuration for cryptoairdropai.com
HOST = "cryptoairdropai.com"
KEY = "c0e8a7f93b5d4e1a82649f2b87e651d3"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"
SITEMAP_URL = "https://cryptoairdropai.com/sitemap.xml"

ENDPOINT = "https://api.indexnow.org/indexnow"

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

def submit_to_indexnow(url_list):
    """
    Submits a batch of up to 10,000 URLs to the IndexNow protocol (Bing, Yandex, Seznam, Yep, AI engines).
    """
    if not url_list:
        print("No URLs to submit.")
        return
        
    if len(url_list) > 10000:
        print("Warning: IndexNow accepts a maximum of 10,000 URLs per POST request.")
        url_list = url_list[:10000]

    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": url_list
    }
    
    headers = {
        "Content-Type": "application/json; charset=utf-8"
    }
    
    print(f"Submitting {len(url_list)} URLs to IndexNow protocol ({ENDPOINT})...")
    response = requests.post(ENDPOINT, headers=headers, data=json.dumps(payload), timeout=15)
    
    if response.status_code == 200:
        print(f"[+] Success (200): {len(url_list)} URLs submitted to IndexNow.")
    elif response.status_code == 202:
        print(f"[+] Accepted (202): {len(url_list)} URLs received by IndexNow engine for re-crawl.")
    else:
        print(f"[-] Error {response.status_code}: {response.text}")

if __name__ == "__main__":
    urls_to_submit = get_urls_from_sitemap()
    print(f"Discovered {len(urls_to_submit)} URLs in live sitemap.")
    submit_to_indexnow(urls_to_submit)

