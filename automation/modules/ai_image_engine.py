import os
import sys
import time
import math
import random
import urllib.request
import urllib.parse
import io
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

# Force UTF-8 on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
OUTPUT_DIR = PROJECT_ROOT / "web" / "public" / "images" / "generated"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

THEME_PALETTES = {
    "bitcoin": {"primary": (247, 147, 26), "secondary": (255, 215, 0), "bg_dark": (15, 12, 8), "glow": (255, 170, 0, 100)},
    "solana": {"primary": (153, 69, 255), "secondary": (20, 241, 149), "bg_dark": (10, 8, 20), "glow": (180, 80, 255, 100)},
    "ethereum": {"primary": (98, 126, 234), "secondary": (192, 214, 245), "bg_dark": (8, 12, 24), "glow": (100, 150, 255, 100)},
    "security": {"primary": (239, 68, 68), "secondary": (59, 130, 246), "bg_dark": (18, 10, 15), "glow": (240, 70, 70, 100)},
    "bridge": {"primary": (6, 182, 212), "secondary": (59, 130, 246), "bg_dark": (6, 16, 26), "glow": (10, 200, 240, 100)},
    "restaking": {"primary": (168, 85, 247), "secondary": (236, 72, 153), "bg_dark": (16, 8, 24), "glow": (200, 90, 250, 100)},
    "fast": {"primary": (16, 185, 129), "secondary": (6, 182, 212), "bg_dark": (6, 20, 16), "glow": (20, 220, 150, 100)},
    "default": {"primary": (37, 99, 235), "secondary": (14, 165, 233), "bg_dark": (10, 15, 28), "glow": (40, 120, 255, 100)},
}

def detect_palette(text: str) -> dict:
    t = text.lower()
    if any(k in t for k in ["bitcoin", "btc", "babylon", "satoshi"]):
        return THEME_PALETTES["bitcoin"]
    if any(k in t for k in ["solana", "svm", "eclipse", "sonic", "solayer"]):
        return THEME_PALETTES["solana"]
    if any(k in t for k in ["sybil", "security", "audit", "fraud", "defense"]):
        return THEME_PALETTES["security"]
    if any(k in t for k in ["bridge", "cross-chain", "hop", "routing", "liquidity"]):
        return THEME_PALETTES["bridge"]
    if any(k in t for k in ["restake", "restaking", "symbiotic", "eigen", "mitosis"]):
        return THEME_PALETTES["restaking"]
    if any(k in t for k in ["fuel", "speed", "megaeth", "fast", "throughput", "execution"]):
        return THEME_PALETTES["fast"]
    if any(k in t for k in ["eth", "ethereum", "evm", "monad", "story", "initia"]):
        return THEME_PALETTES["ethereum"]
    return THEME_PALETTES["default"]

def build_topic_prompt(topic: str, placement: str) -> str:
    """Creates a high-aesthetic, bespoke 3D photorealistic prompt tailored to the topic and placement."""
    clean_topic = topic.replace("-", " ").title()
    pal = detect_palette(topic)
    
    if pal == THEME_PALETTES["bitcoin"]:
        material = "radiant golden cryptographic runes, obsidian marble pedestal, laser timestamping grid"
    elif pal == THEME_PALETTES["solana"]:
        material = "parallel SVM neon violet and cyan crystal pipelines, futuristic holographic telemetry"
    elif pal == THEME_PALETTES["security"]:
        material = "heavy cryptographic security shield, biometric heuristic cluster prism, volumetric laser defense"
    elif pal == THEME_PALETTES["bridge"]:
        material = "translucent quantum fiber bridging platform, multi-chain interconnected sapphire spheres"
    elif pal == THEME_PALETTES["restaking"]:
        material = "gyroscopic interlocking platinum rings, glowing amber restaking crystal heart, cleanroom pedestal"
    elif pal == THEME_PALETTES["fast"]:
        material = "emerald fiber-optic high speed data highway, microsecond execution pipeline, glowing light beams"
    else:
        material = "photorealistic crystalline blockchain cube, iridescent glass facets, ambient studio illumination"

    if placement == "project":
        return f"3D luxury physical crypto token emblem for {clean_topic}, {material}, 1:1 square emblem on white marble pedestal, octane render, cinema 4d, 8k, dramatic lighting"
    elif placement == "featured":
        return f"3D photorealistic cinematic concept art of {clean_topic}, {material}, wide 16:9 perspective, octane render, 8k, highly detailed, sharp focus"
    elif placement == "middle":
        return f"3D isometric architectural schematic of {clean_topic}, transparent glass transaction pipelines, glowing validator nodes, {material}, clean laboratory, 8k render"
    else: # pre_faq
        return f"3D holographic security matrix and cryptographic verification shield for {clean_topic}, glowing circuit traces, {material}, tamper-proof seal, 8k"

def render_procedural_fallback(topic: str, placement: str, target_dim: tuple) -> Image.Image:
    """
    Renders a high-tech procedural 3D cybernetic illustration if online API is unavailable.
    Guarantees no broken visual, no flat HTML card, and pure graphic aesthetics.
    """
    w, h = target_dim
    pal = detect_palette(topic)
    p_color = pal["primary"]
    s_color = pal["secondary"]
    bg = pal["bg_dark"]

    img = Image.new("RGB", (w, h), bg)
    draw = ImageDraw.Draw(img)

    # Background subtle tech grid
    grid_spacing = 40
    for x in range(0, w, grid_spacing):
        draw.line([(x, 0), (x, h)], fill=(bg[0] + 12, bg[1] + 12, bg[2] + 18), width=1)
    for y in range(0, h, grid_spacing):
        draw.line([(0, y), (w, y)], fill=(bg[0] + 12, bg[1] + 12, bg[2] + 18), width=1)

    # Core 3D visual geometry
    center_x, center_y = w // 2, h // 2
    seed = abs(hash(topic + placement)) % 100000
    random.seed(seed)

    # Outer ambient glow
    glow_img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_img)
    for r in range(min(w, h) // 2, 60, -20):
        alpha = int(25 * (1 - r / (min(w, h) // 2)))
        glow_draw.ellipse(
            [(center_x - r, center_y - r), (center_x + r, center_y + r)],
            fill=(p_color[0], p_color[1], p_color[2], alpha)
        )
    glow_img = glow_img.filter(ImageFilter.GaussianBlur(radius=30))
    img.paste(glow_img, (0, 0), glow_img)

    # Isometric 3D Polygon Nodes & Pathways
    draw = ImageDraw.Draw(img)
    num_nodes = 7 if placement == "project" else 12
    nodes = []
    base_radius = min(w, h) * 0.28

    for i in range(num_nodes):
        angle = (2 * math.pi * i) / num_nodes + (seed % 360) * (math.pi / 180)
        dist = base_radius * (0.8 + 0.35 * math.sin(i * 1.7))
        nx = center_x + int(math.cos(angle) * dist)
        ny = center_y + int(math.sin(angle) * dist * 0.75) # isometric tilt
        nodes.append((nx, ny))

    # Draw circuit pathways between nodes
    for i in range(len(nodes)):
        for j in range(i + 1, len(nodes)):
            if random.random() > 0.45:
                color = s_color if (i + j) % 2 == 0 else p_color
                draw.line([nodes[i], nodes[j]], fill=color, width=2)

    # Draw Central Hologram Structure
    c_rad = int(min(w, h) * (0.22 if placement == "project" else 0.18))
    # Outer ring
    draw.ellipse(
        [(center_x - c_rad, center_y - c_rad), (center_x + c_rad, center_y + c_rad)],
        outline=s_color, width=4
    )
    # Inner glowing crystal polygon
    poly_points = []
    num_pts = 6 if placement != "pre_faq" else 8
    for i in range(num_pts):
        ang = (2 * math.pi * i) / num_pts - math.pi / 2
        r = c_rad * 0.75
        poly_points.append((center_x + int(math.cos(ang) * r), center_y + int(math.sin(ang) * r)))
    draw.polygon(poly_points, outline=p_color, fill=(bg[0] + 20, bg[1] + 25, bg[2] + 40))

    # Node points
    for nx, ny in nodes:
        draw.ellipse([(nx - 6, ny - 6), (nx + 6, ny + 6)], fill=s_color, outline=(255, 255, 255), width=2)

    # Dynamic cryptographic HUD markers (corners)
    hud_color = (120, 140, 170)
    draw.line([(30, 30), (70, 30)], fill=hud_color, width=2)
    draw.line([(30, 30), (30, 70)], fill=hud_color, width=2)
    draw.line([(w - 30, 30), (w - 70, 30)], fill=hud_color, width=2)
    draw.line([(w - 30, 30), (w - 30, 70)], fill=hud_color, width=2)
    draw.line([(30, h - 30), (70, h - 30)], fill=hud_color, width=2)
    draw.line([(30, h - 30), (30, h - 70)], fill=hud_color, width=2)
    draw.line([(w - 30, h - 30), (w - 70, h - 30)], fill=hud_color, width=2)
    draw.line([(w - 30, h - 30), (w - 30, h - 70)], fill=hud_color, width=2)

    return img

def generate_8k_image(topic: str, slug: str, placement: str = "featured", category: str = "MARKET INTELLIGENCE") -> str:
    """
    Autonomous AI Image Generation Engine:
    1. Checks cache in web/public/images/generated/
    2. Dynamically prompts Pollinations with topic-specific 3D octane render prompt
    3. Crops out watermark via Pillow and resizes cleanly with LANCZOS
    4. Automatically falls back to high-tech procedural cybernetic 3D visual if offline
    """
    safe_slug = slug.replace("/", "-").strip("-")
    filename = f"{safe_slug}-{placement}.jpg"
    target_path = OUTPUT_DIR / filename
    web_url = f"/images/generated/{filename}"

    # Reuse if already exists and is genuine (>50KB)
    if target_path.exists() and target_path.stat().st_size > 50000:
        print(f"[+] Reusing existing high-res visual for {slug} [{placement}]: {web_url} ({target_path.stat().st_size:,} bytes)")
        return web_url

    print(f"[*] Generating bespoke 3D photorealistic visual for '{topic}' [{placement}]...")
    is_square = (placement == "project")
    target_dim = (800, 800) if is_square else (1280, 720)
    prompt = build_topic_prompt(topic, placement)

    # Attempt Pollinations with retry
    seed = abs(hash(slug + placement)) % 100000
    w_req, h_req = (1024, 1024) if is_square else (1024, 576)
    encoded = urllib.parse.quote(prompt)

    success = False
    for attempt in range(1, 3):
        url = f"https://image.pollinations.ai/prompt/{encoded}?width={w_req}&height={h_req}&seed={seed + attempt * 17}"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"})
        try:
            with urllib.request.urlopen(req, timeout=22) as resp:
                data = resp.read()
            if len(data) > 20000:
                img = Image.open(io.BytesIO(data))
                # Crop watermark cleanly from bottom
                crop_h = 45 if is_square else 35
                cropped = img.crop((0, 0, img.size[0], img.size[1] - crop_h))
                final = cropped.resize(target_dim, Image.Resampling.LANCZOS)
                final.save(target_path, quality=95)
                print(f"[✓] Successfully rendered AI 3D visual ({target_path.stat().st_size:,} bytes) -> {web_url}")
                success = True
                break
        except Exception as e:
            print(f"[-] Pollinations attempt {attempt} failed: {e}")
            time.sleep(2)

    if not success:
        print(f"[!] Triggering high-aesthetic procedural 3D visual fallback for '{topic}' [{placement}]...")
        fallback_img = render_procedural_fallback(topic, placement, target_dim)
        fallback_img.save(target_path, quality=95)
        print(f"[✓] Saved procedural 3D cybernetic visual ({target_path.stat().st_size:,} bytes) -> {web_url}")

    return web_url

def generate_article_images_trio(topic: str, slug: str, category: str = "MARKET INTELLIGENCE") -> dict:
    """Generates all 3 unique visuals for an article (Featured, Middle, Pre-FAQ)."""
    print(f"\n🎨 Starting 3-Visual Generation Pipeline for: {topic}")
    featured = generate_8k_image(topic, slug, placement="featured", category=category)
    time.sleep(2.5)
    middle = generate_8k_image(topic, slug, placement="middle", category=category)
    time.sleep(2.5)
    pre_faq = generate_8k_image(topic, slug, placement="pre_faq", category=category)

    return {
        "featured_image": featured,
        "middle_image": middle,
        "pre_faq_image": pre_faq
    }

if __name__ == "__main__":
    print("Testing AI Image Engine...")
    trio = generate_article_images_trio("Test Protocol Alpha 2026", "test-protocol-alpha-2026")
    print("Result Trio:", trio)
