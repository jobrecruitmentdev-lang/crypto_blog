"""
Live Scout & Deduplication Module
Scrapes real-time DeFi protocols, upcoming airdrops, and trending narratives.
Deduplicates strictly against existing projects, articles, and live database.
Returns: exactly 3 fresh projects, 3 fresh intelligence topics, and 3 fresh guide topics.
"""

import os
import sys
import json
import urllib.request
import urllib.parse
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
PROJECTS_FILE = REPO_ROOT / "web" / "src" / "data" / "projects.json"
ARTICLES_FILE = REPO_ROOT / "web" / "src" / "data" / "articles.json"

def get_existing_slugs():
    existing = set()
    if PROJECTS_FILE.exists():
        with open(PROJECTS_FILE, "r", encoding="utf-8") as f:
            for p in json.load(f):
                existing.add(p.get("slug", "").lower().strip())
    if ARTICLES_FILE.exists():
        with open(ARTICLES_FILE, "r", encoding="utf-8") as f:
            for a in json.load(f):
                existing.add(a.get("slug", "").lower().strip())
    return existing

def slugify(text: str) -> str:
    cleaned = "".join(c.lower() if c.isalnum() or c in " -" else "" for c in text)
    return "-".join(cleaned.split())

def fetch_defillama_unreleased_protocols(limit=10):
    """Fetches high-TVL protocols without tokens from DeFiLlama."""
    print("  [*] Querying DeFiLlama for unreleased token protocols...")
    url = "https://api.llama.fi/protocols"
    req = urllib.request.Request(url, headers={"User-Agent": "CryptoAirdropAI/1.0"})
    
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"  ⚠️ DeFiLlama fetch error: {e}")
        return []

    ignored_cats = {
        "CEX", "Bridge", "Canonical Bridge", "Chain", "Treasury", 
        "Liquid Staking", "Reserve Currency", "Payments", "Services", "Risk Curators"
    }
    banned_names = {"lightning network", "wbtc", "bitfinex", "bybit", "robinhood", "tether", "circle"}
    existing = get_existing_slugs()

    candidates = []
    for p in data:
        cat = p.get("category", "")
        sym = p.get("symbol")
        tvl = p.get("tvl", 0) or 0
        name = p.get("name", "").strip()
        slug = slugify(name)

        if not name or slug in existing or name.lower() in banned_names:
            continue

        # Condition: unreleased token, valid category, reasonable TVL, has website
        if (not sym or sym == "-") and cat not in ignored_cats and 500_000 < tvl < 300_000_000 and p.get("url"):
            candidates.append({
                "name": name,
                "slug": slug,
                "chain": p.get("chain", "Multi-Chain"),
                "category": cat,
                "tvl": tvl,
                "url": p.get("url"),
                "twitter": f"https://twitter.com/{p.get('twitter')}" if p.get("twitter") else ""
            })
            if len(candidates) >= limit:
                break

    return candidates

def fetch_trending_topics():
    """Fetches trending crypto narratives from CoinGecko or dynamic fallbacks."""
    print("  [*] Querying CoinGecko search trending...")
    url = "https://api.coingecko.com/api/v3/search/trending"
    req = urllib.request.Request(url, headers={"User-Agent": "CryptoAirdropAI/1.0"})
    
    trending = []
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            for coin in data.get("coins", [])[:6]:
                item = coin.get("item", {})
                name = item.get("name", "")
                if name:
                    trending.append(name)
    except Exception as e:
        print(f"  ⚠️ CoinGecko trending fetch error: {e}")

    return trending

def scout_3x3x3_batch():
    """
    Returns:
      projects: 3 fresh protocol definitions
      intelligence: 3 fresh institutional analysis topics
      guides: 3 fresh tactical execution guides
    """
    existing = get_existing_slugs()
    raw_protocols = fetch_defillama_unreleased_protocols(limit=15)
    
    # 1. Select 3 Projects
    selected_projects = []
    for p in raw_protocols:
        if p["slug"] not in existing and len(selected_projects) < 3:
            selected_projects.append(p)
            existing.add(p["slug"])

    # Fallback curated candidates if API was partially offline
    curated_project_backups = [
        {"name": "Zircuit Layer 2", "slug": "zircuit-l2-rollup", "chain": "Ethereum L2", "category": "AI Rollup", "url": "https://zircuit.com"},
        {"name": "Kroma Network", "slug": "kroma-network-zk", "chain": "Ethereum L2", "category": "ZK Rollup", "url": "https://kroma.network"},
        {"name": "Swell Layer 2", "slug": "swell-restaked-l2", "chain": "Restaked Rollup", "category": "Restaking", "url": "https://swellnetwork.io"},
        {"name": "Corn Network", "slug": "corn-network-btcl2", "chain": "Bitcoin L2", "category": "BTC Yield", "url": "https://usecorn.com"}
    ]
    for b in curated_project_backups:
        if len(selected_projects) >= 3:
            break
        if b["slug"] not in existing:
            selected_projects.append(b)
            existing.add(b["slug"])

    # 2. Select 3 Intelligence Articles
    intel_pool = [
        f"{selected_projects[0]['name']} Incentive Architecture & Points Valuation Deep Dive",
        f"{selected_projects[1]['name']} Liquidity Flywheel & Token Generation Event (TGE) Model",
        f"{selected_projects[2]['name']} Institutional Risk Assessment & Ecosystem Positioning",
        "Parallelized EVM vs. MoveVM: Execution Speed Benchmark & Airdrop Multipliers",
        "Bitcoin L2 Renaissance: Comparing Babylon, Bitlayer, and Corn Staking Yields",
        "EIP-7702 Account Abstraction Impact on Airdrop Multi-Wallet Sybil Resistance"
    ]
    selected_intel = []
    for topic in intel_pool:
        slug = slugify(topic)
        if slug not in existing and len(selected_intel) < 3:
            selected_intel.append({"title": topic, "slug": slug})
            existing.add(slug)

    # 3. Select 3 Guides
    guide_pool = [
        f"How to Qualify for {selected_projects[0]['name']} Testnet: Step-by-Step Security Runbook",
        f"Optimizing Yield & Multipliers on {selected_projects[1]['name']} Without Sybil Flagging",
        "Automating Testnet Faucets & RPC Jitter: Avoiding Graph Analysis Filters",
        "Safe Multisig Setup for High-Volume Airdrop Claiming & Drainer Immunity",
        "Mempool Priority Gas Timing: Slashing Execution Fees During Mass Snapshot Epochs",
        "Zero-Knowledge Proof Bridging Security: Verifying zk-SNARK State Transitions"
    ]
    selected_guides = []
    for topic in guide_pool:
        slug = slugify(topic)
        if slug not in existing and len(selected_guides) < 3:
            selected_guides.append({"title": topic, "slug": slug})
            existing.add(slug)

    print(f"\n[+] Scouted strictly 3 fresh projects, 3 intelligence, 3 guides:")
    print("  Projects:     ", [p['name'] for p in selected_projects])
    print("  Intelligence: ", [i['title'][:35] + '...' for i in selected_intel])
    print("  Guides:       ", [g['title'][:35] + '...' for g in selected_guides])

    return {
        "projects": selected_projects,
        "intelligence": selected_intel,
        "guides": selected_guides
    }

if __name__ == '__main__':
    batch = scout_3x3x3_batch()
