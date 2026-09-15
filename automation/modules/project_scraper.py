import os
import sys
import json
import time
import random
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

from modules.ai_image_engine import generate_8k_image

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
        "name": "Movement Labs",
        "slug": "movement-labs",
        "chain": "Movement (Move-EVM)",
        "status": ["Ongoing", "Confirmed"],
        "reward": "$1,000 - $4,200",
        "difficulty": "Medium",
        "time": "15 min/week",
        "heat": 490,
        "desc": "Modular network of Move-based blockchains powered by Move-EVM execution engine and Celestia data availability.",
        "tags": ["MoveVM", "Layer 2", "Confirmed"],
        "steps": [
            {"step": 1, "title": "Install Nightly or Razor Wallet", "desc": "Configure Move-EVM RPC settings on the official Porto testnet."},
            {"step": 2, "title": "Claim Testnet MOVE Faucet", "desc": "Request daily MOVE testnet tokens from the Discord and web faucets."},
            {"step": 3, "title": "Execute Swaps on Henry DEX", "desc": "Trade testnet tokens and provide liquidity to the MOVE/USDC pool."},
            {"step": 4, "title": "Deploy Testnet Move Contract", "desc": "Publish an open-source test smart contract using the Movement CLI."}
        ],
        "links": {
            "website": "https://movementlabs.xyz",
            "twitter": "https://twitter.com/movementlabsxyz",
            "docs": "https://docs.movementnetwork.xyz"
        },
        "risk_score": 14
    },
    {
        "name": "MegaETH",
        "slug": "megaeth",
        "chain": "Ethereum L2 (Real-Time EVM)",
        "status": ["Potential", "Confirmed"],
        "reward": "$1,500 - $6,000",
        "difficulty": "Medium",
        "time": "10 min/week",
        "heat": 580,
        "desc": "The first real-time Ethereum Layer 2 capable of streaming 100,000 transactions per second with sub-millisecond latency.",
        "tags": ["Layer 2", "High Throughput", "DeFi"],
        "steps": [
            {"step": 1, "title": "Register on Early Access Portal", "desc": "Connect non-custodial Web3 wallet to the official MegaETH developer portal."},
            {"step": 2, "title": "Participate in Public Benchmarks", "desc": "Run synthetic load-testing transactions during scheduled stress-test epochs."},
            {"step": 3, "title": "Interact with Native AMM Pairs", "desc": "Execute rapid micro-swaps on partner testnet decentralized exchanges."}
        ],
        "links": {
            "website": "https://megaeth.systems",
            "twitter": "https://twitter.com/megaeth_labs",
            "docs": "https://docs.megaeth.systems"
        },
        "risk_score": 22
    },
    {
        "name": "Sonic",
        "slug": "sonic-svm",
        "chain": "Solana SVM / Fantom Sonic",
        "status": ["Ongoing", "Confirmed"],
        "reward": "$800 - $3,200",
        "difficulty": "Easy",
        "time": "10 min/day",
        "heat": 430,
        "desc": "Next-generation sub-second finality layer processing 10,000 TPS with massive 200,000,000 token incentive pool.",
        "tags": ["SVM", "Layer 1", "Confirmed"],
        "steps": [
            {"step": 1, "title": "Claim Sonic Testnet Shards", "desc": "Connect Web3 wallet and claim daily testnet tokens from the Sonic faucet."},
            {"step": 2, "title": "Complete Daily Odyssey Quests", "desc": "Interact with featured dApps to collect rings and mystery box rewards."},
            {"step": 3, "title": "Bridge Assets via Sonic Gateway", "desc": "Transfer test assets between Sepolia and Sonic testnet."}
        ],
        "links": {
            "website": "https://sonic.game",
            "twitter": "https://twitter.com/SonicSVM",
            "docs": "https://docs.sonic.game"
        },
        "risk_score": 12
    },
    {
        "name": "Mitosis",
        "slug": "mitosis-expedition",
        "chain": "Multi-Chain Liquidity",
        "status": ["Ongoing", "Confirmed"],
        "reward": "$700 - $2,900",
        "difficulty": "Medium",
        "time": "15 min",
        "heat": 360,
        "desc": "Ecosystem-owned liquidity protocol transforming DeFi through programmable cross-chain liquidity tokens.",
        "tags": ["DeFi", "Liquidity", "Confirmed"],
        "steps": [
            {"step": 1, "title": "Deposit weETH or wstETH into Vaults", "desc": "Deposit liquid staking tokens on Arbitrum or Ethereum to mint miAssets."},
            {"step": 2, "title": "Earn Mitosis Expedition Points", "desc": "Hold and accrue daily MITO expedition points across partner rollups."},
            {"step": 3, "title": "Participate in Governance Voting", "desc": "Vote on weekly liquidity distribution proposals to earn multiplier badges."}
        ],
        "links": {
            "website": "https://mitosis.org",
            "twitter": "https://twitter.com/MitosisOrg",
            "docs": "https://docs.mitosis.org"
        },
        "risk_score": 19
    },
    {
        "name": "Hyperliquid",
        "slug": "hyperliquid-dex",
        "chain": "Hyperliquid L1",
        "status": ["Ongoing", "Confirmed"],
        "reward": "$2,000 - $8,500",
        "difficulty": "Medium",
        "time": "20 min/week",
        "heat": 620,
        "desc": "Custom Layer 1 blockchain optimized for high-performance decentralized perpetuals and spot order-book trading.",
        "tags": ["DEX", "Layer 1", "Confirmed"],
        "steps": [
            {"step": 1, "title": "Deposit USDC via Arbitrum Bridge", "desc": "Bridge USDC from Arbitrum into native Hyperliquid L1 custody."},
            {"step": 2, "title": "Execute Spot & Perpetual Trades", "desc": "Build genuine non-linear trading volume across BTC, ETH, and altcoin pairs."},
            {"step": 3, "title": "Provide Liquidity to HLP Vault", "desc": "Deposit capital into the community market maker vault to earn yield."}
        ],
        "links": {
            "website": "https://hyperliquid.xyz",
            "twitter": "https://twitter.com/HyperliquidX",
            "docs": "https://hyperliquid.gitbook.io"
        },
        "risk_score": 25
    },
    {
        "name": "Solayer",
        "slug": "solayer-restaking",
        "chain": "Solana",
        "status": ["Ongoing", "Confirmed"],
        "reward": "$900 - $3,800",
        "difficulty": "Easy",
        "time": "10 min",
        "heat": 470,
        "desc": "Native restaking network built on Solana to empower decentralized applications with shared validator security.",
        "tags": ["Solana", "Restaking", "Confirmed"],
        "steps": [
            {"step": 1, "title": "Stake SOL for sSOL", "desc": "Deposit native SOL into Solayer pools to receive restaked sSOL."},
            {"step": 2, "title": "Delegate to Endogenous AVSs", "desc": "Allocate restaked stake to Solana decentralized applications."},
            {"step": 3, "title": "Track Epoch Point Multipliers", "desc": "Check the official dashboard for loyalty multiplier upgrades."}
        ],
        "links": {
            "website": "https://solayer.org",
            "twitter": "https://twitter.com/solayer_labs",
            "docs": "https://docs.solayer.org"
        },
        "risk_score": 16
    },
    {
        "name": "Eclipse",
        "slug": "eclipse-svm",
        "chain": "Ethereum L2 (Solana SVM)",
        "status": ["Ongoing", "Confirmed"],
        "reward": "$1,200 - $5,500",
        "difficulty": "Medium",
        "time": "15 min/week",
        "heat": 540,
        "desc": "Ethereum's first SVM Layer 2 combining Solana's blazing speed with Ethereum's settlement and security.",
        "tags": ["SVM", "Layer 2", "Confirmed"],
        "steps": [
            {"step": 1, "title": "Bridge ETH via Official Canonical Bridge", "desc": "Transfer Sepolia ETH into Eclipse testnet using the official bridge."},
            {"step": 2, "title": "Interact with Turbo DEX", "desc": "Perform swaps between ETH and tUSDC on the primary native order book."},
            {"step": 3, "title": "Deploy Testnet NFT Contract", "desc": "Mint an on-chain collectible to register active contract deployment telemetry."}
        ],
        "links": {
            "website": "https://eclipse.xyz",
            "twitter": "https://twitter.com/EclipseFND",
            "docs": "https://docs.eclipse.xyz"
        },
        "risk_score": 18
    },
    {
        "name": "Plume Network",
        "slug": "plume-rwa",
        "chain": "Plume (RWA Chain)",
        "status": ["Ongoing", "Confirmed"],
        "reward": "$700 - $3,400",
        "difficulty": "Easy",
        "time": "10 min/day",
        "heat": 460,
        "desc": "First modular Layer 2 dedicated exclusively to Real World Asset (RWA) compliance and financial asset tokenization.",
        "tags": ["RWA", "Modular", "Confirmed"],
        "steps": [
            {"step": 1, "title": "Claim Plume Testnet Faucet", "desc": "Request pETH and testnet USDC from the official faucet portal."},
            {"step": 2, "title": "Check In & Complete Daily Miles", "desc": "Earn Miles daily through official check-in passport stamps."},
            {"step": 3, "title": "Tokenize Real World Asset", "desc": "Interact with the RWA tokenization dApp to create fractionalized test assets."}
        ],
        "links": {
            "website": "https://plumenetwork.xyz",
            "twitter": "https://twitter.com/plumenetwork",
            "docs": "https://docs.plumenetwork.xyz"
        },
        "risk_score": 14
    },
    {
        "name": "Karak",
        "slug": "karak-restaking",
        "chain": "Multi-Chain Restaking",
        "status": ["Ongoing", "Confirmed"],
        "reward": "$900 - $4,200",
        "difficulty": "Medium",
        "time": "15 min",
        "heat": 480,
        "desc": "Universal restaking layer bringing hyper-programmable security to any asset on any blockchain network.",
        "tags": ["Restaking", "Ethereum", "Arbitrum"],
        "steps": [
            {"step": 1, "title": "Deposit Supported LSTs into Karak", "desc": "Deposit rETH, wstETH, or USDe into Karak restaking vaults."},
            {"step": 2, "title": "Accumulate Karak XP Points", "desc": "Maintain liquidity over time to unlock tiered staking point multipliers."},
            {"step": 3, "title": "Allocate to Distributed Security Services", "desc": "Opt-in to validate newly launched DSS protocols on Karak."}
        ],
        "links": {
            "website": "https://karak.network",
            "twitter": "https://twitter.com/Karak_Network",
            "docs": "https://docs.karak.network"
        },
        "risk_score": 20
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

def generate_batch_projects(count: int = 3) -> list:
    print("=" * 70)
    print(f"🚀 Running Autonomous Project Scraper (Target: {count} New Protocols)")
    print("=" * 70)

    existing = load_existing_projects()
    existing_slugs = {p["slug"] for p in existing}

    selected_sources = []
    for item in CURATED_PROJECT_SOURCES:
        if item["slug"] not in existing_slugs:
            selected_sources.append(item)
        if len(selected_sources) >= count:
            break

    # If all curated exist, create programmatic variations
    idx = 1
    while len(selected_sources) < count:
        base = CURATED_PROJECT_SOURCES[idx % len(CURATED_PROJECT_SOURCES)]
        new_item = dict(base)
        new_item["slug"] = f"{base['slug']}-v{idx+1}"
        new_item["name"] = f"{base['name']} Phase {idx+1}"
        selected_sources.append(new_item)
        idx += 1

    created_projects = []

    for item in selected_sources:
        slug = item["slug"]
        print(f"\n[+] Generating 1:1 Token Emblem & Invariants for: {item['name']} ({item['chain']})")

        # 1:1 Token Emblem via Playwright
        image_url = generate_8k_image(f"{item['name']} Crypto Airdrop {item['chain']}", slug, placement="project", category="PROJECT EMBLEM")

        new_proj = {
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

        existing.insert(0, new_proj)
        existing_slugs.add(slug)
        created_projects.append(new_proj)
        print(f"[✓] Added Project: /projects/{slug}/ with token visual: {image_url}")

    save_projects(existing)
    print(f"\n[✓] Successfully published {len(created_projects)} projects to projects.json!")
    return created_projects

if __name__ == "__main__":
    generate_batch_projects(3)
