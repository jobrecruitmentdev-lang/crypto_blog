---
title: SEO, AEO & GEO Map of Content
tags: [moc, seo, aeo, geo, structured-data]
updated: 2026-08-17
---

# 🔍 SEO, AEO & GEO Master Knowledge Hub

**Purpose:** Comprehensive guide to search engine, answer engine, and generative AI optimization for Crypto Airdrop AI.

**Summary:** Details the technical schema implementation, canonical URL enforcement, XML sitemap rules, and generative AI knowledge graph files (`llms.txt`, `llms-full.txt`).

## 1. Core Technical Optimization
- **SSG (Static Site Generation)**: All 41 routes prerendered into raw static HTML for instantaneous TTFB.
- **Canonical Consistency**: Strict 1:1 matching on all trailing slashes (`https://cryptoairdropai.com/.../`).
- **Lean XML Sitemap**: Registered at `https://cryptoairdropai.com/sitemap.xml` with strictly the 12 core authority pages + 3 deep-dive blogs.

## 2. Structured Data Hierarchy
- **`NewsMediaOrganization`**: Registered with `@id: #organization`, `areaServed: ["US", "CA", "GB", "EU", "Global"]`, and `knowsAbout`.
- **`WebSite`**: Configured with `SearchAction` targeting `/search?q={search_term_string}`.
- **`BlogPosting`**: Complete author entity binding (`Person`), publisher (`Organization`), and ISO timestamps.
- **`HowTo`**: Applied on all `/guides/[slug]/` pages for step-by-step rich snippets.
- **`FAQPage`**: Embedded in all blog articles and `/faq/` for Google AI Overviews and Perplexity direct extraction.

## 3. Generative Engine Optimization (GEO)
- **`public/llms.txt`**: High-density markdown overview for AI crawlers.
- **`public/llms-full.txt`**: Deep knowledge graph detailing Sybil rules, tokenomics formulas, and citation guidelines.

## Related Notes
- [[000-Index]]
- [[Keywords-and-AEO-Targeting]]
- [[2026-08-17-Strictly-7-Primary-Pages-and-3-Blogs]]
