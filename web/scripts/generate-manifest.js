const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OUT_DIR = path.join(__dirname, '..', 'out');
const MANIFEST_PATH = path.join(OUT_DIR, 'deployment-manifest.json');

const IGNORED_ROUTES = new Set(['/404/', '/_not-found/', '/search/']);

function computeFileSha256(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function relToRoute(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  if (normalized === 'index.html') return '/';
  if (normalized.endsWith('/index.html')) {
    const clean = normalized.slice(0, -11).replace(/^\/+|\/+$/g, '');
    return `/${clean}/`;
  }
  if (normalized.endsWith('.html')) {
    const clean = normalized.slice(0, -5).replace(/^\/+|\/+$/g, '');
    return `/${clean}/`;
  }
  const clean = normalized.replace(/^\/+|\/+$/g, '');
  return `/${clean}/`;
}

function scanHtmlRoutes(dir, baseDir = dir) {
  let routes = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      routes = routes.concat(scanHtmlRoutes(fullPath, baseDir));
    } else if (file.endsWith('.html')) {
      const relPath = path.relative(baseDir, fullPath);
      const route = relToRoute(relPath);
      if (!IGNORED_ROUTES.has(route)) {
        routes.push(route);
      }
    }
  }
  return routes;
}

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.error(`[-] Error: out directory not found at ${OUT_DIR}`);
    process.exit(1);
  }

  const routes = Array.from(new Set(scanHtmlRoutes(OUT_DIR))).sort();
  const sitemapPath = path.join(OUT_DIR, 'sitemap.xml');
  const sitemapSha256 = computeFileSha256(sitemapPath);

  const manifest = {
    site: "cryptoairdropai.com",
    release_id: process.env.RELEASE_ID || process.env.TARGET_RELEASE_ID || "local-build",
    target_post_id: process.env.TARGET_POST_ID || null,
    commit_sha: process.env.GITHUB_SHA || "local-dev",
    build_id: process.env.GITHUB_RUN_ID || new Date().toISOString().replace(/[^a-zA-Z0-9]/g, ''),
    built_at: new Date().toISOString(),
    route_count: routes.length,
    sitemap_sha256: sitemapSha256,
    routes: routes
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`[+] Deployment manifest generated successfully with ${routes.length} routes: ${MANIFEST_PATH}`);
}

main();
