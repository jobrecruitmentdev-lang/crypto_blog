---
title: Architecture Map of Content
tags: [architecture, moc]
updated: 2026-08-03
---

# Architecture MOC

**Purpose:** Central hub for system architecture, dependencies, and deployment strategies for CryptoAirdropAI.

**Summary:** Tracks the tech stack, which is Next.js 15 (Static Export) + Hostinger PHP Backend + MySQL.

## Content
### Core Stack
1. **Frontend:** Next.js (React), outputted as a static build (`out/`).
2. **Backend API:** Lightweight PHP 8+ endpoints using PDO for MySQL.
3. **Database:** Hostinger standard MySQL.
4. **CI/CD:** Automated via local `deploy.sh` (rsync/SSH) and GitHub Actions (lftp).

### Key Decisions
- [[2026-08-03-PHP-Backend-Over-Node]]

## Related
- Repo: `ARCHITECTURE.md`
