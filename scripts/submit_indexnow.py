import json
import urllib.request
import urllib.error
import sys

HOST = "cryptoairdropai.com"
KEY = "c0e8a7f93b5d4e1a82649f2b87e651d3"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"
ENDPOINT = "https://api.indexnow.org/indexnow"

URLS = [
    f"https://{HOST}/",
    f"https://{HOST}/blog/",
    f"https://{HOST}/guides/",
    f"https://{HOST}/about/",
    f"https://{HOST}/methodology/",
    f"https://{HOST}/editorial-policy/",
    f"https://{HOST}/authors/",
    f"https://{HOST}/faq/",
    f"https://{HOST}/contact/",
    f"https://{HOST}/disclaimer/",
    f"https://{HOST}/privacy/",
    f"https://{HOST}/terms/",
    f"https://{HOST}/blog/how-to-farm-airdrops-safely-2026/",
    f"https://{HOST}/blog/monad-ecosystem-airdrop-playbook-2026/",
    f"https://{HOST}/blog/top-confirmed-crypto-airdrops-2026-calendar/"
]

def submit():
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": URLS
    }
    
    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "CryptoAirdropAI-IndexNow/1.0"
    }

    print(f"Submitting {len(URLS)} URLs to IndexNow ({ENDPOINT})...")
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(ENDPOINT, data=data, headers=headers, method='POST')

    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            status = response.status
            body = response.read().decode('utf-8')
            if status in [200, 202]:
                print(f"SUCCESS ({status}): {len(URLS)} URLs accepted by IndexNow!")
                print(f"Bing, Yandex, Seznam, Naver, and Yep have been pinged for instant re-crawling.")
            else:
                print(f"IndexNow Response ({status}): {body}")
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        if e.code in [200, 202]:
            print(f"SUCCESS ({e.code}): URLs received and queued for indexing.")
        else:
            print(f"HTTP Error {e.code}: {body}")
    except Exception as ex:
        print(f"Connection error: {ex}")

if __name__ == '__main__':
    submit()
