"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/types";
import { getAuthorBySlug } from "@/lib/data";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";
import FaqAccordion from "@/components/FaqAccordion";

interface ArticleViewProps {
  article: Article;
  hubTitle: string;
  hubPath: string;
}

function renderTldr(tldrText: string, pageType?: string) {
  if (!tldrText) return null;

  const isGuide = pageType === "guides";
  const icon = isGuide ? "🎯" : "⚡";
  const accentColor = isGuide ? "var(--emerald, #10B981)" : "var(--accent, #2563EB)";

  // Split lines on newline, or if it's bullet-delimited inline with "- "
  let lines: string[] = [];
  if (tldrText.includes("\n")) {
    lines = tldrText.split(/\n+/).map((l) => l.trim()).filter((l) => l.length > 0);
  } else if (tldrText.includes(" - ")) {
    lines = tldrText.split(/\s+-\s+/).map((l) => l.trim()).filter((l) => l.length > 0);
  } else {
    lines = [tldrText.trim()];
  }

  const isBulletList = lines.some((l) => l.startsWith("-") || l.startsWith("*") || l.startsWith("•") || l.match(/^[0-9]+\.\s/)) || lines.length > 1;

  if (isBulletList) {
    const cleanItems = lines.map((l) => l.replace(/^[-*•]\s*/, "").replace(/^[0-9]+\.\s*/, "").trim());
    return (
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {cleanItems.map((item, idx) => {
          const colonIdx = item.indexOf(":");
          if (colonIdx > 0 && colonIdx < 35) {
            const label = item.slice(0, colonIdx);
            const rest = item.slice(colonIdx + 1);
            return (
              <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.98rem", lineHeight: 1.6, color: "var(--text)" }}>
                <span style={{ color: accentColor, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                <span>
                  <strong style={{ color: "var(--text-bright)", fontWeight: 700 }}>{label}:</strong>
                  {rest}
                </span>
              </li>
            );
          }
          return (
            <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.98rem", lineHeight: 1.6, color: "var(--text)" }}>
              <span style={{ color: accentColor, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>{icon}</span>
              <span>{item}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <p style={{ margin: 0, color: "var(--text)", fontSize: "1.02rem", lineHeight: 1.7, fontWeight: 500 }}>
      {tldrText}
    </p>
  );
}

function convertMarkdownFallback(text: string): string {
  if (!text) return "";
  // Check if text has raw markdown headers or pipes
  const hasRawMd = /(?:^|\n)##\s+/.test(text) || /\|[-:\s|]+\|/.test(text) || text.startsWith("## ") || text.includes("**");
  if (!hasRawMd) {
    // Even if no markdown headers, make sure any standalone table is wrapped
    return text.replace(/<div class="table-scroll">\s*<table[\s\S]*?<\/table>\s*<\/div>|<table[\s\S]*?<\/table>/gi, (match) => {
      if (match.startsWith('<div class="table-scroll"')) return match;
      return `<div class="table-scroll">${match}</div>`;
    });
  }

  let out = text;

  // Code blocks: ```...``` -> <pre><code>...</code></pre>
  out = out.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Unwrap any markdown tables trapped inside <p> tags
  out = out.replace(/<p>([\s\S]*?\|[\s\S]*?)<\/p>/gi, (match, inner) => {
    if (/\|[-:\s|]+\|/.test(inner)) {
      return inner;
    }
    return match;
  });

  // Markdown tables
  const tableRegex = /((?:\|[^\n]+\|\r?\n)+)/g;
  out = out.replace(tableRegex, (tbl) => {
    const rows = tbl.trim().split(/\r?\n/).map((r) => r.trim()).filter(Boolean);
    if (rows.length < 2) return tbl;

    let headerRow = rows[0];
    let bodyRows = rows.slice(1);
    if (bodyRows.length > 0 && /\|[-:\s|]+\|/.test(bodyRows[0])) {
      bodyRows = bodyRows.slice(1);
    }

    const parseCells = (row: string) => row.split("|").slice(1, -1).map((c) => c.trim());
    const ths = parseCells(headerRow).map((c) => `<th>${c}</th>`).join("");
    const trs = bodyRows.map((r) => `<tr>${parseCells(r).map((c) => `<td>${c}</td>`).join("")}</tr>`).join("");

    return `<div class="table-scroll"><table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`;
  });

  // Headings
  out = out.replace(/(?:^|\n)##\s+([^\n]+)/g, '\n<h2>$1</h2>');
  out = out.replace(/(?:^|\n)###\s+([^\n]+)/g, '\n<h3>$1</h3>');

  // Bold
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Unordered lists
  out = out.replace(/((?:^|\n)-\s+[^\n]+)+/g, (list) => {
    const items = list.trim().split(/\n-\s+/).filter(Boolean);
    return `<ul>${items.map((it) => `<li>${it.replace(/^-\s*/, '')}</li>`).join('')}</ul>`;
  });

  // Paragraphs for blocks that aren't tags
  const blocks = out.split(/\n\n+/);
  out = blocks.map((b) => {
    const trimmed = b.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<div') || trimmed.startsWith('<ul') || trimmed.startsWith('<ol') || trimmed.startsWith('<pre') || trimmed.startsWith('<table')) {
      return trimmed;
    }
    return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`;
  }).join('\n');

  // Ensure all tables are wrapped
  out = out.replace(/<div class="table-scroll">\s*<table[\s\S]*?<\/table>\s*<\/div>|<table[\s\S]*?<\/table>/gi, (match) => {
    if (match.startsWith('<div class="table-scroll"')) return match;
    return `<div class="table-scroll">${match}</div>`;
  });

  return out;
}

function splitHtmlBody(html: string): [string, string] {
  if (!html) return ["", ""];

  // 1. If content contains raw markdown (e.g. from legacy database), convert it
  let cleanHtml = convertMarkdownFallback(html);

  // 2. Ensure any table without table-scroll is wrapped
  cleanHtml = cleanHtml.replace(/<div class="table-scroll">\s*<table[\s\S]*?<\/table>\s*<\/div>|<table[\s\S]*?<\/table>/gi, (match) => {
    if (match.startsWith('<div class="table-scroll"')) return match;
    return `<div class="table-scroll">${match}</div>`;
  });

  // 3. Find <h2> headings to split cleanly before a major section
  const h2Regex = /<h2\b[^>]*>/gi;
  const matches = [...cleanHtml.matchAll(h2Regex)];

  if (matches.length >= 3) {
    const targetCharIndex = cleanHtml.length * 0.45;
    let bestMatch = matches[1];
    let minDiff = Math.abs((bestMatch.index || 0) - targetCharIndex);
    for (let i = 1; i < matches.length; i++) {
      const diff = Math.abs((matches[i].index || 0) - targetCharIndex);
      if (diff < minDiff) {
        minDiff = diff;
        bestMatch = matches[i];
      }
    }
    const splitIdx = bestMatch.index || Math.floor(cleanHtml.length / 2);
    return [cleanHtml.slice(0, splitIdx), cleanHtml.slice(splitIdx)];
  }

  // Fallback: split on </p> if available
  const pSplit = cleanHtml.split("</p>");
  if (pSplit.length > 2) {
    const mid = Math.floor(pSplit.length / 2);
    return [pSplit.slice(0, mid).join("</p>") + "</p>", pSplit.slice(mid).join("</p>")];
  }

  return [cleanHtml, ""];
}

export default function ArticleView({ article: initialArticle, hubTitle, hubPath }: ArticleViewProps) {
  const [article, setArticle] = useState<Article>(initialArticle);

  useEffect(() => {
    async function syncArticleFromDatabase() {
      try {
        const apiBase = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
          ? "https://cryptoairdropai.com/api"
          : "/api";
        const res = await fetch(`${apiBase}/articles.php?slug=${encodeURIComponent(initialArticle.slug)}`);
        if (res.ok) {
          const liveData = await res.json();
          if (liveData && liveData.slug) {
            if (liveData.body) {
              liveData.body = convertMarkdownFallback(liveData.body);
            }
            setArticle(liveData);
          }
        }
      } catch (err) {
        // quiet fallback to initial pre-rendered article
      }
    }
    syncArticleFromDatabase();
  }, [initialArticle.slug]);

  const author = getAuthorBySlug(article.authorSlug);

  // Helper to split HTML body cleanly at an h2 section boundary
  const [firstHalf, secondHalf] = splitHtmlBody(article.body || "");

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `https://cryptoairdropai.com${hubPath}${article.slug}/#article`,
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://cryptoairdropai.com/#website"
    },
    "headline": article.title,
    "description": article.excerpt,
    "image": article.featuredImage ? [`https://cryptoairdropai.com${article.featuredImage}`] : undefined,
    "datePublished": article.date,
    "dateModified": article.updatedAt || article.date,
    "url": `https://cryptoairdropai.com${hubPath}${article.slug}/`,
    "publisher": {
      "@type": "NewsMediaOrganization",
      "name": "Crypto Airdrop AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cryptoairdropai.com/logo-primary.svg"
      }
    },
    "author": {
      "@type": "Person",
      "name": author?.name || "Crypto Airdrop AI Research Desk",
      "url": `https://cryptoairdropai.com/authors/${author?.slug || 'editorial-desk'}/`
    }
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": hubTitle, "item": `https://cryptoairdropai.com${hubPath}` },
      { "@type": "ListItem", "position": 3, "name": article.title, "item": `https://cryptoairdropai.com${hubPath}${article.slug}/` }
    ]
  };

  const jsonLdFaq = article.faqs && article.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": article.faqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  } : null;

  return (
    <section className="section" style={{ position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      {jsonLdFaq && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      )}

      <div className="wrap post-body" style={{ maxWidth: 820, margin: "0 auto", padding: "0 16px" }}>
        
        {/* Breadcrumb */}
        <div className="breadcrumb" style={{ marginBottom: 24, fontSize: "0.88rem", color: "var(--muted)", fontWeight: 500 }}>
          <Link href="/">Home</Link> / <Link href={hubPath}>{hubTitle}</Link> / <span style={{ color: "var(--text-bright)", fontWeight: 600 }}>{article.tag}</span>
        </div>

        <MotionFade delay={0.05} direction="up">
          <div style={{ display: "inline-flex", marginBottom: 14 }}>
            <span className="pill-badge" style={{ background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)", border: "1px solid rgba(37, 99, 235, 0.2)", fontWeight: 700 }}>
              {article.tag}
            </span>
          </div>

          <h1 style={{ fontSize: "2.5rem", lineHeight: 1.22, marginBottom: 20, fontWeight: 800, fontFamily: "var(--font-serif)", color: "var(--text-bright)", letterSpacing: "-0.02em" }}>
            {article.title}
          </h1>

          {/* Author & Verification Strip */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32, paddingBottom: 18, borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: "var(--surface-sunken)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                {author?.avatar || "🤖"}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                  <Link href={`/authors/${author?.slug || 'editorial-desk'}/`} style={{ color: "var(--text-bright)", textDecoration: "none" }}>
                    {author?.name || "Crypto Airdrop AI Intelligence Desk"}
                  </Link>
                  <span className="pill-badge success" style={{ marginLeft: 8, fontSize: "0.7rem", padding: "2px 8px" }}>
                    ✓ Fact-Checked
                  </span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 2 }}>
                  Published: {article.date} {article.updatedAt && `· Updated: ${article.updatedAt}`} · {article.read}
                </div>
              </div>
            </div>
            <div>
              <Link href="/editorial-policy/" className="btn btn-sm btn-outline" style={{ fontSize: "0.8rem", background: "var(--surface)" }}>
                Editorial Policy
              </Link>
            </div>
          </div>
        </MotionFade>

        {/* 1. FIXED FEATURED 8K HERO IMAGE */}
        {article.featuredImage && (
          <div 
            style={{ 
              position: "relative", 
              width: "100%", 
              aspectRatio: "16/9", 
              borderRadius: "14px", 
              overflow: "hidden", 
              marginBottom: 36,
              border: "1px solid var(--border)",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.06)"
            }}
          >
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 820px) 100vw, 820px"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        {/* Distinct Summary Card: Guides vs Intelligence */}
        {article.tldr && (() => {
          const isGuide = article.pageType === "guides";
          return (
            <MotionCard style={{ 
              padding: 26, 
              marginBottom: 36, 
              borderLeft: isGuide ? "4px solid var(--emerald, #10B981)" : "4px solid var(--accent, #2563EB)", 
              background: isGuide ? "rgba(16, 185, 129, 0.04)" : "var(--surface-sunken)", 
              borderTop: "1px solid var(--border)", 
              borderRight: "1px solid var(--border)", 
              borderBottom: "1px solid var(--border)", 
              borderRadius: "var(--radius-sm, 10px)" 
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span 
                  className="pill-badge" 
                  style={{ 
                    fontSize: "0.74rem", 
                    background: isGuide ? "rgba(16, 185, 129, 0.12)" : "rgba(37, 99, 235, 0.12)", 
                    color: isGuide ? "var(--emerald, #10B981)" : "var(--accent, #2563EB)", 
                    fontWeight: 700 
                  }}
                >
                  {isGuide ? "📋 Tactical Execution Brief" : "🏛️ Institutional Research Brief"}
                </span>
              </div>
              {renderTldr(article.tldr, article.pageType)}
            </MotionCard>
          );
        })()}

        {/* Distinct Key Takeaways / Checkpoints Card: Guides vs Intelligence */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (() => {
          const isGuide = article.pageType === "guides";
          return (
            <MotionCard style={{ 
              padding: 24, 
              marginBottom: 36, 
              background: "var(--surface)", 
              border: isGuide ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid var(--border)", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)" 
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                  {isGuide ? "⚡ Critical Action Checkpoints" : "📈 Protocol Metrics & Market Telemetry"}
                </h3>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "0 0 16px", lineHeight: 1.4 }}>
                {isGuide 
                  ? "Verify all prerequisite operational requirements and execution gates before deploying on-chain capital:"
                  : "Quantitative risk scoring, tokenomics emissions models, and on-chain capital distribution telemetry:"}
              </p>
              <ul style={{ paddingLeft: isGuide ? 0 : 20, margin: 0, display: "flex", flexDirection: "column", gap: 12, listStyle: isGuide ? "none" : "disc", color: "var(--text)", lineHeight: 1.6 }}>
                {article.keyTakeaways.map((item, idx) => (
                  <li key={idx} style={isGuide ? { display: "flex", alignItems: "flex-start", gap: 12 } : undefined}>
                    {isGuide && (
                      <span style={{ 
                        display: "inline-flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        width: 22, 
                        height: 22, 
                        borderRadius: "50%", 
                        background: "rgba(16, 185, 129, 0.15)", 
                        color: "var(--emerald, #10B981)", 
                        fontSize: "0.78rem", 
                        fontWeight: 800, 
                        flexShrink: 0, 
                        marginTop: 2 
                      }}>
                        {idx + 1}
                      </span>
                    )}
                    <strong style={{ color: "var(--text-bright)" }}>{item}</strong>
                  </li>
                ))}
              </ul>
            </MotionCard>
          );
        })()}

        {/* First Half of Body */}
        {firstHalf && (
          <div
            className="post-content article-content"
            dangerouslySetInnerHTML={{ __html: firstHalf }}
            style={{ fontSize: "1.08rem", lineHeight: 1.8, color: "var(--text)" }}
          />
        )}

        {/* 2. MIDDLE 8K CONTEXTUAL IMAGE */}
        {article.middleImage && (
          <div style={{ margin: "44px 0" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16/9",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid var(--border)",
                boxShadow: "0 6px 24px rgba(0, 0, 0, 0.06)"
              }}
            >
              <Image
                src={article.middleImage}
                alt={`${article.title} - Protocol Architecture`}
                fill
                sizes="(max-width: 820px) 100vw, 820px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--muted)", textAlign: "center", marginTop: 10, fontStyle: "italic" }}>
              Figure 1.0: Protocol infrastructure telemetry and on-chain interaction mapping.
            </p>
          </div>
        )}

        {/* Second Half of Body */}
        {secondHalf && (
          <div
            className="post-content article-content"
            dangerouslySetInnerHTML={{ __html: secondHalf }}
            style={{ fontSize: "1.08rem", lineHeight: 1.8, color: "var(--text)" }}
          />
        )}

        {/* 3. PRE-FAQ 8K TACTICAL VERIFICATION IMAGE */}
        {article.preFaqImage && (
          <div style={{ margin: "48px 0 24px" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16/9",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid var(--border)",
                boxShadow: "0 6px 24px rgba(0, 0, 0, 0.06)"
              }}
            >
              <Image
                src={article.preFaqImage}
                alt={`${article.title} - Verification Matrix`}
                fill
                sizes="(max-width: 820px) 100vw, 820px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--muted)", textAlign: "center", marginTop: 10, fontStyle: "italic" }}>
              Figure 2.0: Multi-vector security audit matrix and sybil-resistance validation shield.
            </p>
          </div>
        )}

        {/* 4–6 FAQs Accordion */}
        {article.faqs && article.faqs.length > 0 && (
          <div style={{ marginTop: 48, paddingTop: 36, borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "inline-flex", marginBottom: 12 }}>
              <span className="pill-badge" style={{ background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)" }}>🔍 Inquiries &amp; Resolution</span>
            </div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 22, fontFamily: "var(--font-serif)", color: "var(--text-bright)" }}>
              Frequently Asked Questions (FAQ)
            </h2>
            <FaqAccordion faqs={article.faqs} />
          </div>
        )}

        {/* Author Bio Box */}
        {author && (
          <MotionCard style={{ marginTop: 48, padding: 28, display: "flex", gap: 20, alignItems: "flex-start", background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ width: 60, height: 60, borderRadius: 30, background: "var(--surface-sunken)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}>
              {author.avatar}
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 4px", fontFamily: "var(--font-serif)", color: "var(--text-bright)" }}>
                Written by <Link href={`/authors/${author.slug}/`} style={{ color: "var(--accent)", textDecoration: "none" }}>{author.name}</Link>
              </h3>
              <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 8, fontWeight: 500 }}>{author.role}</div>
              <p style={{ fontSize: "0.92rem", color: "var(--text)", lineHeight: 1.55, margin: "0 0 14px", opacity: 0.9 }}>
                {author.bio}
              </p>
              {author.xUrl && (
                <a href={author.xUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline">
                  Follow on X
                </a>
              )}
            </div>
          </MotionCard>
        )}

      </div>
    </section>
  );
}
