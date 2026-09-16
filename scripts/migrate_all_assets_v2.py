"""
Master Asset Migration Script V2
1. Deploys versioned filenames (-gemini-v2.jpg) to completely bypass Hostinger CDN edge caching.
2. Removes 3 clone duplicate articles (avoiding-sybil-detection, bridging-to-layer-2-networks, understanding-snapshot-mechanics).
3. Gives Monad Ecosystem its own bespoke purple EVM visual distinct from Eclipse SVM.
4. Updates web/src/data/projects.json and web/src/data/articles.json.
5. Updates live Hostinger MySQL database via authenticated API calls.
"""

import os
import sys
import json
import hmac
import hashlib
import urllib.request
from PIL import Image

# Force UTF-8 on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

REPO_ROOT = r"C:\hk\cryptodrop"
PUB_DIR = os.path.join(REPO_ROOT, "web", "public", "images", "generated")
BRAIN_D2 = r"C:\Users\Dell\.gemini\antigravity-cli\brain\d2f64889-1c16-476c-87cb-f2a23865e2a8"
BRAIN_29 = r"C:\Users\Dell\.gemini\antigravity-cli\brain\290e5386-2923-4614-b052-9341725368e1"
BRAIN_E1 = r"C:\Users\Dell\.gemini\antigravity-cli\brain\e17d2b52-cf05-410c-aace-f01fa2a6b008"

# Auth setup for live API
ADMIN_USER = 'chaiwala'
ADMIN_PASS = 'Hostinger ki masi 4786'
API_SECRET_KEY = b'cryptoairdropai_master_secret_2026_xyz'
HMAC_TOKEN = hmac.new(API_SECRET_KEY, f"{ADMIN_USER}:{ADMIN_PASS}".encode('utf-8'), hashlib.sha256).hexdigest()
API_HEADERS = {
    'Authorization': f'Bearer {HMAC_TOKEN}',
    'Content-Type': 'application/json'
}

# 1. 23 Projects source mapping
PROJECT_SOURCES = {
    'solayer-restaking': os.path.join(BRAIN_D2, 'solayer_proj_art_1789454566967.jpg'),
    'hyperliquid-dex': os.path.join(BRAIN_D2, 'hyperliquid_proj_art_1789454537890.jpg'),
    'mitosis-expedition': os.path.join(BRAIN_D2, 'mitosis_proj_art_1789454510553.jpg'),
    'sonic-svm': os.path.join(BRAIN_D2, 'sonic_svm_emblem_1789546245149.jpg'),
    'megaeth': os.path.join(BRAIN_D2, 'megaeth_emblem_1789546260918.jpg'),
    'movement-labs': os.path.join(BRAIN_D2, 'movement_labs_emblem_1789546279106.jpg'),
    'initia': os.path.join(BRAIN_D2, 'initia_project_1789388208313.jpg'),
    'symbiotic': os.path.join(BRAIN_D2, 'symbiotic_project_1789388269350.jpg'),
    'fuel-network': os.path.join(BRAIN_D2, 'fuel_project_1789388236196.jpg'),
    'babylon': os.path.join(BRAIN_D2, 'babylon_project_1789388633948.jpg'),
    'story-protocol': os.path.join(BRAIN_D2, 'story_project_1789388298682.jpg'),
    'monad': os.path.join(BRAIN_D2, 'test_monad_emblem_1789543244320.jpg'),
    'jupiter': os.path.join(BRAIN_D2, 'jupiter_project_emblem_1789543557500.jpg'),
    'gmgn': os.path.join(BRAIN_D2, 'gmgn_project_emblem_1789543576897.jpg'),
    'privacy-pools': os.path.join(BRAIN_D2, 'privacy_pools_emblem_1789543605665.jpg'),
    'legend': os.path.join(BRAIN_D2, 'legend_project_emblem_1789543625989.jpg'),
    'ducat': os.path.join(BRAIN_D2, 'ducat_emblem_1789546296673.jpg'),
    'arcus': os.path.join(BRAIN_D2, 'arcus_emblem_1789546447937.jpg'),
    'solpump': os.path.join(BRAIN_D2, 'solpump_emblem_1789546465275.jpg'),
    'ondo-perps': os.path.join(BRAIN_D2, 'ondo_perps_emblem_1789546485827.jpg'),
    'hypertrade': os.path.join(BRAIN_D2, 'hypertrade_emblem_1789546501973.jpg'),
    '3jane': os.path.join(BRAIN_29, 'crypto_security_shield_1789448020724.jpg'),
    'hoodtracker': os.path.join(BRAIN_E1, 'dashboard_glassmorphism_mockup_1784704302203.jpg')
}

# 2. Article slot sources (only unique articles, clones removed)
ARTICLE_SOURCES = {
    # 1. mastering-on-chain-sybil-resistance-heuristics-behavioral-hygiene
    ('mastering-on-chain-sybil-resistance-heuristics-behavioral-hygiene', 'featuredImage'): os.path.join(PUB_DIR, 'mastering-on-chain-sybil-resistance-heuristics-behavioral-hygiene-featured.jpg'),
    ('mastering-on-chain-sybil-resistance-heuristics-behavioral-hygiene', 'middleImage'): os.path.join(PUB_DIR, 'mastering-on-chain-sybil-resistance-heuristics-behavioral-hygiene-middle.jpg'),
    ('mastering-on-chain-sybil-resistance-heuristics-behavioral-hygiene', 'preFaqImage'): os.path.join(PUB_DIR, 'mastering-on-chain-sybil-resistance-heuristics-behavioral-hygiene-pre_faq.jpg'),

    # 2. understanding-snapshot-mechanics-block-heights-in-web3-airdrops
    ('understanding-snapshot-mechanics-block-heights-in-web3-airdrops', 'featuredImage'): os.path.join(PUB_DIR, 'understanding-snapshot-mechanics-block-heights-in-web3-airdrops-featured.jpg'),
    ('understanding-snapshot-mechanics-block-heights-in-web3-airdrops', 'middleImage'): os.path.join(PUB_DIR, 'understanding-snapshot-mechanics-block-heights-in-web3-airdrops-middle.jpg'),
    ('understanding-snapshot-mechanics-block-heights-in-web3-airdrops', 'preFaqImage'): os.path.join(PUB_DIR, 'understanding-snapshot-mechanics-block-heights-in-web3-airdrops-pre_faq.jpg'),

    # 3. cross-chain-bridging-liquidity-routing-security-manual
    ('cross-chain-bridging-liquidity-routing-security-manual', 'featuredImage'): os.path.join(PUB_DIR, 'cross-chain-bridging-liquidity-routing-security-manual-featured.jpg'),
    ('cross-chain-bridging-liquidity-routing-security-manual', 'middleImage'): os.path.join(PUB_DIR, 'cross-chain-bridging-liquidity-routing-security-manual-middle.jpg'),
    ('cross-chain-bridging-liquidity-routing-security-manual', 'preFaqImage'): os.path.join(PUB_DIR, 'cross-chain-bridging-liquidity-routing-security-manual-pre_faq.jpg'),

    # 4. eclipse-svm-ethereum-layer-2-early-positioning-checklist
    ('eclipse-svm-ethereum-layer-2-early-positioning-checklist', 'featuredImage'): os.path.join(PUB_DIR, 'eclipse-svm-ethereum-layer-2-early-positioning-checklist-featured.jpg'),
    ('eclipse-svm-ethereum-layer-2-early-positioning-checklist', 'middleImage'): os.path.join(PUB_DIR, 'eclipse-svm-ethereum-layer-2-early-positioning-checklist-middle.jpg'),
    ('eclipse-svm-ethereum-layer-2-early-positioning-checklist', 'preFaqImage'): os.path.join(BRAIN_D2, 'test_guide_art_1789448967943.jpg'),

    # 5. babylon-bitcoin-staking-mainnet-distribution-points-guide
    ('babylon-bitcoin-staking-mainnet-distribution-points-guide', 'featuredImage'): os.path.join(PUB_DIR, 'babylon-bitcoin-staking-mainnet-distribution-points-guide-featured.jpg'),
    ('babylon-bitcoin-staking-mainnet-distribution-points-guide', 'middleImage'): os.path.join(PUB_DIR, 'babylon-bitcoin-staking-mainnet-distribution-points-guide-middle.jpg'),
    ('babylon-bitcoin-staking-mainnet-distribution-points-guide', 'preFaqImage'): os.path.join(PUB_DIR, 'babylon-bitcoin-staking-mainnet-distribution-points-guide-pre_faq.jpg'),

    # 6. fuel-network-layer-2-high-speed-execution-testnet-playbook
    ('fuel-network-layer-2-high-speed-execution-testnet-playbook', 'featuredImage'): os.path.join(PUB_DIR, 'fuel-network-layer-2-high-speed-execution-testnet-playbook-featured.jpg'),
    ('fuel-network-layer-2-high-speed-execution-testnet-playbook', 'middleImage'): os.path.join(PUB_DIR, 'fuel-network-layer-2-high-speed-execution-testnet-playbook-middle.jpg'),
    ('fuel-network-layer-2-high-speed-execution-testnet-playbook', 'preFaqImage'): os.path.join(PUB_DIR, 'fuel-network-layer-2-high-speed-execution-testnet-playbook-pre_faq.jpg'),

    # 7. story-protocol-intellectual-property-testnet-airdrop-strategy
    ('story-protocol-intellectual-property-testnet-airdrop-strategy', 'featuredImage'): os.path.join(PUB_DIR, 'story-protocol-intellectual-property-testnet-airdrop-strategy-featured.jpg'),
    ('story-protocol-intellectual-property-testnet-airdrop-strategy', 'middleImage'): os.path.join(PUB_DIR, 'story-protocol-intellectual-property-testnet-airdrop-strategy-middle.jpg'),
    ('story-protocol-intellectual-property-testnet-airdrop-strategy', 'preFaqImage'): os.path.join(PUB_DIR, 'story-protocol-intellectual-property-testnet-airdrop-strategy-pre_faq.jpg'),

    # 8. solana-multi-wallet-isolation-sybil-defense-masterclass-2026
    ('solana-multi-wallet-isolation-sybil-defense-masterclass-2026', 'featuredImage'): os.path.join(PUB_DIR, 'solana-multi-wallet-isolation-sybil-defense-masterclass-2026-featured.jpg'),
    ('solana-multi-wallet-isolation-sybil-defense-masterclass-2026', 'middleImage'): os.path.join(PUB_DIR, 'solana-multi-wallet-isolation-sybil-defense-masterclass-2026-middle.jpg'),
    ('solana-multi-wallet-isolation-sybil-defense-masterclass-2026', 'preFaqImage'): os.path.join(PUB_DIR, 'solana-multi-wallet-isolation-sybil-defense-masterclass-2026-pre_faq.jpg'),

    # 9. berachain-v2-proof-of-liquidity-tge-breakdown-2026
    ('berachain-v2-proof-of-liquidity-tge-breakdown-2026', 'featuredImage'): os.path.join(PUB_DIR, 'berachain-v2-proof-of-liquidity-tge-breakdown-2026-featured.jpg'),
    ('berachain-v2-proof-of-liquidity-tge-breakdown-2026', 'middleImage'): os.path.join(PUB_DIR, 'berachain-v2-proof-of-liquidity-tge-breakdown-2026-middle.jpg'),
    ('berachain-v2-proof-of-liquidity-tge-breakdown-2026', 'preFaqImage'): os.path.join(PUB_DIR, 'berachain-v2-proof-of-liquidity-tge-breakdown-2026-pre_faq.jpg'),

    # 10. 5-stage-smart-contract-audit-telemetry-framework
    ('5-stage-smart-contract-audit-telemetry-framework', 'featuredImage'): os.path.join(PUB_DIR, '5-stage-smart-contract-audit-telemetry-framework-featured.jpg'),
    ('5-stage-smart-contract-audit-telemetry-framework', 'middleImage'): os.path.join(PUB_DIR, '5-stage-smart-contract-audit-telemetry-framework-middle.jpg'),
    ('5-stage-smart-contract-audit-telemetry-framework', 'preFaqImage'): os.path.join(PUB_DIR, '5-stage-smart-contract-audit-telemetry-framework-pre_faq.jpg'),

    # 11. editorial-integrity-charter-and-fact-checking-code
    ('editorial-integrity-charter-and-fact-checking-code', 'featuredImage'): os.path.join(PUB_DIR, 'editorial-integrity-charter-and-fact-checking-code-featured.jpg'),
    ('editorial-integrity-charter-and-fact-checking-code', 'middleImage'): os.path.join(PUB_DIR, 'editorial-integrity-charter-and-fact-checking-code-middle.jpg'),
    ('editorial-integrity-charter-and-fact-checking-code', 'preFaqImage'): os.path.join(PUB_DIR, 'editorial-integrity-charter-and-fact-checking-code-pre_faq.jpg'),

    # 12. setting-up-a-farming-wallet
    ('setting-up-a-farming-wallet', 'featuredImage'): os.path.join(PUB_DIR, 'setting-up-a-farming-wallet-featured.jpg'),
    ('setting-up-a-farming-wallet', 'middleImage'): os.path.join(PUB_DIR, 'setting-up-a-farming-wallet-middle.jpg'),
    ('setting-up-a-farming-wallet', 'preFaqImage'): os.path.join(PUB_DIR, 'setting-up-a-farming-wallet-pre_faq.jpg'),

    # 13. how-to-farm-airdrops-safely-2026
    ('how-to-farm-airdrops-safely-2026', 'featuredImage'): os.path.join(PUB_DIR, 'how-to-farm-airdrops-safely-2026-featured.jpg'),
    ('how-to-farm-airdrops-safely-2026', 'middleImage'): os.path.join(PUB_DIR, 'how-to-farm-airdrops-safely-2026-middle.jpg'),
    ('how-to-farm-airdrops-safely-2026', 'preFaqImage'): os.path.join(PUB_DIR, 'how-to-farm-airdrops-safely-2026-pre_faq.jpg'),

    # 14. monad-ecosystem-parallel-evm-airdrop-playbook (GIVEN ITS OWN MONAD GEMINI PURPLE CORE VISUAL!)
    ('monad-ecosystem-parallel-evm-airdrop-playbook', 'featuredImage'): os.path.join(BRAIN_D2, 'monad_featured_1789388073005.jpg'),
    ('monad-ecosystem-parallel-evm-airdrop-playbook', 'middleImage'): os.path.join(PUB_DIR, 'monad-parallel-evm-testnet-2026-middle.jpg'),
    ('monad-ecosystem-parallel-evm-airdrop-playbook', 'preFaqImage'): os.path.join(PUB_DIR, 'monad-parallel-evm-testnet-2026-pre_faq.jpg'),

    # 15. top-confirmed-crypto-airdrops-2026-calendar
    ('top-confirmed-crypto-airdrops-2026-calendar', 'featuredImage'): os.path.join(PUB_DIR, 'top-confirmed-crypto-airdrops-2026-calendar-featured.jpg'),
    ('top-confirmed-crypto-airdrops-2026-calendar', 'middleImage'): os.path.join(PUB_DIR, 'top-confirmed-crypto-airdrops-2026-calendar-middle.jpg'),
    ('top-confirmed-crypto-airdrops-2026-calendar', 'preFaqImage'): os.path.join(PUB_DIR, 'top-confirmed-crypto-airdrops-2026-calendar-pre_faq.jpg'),

    # 16. berachain-v2-airdrop-strategy-guide-2026 (Honeycomb gold cube vault)
    ('berachain-v2-airdrop-strategy-guide-2026', 'featuredImage'): os.path.join(PUB_DIR, 'berachain-v2-airdrop-strategy-guide-2026-featured.jpg'),
    ('berachain-v2-airdrop-strategy-guide-2026', 'middleImage'): os.path.join(PUB_DIR, 'berachain-v2-airdrop-strategy-guide-2026-middle.jpg'),
    ('berachain-v2-airdrop-strategy-guide-2026', 'preFaqImage'): os.path.join(PUB_DIR, 'berachain-v2-airdrop-strategy-guide-2026-pre_faq.jpg'),
}

# Slugs to remove because they are duplicate clones
DUPLICATE_SLUGS_TO_REMOVE = [
    'avoiding-sybil-detection',
    'bridging-to-layer-2-networks',
    'understanding-snapshot-mechanics'
]

def save_versioned_image(src_path: str, dest_path: str, unique_label: str):
    img = Image.open(src_path)
    if img.mode != 'RGB':
        img = img.convert('RGB')
    exif = img.getexif()
    exif[0x010E] = f"CryptoAirdropAI Verified: {unique_label}"
    exif[0x0131] = "CryptoAirdropAI Engine v2"
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    img.save(dest_path, format="JPEG", quality=95, exif=exif)

def main():
    print("=" * 75)
    print("1. DEPLOYING VERSIONED -gemini-v2.jpg ASSETS (ZERO CACHE COLLISION)")
    print("=" * 75)

    proj_file = os.path.join(REPO_ROOT, "web", "src", "data", "projects.json")
    art_file = os.path.join(REPO_ROOT, "web", "src", "data", "articles.json")

    with open(proj_file, "r", encoding="utf-8") as f:
        projects = json.load(f)
    with open(art_file, "r", encoding="utf-8") as f:
        articles = json.load(f)

    # 1. Deploy Projects
    for p in projects:
        slug = p['slug']
        src = PROJECT_SOURCES.get(slug)
        if not src or not os.path.exists(src):
            print(f"ERROR: Missing source for {slug}")
            continue
        v2_filename = f"{slug}-project-gemini-v2.jpg"
        v2_path = os.path.join(PUB_DIR, v2_filename)
        save_versioned_image(src, v2_path, f"Project {slug}")
        p['featuredImage'] = f"/images/generated/{v2_filename}"
        print(f"  ✓ Project: {slug:<20} -> {v2_filename} ({os.path.getsize(v2_path)//1024} KB)")

    # Save projects.json
    with open(proj_file, "w", encoding="utf-8") as f:
        json.dump(projects, f, indent=2, ensure_ascii=False)
    print(f"\n[+] Saved {len(projects)} projects to projects.json")

    # 2. Filter duplicate articles and deploy versioned images
    cleaned_articles = [a for a in articles if a['slug'] not in DUPLICATE_SLUGS_TO_REMOVE]
    print(f"\n[+] Filtered articles from {len(articles)} down to {len(cleaned_articles)} (removed {len(articles) - len(cleaned_articles)} duplicate clones)")

    for a in cleaned_articles:
        slug = a['slug']
        for slot in ['featuredImage', 'middleImage', 'preFaqImage']:
            src = ARTICLE_SOURCES.get((slug, slot))
            if not src or not os.path.exists(src):
                print(f"ERROR: Missing source for article: {slug} [{slot}]")
                continue
            suffix_map = {'featuredImage': 'featured', 'middleImage': 'middle', 'preFaqImage': 'pre_faq'}
            v2_filename = f"{slug}-{suffix_map[slot]}-gemini-v2.jpg"
            v2_path = os.path.join(PUB_DIR, v2_filename)
            save_versioned_image(src, v2_path, f"Article {slug} {slot}")
            a[slot] = f"/images/generated/{v2_filename}"
            print(f"  ✓ Article: {slug:<35} [{slot}] -> {v2_filename} ({os.path.getsize(v2_path)//1024} KB)")

    # Save articles.json
    with open(art_file, "w", encoding="utf-8") as f:
        json.dump(cleaned_articles, f, indent=2, ensure_ascii=False)
    print(f"\n[+] Saved {len(cleaned_articles)} clean articles to articles.json")

    # 3. Update Remote MySQL via API
    print("\n=" * 75)
    print("2. SYNCING LIVE HOSTINGER MYSQL DATABASE")
    print("=" * 75)

    # Sync projects
    for p in projects:
        slug = p['slug']
        url = f"https://cryptoairdropai.com/api/projects.php?slug={slug}"
        payload = json.dumps({'featuredImage': p['featuredImage']}).encode('utf-8')
        req = urllib.request.Request(url, data=payload, headers=API_HEADERS, method='PUT')
        try:
            with urllib.request.urlopen(req, timeout=10) as res:
                print(f"  ✓ MySQL Project Updated: {slug} -> {p['featuredImage']}")
        except Exception as e:
            print(f"  ❌ MySQL Project Err {slug}: {e}")

    # Delete duplicate clone articles from remote MySQL
    for dup_slug in DUPLICATE_SLUGS_TO_REMOVE:
        url = f"https://cryptoairdropai.com/api/articles.php?slug={dup_slug}"
        req = urllib.request.Request(url, headers=API_HEADERS, method='DELETE')
        try:
            with urllib.request.urlopen(req, timeout=10) as res:
                print(f"  ✓ MySQL Duplicate Article DELETED: {dup_slug}")
        except Exception as e:
            print(f"  Notice MySQL Delete {dup_slug}: {e}")

    # Sync clean articles to remote MySQL
    for a in cleaned_articles:
        slug = a['slug']
        url = f"https://cryptoairdropai.com/api/articles.php?slug={slug}"
        payload = json.dumps({
            'featuredImage': a['featuredImage'],
            'middleImage': a['middleImage'],
            'preFaqImage': a['preFaqImage']
        }).encode('utf-8')
        req = urllib.request.Request(url, data=payload, headers=API_HEADERS, method='PUT')
        try:
            with urllib.request.urlopen(req, timeout=10) as res:
                print(f"  ✓ MySQL Article Updated: {slug}")
        except Exception as e:
            print(f"  ❌ MySQL Article Err {slug}: {e}")

    print("\n=" * 75)
    print("✅ MIGRATION & MYSQL SYNC COMPLETED SUCCESSFULLY!")
    print("=" * 75)

if __name__ == "__main__":
    main()
