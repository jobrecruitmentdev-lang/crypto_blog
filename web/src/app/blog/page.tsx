import type { Metadata } from "next";
import Link from "next/link";
import BlogGrid from "@/components/BlogGrid";
import { getAllPosts } from "@/lib/cms/blogService";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";

export const metadata: Metadata = {
  title: "Crypto News, Guides & Airdrop Market Intelligence",
  description: "Read independent crypto guides, rigorous on-chain airdrop reviews, Layer-2 scaling analyses, and daily DeFi market research from Crypto Airdrop AI.",
  alternates: { canonical: "/blog/" },
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
    <section className="section" style={{ position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogCollectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap">
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / Crypto Intelligence &amp; Research
        </div>

        <MotionFade delay={0.05} direction="up" style={{ marginBottom: 40 }}>
          <div style={{ display: "inline-flex", marginBottom: 12 }}>
            <span className="pill-badge">🧠 Research &amp; Market Intelligence</span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 900, letterSpacing: "-0.03em", margin: "8px 0 16px" }}>
            Crypto News &amp; Protocol Deep Dives
          </h1>
          <p style={{ fontSize: "1.15rem", color: "var(--muted)", maxWidth: 720, lineHeight: 1.6 }}>
            Fact-checked protocol walkthroughs, sybil defense tutorials, and quantitative market insights.
          </p>
        </MotionFade>

        {/* Featured Posts Grid */}
        <BlogGrid posts={posts} />

        {/* Research Transparency Callout */}
        <MotionCard style={{ marginTop: 64, padding: 36, textAlign: "center" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>Have Alpha or an On-Chain Correction?</h3>
          <p style={{ color: "var(--muted)", maxWidth: 560, margin: "0 auto 20px", fontSize: "0.95rem" }}>
            Our editorial desk reviews transaction hashes, contract discrepancies, and snapshot announcements around the clock.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <Link href="/contact" className="btn btn-primary btn-sm">
              Submit to Research Desk
            </Link>
            <Link href="/editorial-policy" className="btn btn-outline btn-sm">
              Editorial Policy
            </Link>
          </div>
        </MotionCard>
      </div>
    </section>
  );
}
