import json, os, sys
from PIL import Image
import numpy as np

sys.stdout.reconfigure(encoding='utf-8')

def dhash(image, hash_size=8):
    # Resize to (hash_size + 1, hash_size) grayscale
    img = image.convert('L').resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
    pixels = np.asarray(img)
    # Compute horizontal gradient
    diff = pixels[:, 1:] > pixels[:, :-1]
    # Convert to hex string
    return hex(int("".join(["1" if v else "0" for v in diff.flatten()]), 2))[2:].zfill(hash_size * hash_size // 4)

repo_root = r"C:\hk\cryptodrop"
pub_dir = os.path.join(repo_root, "web", "public")
projects = json.load(open(os.path.join(repo_root, "web", "src", "data", "projects.json"), encoding='utf-8'))
articles = json.load(open(os.path.join(repo_root, "web", "src", "data", "articles.json"), encoding='utf-8'))

all_images = []
for p in projects:
    all_images.append((f"Project: {p['slug']}", p.get('featuredImage')))

for a in articles:
    for slot in ['featuredImage', 'middleImage', 'preFaqImage']:
        if a.get(slot):
            all_images.append((f"Article: {a['slug']} [{slot}]", a.get(slot)))

print(f"Total image references: {len(all_images)}")

hashes = {}
for label, rel_path in all_images:
    full_path = os.path.join(pub_dir, rel_path.lstrip('/'))
    if not os.path.exists(full_path):
        print(f"MISSING: {label} -> {full_path}")
        continue
    try:
        img = Image.open(full_path)
        h = dhash(img)
        if h not in hashes:
            hashes[h] = []
        hashes[h].append((label, rel_path))
    except Exception as e:
        print(f"ERR reading {full_path}: {e}")

duplicates = {h: items for h, items in hashes.items() if len(items) > 1}

print("\n" + "="*70)
print(f"VISUAL DUPLICATE AUDIT REPORT (dHash perceptual matching):")
print(f"Unique visual signatures: {len(hashes)} / {len(all_images)}")
print(f"Visual duplicate clusters found: {len(duplicates)}")
print("="*70)

for h, items in duplicates.items():
    print(f"\n[Visual Cluster: {h}] ({len(items)} images share identical/near-identical visuals):")
    for label, rel in items:
        print(f"  - {label} -> {rel}")

