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

      <div className="wrap post-body" style={{ maxWidth: 920, margin: "0 auto" }}>
        
        {/* Breadcrumb */}
        <div className="breadcrumb" style={{ marginBottom: 24, fontSize: "0.88rem", color: "var(--muted)" }}>
          <Link href="/">Home</Link> / <Link href={hubPath}>{hubTitle}</Link> / <span style={{ color: "var(--text)" }}>{article.tag}</span>
        </div>

        <MotionFade delay={0.05} direction="up">
          <div style={{ display: "inline-flex", marginBottom: 12 }}>
            <span className="pill-badge">{article.tag}</span>
          </div>

          <h1 style={{ fontSize: "2.6rem", lineHeight: 1.18, marginBottom: 18, fontWeight: 900, letterSpacing: "-0.025em" }}>
            {article.title}
          </h1>

          {/* Author & Verification Strip */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                {author?.avatar || "🤖"}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                  <Link href={`/authors/${author?.slug || 'editorial-desk'}`} style={{ color: "var(--text)" }}>
                    {author?.name || "Crypto Airdrop AI Intelligence Desk"}
                  </Link>
                  <span className="pill-badge success" style={{ marginLeft: 8, fontSize: "0.68rem", padding: "2px 8px" }}>
                    ✓ Fact-Checked
                  </span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 2 }}>
                  Published: {article.date} {article.updatedAt && `· Updated: ${article.updatedAt}`} · {article.read}
                </div>
              </div>
            </div>
            <div>
              <Link href="/editorial-policy/" className="btn btn-sm btn-outline" style={{ fontSize: "0.8rem" }}>
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
              borderRadius: "16px", 
              overflow: "hidden", 
              marginBottom: 36,
              border: "1px solid var(--border)",
              boxShadow: "0 12px 40px rgba(0, 224, 164, 0.08)"
            }}
          >
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 920px) 100vw, 920px"
              style={{ objectFit: "cover" }}
            />
            <div style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              background: "rgba(2, 4, 8, 0.75)",
              backdropFilter: "blur(6px)",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "0.72rem",
              fontFamily: "monospace",
              color: "var(--emerald)",
              border: "1px solid rgba(16, 185, 129, 0.3)"
            }}>
              ● 8K VERIFIED AI ASSET
            </div>
          </div>
        )}

        {/* TL;DR Box */}
        {article.tldr && (
          <MotionCard style={{ padding: 24, marginBottom: 32, borderLeft: "4px solid var(--accent)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="pill-badge" style={{ fontSize: "0.72rem" }}>⚡ Quick TL;DR Takeaway</span>
            </div>
            <p style={{ margin: 0, color: "var(--text)", fontSize: "1.02rem", lineHeight: 1.65 }}>
              {article.tldr}
            </p>
          </MotionCard>
        )}

        {/* Key Takeaways */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <MotionCard style={{ padding: 24, marginBottom: 36 }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: 12 }}>Key Findings &amp; Quick Facts</h3>
            <ul style={{ paddingLeft: 20, margin: 0, display: "flex", flexDirection: "column", gap: 8, color: "var(--muted)", lineHeight: 1.6 }}>
              {article.keyTakeaways.map((item, idx) => (
                <li key={idx}><strong>{item}</strong></li>
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
          style={{ fontSize: "1.08rem", lineHeight: 1.75 }}
        />

        {/* 2. MIDDLE 8K CONTEXTUAL IMAGE */}
        {article.middleImage && (
          <div style={{ margin: "40px 0" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16/9",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid var(--border)",
                boxShadow: "0 8px 32px rgba(124, 92, 255, 0.08)"
              }}
            >
              <Image
                src={article.middleImage}
                alt={`${article.title} - Protocol Architecture`}
                fill
                sizes="(max-width: 920px) 100vw, 920px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--muted)", textAlign: "center", marginTop: 8, fontStyle: "italic" }}>
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
          style={{ fontSize: "1.08rem", lineHeight: 1.75 }}
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
                boxShadow: "0 8px 32px rgba(0, 224, 164, 0.08)"
              }}
            >
              <Image
                src={article.preFaqImage}
                alt={`${article.title} - Verification Matrix`}
                fill
                sizes="(max-width: 920px) 100vw, 920px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--muted)", textAlign: "center", marginTop: 8, fontStyle: "italic" }}>
              Figure 2.0: Multi-vector security audit matrix and sybil-resistance validation shield.
            </p>
          </div>
        )}

        {/* 4–6 FAQs Accordion */}
        {article.faqs && article.faqs.length > 0 && (
          <div style={{ marginTop: 40, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "inline-flex", marginBottom: 10 }}>
              <span className="pill-badge">🔍 Critical Inquiries</span>
            </div>
            <h2 style={{ fontSize: "1.7rem", fontWeight: 900, marginBottom: 20 }}>
              Frequently Asked Questions (FAQ)
            </h2>
            <FaqAccordion faqs={article.faqs} />
          </div>
        )}

        {/* Author Bio Box */}
        {author && (
          <MotionCard style={{ marginTop: 48, padding: 28, display: "flex", gap: 20, alignItems: "flex-start" }}>
            <div style={{ width: 60, height: 60, borderRadius: 30, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}>
              {author.avatar}
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 4px" }}>
                Written by <Link href={`/authors/${author.slug}/`} style={{ color: "var(--accent)" }}>{author.name}</Link>
              </h3>
              <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 8 }}>{author.role}</div>
              <p style={{ fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.5, margin: "0 0 12px" }}>
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
