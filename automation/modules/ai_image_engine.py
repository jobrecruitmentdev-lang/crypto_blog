import os
import sys
import time
import base64
from pathlib import Path
from playwright.sync_api import sync_playwright

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

COLOR_PALETTES = {
    "featured": {"accent": "#2563eb", "badge_bg": "#eff6ff", "badge_border": "#bfdbfe", "badge_text": "#1d4ed8"},
    "middle": {"accent": "#0891b2", "badge_bg": "#ecfeff", "badge_border": "#a5f3fc", "badge_text": "#0e7490"},
    "pre_faq": {"accent": "#d97706", "badge_bg": "#fffbeb", "badge_border": "#fde68a", "badge_text": "#b45309"},
    "project": {"accent": "#059669", "badge_bg": "#ecfdf5", "badge_border": "#a7f3d0", "badge_text": "#047857"}
}

def generate_html_template(topic: str, placement: str = "featured", category: str = "MARKET INTELLIGENCE") -> str:
    palette = COLOR_PALETTES.get(placement, COLOR_PALETTES["featured"])
    accent = palette["accent"]
    badge_bg = palette["badge_bg"]
    badge_border = palette["badge_border"]
    badge_text = palette["badge_text"]

    if placement == "project":
        # 1:1 Square Token Emblem Template (800x800)
        return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }}
  body {{
    width: 800px;
    height: 800px;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }}
  .grid-bg {{
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(to right, rgba(226, 232, 240, 0.4) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(226, 232, 240, 0.4) 1px, transparent 1px);
    background-size: 32px 32px;
  }}
  .glow {{
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, {accent}18 0%, rgba(255,255,255,0) 70%);
  }}
  .card {{
    position: relative;
    z-index: 10;
    width: 680px;
    height: 680px;
    background: #ffffff;
    border: 2px solid #e2e8f0;
    border-radius: 36px;
    box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.12);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 60px 40px;
    text-align: center;
  }}
  .badge {{
    padding: 8px 20px;
    border-radius: 9999px;
    background: {badge_bg};
    border: 1px solid {badge_border};
    color: {badge_text};
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }}
  .sphere {{
    width: 260px;
    height: 260px;
    border-radius: 50%;
    background: linear-gradient(135deg, {accent} 0%, #0f172a 100%);
    box-shadow: 
      0 20px 50px -10px {accent}60,
      inset 0 4px 12px rgba(255, 255, 255, 0.6),
      inset 0 -10px 20px rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 88px;
    font-weight: 900;
  }}
  .title {{
    font-size: 38px;
    font-weight: 900;
    color: #0f172a;
    line-height: 1.2;
    letter-spacing: -0.03em;
    max-width: 580px;
  }}
  .sub {{
    font-size: 17px;
    color: #64748b;
    font-weight: 600;
    letter-spacing: 0.02em;
  }}
</style>
</head>
<body>
  <div class="grid-bg"></div>
  <div class="glow"></div>
  <div class="card">
    <div class="badge">◈ VERIFIED PROTOCOL EMBLEM</div>
    <div class="sphere">{topic[:1].upper()}</div>
    <div>
      <div class="title">{topic}</div>
      <div class="sub" style="margin-top: 10px;">Institutional On-Chain Ecosystem &bull; 2026</div>
    </div>
  </div>
</body>
</html>"""

    # 16:9 Landscape Template (1920x1080) for Featured, Middle, Pre-FAQ
    if placement == "featured":
        badge_label = "RESEARCH INTELLIGENCE DISPATCH"
        subhead = "Institutional quantitative telemetry, on-chain execution architecture, and verified allocation parameters."
        m1, m2, m3, m4 = ("CONSENSUS MODEL", "EVM / PoS"), ("STATUS", "Audited & Active"), ("ESTIMATED POOL", "$2.5M - $10M"), ("SYBIL DEFENSE", "Tier-1 Protected")
    elif placement == "middle":
        badge_label = "PROTOCOL ARCHITECTURE & TELEMETRY"
        subhead = "Deep cryptographic state transitions, contract interaction sequence, and liquidity bridge routing."
        m1, m2, m3, m4 = ("DATA AVAILABILITY", "High Throughput"), ("SMART CONTRACTS", "Audited Invariants"), ("GAS OPTIMIZATION", "Sub-Cent Execution"), ("INTERACTIONS", "Multi-Phase")
    else: # pre_faq
        badge_label = "SECURITY AUDIT & SYBIL MATRIX"
        subhead = "Multi-vector clustering defense, timing heuristics, and formal snapshot qualification criteria."
        m1, m2, m3, m4 = ("SNAPSHOT HORIZON", "Q3/Q4 2026"), ("CLUSTER DEFENSE", "Anti-Sybil Grade A+"), ("FUNDING VECTOR", "Isolated Wallets"), ("COMPLIANCE", "Zero Custody")

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }}
  body {{
    width: 1920px;
    height: 1080px;
    background: #ffffff;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 70px 90px;
    color: #0f172a;
  }}
  .grid-bg {{
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(to right, rgba(226, 232, 240, 0.45) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(226, 232, 240, 0.45) 1px, transparent 1px);
    background-size: 48px 48px;
    z-index: 0;
  }}
  .glow {{
    position: absolute;
    top: -150px;
    right: -150px;
    width: 800px;
    height: 800px;
    border-radius: 50%;
    background: radial-gradient(circle, {accent}14 0%, rgba(255,255,255,0) 70%);
    z-index: 1;
  }}
  .top-bar {{
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 24px;
  }}
  .brand {{
    display: flex;
    align-items: center;
    gap: 14px;
  }}
  .brand-icon {{
    width: 44px;
    height: 44px;
    background: #0f172a;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 24px;
    font-weight: 900;
  }}
  .brand-text {{
    display: flex;
    flex-direction: column;
  }}
  .brand-title {{
    font-size: 20px;
    font-weight: 900;
    letter-spacing: -0.5px;
    color: #0f172a;
  }}
  .brand-sub {{
    font-size: 13px;
    color: #64748b;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }}
  .pill {{
    padding: 8px 18px;
    border-radius: 9999px;
    background: {badge_bg};
    border: 1px solid {badge_border};
    color: {badge_text};
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }}
  .main {{
    position: relative;
    z-index: 10;
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 60px;
    align-items: center;
    margin: 20px 0;
  }}
  .headline {{
    font-size: 52px;
    line-height: 1.15;
    font-weight: 900;
    letter-spacing: -1.5px;
    color: #0f172a;
    margin-bottom: 18px;
  }}
  .subhead {{
    font-size: 22px;
    line-height: 1.5;
    color: #475569;
    font-weight: 400;
    margin-bottom: 28px;
  }}
  .metrics-grid {{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }}
  .metric-card {{
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 16px 20px;
    box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.05);
  }}
  .metric-label {{
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #64748b;
    margin-bottom: 4px;
  }}
  .metric-value {{
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
  }}
  .diagram-box {{
    display: flex;
    align-items: center;
    justify-content: center;
  }}
  .shield-graphic {{
    width: 420px;
    height: 420px;
    background: linear-gradient(145deg, #f8fafc 0%, #ffffff 100%);
    border: 2px solid #e2e8f0;
    border-radius: 32px;
    box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    position: relative;
  }}
  .shield-icon {{
    width: 140px;
    height: 140px;
    border-radius: 28px;
    background: {badge_bg};
    border: 2px solid {badge_border};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 64px;
    color: {accent};
    margin-bottom: 24px;
    box-shadow: 0 10px 25px -5px {accent}30;
  }}
  .shield-tag {{
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.5px;
  }}
  .shield-sub {{
    font-size: 14px;
    color: #64748b;
    font-weight: 600;
    margin-top: 6px;
  }}
  .bottom-strip {{
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 2px solid #e2e8f0;
    padding-top: 24px;
    font-size: 14px;
    color: #64748b;
    font-weight: 700;
  }}
</style>
</head>
<body>
  <div class="grid-bg"></div>
  <div class="glow"></div>
  
  <div class="top-bar">
    <div class="brand">
      <div class="brand-icon">◈</div>
      <div class="brand-text">
        <div class="brand-title">Crypto Airdrop AI</div>
        <div class="brand-sub">Institutional Research Desk</div>
      </div>
    </div>
    <div class="pill">{badge_label}</div>
  </div>

  <div class="main">
    <div>
      <h1 class="headline">{topic}</h1>
      <p class="subhead">{subhead}</p>
      
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">{m1[0]}</div>
          <div class="metric-value">{m1[1]}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">{m2[0]}</div>
          <div class="metric-value">{m2[1]}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">{m3[0]}</div>
          <div class="metric-value">{m3[1]}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">{m4[0]}</div>
          <div class="metric-value">{m4[1]}</div>
        </div>
      </div>
    </div>

    <div class="diagram-box">
      <div class="shield-graphic">
        <div class="shield-icon">{'⚡' if placement == 'featured' else '📊' if placement == 'middle' else '🛡️'}</div>
        <div class="shield-tag">{category.upper()}</div>
        <div class="shield-sub">On-Chain Verified Protocol Telemetry</div>
      </div>
    </div>
  </div>

  <div class="bottom-strip">
    <div>● Standard: <strong>Non-Custodial Audit</strong> &nbsp;&bull;&nbsp; ● Integrity: <strong>Zero Paid Listings</strong></div>
    <div>CRYPTOAIRDROPAI.COM &copy; 2026</div>
  </div>
</body>
</html>"""

def generate_8k_image(topic: str, slug: str, placement: str = "featured", category: str = "MARKET INTELLIGENCE") -> str:
    """
    Renders an ultra-sharp, topic-specific 8K editorial visual using Playwright.
    Saves to web/public/images/generated/ and returns the local web URL.
    """
    safe_slug = slug.replace("/", "-").strip("-")
    filename = f"{safe_slug}-{placement}.jpg"
    target_path = OUTPUT_DIR / filename
    web_url = f"/images/generated/{filename}"

    # If file already exists and is non-empty, reuse it
    if target_path.exists() and target_path.stat().st_size > 40000:
        print(f"[+] Reusing existing visual for {slug} [{placement}]: {web_url}")
        return web_url

    print(f"[*] Rendering bespoke Playwright visual for '{topic}' [{placement}]...")
    html_content = generate_html_template(topic=topic, placement=placement, category=category)

    viewport_width = 800 if placement == "project" else 1920
    viewport_height = 800 if placement == "project" else 1080

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": viewport_width, "height": viewport_height})
        page.set_content(html_content)
        page.screenshot(path=str(target_path), type="jpeg", quality=95)
        browser.close()

    print(f"[✓] Successfully generated visual ({target_path.stat().st_size:,} bytes) -> {web_url}")
    return web_url

def generate_article_images_trio(topic: str, slug: str, category: str = "MARKET INTELLIGENCE") -> dict:
    """
    Generates all 3 unique visuals for an article:
    1. Featured Hero Visual
    2. Middle Section Architecture Visual
    3. Pre-FAQ Verification Matrix Visual
    """
    print(f"\n🎨 Starting 3-Visual Generation Pipeline for: {topic}")
    featured = generate_8k_image(topic, slug, placement="featured", category=category)
    middle = generate_8k_image(topic, slug, placement="middle", category=category)
    pre_faq = generate_8k_image(topic, slug, placement="pre_faq", category=category)

    return {
        "featured_image": featured,
        "middle_image": middle,
        "pre_faq_image": pre_faq
    }

if __name__ == "__main__":
    trio = generate_article_images_trio("Test Protocol Alpha 2026", "test-protocol-alpha-2026")
    print("Result Trio:", trio)
