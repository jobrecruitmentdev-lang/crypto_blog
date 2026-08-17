import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllAuthors, getAuthorBySlug, getPostsByAuthor } from "@/lib/data";

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
    title: `${author.name} — Author & Analyst Profile`,
    description: author.bio,
    alternates: { canonical: `/authors/${slug}` },
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
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap" style={{ maxWidth: 860, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 20 }}>
          <Link href="/">Home</Link> / <Link href="/authors">Authors</Link> / {author.name}
        </div>

        <div className="card" style={{ padding: 32, marginBottom: 40 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
            <div style={{ width: 80, height: 80, borderRadius: 40, background: "var(--surface-hover)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, flexShrink: 0 }}>
              {author.avatar}
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h1 style={{ fontSize: "2rem", fontWeight: 900, margin: 0, letterSpacing: "-0.02em" }}>
                {author.name}
              </h1>
              <div style={{ color: "var(--primary)", fontWeight: 700, fontSize: "1rem", marginTop: 4 }}>
                {author.role}
              </div>

              <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.7, margin: "16px 0" }}>
                {author.bio}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {author.credentials?.map((cred: string, idx: number) => (
                  <span key={idx} style={{ background: "var(--surface-hover)", border: "1px solid var(--border)", fontSize: "0.85rem", padding: "4px 12px", borderRadius: 6, color: "var(--foreground)" }}>
                    ✓ {cred}
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                {author.xUrl && (
                  <a href={author.xUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: "0.85rem", padding: "6px 12px" }}>
                    Follow on X
                  </a>
                )}
                {author.linkedinUrl && (
                  <a href={author.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: "0.85rem", padding: "6px 12px" }}>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 20 }}>
            Articles &amp; Research by {author.name}
          </h2>

          {authorPosts.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {authorPosts.map((post) => (
                <div key={post.slug} className="card" style={{ padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span className="blog-tag" style={{ background: "var(--primary)", color: "white", padding: "2px 8px", borderRadius: 4, fontSize: "0.75rem", fontWeight: 700 }}>
                      {post.tag}
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{post.date} · {post.read} read</span>
                  </div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "8px 0" }}>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: "8px 0 16px" }}>
                    {post.excerpt}
                  </p>
                  <Link href={`/blog/${post.slug}`} style={{ color: "var(--primary)", fontWeight: 700, fontSize: "0.9rem" }}>
                    Read Full Guide →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--muted)" }}>More analyses coming soon from this analyst.</p>
          )}
        </div>
      </div>
    </section>
  );
}
