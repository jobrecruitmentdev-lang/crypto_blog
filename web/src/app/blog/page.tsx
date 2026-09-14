import type { Metadata } from "next";
import Link from "next/link";
import ArticleCardGrid from "@/components/ArticleCardGrid";
import { getAllPosts } from "@/lib/cms/blogService";
import { MotionFade } from "@/components/ui/MotionWrapper";

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
    "url": "https://cryptoairdropai.com/blog/",
    "description": "Daily fact-checked crypto research, on-chain airdrop strategies, and security tutorials.",
    "hasPart": posts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "url": `https://cryptoairdropai.com/blog/${post.slug}/`,
      "datePublished": post.date
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Intelligence", "item": "https://cryptoairdropai.com/blog/" }
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
            <span className="pill-badge" style={{ background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)", fontWeight: 700 }}>
              🧠 Research &amp; Market Intelligence
            </span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 800, letterSpacing: "-0.025em", margin: "8px 0 16px", fontFamily: "var(--font-serif)", color: "var(--text-bright)" }}>
            Crypto News &amp; Protocol Deep Dives
          </h1>
          <p style={{ fontSize: "1.15rem", color: "var(--text)", maxWidth: 720, lineHeight: 1.65, opacity: 0.88 }}>
            Fact-checked protocol walkthroughs, tokenomics breakdowns, and quantitative market intelligence.
          </p>
        </MotionFade>

        {/* 8K Article Card Grid */}
        <ArticleCardGrid articles={posts} basePath="/blog/" />
      </div>
    </section>
  );
}
