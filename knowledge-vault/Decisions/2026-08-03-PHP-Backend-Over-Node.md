---
title: Hostinger PHP Deployment
tags: [architecture, deploy, decision, php, hostinger]
updated: 2026-08-03
---

# Hostinger PHP Deployment

**Purpose:** Document the decision to use a lightweight PHP API for the Next.js static export instead of Node.js.

**Summary:** For Hostinger Shared/Premium hosting, running a Next.js Node app requires advanced setup and a custom port. A static `out/` export synced to `public_html` combined with a PHP API is much faster to deploy, has zero runtime dependencies, and perfectly scales on LiteSpeed.

## Content
- **Frontend:** Next.js 15 (`output: 'export'`). Uploaded via `rsync` / GitHub Actions (FTP).
- **Backend:** PHP API files (`config.php`, `db.php`, `get_posts.php`) placed in `public_html/api/`.
- **Database:** Hostinger MySQL (`u390470426_crypto`).
- **Data Fetching:** Next.js fetches from `http://cryptoairdropai.com/api/get_posts.php` using `{ cache: 'force-cache' }` at build time.

## Related
- [[Architecture-MOC]]
- Repo: `ARCHITECTURE.md`

## References
- Hostinger hPanel Database
