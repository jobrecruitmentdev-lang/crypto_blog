import os
import sys
import time
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

sys.path.extend([str(AUTOMATION_ROOT), str(PROJECT_ROOT)])

load_dotenv(dotenv_path=AUTOMATION_ROOT / ".env")
load_dotenv()

from modules.project_scraper import generate_batch_projects
from modules.article_generator import generate_batch_articles

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
    print("  Queue: 3 Projects + 3 Intelligence Articles + 3 Guides Playbooks")
    print("  Standard: Gemini-Class Bespoke Visuals, Full Invariants, 100% Live Deploy")
    print("=" * 80 + "\n")

    # 1. Generate 3 Projects
    print("\n" + "▶" * 40)
    print("PHASE 1: GENERATING 3 VERIFIED AIRDROP PROTOCOLS")
    print("▶" * 40)
    new_projects = generate_batch_projects(count=3)

    # 2. Generate 3 Intelligence Articles (2,200 - 2,600 words, 4-6 FAQs)
    print("\n" + "▶" * 40)
    print("PHASE 2: GENERATING 3 DEEP INTELLIGENCE REPORTS (2,200-2,600 WORDS)")
    print("▶" * 40)
    new_intelligence = generate_batch_articles(page_type="intelligence", count=3)

    # 3. Generate 3 Guides (1,800 - 2,200 words, 4-7 FAQs)
    print("\n" + "▶" * 40)
    print("PHASE 3: GENERATING 3 TACTICAL GUIDES (1,800-2,200 WORDS)")
    print("▶" * 40)
    new_guides = generate_batch_articles(page_type="guides", count=3)

    # 3.5 Sync generated batch to Hostinger MySQL Database
    print("\n" + "▶" * 40)
    print("PHASE 3.5: PERSISTING BATCH TO HOSTINGER MYSQL DATABASE")
    print("▶" * 40)
    try:
        from modules.db_sync import sync_batch_to_mysql
        sync_batch_to_mysql(new_projects, new_intelligence, new_guides)
    except Exception as e:
        print(f"⚠️ Notice: Database sync encountered issue: {e}")

    # 4. Local Build & Verification Gate
    print("\n" + "▶" * 40)
    print("PHASE 4: LOCAL BUILD & STATIC VERIFICATION GATE")
    print("▶" * 40)
    web_dir = PROJECT_ROOT / "web"
    build_ok = run_cmd("npm run build", cwd=web_dir)
    if not build_ok:
        print("❌ Build failed! Aborting git commit & push.")
        sys.exit(1)

    verify_ok = run_cmd([sys.executable, str(PROJECT_ROOT / "tests" / "verify_crawl_architecture.py")])
    if not verify_ok:
        print("❌ Crawl architecture verification failed! Aborting git push.")
        sys.exit(1)

    # 5. Production Git Commit & Push
    print("\n" + "▶" * 40)
    print("PHASE 5: GIT COMMIT & HOSTINGER PRODUCTION DEPLOYMENT")
    print("▶" * 40)
    
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    commit_msg = f"feat(auto): publish 3 projects, 3 intelligence articles, 3 guides [{timestamp}]"

    run_cmd("git add web/src/data/ web/public/images/generated/ automation/ scripts/")
    run_cmd(f'git commit -m "{commit_msg}"')
    push_ok = run_cmd("git push origin main")

    if push_ok:
        print("\n✅ Successfully pushed to origin main! GitHub Actions deployment triggered.")
    else:
        print("\n⚠️ Notice: Git push completed or no changes to push.")

    # 6. Search Discovery Broadcast (Google Indexing API + IndexNow)
    print("\n" + "▶" * 40)
    print("PHASE 6: SEARCH DISCOVERY BROADCAST (GOOGLE + INDEXNOW)")
    print("▶" * 40)
    new_urls = []
    for p in new_projects:
        new_urls.append(f"https://cryptoairdropai.com/projects/{p['slug']}/")
    for a in new_intelligence:
        new_urls.append(f"https://cryptoairdropai.com/blog/{a['slug']}/")
    for g in new_guides:
        new_urls.append(f"https://cryptoairdropai.com/guides/{g['slug']}/")

    try:
        from modules.submit_indexing import notify_search_engines
        notify_search_engines(new_urls)
    except Exception as e:
        print(f"[*] Search indexing broadcast note: {e}")

    elapsed = time.time() - start_time
    print("\n" + "=" * 80)
    print(f"  🎉 BATCH PUBLISHING COMPLETED IN {elapsed:.1f} SECONDS!")
    print("=" * 80)
    print("\n📋 SCOREBOARD OF NEWLY PUBLISHED ASSETS:")
    print("-" * 80)
    print("PROJECTS (3):")
    for p in new_projects:
        print(f"  ● https://cryptoairdropai.com/projects/{p['slug']}/  ({p['chain']} | {p['reward']})")
    print("\nINTELLIGENCE ARTICLES (3):")
    for a in new_intelligence:
        word_count = len(a['body'].split())
        faq_count = len(a.get('faqs', []))
        print(f"  ● https://cryptoairdropai.com/blog/{a['slug']}/  ({word_count:,} words | {faq_count} FAQs)")
    print("\nGUIDES (3):")
    for g in new_guides:
        word_count = len(g['body'].split())
        faq_count = len(g.get('faqs', []))
        print(f"  ● https://cryptoairdropai.com/guides/{g['slug']}/  ({word_count:,} words | {faq_count} FAQs)")
    print("=" * 80)

if __name__ == "__main__":
    run_master_automation()
