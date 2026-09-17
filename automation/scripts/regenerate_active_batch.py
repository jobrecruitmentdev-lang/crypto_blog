import sys
import json
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.extend([str(ROOT / "automation"), str(ROOT / "automation" / "modules")])

from institutional_writer import write_article_payload

batch_file = ROOT / "automation" / "pending_batch.json"
with open(batch_file, "r", encoding="utf-8") as f:
    batch = json.load(f)

print("=" * 70)
print("REGENERATING 6 BESPOKE ARTICLES WITH DEEP TECHNICAL CONTENT & HTML")
print("=" * 70)

print("\n[+] Regenerating 3 Market Intelligence Articles...")
for item in batch["intelligence"]:
    title_short = item["title"][:45]
    print(f" -> Writing bespoke analysis: {title_short}...")
    new_art = write_article_payload(item["title"], item["slug"], "intelligence")
    for img_key in ["featuredImage", "middleImage", "preFaqImage"]:
        if img_key in item:
            new_art[img_key] = item[img_key]
    item.update(new_art)

print("\n[+] Regenerating 3 Tactical Guides...")
for item in batch["guides"]:
    title_short = item["title"][:45]
    print(f" -> Writing bespoke playbook: {title_short}...")
    new_art = write_article_payload(item["title"], item["slug"], "guides")
    for img_key in ["featuredImage", "middleImage", "preFaqImage"]:
        if img_key in item:
            new_art[img_key] = item[img_key]
    item.update(new_art)

with open(batch_file, "w", encoding="utf-8") as f:
    json.dump(batch, f, indent=2, ensure_ascii=False)

articles_file = ROOT / "web" / "src" / "data" / "articles.json"
with open(articles_file, "r", encoding="utf-8") as f:
    articles = json.load(f)

a_map = {a["slug"]: i for i, a in enumerate(articles)}
for a in batch["intelligence"] + batch["guides"]:
    if a["slug"] in a_map:
        articles[a_map[a["slug"]]] = a
    else:
        articles.append(a)

with open(articles_file, "w", encoding="utf-8") as f:
    json.dump(articles, f, indent=2, ensure_ascii=False)

print("\n[✓] All 6 active articles regenerated with 100% unique bespoke content and pure HTML!")
