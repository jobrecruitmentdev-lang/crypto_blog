"""
CryptoAirdropAI Master Autonomous Batch Publishing Engine (3x3x3)
Pipeline:
  Phase 1: Live Scraping & Deduplication (DeFiLlama & CoinGecko)
  Phase 2: Institutional Content Generation (Groq LLM)
  Phase 3: Autonomous Antigravity & AI Bespoke 3D Visual Generation
  Phase 4: Hostinger MySQL Database Synchronization
  Phase 5: Production Quality Gate (Zero Duplicates Test & Next.js Build)
  Phase 6: Git Commit & Live Hostinger Deployment
"""

import os
import sys
import time
import json
import subprocess
from pathlib import Path
from dotenv import load_dotenv

# Force UTF-8 on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

PROJECT_ROOT = Path(__file__).resolve().parent.parent
AUTOMATION_ROOT = Path(__file__).resolve().parent
MODULES_DIR = AUTOMATION_ROOT / "modules"

sys.path.extend([str(AUTOMATION_ROOT), str(MODULES_DIR), str(PROJECT_ROOT)])

load_dotenv(dotenv_path=AUTOMATION_ROOT / ".env")
load_dotenv()

from live_scout import scout_3x3x3_batch
from institutional_writer import generate_full_batch_manifest
from antigravity_image_bridge import process_batch_images
from db_sync import sync_batch_to_mysql

def run_cmd(cmd, cwd=None):
    print(f"\n[RUN] {' '.join(cmd) if isinstance(cmd, list) else cmd}")
    res = subprocess.run(cmd, cwd=cwd or PROJECT_ROOT, shell=isinstance(cmd, str), text=True, capture_output=True)
    if res.stdout:
        print(res.stdout)
    if res.stderr:
        print(res.stderr)
    return res.returncode == 0

def run_master_automation():
    start_time = time.time()
    print("\n" + "=" * 80)
    print("  🚀 CRYPTOAIRDROPAI.COM — AUTONOMOUS BATCH PUBLISHING ENGINE (3x3x3)")
    print("=" * 80)
    print("  Target: 3 Projects + 3 Intelligence Articles + 3 Guides Playbooks")
    print("  Standard: 100% Unique Bespoke 3D Visuals, Zero Duplicates, Live Deploy")
    print("=" * 80 + "\n")

    # PHASE 1: LIVE SCOUTING & DEDUPLICATION
    print("\n" + "▶" * 40)
    print("PHASE 1: LIVE PROTOCOL SCOUTING & DEDUPLICATION")
    print("▶" * 40)
    scout_data = scout_3x3x3_batch()
    if not scout_data["projects"] or not scout_data["intelligence"] or not scout_data["guides"]:
        print("❌ Scouting did not return full 3x3x3 batch! Aborting.")
        sys.exit(1)

    # PHASE 2: INSTITUTIONAL CONTENT GENERATION (LLM)
    print("\n" + "▶" * 40)
    print("PHASE 2: INSTITUTIONAL LLM CONTENT GENERATION (2,200+ WORDS)")
    print("▶" * 40)
    manifest = generate_full_batch_manifest(scout_data)

    # PHASE 3: BESPOKE 3D IMAGE GENERATION
    print("\n" + "▶" * 40)
    print("PHASE 3: AUTONOMOUS 3D VISUAL ASSET GENERATION")
    print("▶" * 40)
    process_batch_images()

    # Reload generated batch with final image paths
    batch_file = AUTOMATION_ROOT / "pending_batch.json"
    with open(batch_file, "r", encoding="utf-8") as f:
        final_batch = json.load(f)

    # PHASE 4: SYNC TO HOSTINGER MYSQL DATABASE
    print("\n" + "▶" * 40)
    print("PHASE 4: HOSTINGER MYSQL REMOTE DATABASE SYNC")
    print("▶" * 40)
    try:
        sync_batch_to_mysql(
            final_batch["projects"],
            final_batch["intelligence"],
            final_batch["guides"]
        )
    except Exception as e:
        print(f"⚠️ Notice: Database sync encountered issue: {e}")

    # PHASE 5: QUALITY GATE & LOCAL BUILD VERIFICATION
    print("\n" + "▶" * 40)
    print("PHASE 5: PRODUCTION QUALITY GATE & BUILD VERIFICATION")
    print("▶" * 40)

    # 1. Uniqueness check
    uniq_ok = run_cmd([sys.executable, str(PROJECT_ROOT / "tests" / "verify_image_uniqueness.py")])
    if not uniq_ok:
        print("❌ Image uniqueness verification failed! Aborting deploy.")
        sys.exit(1)

    # 2. Next.js static build
    web_dir = PROJECT_ROOT / "web"
    build_ok = run_cmd("npm run build", cwd=web_dir)
    if not build_ok:
        print("❌ Next.js build failed! Aborting deploy.")
        sys.exit(1)

    # PHASE 6: GIT COMMIT & PRODUCTION LIVE DEPLOYMENT
    print("\n" + "▶" * 40)
    print("PHASE 6: GIT COMMIT & PRODUCTION DEPLOYMENT TO HOSTINGER")
    print("▶" * 40)

    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    commit_msg = f"feat(auto): publish 3 projects, 3 intelligence articles, 3 guides [{timestamp}]"

    run_cmd("git add web/src/data/ web/public/images/generated/ automation/pending_batch.json")
    run_cmd(f'git commit -m "{commit_msg}"')
    push_ok = run_cmd("git push origin main")

    elapsed = time.time() - start_time
    print("\n" + "=" * 80)
    if push_ok:
        print(f"  🎉 BATCH PUBLISHING SUCCESSFUL IN {elapsed:.1f}s!")
        print("  All 3 Projects + 3 Intelligence + 3 Guides deployed live to Hostinger.")
    else:
        print(f"  ⚠️ Completed with git warning in {elapsed:.1f}s. Check output above.")
    print("=" * 80 + "\n")

if __name__ == "__main__":
    run_master_automation()
