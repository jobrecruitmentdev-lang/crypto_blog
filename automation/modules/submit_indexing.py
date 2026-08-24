import os
import sys
import json
import xml.etree.ElementTree as ET
import urllib.request
import urllib.error

HOST = os.getenv("SITE_HOST", "cryptoairdropai.com")
KEY = os.getenv("INDEXNOW_KEY", "c0e8a7f93b5d4e1a82649f2b87e651d3")
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"
ENDPOINT = "https://api.indexnow.org/indexnow"

def get_urls_from_sitemap(sitemap_path: str = None) -> list[str]:
    if not sitemap_path:
        sitemap_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "web", "out", "sitemap.xml")
        
    urls = []
    if os.path.exists(sitemap_path):
        try:
            tree = ET.parse(sitemap_path)
            root = tree.getroot()
            for elem in root.findall("{http://www.sitemaps.org/schemas/sitemap/0.9}url"):
                loc = elem.find("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")
                if loc is not None and loc.text:
                    urls.append(loc.text.strip())
        except Exception as e:
            print(f"[-] Error reading sitemap: {e}")
            
    if not urls:
        urls = [f"https://{HOST}/", f"https://{HOST}/blog/", f"https://{HOST}/projects/"]
        
    return urls

def submit_indexnow(urls: list[str] = None):
    if not urls:
        urls = get_urls_from_sitemap()

    print(f"[*] Submitting {len(urls)} URLs to IndexNow ({ENDPOINT})...")
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls
    }
    
    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "CryptoAirdropAI-IndexNow/1.0"
    }

    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(ENDPOINT, data=data, headers=headers, method='POST')

    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            status = response.status
            if status in [200, 202]:
                print(f"[+] SUCCESS ({status}): {len(urls)} URLs received and queued for crawling across Bing, Yandex, Seznam, Naver.")
                return True
            else:
                print(f"[-] IndexNow Response ({status}): {response.read().decode('utf-8')}")
                return False
    except urllib.error.HTTPError as e:
        if e.code in [200, 202]:
            print(f"[+] SUCCESS ({e.code}): URLs received and queued.")
            return True
        else:
            print(f"[-] IndexNow HTTP Error {e.code}: {e.read().decode('utf-8')}")
            return False
    except Exception as ex:
        print(f"[-] Connection error submitting IndexNow: {ex}")
        return False

if __name__ == "__main__":
    submit_indexnow()
