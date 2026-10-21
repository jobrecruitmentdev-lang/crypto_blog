import os
import sys
from PIL import Image

src1 = r"C:\Users\Dell\.gemini\antigravity-cli\brain\96a4b725-34a8-447d-a7a3-2ee8cdf36640\berachain_v2_project_gemini_v3_1792579882083.jpg"
dest1 = r"C:\hk\cryptodrop\web\public\images\generated\berachain-v2-project-gemini-v3.jpg"

src2 = r"C:\Users\Dell\.gemini\antigravity-cli\brain\96a4b725-34a8-447d-a7a3-2ee8cdf36640\grass_network_project_gemini_v3_1792579904297.jpg"
dest2 = r"C:\hk\cryptodrop\web\public\images\generated\grass-network-project-gemini-v3.jpg"

for src, dest, label in [(src1, dest1, "Berachain V2 Emblem"), (src2, dest2, "Grass DePIN Network Emblem")]:
    if not os.path.exists(src):
        print(f"Error: {src} not found")
        sys.exit(1)
    img = Image.open(src)
    if img.mode != "RGB":
        img = img.convert("RGB")
    exif = img.getexif()
    exif[0x010E] = f"CryptoAirdropAI Unique: {label}"
    exif[0x0131] = "CryptoAirdropAI Engine v8-Bespoke"
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    img.save(dest, format="JPEG", quality=95, exif=exif)
    print(f"Saved: {dest} ({img.size})")

print("All images formatted and saved successfully.")
