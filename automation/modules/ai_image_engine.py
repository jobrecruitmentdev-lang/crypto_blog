import os
import sys
import time
import random
import urllib.parse
import requests
from pathlib import Path

# Force UTF-8 on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Base paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
OUTPUT_DIR = PROJECT_ROOT / "web" / "public" / "images" / "generated"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPT_STYLES = {
    "featured": (
        "Clean bright studio lighting 8k photorealistic concept art for {topic}, modern institutional Web3 blockchain visualization, "
        "pristine white and soft slate architectural backdrop, frosted glass cryptographic nodes, royal blue and gold accents, "
        "depth of field, subtle ray tracing, octane render 8k resolution, soft natural architectural shadows, masterpiece, "
        "ultra-detailed financial journalism visual, sharp focus, 8k magazine quality, no text"
    ),
    "middle": (
        "Hyper-detailed 8k technical 3D visualization of {topic} protocol infrastructure and on-chain telemetry, "
        "clean white minimalist studio lighting, decentralized smart contract data architecture, elegant blue glass geometric nodes, "
        "pristine bright composition, 8k octane render, hyper-realistic, soft ambient occlusion, "
        "clean sharp isometric composition, highly intricate, no text"
    ),
    "pre_faq": (
        "High-end 8k cryptographic security telemetry emblem and algorithmic verification matrix for {topic}, "
        "bright daylight studio lighting, frosted crystal audit holographic interface, refined royal blue and warm amber data visualization, "
        "clean white canvas, 8k resolution, crisp studio shadows, masterpiece, modern institutional Web3 graphic, no text"
    ),
    "project": (
        "Ultra-crisp 8k official protocol emblem and 3D token icon for {topic} crypto ecosystem, "
        "gleaming polished metallic and glass token sphere, pristine white studio pedestal, soft directional rim lighting, "
        "octane render 8k, clean photorealistic ray tracing, institutional fintech badge design, no text"
    )
}

def generate_8k_image(topic: str, slug: str, placement: str = "featured", width: int = 1280, height: int = 720) -> str:
    """
    Generates an 8K-styled, ultra-detailed photorealistic topic-specific image
    using Flux via Pollinations AI, saves it to public web assets, and returns the web URL.
    """
    safe_slug = slug.replace("/", "-").strip("-")
    filename = f"{safe_slug}-{placement}.jpg"
    target_path = OUTPUT_DIR / filename
    web_url = f"/images/generated/{filename}"

    # If file already exists and is non-empty (>5KB), reuse it to save bandwidth/time
    if target_path.exists() and target_path.stat().st_size > 5000:
        print(f"[+] Reusing cached 8K image for {slug} [{placement}]: {web_url}")
        return web_url

    template = PROMPT_STYLES.get(placement, PROMPT_STYLES["featured"])
    prompt = template.format(topic=topic)
    encoded_prompt = urllib.parse.quote(prompt)

    # Unique seed guarantees completely unique art every single time
    seed = random.randint(100000, 9999999)
    pollinations_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width={width}&height={height}&model=flux&enhance=true&seed={seed}&nologo=true"

    print(f"[*] Generating 8K {placement} image for '{topic}' (Seed: {seed})...")

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    # Retry up to 3 times
    for attempt in range(1, 4):
        try:
            resp = requests.get(pollinations_url, headers=headers, timeout=45)
            if resp.status_code == 200 and len(resp.content) > 3000:
                with open(target_path, "wb") as f:
                    f.write(resp.content)
                print(f"[+] Successfully generated and saved 8K image ({len(resp.content):,} bytes) to {web_url}")
                return web_url
            else:
                print(f"[-] Attempt {attempt} failed with HTTP {resp.status_code}. Retrying...")
                time.sleep(2)
        except Exception as e:
            print(f"[-] Attempt {attempt} error: {e}")
            time.sleep(2)

    # Fallback to turbo model if flux times out
    print("[*] Flux timed out, falling back to Turbo 8K engine...")
    fallback_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width={width}&height={height}&model=turbo&seed={seed}&nologo=true"
    try:
        resp = requests.get(fallback_url, headers=headers, timeout=30)
        if resp.status_code == 200 and len(resp.content) > 3000:
            with open(target_path, "wb") as f:
                f.write(resp.content)
            print(f"[+] Turbo fallback succeeded: {web_url}")
            return web_url
    except Exception as e:
        print(f"[-] Fallback error: {e}")

    # Return default fallback if network totally fails
    print("[-] Network failure during image generation, using fallback asset.")
    return "/icon.svg"

def generate_article_images_trio(topic: str, slug: str) -> dict:
    """
    Generates all 3 unique 8K images required for an article:
    1. Featured Hero Image
    2. Middle Section Architecture Image
    3. Pre-FAQ Verification Matrix Image
    """
    print(f"\n🎨 Starting 3-Image 8K Generation Pipeline for: {topic}")
    featured = generate_8k_image(topic, slug, placement="featured")
    middle = generate_8k_image(topic, slug, placement="middle")
    pre_faq = generate_8k_image(topic, slug, placement="pre_faq")

    return {
        "featured_image": featured,
        "middle_image": middle,
        "pre_faq_image": pre_faq
    }

if __name__ == "__main__":
    trio = generate_article_images_trio("Monad Parallel EVM Testnet 2026", "monad-parallel-evm-testnet-2026")
    print("\nResult Trio:", trio)
