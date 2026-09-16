import os, sys, json
from PIL import Image
import numpy as np

sys.stdout.reconfigure(encoding='utf-8')

REPO_ROOT = r"C:\hk\cryptodrop"
PUB_DIR = os.path.join(REPO_ROOT, "web", "public", "images", "generated")
BRAIN_D2 = r"C:\Users\Dell\.gemini\antigravity-cli\brain\d2f64889-1c16-476c-87cb-f2a23865e2a8"
art_file = os.path.join(REPO_ROOT, "web", "src", "data", "articles.json")

def save_versioned_image(src_path: str, dest_path: str, unique_label: str):
    img = Image.open(src_path)
    if img.mode != 'RGB':
        img = img.convert('RGB')
    exif = img.getexif()
    exif[0x010E] = f"CryptoAirdropAI Verified: {unique_label}"
    exif[0x0131] = "CryptoAirdropAI Engine v4"
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    img.save(dest_path, format="JPEG", quality=95, exif=exif)

with open(art_file, "r", encoding="utf-8") as f:
    articles = json.load(f)

# Refined slot assignments to eliminate all remaining cluster overlaps
refinements = {
    # 1. understanding-snapshot-mechanics middleImage -> understanding-snapshot-mechanics-middle-v2.jpg
    ('understanding-snapshot-mechanics-block-heights-in-web3-airdrops', 'middleImage',
     os.path.join(PUB_DIR, 'understanding-snapshot-mechanics-middle-v2.jpg')),

    # 2. fuel-network preFaqImage -> fuel_intel_faq_1789454812560.jpg
    ('fuel-network-layer-2-high-speed-execution-testnet-playbook', 'preFaqImage',
     os.path.join(BRAIN_D2, 'fuel_intel_faq_1789454812560.jpg')),

    # 3. babylon-bitcoin-staking middleImage -> babylon-bitcoin-staking-mainnet-distribution-points-guide-pre_faq-3d.jpg
    ('babylon-bitcoin-staking-mainnet-distribution-points-guide', 'middleImage',
     os.path.join(PUB_DIR, 'babylon-bitcoin-staking-mainnet-distribution-points-guide-pre_faq-3d.jpg')),

    # 4. evm-gas-optimization featuredImage -> avoiding-sybil-detection-featured-v2.jpg
    ('evm-gas-optimization-and-gwei-timing-for-airdrop-farmers', 'featuredImage',
     os.path.join(PUB_DIR, 'avoiding-sybil-detection-featured-v2.jpg')),

    # 5. automated-scripts featuredImage -> understanding-snapshot-mechanics-featured-v2.jpg
    ('automated-scripts-vs-manual-interaction-sybil-vectors', 'featuredImage',
     os.path.join(PUB_DIR, 'understanding-snapshot-mechanics-featured-v2.jpg')),

    # 6. berachain-v2-proof-of-liquidity featuredImage -> berachain_featured_1789387980927.jpg
    ('berachain-v2-proof-of-liquidity-tge-breakdown-2026', 'featuredImage',
     os.path.join(BRAIN_D2, 'berachain_featured_1789387980927.jpg')),

    # 7. cross-chain-bridging preFaqImage -> bridging-to-layer-2-networks-pre_faq-v2.jpg
    ('cross-chain-bridging-liquidity-routing-security-manual', 'preFaqImage',
     os.path.join(PUB_DIR, 'bridging-to-layer-2-networks-pre_faq-v2.jpg')),

    # 8. cross-chain-bridging middleImage -> bridging-to-layer-2-networks-middle-v2.jpg
    ('cross-chain-bridging-liquidity-routing-security-manual', 'middleImage',
     os.path.join(PUB_DIR, 'bridging-to-layer-2-networks-middle-v2.jpg')),

    # 9. story-protocol preFaqImage -> test_guide_art_1789448967943.jpg
    ('story-protocol-intellectual-property-testnet-airdrop-strategy', 'preFaqImage',
     os.path.join(BRAIN_D2, 'test_guide_art_1789448967943.jpg')),

    # 10. hardware-wallet-multisig middleImage -> understanding-snapshot-mechanics-pre_faq-v2.jpg
    ('hardware-wallet-multisig-airdrop-claim-security-manual', 'middleImage',
     os.path.join(PUB_DIR, 'understanding-snapshot-mechanics-pre_faq-v2.jpg')),

    # 11. babylon-bitcoin-staking preFaqImage -> babylon-bitcoin-staking-mainnet-distribution-points-guide-middle-3d.jpg
    ('babylon-bitcoin-staking-mainnet-distribution-points-guide', 'preFaqImage',
     os.path.join(PUB_DIR, 'babylon-bitcoin-staking-mainnet-distribution-points-guide-middle-3d.jpg')),

    # 12. story-protocol middleImage -> story-protocol-intellectual-property-testnet-airdrop-strategy-middle-3d.jpg
    ('story-protocol-intellectual-property-testnet-airdrop-strategy', 'middleImage',
     os.path.join(PUB_DIR, 'story-protocol-intellectual-property-testnet-airdrop-strategy-middle-3d.jpg')),

    # 13. solana-multi-wallet preFaqImage -> solana-multi-wallet-isolation-sybil-defense-masterclass-2026-middle-gemini-v2.jpg
    ('solana-multi-wallet-isolation-sybil-defense-masterclass-2026', 'preFaqImage',
     os.path.join(PUB_DIR, 'solana-multi-wallet-isolation-sybil-defense-masterclass-2026-middle-gemini-v2.jpg')),
}

for (slug, slot, src) in refinements:
    for a in articles:
        if a['slug'] == slug:
            suffix = {'featuredImage': 'featured', 'middleImage': 'middle', 'preFaqImage': 'pre_faq'}[slot]
            dest_filename = f"{slug}-{suffix}-gemini-v2.jpg"
            dest_path = os.path.join(PUB_DIR, dest_filename)
            save_versioned_image(src, dest_path, f"{slug} {slot} refined")
            a[slot] = f"/images/generated/{dest_filename}"
            print(f"  ✓ Refined {slug} [{slot}] -> {dest_filename}")

with open(art_file, "w", encoding="utf-8") as f:
    json.dump(articles, f, indent=2, ensure_ascii=False)

print("\n[+] Saved refined articles.json")
