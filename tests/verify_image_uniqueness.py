"""
CryptoAirdropAI Production Quality Gate: Image Uniqueness & Integrity Verification
Scans all images referenced by projects and articles.
Asserts:
  1. All referenced images exist on disk.
  2. Zero hash collisions (every single image has a strictly unique MD5 hash).
"""

import sys
import os
import json
import hashlib
from collections import defaultdict
from pathlib import Path

# Force UTF-8 on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

REPO_ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIR = REPO_ROOT / "web" / "public"
PROJECTS_FILE = REPO_ROOT / "web" / "src" / "data" / "projects.json"
ARTICLES_FILE = REPO_ROOT / "web" / "src" / "data" / "articles.json"

def verify_uniqueness():
    print("=" * 70)
    print("  PRODUCTION ASSET VERIFICATION: ZERO DUPLICATE IMAGES CONTRACT")
    print("=" * 70)

    if not PROJECTS_FILE.exists() or not ARTICLES_FILE.exists():
        print("[-] Error: Data files not found.")
        sys.exit(1)

    with open(PROJECTS_FILE, "r", encoding="utf-8") as f:
        projects = json.load(f)

    with open(ARTICLES_FILE, "r", encoding="utf-8") as f:
        articles = json.load(f)

    image_entries = []

    # 1. Collect Project Images
    for p in projects:
        name = p.get("name", "Unknown")
        img_rel = p.get("featuredImage")
        if img_rel:
            image_entries.append((f"Project: {name}", img_rel))

    # 2. Collect Article Images
    for a in articles:
        slug = a.get("slug", "unknown")
        for kind in ["featuredImage", "middleImage", "preFaqImage"]:
            img_rel = a.get(kind)
            if img_rel:
                image_entries.append((f"Article: {slug} [{kind}]", img_rel))

    print(f"[*] Total image references collected: {len(image_entries)}")

    # 3. Check file existence and compute hashes
    missing_files = []
    hash_to_entries = defaultdict(list)

    for label, rel_path in image_entries:
        clean_rel = rel_path.lstrip("/")
        full_path = PUBLIC_DIR / clean_rel
        if not full_path.exists():
            missing_files.append((label, str(full_path)))
            continue
            
        with open(full_path, "rb") as fp:
            file_bytes = fp.read()
            file_hash = hashlib.md5(file_bytes).hexdigest()
            file_size = len(file_bytes)
            
        hash_to_entries[file_hash].append((label, rel_path, file_size))

    if missing_files:
        print("\n❌ MISSING IMAGE FILES FOUND:")
        for label, p in missing_files:
            print(f"   - {label}: {p}")
        sys.exit(1)

    # 4. Check for duplicate collisions
    collisions = {h: entries for h, entries in hash_to_entries.items() if len(entries) > 1}

    print(f"[*] Unique verified files: {len(hash_to_entries)} / {len(image_entries)}")

    if collisions:
        print(f"\n❌ FAILED: {len(collisions)} DUPLICATE IMAGE COLLISION(S) DETECTED:")
        for h, entries in collisions.items():
            print(f"\n  Collision Hash: {h[:8]} ({entries[0][2]:,} bytes):")
            for label, path, _ in entries:
                print(f"     - {label} -> {path}")
        print("\nAll assets MUST be strictly unique across projects and articles.")
        sys.exit(1)

    print("\n[+] 100% CLEAN: ZERO DUPLICATE IMAGES DETECTED!")
    print(f"[+] All {len(image_entries)} images have verified unique MD5 cryptographic hashes.")
    print("=" * 70)

if __name__ == "__main__":
    verify_uniqueness()
