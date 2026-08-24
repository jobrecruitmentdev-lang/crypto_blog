import os
import sys
import json
import argparse
import urllib.request
import psycopg2

BASE_URL = "https://cryptoairdropai.com"

CORE_HUBS = [
    "/",
    "/projects/",
    "/blog/",
    "/guides/",
    "/authors/",
    "/robots.txt",
    "/sitemap.xml"
]

SAMPLE_ROUTES = [
    "/projects/monad/",
    "/guides/avoiding-sybil-detection/",
    "/authors/ai-intelligence-engine/"
]

DB_CONFIG = {
    'host': os.getenv('SUPABASE_DB_HOST', 'aws-0-ap-northeast-1.pooler.supabase.com'),
    'port': int(os.getenv('SUPABASE_DB_PORT', 6543)),
    'user': os.getenv('SUPABASE_DB_USER', 'postgres.oebuqronflnytkdyckxi'),
    'password': os.getenv('SUPABASE_DB_PASS', '9^VGH+Wff&#qtGy'),
    'dbname': os.getenv('SUPABASE_DB_NAME', 'postgres'),
    'sslmode': 'require'
}

def check_http_endpoint(url: str, expected_status: int = 200) -> tuple[bool, str]:
    try:
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'CryptoAirdropAISmokeVerifier/1.0'}
        )
        with urllib.request.urlopen(req, timeout=12) as response:
            status = response.status
            content_type = response.headers.get('Content-Type', '')
            if status == expected_status:
                return True, f"HTTP {status} OK ({content_type})"
            else:
                return False, f"Unexpected HTTP status: {status}"
    except Exception as e:
        return False, f"Request failed: {e}"

def run_smoke_verification(release_id: str = None, post_id: str = None, slug: str = None, dry_run: bool = False):
    print("=" * 80)
    print("  CRYPTOAIRDROPAI.COM — PRODUCTION SMOKE & FINGERPRINT VERIFIER")
    print("=" * 80)

    errors = []
    
    # 1. Fetch live deployment manifest
    manifest_url = f"{BASE_URL}/deployment-manifest.json"
    print(f"[*] Checking live deployment fingerprint at: {manifest_url}")
    manifest_data = None
    try:
        req = urllib.request.Request(manifest_url, headers={'User-Agent': 'CryptoAirdropAISmokeVerifier/1.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                manifest_data = json.loads(response.read().decode('utf-8'))
                print(f"[+] Live manifest retrieved: Release {manifest_data.get('release_id')}, Routes: {manifest_data.get('route_count')}")
            else:
                errors.append(f"Manifest returned HTTP {response.status}")
    except Exception as e:
        if not dry_run:
            errors.append(f"Failed to fetch live deployment manifest: {e}")
        else:
            print(f"[*] [DRY RUN] Live manifest check bypassed: {e}")

    if release_id and manifest_data and not dry_run:
        live_release = manifest_data.get("release_id")
        if live_release != release_id:
            errors.append(f"Release ID mismatch: live '{live_release}' vs expected '{release_id}'")

    # 2. Check Core Hubs & Metadata
    print("\n[*] Verifying Global Hubs & Metadata...")
    for route in CORE_HUBS:
        target = f"{BASE_URL}{route}"
        ok, msg = check_http_endpoint(target)
        if ok:
            print(f"  [✓] {route:<25} -> {msg}")
        else:
            print(f"  [✗] {route:<25} -> {msg}")
            if not dry_run:
                errors.append(f"Hub check failed for {route}: {msg}")

    # 3. Check Sample Leaf Pages
    print("\n[*] Verifying Sample Leaf Pages...")
    for route in SAMPLE_ROUTES:
        target = f"{BASE_URL}{route}"
        ok, msg = check_http_endpoint(target)
        if ok:
            print(f"  [✓] {route:<40} -> {msg}")
        else:
            print(f"  [✗] {route:<40} -> {msg}")
            if not dry_run:
                errors.append(f"Sample route check failed for {route}: {msg}")

    # 4. Check Target Post (if releasing a specific article)
    if slug:
        article_route = f"/blog/{slug}/"
        target = f"{BASE_URL}{article_route}"
        print(f"\n[*] Verifying Newly Deployed Article: {target}")
        ok, msg = check_http_endpoint(target)
        if ok:
            print(f"  [✓] {article_route} -> {msg}")
        else:
            print(f"  [✗] {article_route} -> {msg}")
            if not dry_run:
                errors.append(f"Newly deployed article check failed for {article_route}: {msg}")

    # 5. Atomic Finalization via Supabase RPC
    if len(errors) == 0 and release_id and post_id and not dry_run:
        print(f"\n[*] All smoke tests passed! Invoking finalize_publication({release_id}, {post_id})...")
        try:
            conn = psycopg2.connect(**DB_CONFIG)
            conn.autocommit = True
            cur = conn.cursor()
            manifest_hash = manifest_data.get("manifest_sha256") if manifest_data else None
            cur.execute("SELECT public.finalize_publication(%s, %s, %s);", (release_id, post_id, manifest_hash))
            res = cur.fetchone()[0]
            cur.close()
            conn.close()
            if res:
                print(f"[+] SUCCESS: Post {post_id} successfully promoted to 'published' in database!")
            else:
                errors.append("finalize_publication RPC returned False")
        except Exception as e:
            errors.append(f"finalize_publication RPC failed: {e}")

    print("\n" + "=" * 80)
    if len(errors) == 0:
        print("  [+] ALL PRODUCTION SMOKE VERIFICATIONS PASSED (100% HEALTHY)!")
        print("=" * 80)
        return True
    else:
        print("  [-] PRODUCTION SMOKE VERIFICATION FAILED! Errors:")
        for err in errors:
            print(f"    -> {err}")
        print("=" * 80)
        return False

if __name__ == "__main__":
    sys.stdout.reconfigure(encoding='utf-8')
    parser = argparse.ArgumentParser()
    parser.add_argument("--release-id", default=os.getenv("RELEASE_ID"))
    parser.add_argument("--post-id", default=os.getenv("TARGET_POST_ID"))
    parser.add_argument("--slug", default=os.getenv("TARGET_SLUG"))
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    success = run_smoke_verification(
        release_id=args.release_id,
        post_id=args.post_id,
        slug=args.slug,
        dry_run=args.dry_run
    )
    if not success:
        sys.exit(1)
