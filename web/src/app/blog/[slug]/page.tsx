import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/cms/blogService";
import { getAuthorBySlug } from "@/lib/data";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  if (!posts || posts.length === 0) {
    return [{ slug: 'coming-soon' }];
  }
  return posts.map((p) => ({ slug: p.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Crypto Airdrop AI`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}/` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://cryptoairdropai.com/blog/${slug}/`,
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      authors: [`https://cryptoairdropai.com/authors/${post.authorSlug}/`],
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const author = getAuthorBySlug(post.authorSlug);

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.date,
    "dateModified": post.updatedAt || post.date,
    "url": `https://cryptoairdropai.com/blog/${slug}/`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://cryptoairdropai.com/blog/${slug}/`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Crypto Airdrop AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cryptoairdropai.com/logo-primary.svg"
      }
    },
    "author": {
      "@type": "Person",
      "name": author?.name || "Crypto Airdrop AI Research Desk",
      "url": `https://cryptoairdropai.com/authors/${author?.slug || 'editorial-desk'}`,
      "jobTitle": author?.role || "Crypto Research Analyst",
      "sameAs": [author?.xUrl, author?.linkedinUrl].filter(Boolean)
    }
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://cryptoairdropai.com/blog" },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://cryptoairdropai.com/blog/${slug}` }
    ]
  };

  const jsonLdFaq = post.faqs && post.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map((f) => ({
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
      
      <div className="wrap post-body" style={{ maxWidth: 860, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 24, fontSize: "0.9rem", color: "var(--muted)" }}>
          <Link href="/">Home</Link> / <Link href="/blog">Intelligence</Link> / <span style={{ color: "var(--text)" }}>{post.tag}</span>
        </div>
        
        <MotionFade delay={0.05} direction="up">
          <div style={{ display: "inline-flex", marginBottom: 14 }}>
            <span className="pill-badge">{post.tag}</span>
          </div>
          
          <h1 style={{ fontSize: "2.6rem", lineHeight: 1.15, marginBottom: 20, fontWeight: 900, letterSpacing: "-0.025em" }}>
            {post.title}
          </h1>
          
          {/* Author Byline & Fact-Check Metadata */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                {author?.avatar || "🛡️"}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                  <Link href={`/authors/${author?.slug || 'editorial-desk'}`} style={{ color: "var(--text)" }}>
                    {author?.name || "Crypto Airdrop AI Research Desk"}
                  </Link>
                  <span className="pill-badge success" style={{ marginLeft: 8, fontSize: "0.68rem", padding: "2px 8px" }}>
                    ✓ Fact-Checked
                  </span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: 2 }}>
                  Published: {post.date} {post.updatedAt && `· Updated: ${post.updatedAt}`} · {post.read} read
                </div>
              </div>
            </div>
            <div>
              <Link href="/editorial-policy" className="btn btn-sm btn-outline" style={{ fontSize: "0.8rem" }}>
                Editorial Policy
              </Link>
            </div>
          </div>
        </MotionFade>

        {/* TL;DR Callout */}
        {post.tldr && (
          <MotionCard style={{ padding: 24, marginBottom: 32, borderLeft: "4px solid var(--accent)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="pill-badge" style={{ fontSize: "0.72rem" }}>⚡ Quick TL;DR Takeaway</span>
            </div>
            <p style={{ margin: 0, color: "var(--text)", fontSize: "1.02rem", lineHeight: 1.65 }}>
              {post.tldr}
            </p>
          </MotionCard>
        )}

        {/* Key Takeaways */}
        {post.keyTakeaways && post.keyTakeaways.length > 0 && (
          <MotionCard style={{ padding: 24, marginBottom: 36 }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: 12 }}>Key Findings &amp; Quick Facts</h3>
            <ul style={{ paddingLeft: 20, margin: 0, display: "flex", flexDirection: "column", gap: 8, color: "var(--muted)", lineHeight: 1.6 }}>
              {post.keyTakeaways.map((item, idx) => (
                <li key={idx}><strong>{item}</strong></li>
              ))}
            </ul>
          </MotionCard>
        )}

        {/* Post Main Body */}
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.body }} style={{ fontSize: "1.08rem", lineHeight: 1.75 }} />

        {/* FAQs */}
        {post.faqs && post.faqs.length > 0 && (
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 900, marginBottom: 20 }}>
              Frequently Asked Questions (FAQ)
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {post.faqs.map((faq, idx) => (
                <MotionCard key={idx} style={{ padding: 22 }}>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>
                    {faq.question}
                  </h3>
                  <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>
                    {faq.answer}
                  </p>
                </MotionCard>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio Box */}
        {author && (
          <MotionCard style={{ marginTop: 48, padding: 28, display: "flex", gap: 20, alignItems: "flex-start" }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>
              {author.avatar}
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 4px" }}>
                Written by <Link href={`/authors/${author.slug}`} style={{ color: "var(--accent)" }}>{author.name}</Link>
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
