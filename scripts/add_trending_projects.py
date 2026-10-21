# scripts/add_trending_projects.py
import os
import sys
import json
import hmac
import hashlib
import urllib.request
import urllib.parse
from pathlib import Path

# Force UTF-8
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

REPO_ROOT = Path(__file__).resolve().parent.parent
PROJECTS_FILE = REPO_ROOT / "web" / "src" / "data" / "projects.json"

API_BASE = "https://cryptoairdropai.com/api"
ADMIN_USER = "chaiwala"
ADMIN_PASS = "Hostinger ki masi 4786"
API_SECRET_KEY = b"cryptoairdropai_master_secret_2026_xyz"
HMAC_TOKEN = hmac.new(API_SECRET_KEY, f"{ADMIN_USER}:{ADMIN_PASS}".encode("utf-8"), hashlib.sha256).hexdigest()

API_HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {HMAC_TOKEN}",
    "User-Agent": "CryptoAirdropAI-Publishing/1.0"
}

new_projects = [
    {
        "slug": "berachain-v2",
        "name": "Berachain V2",
        "chain": "Berachain (Polaris EVM)",
        "status": ["Ongoing", "Confirmed"],
        "reward": "$1,200 - $6,500",
        "difficulty": "Medium",
        "time": "15 min",
        "heat": 510,
        "desc": "High-throughput EVM-identical L1 blockchain powered by Proof-of-Liquidity consensus and the tripartite token architecture (BERA, BGT, HONEY).",
        "tags": ["Layer-1", "Proof-of-Liquidity", "Confirmed", "Testnet", "Boyco"],
        "featuredImage": "/images/generated/berachain-v2-project-gemini-v3.jpg",
        "farmingSteps": [
            {
                "step": 1,
                "title": "Claim Testnet BERA from Official Faucet",
                "desc": "Connect your EVM wallet to the official Berachain bArtio faucet and claim testnet BERA tokens every 8 hours."
            },
            {
                "step": 2,
                "title": "Execute Swaps & Mint HONEY on BEX",
                "desc": "Swap testnet BERA for STGUSDC on the native BEX DEX and mint overcollateralized HONEY stablecoins."
            },
            {
                "step": 3,
                "title": "Provide Liquidity in Boyco Vaults",
                "desc": "Deposit HONEY and BERA into liquidity vaults to accumulate mock BGT governance weight and Boyco multiplier tiers."
            },
            {
                "step": 4,
                "title": "Delegate Governance Weight on BGT Station",
                "desc": "Delegate earned governance tokens to active validator nodes on BGT Station to boost bribe yields and testnet activity score."
            }
        ],
        "officialLinks": {
            "website": "https://berachain.com",
            "twitter": "https://twitter.com/berachain",
            "docs": "https://docs.berachain.com",
            "discord": "https://discord.gg/berachain"
        },
        "riskScore": 14
    },
    {
        "slug": "grass-network",
        "name": "Grass DePIN Network",
        "chain": "Solana",
        "status": ["Ongoing", "Confirmed"],
        "reward": "$500 - $2,200",
        "difficulty": "Easy",
        "time": "5 min",
        "heat": 495,
        "desc": "Decentralized AI web-scraping and data layer on Solana where users monetize unused residential internet bandwidth with zero hardware costs.",
        "tags": ["DePIN", "Solana", "Confirmed", "AI", "Zero-Investment"],
        "featuredImage": "/images/generated/grass-network-project-gemini-v3.jpg",
        "farmingSteps": [
            {
                "step": 1,
                "title": "Register on Grass Network Portal",
                "desc": "Sign up on the official Grass platform with verified credentials and secure your node account."
            },
            {
                "step": 2,
                "title": "Install the Official Grass Browser Node Extension",
                "desc": "Add the verified Grass extension to Chrome or Brave and keep it connected in the background."
            },
            {
                "step": 3,
                "title": "Link Verified Solana Phantom / Backpack Wallet",
                "desc": "Verify your email and bind your Solana wallet address in the dashboard rewards tab for token settlement."
            },
            {
                "step": 4,
                "title": "Maintain Continuous Uptime & Epoch Multipliers",
                "desc": "Maintain 90%+ network quality score to maximize epoch point accrual and upcoming distribution tiers."
            }
        ],
        "officialLinks": {
            "website": "https://getgrass.io",
            "twitter": "https://twitter.com/getgrass_io",
            "docs": "https://docs.getgrass.io",
            "discord": "https://discord.gg/getgrass"
        },
        "riskScore": 12
    }
]

def update_local_json():
    with open(PROJECTS_FILE, "r", encoding="utf-8") as f:
        projects = json.load(f)

    existing_slugs = {p["slug"] for p in projects}
    to_add = [p for p in new_projects if p["slug"] not in existing_slugs]

    if to_add:
        updated = to_add + projects
        with open(PROJECTS_FILE, "w", encoding="utf-8") as f:
            json.dump(updated, f, indent=2, ensure_ascii=False)
        print(f"[+] Added {len(to_add)} projects to {PROJECTS_FILE}. Total: {len(updated)}")
    else:
        print("[*] Projects already in JSON file.")

def sync_to_hostinger_mysql():
    for p in new_projects:
        slug = p["slug"]
        payload = json.dumps(p).encode("utf-8")
        try:
            req = urllib.request.Request(f"{API_BASE}/projects.php", data=payload, headers=API_HEADERS, method="POST")
            with urllib.request.urlopen(req, timeout=15) as res:
                print(f"[+] Synced {slug} to Hostinger MySQL (POST)")
        except urllib.error.HTTPError as e:
            if e.code == 409:
                put_url = f"{API_BASE}/projects.php?slug={urllib.parse.quote(slug)}"
                put_req = urllib.request.Request(put_url, data=payload, headers=API_HEADERS, method="PUT")
                with urllib.request.urlopen(put_req, timeout=15) as res:
                    print(f"[+] Updated {slug} in Hostinger MySQL (PUT)")
            else:
                print(f"[-] HTTP Error {e.code} for {slug}: {e.read().decode('utf-8', errors='ignore')}")
        except Exception as ex:
            print(f"[-] Error syncing {slug}: {ex}")

if __name__ == "__main__":
    update_local_json()
    sync_to_hostinger_mysql()
