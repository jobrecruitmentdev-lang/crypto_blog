import json, os, sys
from PIL import Image
import numpy as np

sys.stdout.reconfigure(encoding='utf-8')

def dhash(image, hash_size=8):
    img = image.convert('L').resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
    pixels = np.asarray(img)
    diff = pixels[:, 1:] > pixels[:, :-1]
    return hex(int("".join(["1" if v else "0" for v in diff.flatten()]), 2))[2:].zfill(hash_size * hash_size // 4)

REPO_ROOT = r"C:\hk\cryptodrop"
PUB_DIR = os.path.join(REPO_ROOT, "web", "public", "images", "generated")
BRAIN_D2 = r"C:\Users\Dell\.gemini\antigravity-cli\brain\d2f64889-1c16-476c-87cb-f2a23865e2a8"
BRAIN_29 = r"C:\Users\Dell\.gemini\antigravity-cli\brain\290e5386-2923-4614-b052-9341725368e1"
BRAIN_E1 = r"C:\Users\Dell\.gemini\antigravity-cli\brain\e17d2b52-cf05-410c-aace-f01fa2a6b008"

# 1. Check all 23 project images
projects = json.load(open(os.path.join(REPO_ROOT, "web", "src", "data", "projects.json"), encoding='utf-8'))
project_hashes = {}
for p in projects:
    slug = p['slug']
    img_rel = p['featuredImage']
    full_p = os.path.join(REPO_ROOT, "web", "public", img_rel.lstrip('/'))
    if os.path.exists(full_p):
        h = dhash(Image.open(full_p))
        if h in project_hashes:
            print(f"COLLISION in projects: {slug} and {project_hashes[h]}")
        project_hashes[h] = slug

print(f"Projects unique dhashes: {len(project_hashes)} / {len(projects)}")

search_dirs = [
    r"C:\hk\cryptodrop\web\public\images\generated",
    BRAIN_D2,
    BRAIN_29,
    BRAIN_E1
]

available_candidates = {}
for sdir in search_dirs:
    if not os.path.exists(sdir):
        continue
    for f in os.listdir(sdir):
        if f.endswith(('.jpg', '.png')) and not f.startswith('media_'):
            p = os.path.join(sdir, f)
            sz = os.path.getsize(p) // 1024
            if sz > 150:
                try:
                    h = dhash(Image.open(p))
                    if h not in project_hashes and h not in available_candidates:
                        available_candidates[h] = (f, p, sz)
                except Exception:
                    pass

print(f"Completely unreserved unique visual candidates for articles: {len(available_candidates)}")
for i, (h, (f, p, sz)) in enumerate(available_candidates.items()):
    print(f"  {i+1:2d}. {h} | {sz:>4} KB | {f}")

