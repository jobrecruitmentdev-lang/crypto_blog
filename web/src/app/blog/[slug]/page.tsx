import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/cms/blogService";
import { getAuthorBySlug } from "@/lib/data";

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
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      authors: [`https://cryptoairdropai.com/authors/${post.authorSlug}`],
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
    "url": `https://cryptoairdropai.com/blog/${slug}`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://cryptoairdropai.com/blog/${slug}`
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
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      {jsonLdFaq && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      )}
      
      <div className="wrap post-body" style={{ maxWidth: 820, margin: "0 auto", padding: "30px 20px" }}>
        <div className="breadcrumb" style={{ marginBottom: 20, fontSize: "0.9rem", color: "var(--muted)" }}>
          <Link href="/">Home</Link> / <Link href="/blog">Blog</Link> / <span style={{ color: "var(--foreground)" }}>{post.tag}</span>
        </div>
        
        <span className="blog-tag" style={{ background: "var(--primary)", color: "white", padding: "4px 12px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 700, marginBottom: 14, display: "inline-block" }}>
          {post.tag}
        </span>
        
        <h1 style={{ fontSize: "2.5rem", lineHeight: 1.15, marginBottom: 20, fontWeight: 900, letterSpacing: "-0.025em" }}>
          {post.title}
        </h1>
        
        {/* Author Byline & Fact-Check Metadata */}
        <div className="author-byline" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 23, background: "var(--surface-hover)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              {author?.avatar || "🛡️"}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                <Link href={`/authors/${author?.slug || 'editorial-desk'}`} style={{ color: "var(--foreground)" }}>
                  {author?.name || "Crypto Airdrop AI Research Desk"}
                </Link>
                <span style={{ marginLeft: 8, fontSize: "0.75rem", background: "rgba(16,185,129,0.15)", color: "#10b981", padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>
                  ✓ Fact-Checked
                </span>
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: 2 }}>
                Published: {post.date} {post.updatedAt && `· Updated: ${post.updatedAt}`} · {post.read} read
              </div>
            </div>
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
            <Link href="/editorial-policy" style={{ color: "var(--primary)", textDecoration: "underline" }}>
              Editorial Standards
            </Link>
          </div>
        </div>

        {/* AEO / GEO TL;DR Direct Answer Extraction Callout */}
        {post.tldr && (
          <div className="card" style={{ padding: 22, marginBottom: 32, background: "rgba(99, 102, 241, 0.06)", borderLeft: "4px solid var(--primary)", borderRadius: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: "1.1rem" }}>⚡</span>
              <strong style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--foreground)" }}>
                TL;DR Direct Summary (Key Takeaway)
              </strong>
            </div>
            <p style={{ margin: 0, color: "var(--foreground)", fontSize: "1.02rem", lineHeight: 1.65 }}>
              {post.tldr}
            </p>
          </div>
        )}

        {/* Key Takeaways */}
        {post.keyTakeaways && post.keyTakeaways.length > 0 && (
          <div className="card" style={{ padding: 22, marginBottom: 36, background: "var(--surface)" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: 12 }}>Key Findings &amp; Quick Facts</h3>
            <ul style={{ paddingLeft: 20, margin: 0, display: "flex", flexDirection: "column", gap: 8, color: "var(--muted)", lineHeight: 1.6 }}>
              {post.keyTakeaways.map((item, idx) => (
                <li key={idx}><strong>{item}</strong></li>
              ))}
            </ul>
          </div>
        )}

        {/* Post Main Body */}
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.body }} style={{ fontSize: "1.08rem", lineHeight: 1.75 }} />

        {/* 5 Standalone AEO / GEO FAQs */}
        {post.faqs && post.faqs.length > 0 && (
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 900, marginBottom: 20 }}>
              Frequently Asked Questions (FAQ)
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {post.faqs.map((faq, index) => (
                <div key={index} className="card" style={{ padding: 20, background: "var(--surface)" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: 8, color: "var(--foreground)" }}>
                    Q: {faq.question}
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio Footer Card */}
        {author && (
          <div className="card" style={{ padding: 24, marginTop: 44, background: "var(--surface)", borderLeft: "4px solid var(--primary)" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ width: 56, height: 56, borderRadius: 28, background: "var(--surface-hover)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                {author.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                  Written by <Link href={`/authors/${author.slug}`} style={{ color: "var(--foreground)" }}>{author.name}</Link>
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600 }}>
                  {author.role}
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--muted)", margin: "8px 0 0", lineHeight: 1.5 }}>
                  {author.bio}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
