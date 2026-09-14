import os
import sys
import json
import time
import random
import requests
from pathlib import Path

# Force UTF-8 on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
AUTOMATION_ROOT = Path(__file__).resolve().parent.parent
MODULES_DIR = Path(__file__).resolve().parent
PROJECTS_FILE = PROJECT_ROOT / "web" / "src" / "data" / "projects.json"

sys.path.extend([str(AUTOMATION_ROOT), str(MODULES_DIR), str(PROJECT_ROOT)])

# Curated High-Value 2026 Airdrop Protocol Seed List for Live Enrichment
CURATED_PROJECT_SOURCES = [
    {
        "name": "Story Protocol",
        "slug": "story-protocol",
        "chain": "Story Chain (EVM)",
        "status": ["Ongoing", "Confirmed"],
        "reward": "$1,000 - $4,500",
        "difficulty": "Medium",
        "time": "15 min/week",
        "heat": 320,
        "desc": "Decentralized Intellectual Property blockchain enabling creator tokenization and programmable IP licensing.",
        "tags": ["Layer 1", "IP", "Confirmed"],
        "steps": [
            {"step": 1, "title": "Claim Odyssey Testnet IP Faucet", "desc": "Request testnet IP tokens from the official Story Protocol Odyssey faucet."},
            {"step": 2, "title": "Register Intellectual Property Asset (IPA)", "desc": "Mint and register an on-chain IP NFT using Story Protocol SDK or partner dApps."},
            {"step": 3, "title": "Create Licensing Agreement", "desc": "Attach commercial terms and royalty distributions to your registered IP assets."},
            {"step": 4, "title": "Interact with Ecosystem dApps", "desc": "Swap and trade licensed IP on secondary marketplaces to record diverse contract transactions."}
        ],
        "links": {
            "website": "https://storyprotocol.xyz",
            "twitter": "https://twitter.com/storyprotocol",
            "docs": "https://docs.storyprotocol.xyz"
        },
        "risk_score": 15
    },
    {
        "name": "Babylon",
        "slug": "babylon",
        "chain": "Bitcoin / Cosmos",
        "status": ["Ongoing", "Confirmed"],
        "reward": "$800 - $3,500",
        "difficulty": "Medium",
        "time": "20 min",
        "heat": 415,
        "desc": "Trustless Bitcoin staking protocol bringing decentralized proof-of-stake security to PoS chains using native BTC.",
        "tags": ["Bitcoin", "Staking", "Confirmed"],
        "steps": [
            {"step": 1, "title": "Setup OKX or UniSat Bitcoin Wallet", "desc": "Ensure your wallet supports native SegWit or Taproot address formats."},
            {"step": 2, "title": "Deposit BTC into Staking Cap Pools", "desc": "Stake BTC directly during Babylon phase caps to start accruing staking points."},
            {"step": 3, "title": "Delegate to Top Validators", "desc": "Split allocations across multiple active network finality providers."},
            {"step": 4, "title": "Verify Points on Official Dashboard", "desc": "Check the official Babylon staking leaderboard to track eligible epoch points."}
        ],
        "links": {
            "website": "https://babylonchain.io",
            "twitter": "https://twitter.com/babylonlabs_io",
            "docs": "https://docs.babylonchain.io"
        },
        "risk_score": 20
    },
    {
        "name": "Fuel Network",
        "slug": "fuel-network",
        "chain": "Fuel (Sway VM)",
        "status": ["Ongoing"],
        "reward": "$600 - $2,800",
        "difficulty": "Easy",
        "time": "15 min/week",
        "heat": 285,
        "desc": "The fastest modular execution layer designed for Ethereum, powered by parallel transaction processing and the Sway programming language.",
        "tags": ["Modular", "Layer 2", "Rollup"],
        "steps": [
            {"step": 1, "title": "Install Fuel Wallet", "desc": "Download and install the official Fuel Browser Extension."},
            {"step": 2, "title": "Bridge Assets via Fuel Native Bridge", "desc": "Bridge Sepolia ETH to Fuel Sepolia testnet."},
            {"step": 3, "title": "Trade and LP on Mira DEX", "desc": "Execute swaps between ETH and USDC and provide liquidity to verified pairs."},
            {"step": 4, "title": "Borrow & Lend on SwayLend", "desc": "Deposit collateral to borrow testnet stablecoins."}
        ],
        "links": {
            "website": "https://fuel.network",
            "twitter": "https://twitter.com/fuel_network",
            "docs": "https://docs.fuel.network"
        },
        "risk_score": 18
    },
    {
        "name": "Symbiotic",
        "slug": "symbiotic",
        "chain": "Ethereum",
        "status": ["Ongoing", "Confirmed"],
        "reward": "$1,200 - $5,000",
        "difficulty": "Medium",
        "time": "10 min",
        "heat": 510,
        "desc": "Permissionless shared security restaking protocol allowing any asset to secure decentralized networks.",
        "tags": ["Restaking", "Ethereum", "DeFi"],
        "steps": [
            {"step": 1, "title": "Acquire Supported LSTs or LRTs", "desc": "Obtain wstETH, cbETH, or rETH on Ethereum mainnet."},
            {"step": 2, "title": "Deposit into Symbiotic Restaking Vaults", "desc": "Deposit assets when vault caps open to earn Symbiotic points."},
            {"step": 3, "title": "Deploy into Mellow Protocol Curated Vaults", "desc": "Multiply point yields by participating in ecosystem partner vaults."}
        ],
        "links": {
            "website": "https://symbiotic.fi",
            "twitter": "https://twitter.com/symbioticfi",
            "docs": "https://docs.symbiotic.fi"
        },
        "risk_score": 25
    },
    {
        "name": "Initia",
        "slug": "initia",
        "chain": "Cosmos / MoveVM",
        "status": ["Ongoing", "Confirmed"],
        "reward": "$500 - $2,200",
        "difficulty": "Easy",
        "time": "15 min/week",
        "heat": 340,
        "desc": "Network for interwoven rollups, combining Layer 1 architecture with application-specific L2s across EVM, Wasm, and MoveVM.",
        "tags": ["Cosmos", "Interwoven", "Confirmed"],
        "steps": [
            {"step": 1, "title": "Install Initia Wallet", "desc": "Setup your Initia wallet and claim testnet INIT from faucet."},
            {"step": 2, "title": "Adopt and Feed Jennie Pet", "desc": "Feed your virtual Jennie mascot daily by completing on-chain quests."},
            {"step": 3, "title": "Swap and Bridge across Minitias", "desc": "Bridge tokens between Blackwing, Tucana, and Lunch Minitias."},
            {"step": 4, "title": "Stake INIT with Active Validators", "desc": "Delegate INIT to participate in governance proposals."}
        ],
        "links": {
            "website": "https://initia.xyz",
            "twitter": "https://twitter.com/initiaFDN",
            "docs": "https://docs.initia.xyz"
        },
        "risk_score": 15
    }
]

def load_existing_projects() -> list:
    if PROJECTS_FILE.exists():
        try:
            with open(PROJECTS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[-] Error reading projects.json: {e}")
    return []

def save_projects(projects: list):
    PROJECTS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(PROJECTS_FILE, "w", encoding="utf-8") as f:
        json.dump(projects, f, indent=2, ensure_ascii=False)
    print(f"[+] Successfully saved {len(projects)} projects to {PROJECTS_FILE}")

def scrape_and_enrich_projects():
    print("=======================================================")
    print("🚀 Running Crypto Airdrop Project Scraper & 8K Enricher")
    print("=======================================================")

    # Import 8K image generator
    from modules.ai_image_engine import generate_8k_image

    existing = load_existing_projects()
    existing_slugs = {p["slug"] for p in existing}

    added_count = 0

    for item in CURATED_PROJECT_SOURCES:
        slug = item["slug"]
        if slug in existing_slugs:
            print(f"[*] Project '{item['name']}' already exists. Updating...")
            # Update metadata
            for p in existing:
                if p["slug"] == slug:
                    p.update({
                        "reward": item["reward"],
                        "difficulty": item["difficulty"],
                        "farmingSteps": item["steps"],
                        "officialLinks": item["links"],
                        "riskScore": item["risk_score"]
                    })
            continue

        print(f"\n[+] Processing New Scraped Project: {item['name']} ({item['chain']})")

        # Generate unique 8K project badge/banner
        image_url = generate_8k_image(f"{item['name']} Crypto Airdrop {item['chain']}", slug, placement="project")

        new_project = {
            "slug": slug,
            "name": item["name"],
            "chain": item["chain"],
            "status": item["status"],
            "reward": item["reward"],
            "difficulty": item["difficulty"],
            "time": item["time"],
            "heat": item["heat"],
            "desc": item["desc"],
            "tags": item["tags"],
            "featuredImage": image_url,
            "farmingSteps": item["steps"],
            "officialLinks": item["links"],
            "riskScore": item["risk_score"]
        }

        existing.insert(0, new_project)
        existing_slugs.add(slug)
        added_count += 1
        print(f"[✓] Added '{item['name']}' with 8K image: {image_url}")

    save_projects(existing)
    print(f"\n[+] Done! Total projects in database: {len(existing)} ({added_count} newly scraped).")
    return existing

if __name__ == "__main__":
    scrape_and_enrich_projects()
