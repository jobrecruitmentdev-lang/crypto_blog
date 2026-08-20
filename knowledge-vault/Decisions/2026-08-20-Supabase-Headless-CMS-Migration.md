---
title: ADR - Supabase Headless CMS & Instant Live Publishing Migration
tags: [decision, adr, supabase, cms, database, performance]
date: 2026-08-20
status: Accepted
---

# ⚖️ ADR: Supabase Headless CMS & Instant Live Publishing Migration

## Context & Problem Statement
Previously, blog content was either baked statically into TypeScript data files (`src/lib/data.ts`) or depended on an external self-hosted Strapi instance. This introduced two bottlenecks:
1. Publishing a new blog required a full static rebuild and FTP deployment cycle.
2. Managing a separate Node.js CMS server added infrastructure maintenance overhead.

## Decision
Migrate the primary blogging data layer to a managed **Supabase PostgreSQL 17** database instance (`aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`):
1. Create a lightweight, high-performance `public.posts` table with JSONB support for FAQs and takeaways.
2. Enable Row Level Security (RLS) with a public read policy for published articles.
3. Wire Next.js App Router (`web/src/lib/cms/blogService.ts`) to query Supabase dynamically with local fallback safety.
4. Integrate the Python automation engine directly with Supabase connection pooling.

## Consequences
- **Positive**:
  * New blog articles go live in **under 1 second** without triggering a Next.js frontend rebuild.
  * Articles can be authored via the intuitive Supabase Table Editor or via the autonomous Python AI script.
  * Complete data portability with standard PostgreSQL dumps and queries.
- **Negative / Trade-offs**:
  * Requires database connection pooling credentials (`SUPABASE_DB_URL`). Handled via `.env` configuration.

---

## Related Notes
- [[000-Index]]
- [[MOC-Supabase-CMS-Automation]]
- [[Supabase-and-Auto-Indexing-Pipeline]]
