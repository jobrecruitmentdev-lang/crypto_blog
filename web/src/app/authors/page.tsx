import type { Metadata } from "next";
import Link from "next/link";
import { AUTHORS, getPostsByAuthor } from "@/lib/data";

export const metadata: Metadata = {
  title: "Editorial & Research Team — Verified Authors & Analysts",
  description:
    "Meet the researchers, on-chain analysts, and Web3 security contributors behind Crypto Airdrop AI.",
  alternates: { canonical: "/authors" },
};

export default function AuthorsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Authors", "item": "https://cryptoairdropai.com/authors" }
    ]
  };

  const authorsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": AUTHORS.map((author, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Person",
        "name": author.name,
        "jobTitle": author.role,
        "url": `https://cryptoairdropai.com/authors/${author.slug}`,
        "description": author.bio
      }
    }))
  };

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(authorsSchema) }} />

      <div className="wrap" style={{ maxWidth: 880, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 20 }}>
          <Link href="/">Home</Link> / Authors &amp; Analysts
        </div>

        <div className="section-head" style={{ marginBottom: 32 }}>
          <div>
            <span style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Our Contributors
            </span>
            <h1 style={{ fontSize: "2.4rem", fontWeight: 900, marginTop: 8, letterSpacing: "-0.02em" }}>
              Editorial &amp; Research Team
            </h1>
            <p style={{ fontSize: "1.15rem", color: "var(--muted)", marginTop: 8, lineHeight: 1.6 }}>
              Experienced blockchain developers, DeFi strategists, and on-chain auditors authoring fact-checked guides.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {AUTHORS.map((author) => {
            const authorPosts = getPostsByAuthor(author.slug);
            return (
              <div key={author.slug} className="card" style={{ padding: 28 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
                  <div style={{ width: 64, height: 64, borderRadius: 32, background: "var(--surface-hover)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>
                    {author.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0 }}>
                          <Link href={`/authors/${author.slug}`}>{author.name}</Link>
                        </h2>
                        <div style={{ color: "var(--primary)", fontWeight: 700, fontSize: "0.9rem", marginTop: 2 }}>
                          {author.role}
                        </div>
                      </div>
                      <Link href={`/authors/${author.slug}`} className="btn btn-outline" style={{ fontSize: "0.85rem", padding: "6px 14px" }}>
                        View Full Profile →
                      </Link>
                    </div>

                    <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: "14px 0" }}>
                      {author.bio}
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                      {author.credentials?.map((cred: string, idx: number) => (
                        <span key={idx} style={{ background: "var(--surface-hover)", border: "1px solid var(--border)", fontSize: "0.8rem", padding: "4px 10px", borderRadius: 6, color: "var(--muted)" }}>
                          ✓ {cred}
                        </span>
                      ))}
                    </div>

                    {authorPosts.length > 0 && (
                      <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border)", fontSize: "0.85rem", color: "var(--muted)" }}>
                        <strong>Authored:</strong>{" "}
                        {authorPosts.map((p, i) => (
                          <span key={p.slug}>
                            <Link href={`/blog/${p.slug}`} style={{ color: "var(--foreground)", textDecoration: "underline" }}>
                              {p.title.split(":")[0]}
                            </Link>
                            {i < authorPosts.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
