import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllAuthors, getAuthorBySlug, getPostsByAuthor } from "@/lib/data";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";

export async function generateStaticParams() {
  const authors = getAllAuthors();
  return authors.map((a) => ({ slug: a.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return {};
  return {
    title: `${author.name} — Author & Analyst Profile | Crypto Airdrop AI`,
    description: author.bio,
    alternates: { canonical: `/authors/${slug}/` },
  };
}

export default async function AuthorDetailPage({ params }: Props) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const authorPosts = getPostsByAuthor(slug);

  const authorSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": author.name,
      "jobTitle": author.role,
      "description": author.bio,
      "url": `https://cryptoairdropai.com/authors/${slug}`,
      "sameAs": [author.xUrl, author.linkedinUrl].filter(Boolean)
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Authors", "item": "https://cryptoairdropai.com/authors" },
      { "@type": "ListItem", "position": 3, "name": author.name, "item": `https://cryptoairdropai.com/authors/${slug}` }
    ]
  };

  return (
    <section className="section" style={{ position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap" style={{ maxWidth: 940, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / <Link href="/authors/">Authors</Link> / {author.name}
        </div>

        {/* Hero Card */}
        <MotionCard style={{ padding: 36, marginBottom: 44, background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
            <div style={{ width: 84, height: 84, borderRadius: 42, background: "var(--surface-sunken)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, flexShrink: 0 }}>
              {author.avatar}
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: 0, letterSpacing: "-0.02em", color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                  {author.name}
                </h1>
                <span className="pill-badge success">Verified Node</span>
              </div>
              <div style={{ color: "var(--accent)", fontWeight: 700, fontSize: "1rem", marginBottom: 12 }}>
                {author.role}
              </div>
              <p style={{ color: "var(--text)", fontSize: "1.02rem", lineHeight: 1.7, margin: "0 0 16px", opacity: 0.9 }}>
                {author.bio}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {author.credentials?.map((cred: string, idx: number) => (
                  <span key={idx} className="pill-badge" style={{ fontSize: "0.75rem", textTransform: "none", background: "var(--surface-sunken)", border: "1px solid var(--border)" }}>
                    ✓ {cred}
                  </span>
                ))}
              </div>
              {author.xUrl && (
                <a href={author.xUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline" style={{ background: "var(--surface)" }}>
                  Follow on X
                </a>
              )}
            </div>
          </div>
        </MotionCard>

        {/* Authored Guides Section */}
        <div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 20, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
            Research &amp; Guides Authored by {author.name}
          </h2>
          {authorPosts.length === 0 ? (
            <MotionCard style={{ padding: 24, textAlign: "center", color: "var(--muted)", background: "var(--surface)", border: "1px solid var(--border)" }}>
              No articles published under this profile yet.
            </MotionCard>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {authorPosts.map((post) => (
                <MotionCard key={post.slug} style={{ padding: 24, background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span className="pill-badge" style={{ fontSize: "0.75rem", background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)" }}>
                      {post.tag}
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: 500 }}>
                      {post.date} · {post.read} read
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "8px 0", fontFamily: "var(--font-serif)" }}>
                    <Link href={`/blog/${post.slug}/`} style={{ color: "var(--text-bright)", textDecoration: "none" }}>{post.title}</Link>
                  </h3>
                  <p style={{ color: "var(--text)", fontSize: "0.95rem", lineHeight: 1.6, margin: "8px 0 16px", opacity: 0.88 }}>
                    {post.excerpt}
                  </p>
                  <Link href={`/blog/${post.slug}/`} style={{ color: "var(--accent)", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>
                    Read Full Guide →
                  </Link>
                </MotionCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
