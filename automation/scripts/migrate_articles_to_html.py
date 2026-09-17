"""
Migration Utility: Convert all raw markdown in articles.json and pending_batch.json to semantic HTML.
- Ensures all ## become <h2>
- Ensures all tables become responsive <div class="table-scroll"><table>
- Ensures all lists, blockquotes, and codeblocks are semantic HTML
- Formats TL;DR bullet points cleanly
"""

import os
import sys
import re
import json
from pathlib import Path
import markdown

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT = Path(__file__).resolve().parent.parent.parent
ARTICLES_FILE = ROOT / "web" / "src" / "data" / "articles.json"
BATCH_FILE = ROOT / "automation" / "pending_batch.json"

def compile_markdown_to_html(text: str) -> str:
    if not text:
        return ""
    # If already fully HTML with <h2> and <p> and no raw ## or markdown tables, return as-is
    has_raw_md = bool(re.search(r'(^|\n)##\s+', text) or re.search(r'\|\s*:[-\s]+\|', text) or text.startswith('## '))
    if not has_raw_md and ("<p>" in text or "<h2>" in text):
        # Just wrap any unwrapped tables
        if "<table" in text and 'class="table-scroll"' not in text:
            text = re.sub(r'(<table[\s\S]*?</table>)', r'<div class="table-scroll">\1</div>', text, flags=re.IGNORECASE)
        return text

    # Compile with markdown library
    html = markdown.markdown(
        text,
        extensions=['tables', 'fenced_code', 'extra']
    )
    # Wrap tables in responsive scroll container
    if "<table" in html and 'class="table-scroll"' not in html:
        html = re.sub(r'(<table[\s\S]*?</table>)', r'<div class="table-scroll">\1</div>', html, flags=re.IGNORECASE)
    return html

def clean_tldr(tldr: str) -> str:
    if not tldr:
        return ""
    # If it's a single line with inline dashes like "- Cat: x - Dil: y", split them with newlines
    if " - " in tldr and not "\n" in tldr:
        parts = re.split(r'\s+-\s+', tldr.strip())
        parts = [p.strip("- ").strip() for p in parts if p.strip()]
        return "\n".join(f"- {p}" for p in parts)
    return tldr

def migrate_articles():
    print("=" * 60)
    print("MIGRATING ALL ARTICLES TO SEMANTIC HTML")
    print("=" * 60)

    # 1. Migrate articles.json
    if ARTICLES_FILE.exists():
        with open(ARTICLES_FILE, "r", encoding="utf-8") as f:
            articles = json.load(f)
        
        migrated_count = 0
        for a in articles:
            old_body = a.get("body", "")
            new_body = compile_markdown_to_html(old_body)
            if new_body != old_body:
                a["body"] = new_body
                migrated_count += 1
            if "tldr" in a:
                a["tldr"] = clean_tldr(a["tldr"])

        with open(ARTICLES_FILE, "w", encoding="utf-8") as f:
            json.dump(articles, f, indent=2, ensure_ascii=False)
        print(f"[✓] Migrated articles.json: {migrated_count} of {len(articles)} articles updated to semantic HTML.")

    # 2. Migrate pending_batch.json
    if BATCH_FILE.exists():
        with open(BATCH_FILE, "r", encoding="utf-8") as f:
            batch = json.load(f)
        
        b_count = 0
        for cat in ["intelligence", "guides"]:
            for item in batch.get(cat, []):
                old_body = item.get("body", "")
                new_body = compile_markdown_to_html(old_body)
                if new_body != old_body:
                    item["body"] = new_body
                    b_count += 1
                if "tldr" in item:
                    item["tldr"] = clean_tldr(item["tldr"])

        with open(BATCH_FILE, "w", encoding="utf-8") as f:
            json.dump(batch, f, indent=2, ensure_ascii=False)
        print(f"[✓] Migrated pending_batch.json: {b_count} articles updated.")

if __name__ == "__main__":
    migrate_articles()
