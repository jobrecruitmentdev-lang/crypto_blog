import type { Metadata } from "next";
import Link from "next/link";
import FilterableGrid from "@/components/FilterableGrid";
import { AIRDROPS } from "@/lib/data";
import { MotionFade } from "@/components/ui/MotionWrapper";

export const metadata: Metadata = {
  title: "Verified Crypto Airdrop Deployments 2026 — On-Chain Intelligence",
  description: "Comprehensive directory of verified crypto token airdrops, testnet farming tutorials, and retroactive rewards across 50+ blockchain ecosystems.",
  alternates: { canonical: "/projects/" },
};

export default function ProjectsPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Verified Crypto Airdrop Deployments & Intelligence",
    "url": "https://cryptoairdropai.com/projects/",
    "description": "Directory of fact-checked crypto token airdrops, protocols, and testnet reward deployments.",
    "hasPart": AIRDROPS.map((a) => ({
      "@type": "Article",
      "headline": `${a.name} Airdrop Farming Guide`,
      "description": a.desc,
      "url": `https://cryptoairdropai.com/projects/${a.slug}/`
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Projects", "item": "https://cryptoairdropai.com/projects/" }
    ]
  };

  return (
    <section className="section" style={{ position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap">
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / Verified Airdrop Projects
        </div>

        <MotionFade delay={0.05} direction="up" style={{ marginBottom: 32 }}>
          <div style={{ display: "inline-flex", marginBottom: 12 }}>
            <span className="pill-badge gold">⚡ Web3 Research Directory</span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 900, letterSpacing: "-0.03em", margin: "8px 0 16px" }}>
            Verified Crypto Airdrop Deployments
          </h1>
          <p style={{ fontSize: "1.15rem", color: "var(--muted)", maxWidth: 760, lineHeight: 1.6 }}>
            Fact-checked airdrops, testnet task lists, and protocol reward schedules. All deployments undergo contract risk audits and Sybil resistance evaluations before listing.
          </p>
        </MotionFade>

        {/* Interactive Filterable Grid with Guaranteed Static Anchor Links */}
        <FilterableGrid airdrops={AIRDROPS} />
      </div>
    </section>
  );
}
