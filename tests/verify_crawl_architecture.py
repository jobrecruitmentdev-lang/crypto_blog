import os
import sys
import json
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import urlparse
from collections import deque

# Force UTF-8 stdout encoding on Windows
sys.stdout.reconfigure(encoding='utf-8')

OUT_DIR = r"C:\hk\cryptodrop\web\out"
DOMAIN = "cryptoairdropai.com"
BASE_URL = f"https://{DOMAIN}"

ASSET_EXTENSIONS = {
    ".svg", ".ico", ".png", ".jpg", ".jpeg", ".webp", ".gif",
    ".xml", ".txt", ".json", ".css", ".js", ".mjs", ".webmanifest"
}

IGNORED_ROUTES = {"/404/", "/_not-found/", "/search/", "/admin/"}

PRIMARY_HUBS = {
    "/",
    "/projects/",
    "/blog/",
    "/guides/",
    "/authors/"
}

class HTMLCrawler(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.canonical = None
        self.json_ld_blocks = []
        self.robots_meta = None
        self._in_script_json = False
        self._current_script_content = ""

    def handle_starttag(self, tag, attrs):
        attr_dict = {k.lower(): v for k, v in attrs}
        if tag == "a" and "href" in attr_dict:
            self.links.append(attr_dict["href"])
        elif tag == "link" and attr_dict.get("rel") == "canonical":
            self.canonical = attr_dict.get("href")
        elif tag == "meta" and attr_dict.get("name", "").lower() == "robots":
            self.robots_meta = attr_dict.get("content")
        elif tag == "script" and attr_dict.get("type") == "application/ld+json":
            self._in_script_json = True
            self._current_script_content = ""

    def handle_endtag(self, tag):
        if tag == "script" and self._in_script_json:
            self._in_script_json = False
            if self._current_script_content.strip():
                self.json_ld_blocks.append(self._current_script_content.strip())

    def handle_data(self, data):
        if self._in_script_json:
            self._current_script_content += data

def is_document_route(href):
    if not href:
        return False
    if href.startswith(("mailto:", "tel:", "javascript:", "#")):
        return False
    
    parsed = urlparse(href)
    if parsed.netloc and parsed.netloc != DOMAIN:
        return False
    
    path = parsed.path
    if not path:
        return False
    
    for ext in ASSET_EXTENSIONS:
        if path.lower().endswith(ext):
            return False
            
    return True

def normalize_route(href):
    parsed = urlparse(href)
    path = parsed.path
    if not path:
        return "/"
    clean = path.strip("/")
    if not clean:
        return "/"
    return f"/{clean}/"

def rel_to_route(rel_path):
    normalized = rel_path.replace("\\", "/")
    if normalized == "index.html":
        return "/"
    if normalized.endswith("/index.html"):
        clean = normalized[:-11].strip("/")
        return f"/{clean}/"
    if normalized.endswith(".html"):
        clean = normalized[:-5].strip("/")
        return f"/{clean}/"
    clean = normalized.strip("/")
    return f"/{clean}/"

def run_crawl_audit():
    print("=" * 80)
    print("  CRYPTOAIRDROPAI.COM — PRODUCTION TIERED CRAWL & MANIFEST VERIFICATION")
    print("=" * 80)

    if not os.path.exists(OUT_DIR):
        print(f"[-] ERROR: Build output directory not found at {OUT_DIR}")
        return False

    # 1. Discover all HTML routes in web/out/
    all_html_files = {}
    for root, _, files in os.walk(OUT_DIR):
        for f in files:
            if f.endswith('.html'):
                abs_path = os.path.join(root, f)
                rel_path = os.path.relpath(abs_path, OUT_DIR)
                route = rel_to_route(rel_path)
                if route not in IGNORED_ROUTES:
                    all_html_files[route] = abs_path

    indexable_routes = all_html_files
    print(f"Found {len(indexable_routes)} indexable static HTML document routes in `web/out/`.")

    # 2. Parse Sitemap
    sitemap_path = os.path.join(OUT_DIR, "sitemap.xml")
    sitemap_urls = set()
    if os.path.exists(sitemap_path):
        try:
            tree = ET.parse(sitemap_path)
            root = tree.getroot()
            for elem in root.findall("{http://www.sitemaps.org/schemas/sitemap/0.9}url"):
                loc = elem.find("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")
                if loc is not None and loc.text:
                    sitemap_urls.add(loc.text.strip())
            print(f"Sitemap contains {len(sitemap_urls)} URLs.")
        except Exception as e:
            print(f"[-] Failed to parse sitemap.xml: {e}")
    else:
        print("[-] WARNING: sitemap.xml not found in output directory!")

    # 3. Parse Deployment Manifest
    manifest_path = os.path.join(OUT_DIR, "deployment-manifest.json")
    manifest_routes = set()
    if os.path.exists(manifest_path):
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                manifest_data = json.load(f)
                manifest_routes = set(manifest_data.get("routes", []))
                print(f"Deployment Manifest validated: {manifest_data.get('route_count')} routes, Release: {manifest_data.get('release_id')}")
        except Exception as e:
            print(f"[-] Failed to parse deployment-manifest.json: {e}")

    # 4. Crawl Graph Build
    errors = []
    crawl_graph = {}
    incoming_links = {r: set() for r in indexable_routes}

    for route, filepath in indexable_routes.items():
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        parser = HTMLCrawler()
        parser.feed(content)

        # 4a. Canonical URL contract (Trailing slash match)
        expected_canonical = f"{BASE_URL}{route}"
        if parser.canonical != expected_canonical:
            errors.append(f"Canonical Mismatch in '{route}': got '{parser.canonical}', expected '{expected_canonical}'")

        # 4b. Collect and validate outgoing links
        doc_links = set()
        for href in parser.links:
            if is_document_route(href):
                # Enforce trailing slash policy on all internal link anchors
                parsed = urlparse(href)
                if not parsed.path.endswith("/"):
                    errors.append(f"Non-trailing-slash internal link found in '{route}': href='{href}'")
                
                target_route = normalize_route(href)
                doc_links.add(target_route)
                if target_route in incoming_links:
                    incoming_links[target_route].add(route)
                    
        crawl_graph[route] = doc_links

    # 5. Tiered Hub BFS Reachability & Hop Distance
    hop_distances = {r: float("inf") for r in indexable_routes}
    
    # BFS from root '/'
    queue = deque([("/", 0)])
    hop_distances["/"] = 0
    visited = {"/"}

    while queue:
        curr, dist = queue.popleft()
        for neighbor in crawl_graph.get(curr, []):
            if neighbor in indexable_routes and neighbor not in visited:
                visited.add(neighbor)
                hop_distances[neighbor] = dist + 1
                queue.append((neighbor, dist + 1))

    # 6. Contract Invariant Assertions
    # 6a. 0 Orphan HTML Pages
    orphans = [r for r, srcs in incoming_links.items() if len(srcs) == 0 and r != "/"]
    if orphans:
        for o in orphans:
            errors.append(f"Orphan Route Detected (0 incoming links): '{o}'")

    # 6b. Bounded Hop Distance (Hub -> Leaf <= 3, Root -> Leaf <= 4)
    unreachable = [r for r, d in hop_distances.items() if d == float("inf")]
    if unreachable:
        for u in unreachable:
            errors.append(f"Unreachable from Homepage BFS: '{u}'")

    too_deep = [r for r, d in hop_distances.items() if d > 4]
    if too_deep:
        for td in too_deep:
            errors.append(f"Hop distance exceeded (> 4 hops from /): '{td}' (dist={hop_distances[td]})")

    # 6c. 4-Way Route Equality
    for r in indexable_routes:
        canonical = f"{BASE_URL}{r}"
        if sitemap_urls and canonical not in sitemap_urls:
            errors.append(f"Sitemap Missing Indexable Route: '{canonical}'")
        if manifest_routes and r not in manifest_routes:
            errors.append(f"Manifest Missing Indexable Route: '{r}'")

    # 7. Print Summary
    print("\n" + "=" * 80)
    print("  TIERED CRAWL & SITEMAP CONTRACT REPORT")
    print("=" * 80)
    print(f"Total Indexable Routes:       {len(indexable_routes)}")
    print(f"Orphan HTML Pages:            {len(orphans)}")
    print(f"Max Hop Distance Observed:    {max([d for d in hop_distances.values() if d != float('inf')], default=0)}")
    print(f"Total Contract Violations:    {len(errors)}")
    print("-" * 80)

    if errors:
        print("\n[-] CONTRACT TEST FAILED! Violations:")
        for err in errors[:20]:
            print(f"  -> {err}")
        return False
    else:
        print("\n[+] ALL TIERED CRAWL & SITEMAP CONTRACTS PASSED (100% CLEAN)!\n")
        return True

if __name__ == "__main__":
    success = run_crawl_audit()
    if not success:
        sys.exit(1)
