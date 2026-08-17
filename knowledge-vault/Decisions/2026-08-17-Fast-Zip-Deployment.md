---
title: ADR - Fast ZIP Deployment with Server-Side Extraction
tags: [decision, deploy, ci-cd, hostinger]
updated: 2026-08-17
---

# ⚖️ ADR: Fast ZIP Deployment with Server-Side Extraction

**Context:** Single-threaded sequential FTPS uploads of 300+ files to Hostinger took ~8 to 10 minutes per GitHub push, creating temporary CSS/HTML hash mismatches for active visitors during the transfer window.

**Decision:** Replace sequential file uploads in `scripts/deploy_ftp.py` with a compressed archive workflow:
1. GitHub Actions compresses `./web/out` into `build.zip`.
2. Generates a one-time 32-character security token and temporary `deploy_unzip.php`.
3. Uploads 1 single binary `build.zip` and `deploy_unzip.php` via FTPS in ~2 seconds.
4. Triggers server-side native PHP `ZipArchive::extractTo('./')` which unpacks the build atomically in ~0.5 seconds.
5. Auto-deletes `build.zip` and `deploy_unzip.php` immediately.

**Reason:** Eliminates transfer latency and rate limiting, slashing deploy duration from 10 minutes to under 30 seconds.

**Tradeoffs:** Requires server-side PHP with `ZipArchive` extension enabled (available by default on Hostinger).

**Consequences:** Atomic zero-downtime updates, zero CSS glitches during deployment, instant CI/CD feedback.

## Related
- [[MOC-CI-CD-Deployments]]
- [[000-Index]]
- Repo: `scripts/deploy_ftp.py`, `.github/workflows/deploy-hostinger.yml`
