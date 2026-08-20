---
title: ADR - Omnichannel AEO, GEO & Knowledge Graph Pipeline Architecture
tags: [decision, adr, aeo, geo, knowledge-graph, json-ld, sge, seo]
date: 2026-08-20
status: Accepted
---

# ⚖️ ADR: Omnichannel AEO, GEO & Knowledge Graph Pipeline Architecture

## Context & Problem Statement
With the rise of generative search (Google AI Overviews / SGE, ChatGPT Search, Perplexity AI, Claude), conventional keyword-based SEO alone is insufficient. Sites must provide structured entity grounding, direct answer boxes, and machine-verifiable citations to capture zero-click answers and high-intent traffic.

## Decision
Implement a unified 6-pillar Omnichannel Intelligence architecture across `cryptoairdropai.com`:
1. **Interlocking JSON-LD Knowledge Graph**: Connect `#organization`, `#website`, `#author`, and `#article` nodes into a single linked graph.
2. **AEO Direct Answer Box (`tldr`)**: Every article features a 40–60 word answer box positioned directly beneath the H1 headline.
3. **GEO Citation Anchors**: Content contains testnet chain IDs, RPC endpoints, and difficulty metrics to maximize citations in Perplexity and ChatGPT.
4. **Multi-Schema Injection**: Inject `BlogPosting`, `FAQPage`, `BreadcrumbList`, and `HowTo` schemas on every guide.
5. **Topical Authority Silos**: Organize all articles into 5 core content silos with contextual internal link graphs.
6. **Instant Auto-Indexing**: Fire the Google Indexing API and IndexNow upon every publication.

## Consequences
- **Positive**:
  * Massive increase in Google AI Overview appearances and Perplexity/ChatGPT citation rates.
  * Zero trailing slash conflicts and 100% canonical parity.
  * Interlocking schema nodes establish verified institutional E-E-A-T.
- **Negative / Trade-offs**:
  * Requires strict adherence to the 40–60 word answer box format in LLM prompts.

---

## Related Notes
- [[000-Index]]
- [[MOC-Knowledge-Graph-Schemas]]
- [[MOC-SEO-AEO-GEO]]
- [[AEO-and-SGE-Optimization-Standard]]
- [[GEO-Generative-Engine-Optimization-Rules]]
