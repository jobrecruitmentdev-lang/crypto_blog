---
title: SEO Architecture
tags: [seo, architecture, moc]
updated: 2026-08-15
---

# SEO Architecture

**Purpose:** Track the high-level strategies and technical implementation for CryptoDrop's global SEO, AEO, and Topical Authority.

**Summary:** CryptoDrop utilizes a flat URL architecture, strict E-E-A-T schemas, and indexation automation to rank rapidly on Google and AI answer engines.

## Content
- **International SEO**: Phase 1 is English-only to consolidate domain authority. Subdirectories (`/es/`, `/hi/`) will be introduced in Phase 2 once initial topical clusters rank.
- **Topical Silos**: We use a flat routing structure (`/blog/[slug]`) rather than deep nested directories to minimize click depth. BreadcrumbList JSON-LD is injected on all posts to explicitly declare the site hierarchy to search engines.
- **E-E-A-T Strategy**: Since crypto is a YMYL (Your Money or Your Life) niche, all content is attributed to the `Organization` (CryptoDrop) as the publisher, and a `Person` entity (CryptoDrop Editorial Team) with a verified `sameAs` link (Twitter). 
- **Indexation**: We automate URL submission via the GSC Indexing API and IndexNow protocol to ensure new guides are indexed instantly.

## Related
- [[2026-08-15-SEO-Blog-Pivot]]
- Repo: `../../ARCHITECTURE.md`
- Repo: `../../scripts/gsc_indexer.py`

## References
- [Google E-E-A-T Guidelines](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
