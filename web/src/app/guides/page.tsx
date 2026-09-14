import type { Metadata } from "next";
import Link from "next/link";
import ArticleCardGrid from "@/components/ArticleCardGrid";
import { getArticles } from "@/lib/contentStore";
import { GUIDES } from "@/lib/data";
import { MotionFade } from "@/components/ui/MotionWrapper";

export const metadata: Metadata = {
  title: "Airdrop & Layer-2 Farming Guides — Step-by-Step Tutorials",
  description: "Step-by-step guides covering non-custodial wallet setup, bridging, snapshot mechanics, and sybil-safe farming strategies.",
  alternates: { canonical: "/guides/" },
};

export default async function GuidesPage() {
  let guides = await getArticles("guides");
  if (!guides || guides.length === 0) {
    // fallback to GUIDES mapped to Article
    guides = GUIDES.map((g) => ({
      slug: g.slug,
      pageType: "guides",
      tag: "Farming Playbook",
      title: g.title,
      excerpt: g.desc,
      tldr: g.desc,
      keyTakeaways: ["Follow multi-wallet hygiene", "Execute weekly transaction cadence"],
      date: "2026-08-20",
      read: "6 min read",
      authorSlug: g.authorSlug || "ai-intelligence-engine",
      body: g.body,
      featuredImage: `/images/generated/${g.slug}-featured.jpg`,
      middleImage: `/images/generated/${g.slug}-middle.jpg`,
      preFaqImage: `/images/generated/${g.slug}-pre_faq.jpg`,
      faqs: [
        { question: "How to avoid sybil detection?", answer: "Do not fund multiple wallets from the exact same centralized exchange address at the same timestamp." }
      ]
    }));
  }

  const guideCollectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Crypto Airdrop AI Step-by-Step Guides",
    "url": "https://cryptoairdropai.com/guides/",
    "description": "Educational guides for on-chain crypto security, testnet farming, and snapshot eligibility.",
    "hasPart": guides.map((g) => ({
      "@type": "HowTo",
      "name": g.title,
      "description": g.excerpt,
      "url": `https://cryptoairdropai.com/guides/${g.slug}/`
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://cryptoairdropai.com/guides/" }
    ]
  };

  return (
    <section className="section" style={{ position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideCollectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap">
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / Guides &amp; Tutorials
        </div>

        <MotionFade delay={0.05} direction="up" style={{ marginBottom: 40 }}>
          <div style={{ display: "inline-flex", marginBottom: 12 }}>
            <span className="pill-badge" style={{ background: "rgba(5, 150, 105, 0.08)", color: "var(--emerald)", fontWeight: 700 }}>
              📖 Practical On-Chain Playbooks
            </span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 800, letterSpacing: "-0.025em", margin: "8px 0 16px", fontFamily: "var(--font-serif)", color: "var(--text-bright)" }}>
            Airdrop &amp; DeFi Strategy Guides
          </h1>
          <p style={{ fontSize: "1.15rem", color: "var(--text)", maxWidth: 720, lineHeight: 1.65, opacity: 0.88 }}>
            Step-by-step walkthroughs to interact with smart contracts safely, optimize gas fees, and avoid sybil clustering.
          </p>
        </MotionFade>

        {/* 8K Guides Card Grid */}
        <ArticleCardGrid articles={guides} basePath="/guides/" />
      </div>
    </section>
  );
}
