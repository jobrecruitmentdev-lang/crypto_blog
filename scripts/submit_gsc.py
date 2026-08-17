import os
import json
import time
import requests
from google.oauth2 import service_account
from google.auth.transport.requests import AuthorizedSession

SERVICE_ACCOUNT_FILE = 'cosmic-mariner-503804-c4-981c45ff145b.json'
SCOPES = ["https://www.googleapis.com/auth/indexing"]
ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"

URLS = [
    "https://cryptoairdropai.com/",
    "https://cryptoairdropai.com/blog/",
    "https://cryptoairdropai.com/guides/",
    "https://cryptoairdropai.com/about/",
    "https://cryptoairdropai.com/methodology/",
    "https://cryptoairdropai.com/editorial-policy/",
    "https://cryptoairdropai.com/authors/",
    "https://cryptoairdropai.com/faq/",
    "https://cryptoairdropai.com/contact/",
    "https://cryptoairdropai.com/disclaimer/",
    "https://cryptoairdropai.com/privacy/",
    "https://cryptoairdropai.com/terms/",
    "https://cryptoairdropai.com/blog/how-to-farm-airdrops-safely-2026/",
    "https://cryptoairdropai.com/blog/monad-ecosystem-airdrop-playbook-2026/",
    "https://cryptoairdropai.com/blog/top-confirmed-crypto-airdrops-2026-calendar/"
]

def get_authorized_session():
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        print(f"Error: {SERVICE_ACCOUNT_FILE} not found.")
        return None
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    return AuthorizedSession(credentials)

def submit_urls():
    session = get_authorized_session()
    if not session:
        return

    print(f"Starting Google Search Indexing API submission for {len(URLS)} URLs...")
    success_count = 0

    for url in URLS:
        payload = {
            "url": url,
            "type": "URL_UPDATED"
        }
        try:
            response = session.post(ENDPOINT, data=json.dumps(payload))
            if response.status_code == 200:
                print(f"[200 OK] Submitted: {url}")
                success_count += 1
            elif response.status_code == 403:
                print(f"[403 Permission Denied] {url} -> Make sure 'automation-api@cosmic-mariner-503804-c4.iam.gserviceaccount.com' is added as Owner in Google Search Console for https://cryptoairdropai.com/")
                break
            else:
                print(f"[{response.status_code}] {url} -> {response.text}")
        except Exception as e:
            print(f"Error submitting {url}: {e}")
        time.sleep(0.2)

    print(f"\n=======================================================")
    print(f"Google Indexing API: {success_count}/{len(URLS)} URLs submitted successfully!")
    print(f"=======================================================")

if __name__ == '__main__':
    submit_urls()
