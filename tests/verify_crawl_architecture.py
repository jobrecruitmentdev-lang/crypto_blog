import os
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import urlparse

# Force utf-8 output on Windows
sys.stdout.reconfigure(encoding='utf-8')

OUT_DIR = r"C:\hk\cryptodrop\web\out"
DOMAIN = "cryptoairdropai.com"
BASE_URL = f"https://{DOMAIN}"

ASSET_EXTENSIONS = {
    ".svg", ".ico", ".png", ".jpg", ".jpeg", ".webp", ".gif",
    ".xml", ".txt", ".json", ".css", ".js", ".mjs", ".webmanifest"
}

IGNORED_ROUTES = {"/404/", "/_not-found/", "/search/"}

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
    if not path or path == "/":
        return True

    _, ext = os.path.splitext(path)
    if ext.lower() in ASSET_EXTENSIONS:
        return False

    return True

def run_crawl_audit():
    print("=" * 80)
    print("  CRYPTOAIRDROPAI.COM — PRODUCTION CRAWL ARCHITECTURE VERIFICATION")
    print("=" * 80)

    if not os.path.exists(OUT_DIR):
        print(f"ERROR: Build directory not found: {OUT_DIR}")
        print("Please run `npm run build` inside `web/` first.")
        return False

    all_html_files = {}
    for root, _, files in os.walk(OUT_DIR):
        for f in files:
            if f.endswith(".html"):
                abs_path = os.path.join(root, f)
                rel_path = os.path.relpath(abs_path, OUT_DIR).replace("\\", "/")
                
                if rel_path == "index.html":
                    route = "/"
                elif rel_path.endswith("/index.html"):
                    route = "/" + rel_path[:-11] + "/"
                elif rel_path.endswith(".html"):
                    route = "/" + rel_path[:-5] + "/"
                else:
                    route = "/" + rel_path + "/"
                
                if route not in IGNORED_ROUTES:
                    all_html_files[route] = abs_path

    print(f"Found {len(all_html_files)} indexable static HTML document routes in `web/out/`.")

    errors = []
    crawl_graph = {}
    all_extracted_internal_links = set()

    for route, filepath in all_html_files.items():
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        if "sitemkap" in content.lower():
            errors.append(f"TYPO: Found 'sitemkap' in {route}")

        parser = HTMLCrawler()
        parser.feed(content)

        expected_canonical = f"{BASE_URL}{route}"
        if not parser.canonical:
            errors.append(f"MISSING CANONICAL: {route} has no canonical link tag")
        elif parser.canonical != expected_canonical:
            errors.append(f"CANONICAL MISMATCH: {route} -> Expected: {expected_canonical} | Got: {parser.canonical}")

        if parser.robots_meta and "noindex" in parser.robots_meta.lower():
            errors.append(f"ROGUE NOINDEX: {route} has meta robots: {parser.robots_meta}")

        valid_links_for_route = []
        for href in parser.links:
            if is_document_route(href):
                parsed = urlparse(href)
                path = parsed.path
                if not path:
                    continue
                if not path.endswith("/"):
                    errors.append(f"NON-SLASH INTERNAL LINK: In {route} -> href='{href}' (Must end in '/')")
                valid_links_for_route.append(path)
                all_extracted_internal_links.add(path)

        crawl_graph[route] = valid_links_for_route

    # SITEMAP VERIFICATION
    sitemap_path = os.path.join(OUT_DIR, "sitemap.xml")
    if not os.path.exists(sitemap_path):
        errors.append("MISSING SITEMAP: out/sitemap.xml was not generated")
    else:
        try:
            tree = ET.parse(sitemap_path)
            root = tree.getroot()
            sitemap_urls = []
            for child in root:
                loc = child.find("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")
                if loc is not None and loc.text:
                    sitemap_urls.append(loc.text.strip())

            print(f"Sitemap contains {len(sitemap_urls)} URLs.")
            for surl in sitemap_urls:
                if not surl.endswith("/"):
                    errors.append(f"SITEMAP NON-SLASH: {surl}")
                
                route = surl.replace(BASE_URL, "")
                if route not in all_html_files:
                    errors.append(f"SITEMAP ORPHAN ROUTE (No static file on disk): {surl} -> expected on disk")
        except Exception as e:
            errors.append(f"SITEMAP XML PARSE ERROR: {e}")

    # ORPHAN PAGE DETECTION VIA GRAPH TRAVERSAL (BFS from /)
    visited = set()
    queue = ["/"]
    while queue:
        curr = queue.pop(0)
        if curr in visited:
            continue
        visited.add(curr)

        neighbors = crawl_graph.get(curr, [])
        for n in neighbors:
            if n in all_html_files and n not in visited:
                queue.append(n)

    orphans = [r for r in all_html_files.keys() if r not in visited]
    if orphans:
        for o in orphans:
            errors.append(f"ORPHAN PAGE (Not reachable via <a> tags from /): {o}")

    # ROBOTS.TXT VERIFICATION
    robots_path = os.path.join(OUT_DIR, "robots.txt")
    if not os.path.exists(robots_path):
        errors.append("MISSING ROBOTS: out/robots.txt was not generated")
    else:
        with open(robots_path, "r", encoding="utf-8") as f:
            rob_content = f.read()
            if "disallow: /" in rob_content.lower() and not "disallow: /api/" in rob_content.lower():
                errors.append("ACCIDENTAL SITEWIDE DISALLOW in robots.txt")
            if f"sitemap: {BASE_URL}/sitemap.xml" not in rob_content.lower():
                errors.append(f"robots.txt does not declare sitemap: {BASE_URL}/sitemap.xml")

    # REPORT SUMMARY
    print("\n" + "=" * 80)
    print("  CRAWL ARCHITECTURE REPORT")
    print("=" * 80)
    print(f"Total Indexable Routes in Build: {len(all_html_files)}")
    print(f"Routes Reachable from Homepage:  {len(visited)}")
    print(f"Orphan HTML Pages:               {len(orphans)}")
    print(f"Total Internal Links Checked:    {len(all_extracted_internal_links)}")
    print(f"Violations / Errors Found:       {len(errors)}")
    print("-" * 80)

    if errors:
        print("\n[!] VERIFICATION FAILED! Violations:")
        for idx, err in enumerate(errors, 1):
            print(f"  {idx}. {err}")
        return False
    else:
        print("\n[+] ALL CRAWL & CANONICAL ARCHITECTURAL INVARIANTS PASSED (100% CLEAN)!")
        return True

if __name__ == "__main__":
    success = run_crawl_audit()
    sys.exit(0 if success else 1)
