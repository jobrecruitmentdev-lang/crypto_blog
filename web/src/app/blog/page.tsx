import type { Metadata } from "next";
import Link from "next/link";
import BlogGrid from "@/components/BlogGrid";
import { getAllPosts } from "@/lib/cms/blogService";

export const metadata: Metadata = {
  title: "Crypto News, Guides & Airdrop Market Intelligence",
  description: "Read independent crypto guides, rigorous on-chain airdrop reviews, Layer-2 scaling analyses, and daily DeFi market research from Crypto Airdrop AI.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  const blogCollectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Crypto Airdrop AI Blog & Intelligence",
    "url": "https://cryptoairdropai.com/blog",
    "description": "Daily fact-checked crypto research, on-chain airdrop strategies, and security tutorials.",
    "hasPart": posts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "url": `https://cryptoairdropai.com/blog/${post.slug}`,
      "datePublished": post.date
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://cryptoairdropai.com/blog" }
    ]
  };

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogCollectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap">
        <div className="breadcrumb" style={{ marginBottom: 20 }}>
          <Link href="/">Home</Link> / Crypto Blog &amp; Guides
        </div>
        <div className="section-head" style={{ marginBottom: 32 }}>
          <div>
            <span style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Research &amp; Analysis
            </span>
            <h1 style={{ fontSize: "2.4rem", fontWeight: 900, marginTop: 8, letterSpacing: "-0.02em" }}>
              Crypto News, In-Depth Guides &amp; Airdrop Intelligence
            </h1>
            <p style={{ fontSize: "1.1rem", color: "var(--muted)", marginTop: 6 }}>
              Fact-checked protocol walkthroughs, sybil defense tutorials, and quantitative market insights.
            </p>
          </div>
        </div>
        <BlogGrid posts={posts} />
      </div>
    </section>
  );
}
