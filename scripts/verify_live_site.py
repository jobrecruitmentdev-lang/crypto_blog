import urllib.request
import re

def check_url(url, label):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=15) as resp:
        html = resp.read().decode('utf-8')
    imgs = set(re.findall(r'/images/generated/[^"\s\\]+', html))
    print(f"=== {label} ({url}) ===")
    print(f"Total unique generated images found in HTML: {len(imgs)}")
    for img in sorted(imgs):
        print(f"  {img}")
    print()

def test_image_http(img_path):
    url = f"https://cryptoairdropai.com{img_path}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}, method='HEAD')
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(f"HTTP {resp.status} OK: {img_path}")
    except Exception as e:
        print(f"HTTP ERROR {img_path}: {e}")

if __name__ == '__main__':
    check_url("https://cryptoairdropai.com/guides/", "LIVE GUIDES PAGE")
    check_url("https://cryptoairdropai.com/blog/", "LIVE BLOG PAGE")
    
    # Test top guides images directly
    test_image_http("/images/generated/automated-scripts-vs-manual-interaction-sybil-vectors-featured-gemini-v3.jpg")
    test_image_http("/images/generated/hardware-wallet-multisig-airdrop-claim-security-manual-featured-gemini-v3.jpg")
    test_image_http("/images/generated/evm-gas-optimization-and-gwei-timing-for-airdrop-farmers-featured-gemini-v3.jpg")
    test_image_http("/images/generated/story-protocol-intellectual-property-testnet-airdrop-strategy-featured-gemini-v3.jpg")
    test_image_http("/images/generated/eclipse-svm-ethereum-layer-2-early-positioning-checklist-featured-gemini-v3.jpg")
    test_image_http("/images/generated/monad-ecosystem-parallel-evm-airdrop-playbook-featured-gemini-v3.jpg")
