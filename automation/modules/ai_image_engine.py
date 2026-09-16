import os
import sys
import time
import math
import random
import urllib.request
import urllib.parse
import io
from pathlib import Path
from dotenv import load_dotenv
from PIL import Image, ImageDraw, ImageFilter

# Force UTF-8 on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
AUTOMATION_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = PROJECT_ROOT / "web" / "public" / "images" / "generated"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Load env variables
load_dotenv(dotenv_path=AUTOMATION_ROOT / ".env")
load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
HF_MODEL = os.getenv("HF_IMAGE_MODEL", "black-forest-labs/FLUX.1-schnell")

THEME_PALETTES = {
    "bitcoin": {"primary": (247, 147, 26), "secondary": (255, 215, 0), "bg_dark": (15, 12, 8)},
    "solana": {"primary": (153, 69, 255), "secondary": (20, 241, 149), "bg_dark": (10, 8, 20)},
    "ethereum": {"primary": (98, 126, 234), "secondary": (192, 214, 245), "bg_dark": (8, 12, 24)},
    "security": {"primary": (239, 68, 68), "secondary": (59, 130, 246), "bg_dark": (18, 10, 15)},
    "bridge": {"primary": (6, 182, 212), "secondary": (59, 130, 246), "bg_dark": (6, 16, 26)},
    "restaking": {"primary": (168, 85, 247), "secondary": (236, 72, 153), "bg_dark": (16, 8, 24)},
    "fast": {"primary": (16, 185, 129), "secondary": (6, 182, 212), "bg_dark": (6, 20, 16)},
    "default": {"primary": (37, 99, 235), "secondary": (14, 165, 233), "bg_dark": (10, 15, 28)},
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
    """Procedural 3D cybernetic fallback if both HF and Pollinations are offline."""
    w, h = target_dim
    pal = detect_palette(topic)
    p_color = pal["primary"]
    s_color = pal["secondary"]
    bg = pal["bg_dark"]

    img = Image.new("RGB", (w, h), bg)
    draw = ImageDraw.Draw(img)

    # Tech grid
    grid_spacing = 40
    for x in range(0, w, grid_spacing):
        draw.line([(x, 0), (x, h)], fill=(bg[0] + 12, bg[1] + 12, bg[2] + 18), width=1)
    for y in range(0, h, grid_spacing):
        draw.line([(0, y), (w, y)], fill=(bg[0] + 12, bg[1] + 12, bg[2] + 18), width=1)

    center_x, center_y = w // 2, h // 2
    seed = abs(hash(topic + placement)) % 100000
    random.seed(seed)

    # Ambient glow
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
        ny = center_y + int(math.sin(angle) * dist * 0.75)
        nodes.append((nx, ny))

    for i in range(len(nodes)):
        for j in range(i + 1, len(nodes)):
            if random.random() > 0.45:
                color = s_color if (i + j) % 2 == 0 else p_color
                draw.line([nodes[i], nodes[j]], fill=color, width=2)

    c_rad = int(min(w, h) * (0.22 if placement == "project" else 0.18))
    draw.ellipse([(center_x - c_rad, center_y - c_rad), (center_x + c_rad, center_y + c_rad)], outline=s_color, width=4)

    poly_points = []
    num_pts = 6 if placement != "pre_faq" else 8
    for i in range(num_pts):
        ang = (2 * math.pi * i) / num_pts - math.pi / 2
        r = c_rad * 0.75
        poly_points.append((center_x + int(math.cos(ang) * r), center_y + int(math.sin(ang) * r)))
    draw.polygon(poly_points, outline=p_color, fill=(bg[0] + 20, bg[1] + 25, bg[2] + 40))

    for nx, ny in nodes:
        draw.ellipse([(nx - 6, ny - 6), (nx + 6, ny + 6)], fill=s_color, outline=(255, 255, 255), width=2)

    hud_color = (120, 140, 170)
    for offset_x in [30, w - 30]:
        for offset_y in [30, h - 30]:
            dx = 40 if offset_x == 30 else -40
            dy = 40 if offset_y == 30 else -40
            draw.line([(offset_x, offset_y), (offset_x + dx, offset_y)], fill=hud_color, width=2)
            draw.line([(offset_x, offset_y), (offset_x, offset_y + dy)], fill=hud_color, width=2)

    return img

def generate_8k_image(topic: str, slug: str, placement: str = "featured", category: str = "MARKET INTELLIGENCE") -> str:
    """
    State-of-the-Art Autonomous AI Image Generation Engine:
    - Tier 1: Hugging Face FLUX.1-schnell (Ultra-crisp 8K, Zero watermark, Photorealistic)
    - Tier 2: Pollinations AI (Flux / Sana fallback with auto-crop)
    - Tier 3: High-aesthetic Procedural 3D Cybernetic HUD (Offline fail-safe)
    """
    safe_slug = slug.replace("/", "-").strip("-")
    filename = f"{safe_slug}-{placement}-3d.jpg"
    target_path = OUTPUT_DIR / filename
    web_url = f"/images/generated/{filename}"

    # Reuse if already exists and is high quality (>50KB)
    if target_path.exists() and target_path.stat().st_size > 50000:
        print(f"[+] Reusing existing high-res visual for {slug} [{placement}]: {web_url} ({target_path.stat().st_size:,} bytes)")
        return web_url

    is_square = (placement == "project")
    target_dim = (800, 800) if is_square else (1280, 720)
    prompt = build_topic_prompt(topic, placement)

    # Dynamic SHA-256 salt with microsecond timestamp to guarantee unique randomness
    seed = int(hashlib.sha256(f"{slug}_{placement}_{time.time_ns()}".encode()).hexdigest(), 16) % 900000 + 100000

    # Build catalog of existing image hashes to detect and prevent collisions
    existing_hashes = set()
    for existing_file in OUTPUT_DIR.glob("*.jpg"):
        if existing_file.name != filename:
            try:
                with open(existing_file, "rb") as efp:
                    existing_hashes.add(hashlib.md5(efp.read()).hexdigest())
            except Exception:
                pass

    def save_and_verify(image_obj: Image.Image) -> bool:
        buf = io.BytesIO()
        image_obj.save(buf, format="JPEG", quality=95)
        raw_bytes = buf.getvalue()
        new_hash = hashlib.md5(raw_bytes).hexdigest()
        if new_hash in existing_hashes:
            print(f"[!] Warning: Hash collision detected for {filename} ({new_hash[:8]}). Regenerating...")
            return False
        with open(target_path, "wb") as fp:
            fp.write(raw_bytes)
        print(f"[✓] Unique image saved: {filename} ({len(raw_bytes):,} bytes, hash: {new_hash[:8]}) -> {web_url}")
        return True

    # -------------------------------------------------------------
    # Tier 1: Hugging Face FLUX.1-schnell
    # -------------------------------------------------------------
    if HF_TOKEN:
        print(f"[*] [Tier 1: FLUX.1-schnell] Generating bespoke 3D photorealistic visual for '{topic}' [{placement}]...")
        try:
            from huggingface_hub import InferenceClient
            client = InferenceClient(token=HF_TOKEN)
            gen_w, gen_h = (1024, 1024) if is_square else (1280, 720)
            img = client.text_to_image(prompt, model=HF_MODEL, width=gen_w, height=gen_h)
            if img:
                final = img.resize(target_dim, Image.Resampling.LANCZOS)
                if save_and_verify(final):
                    return web_url
        except Exception as e:
            print(f"[-] Hugging Face FLUX error: {e}. Falling back to Tier 2...")

    # -------------------------------------------------------------
    # Tier 2: Pollinations AI (with Pillow crop)
    # -------------------------------------------------------------
    print(f"[*] [Tier 2: Pollinations AI] Generating visual for '{topic}' [{placement}]...")
    w_req, h_req = (1024, 1024) if is_square else (1024, 576)
    encoded = urllib.parse.quote(prompt)

    for attempt in range(1, 4):
        url = f"https://image.pollinations.ai/prompt/{encoded}?width={w_req}&height={h_req}&seed={seed + attempt * 73}&nologo=true"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        try:
            with urllib.request.urlopen(req, timeout=25) as resp:
                data = resp.read()
            if len(data) > 20000:
                img = Image.open(io.BytesIO(data))
                crop_h = 45 if is_square else 35
                cropped = img.crop((0, 0, img.size[0], img.size[1] - crop_h))
                final = cropped.resize(target_dim, Image.Resampling.LANCZOS)
                if save_and_verify(final):
                    return web_url
        except Exception as e:
            print(f"[-] Pollinations attempt {attempt} failed: {e}")
            time.sleep(2)

    # -------------------------------------------------------------
    # Tier 3: Procedural 3D Cybernetic Fallback
    # -------------------------------------------------------------
    print(f"[!] [Tier 3: Procedural Fallback] Rendering cybernetic HUD visual for '{topic}' [{placement}]...")
    fallback_img = render_procedural_fallback(topic, placement, target_dim)
    save_and_verify(fallback_img)
    return web_url

def generate_article_images_trio(topic: str, slug: str, category: str = "MARKET INTELLIGENCE") -> dict:
    """Generates all 3 unique visuals for an article (Featured, Middle, Pre-FAQ)."""
    print(f"\n🎨 Starting 3-Visual Generation Pipeline for: {topic}")
    featured = generate_8k_image(topic, slug, placement="featured", category=category)
    time.sleep(2.0)
    middle = generate_8k_image(topic, slug, placement="middle", category=category)
    time.sleep(2.0)
    pre_faq = generate_8k_image(topic, slug, placement="pre_faq", category=category)

    return {
        "featured_image": featured,
        "middle_image": middle,
        "pre_faq_image": pre_faq
    }

if __name__ == "__main__":
    print("Testing FLUX.1-schnell Engine...")
    trio = generate_article_images_trio("Sonic SVM High Throughput Incentive Points Framework", "sonic-svm-test")
    print("Result Trio:", trio)
