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

export default function ArticleView({ article, hubTitle, hubPath }: ArticleViewProps) {
  const author = getAuthorBySlug(article.authorSlug);

  // Split article body around the middle to inject the Middle 8K Image
  const body = article.body || "";
  const paragraphs = body.split("</p>");
  const midIndex = Math.floor(paragraphs.length / 2);

  const firstHalf = paragraphs.slice(0, midIndex).join("</p>") + (midIndex > 0 ? "</p>" : "");
  const secondHalf = paragraphs.slice(midIndex).join("</p>");

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
            <div style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              background: "rgba(255, 255, 255, 0.94)",
              backdropFilter: "blur(6px)",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "var(--emerald)",
              border: "1px solid var(--border)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
            }}>
              ● 8K VERIFIED AI ASSET
            </div>
          </div>
        )}

        {/* TL;DR Box */}
        {article.tldr && (
          <MotionCard style={{ padding: 24, marginBottom: 32, borderLeft: "4px solid var(--accent)", background: "var(--surface-sunken)", borderTop: "1px solid var(--border)", borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="pill-badge" style={{ fontSize: "0.72rem", background: "rgba(37, 99, 235, 0.1)", color: "var(--accent)" }}>⚡ Executive Summary (TL;DR)</span>
            </div>
            <p style={{ margin: 0, color: "var(--text)", fontSize: "1.02rem", lineHeight: 1.7, fontWeight: 500 }}>
              {article.tldr}
            </p>
          </MotionCard>
        )}

        {/* Key Takeaways */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <MotionCard style={{ padding: 24, marginBottom: 36, background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: 14, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>Key Findings &amp; Core Telemetry</h3>
            <ul style={{ paddingLeft: 20, margin: 0, display: "flex", flexDirection: "column", gap: 10, color: "var(--text)", lineHeight: 1.6 }}>
              {article.keyTakeaways.map((item, idx) => (
                <li key={idx}><strong style={{ color: "var(--text-bright)" }}>{item}</strong></li>
              ))}
            </ul>
          </MotionCard>
        )}

        {/* First Half of Body */}
        <div
          className="post-content article-content"
          dangerouslySetInnerHTML={{
            __html: firstHalf.replace(/(<table[\s\S]*?<\/table>)/gi, '<div class="table-scroll">$1</div>')
          }}
          style={{ fontSize: "1.08rem", lineHeight: 1.8, color: "var(--text)" }}
        />

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
        <div
          className="post-content article-content"
          dangerouslySetInnerHTML={{
            __html: secondHalf.replace(/(<table[\s\S]*?<\/table>)/gi, '<div class="table-scroll">$1</div>')
          }}
          style={{ fontSize: "1.08rem", lineHeight: 1.8, color: "var(--text)" }}
        />

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
