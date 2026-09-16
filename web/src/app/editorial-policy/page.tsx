import type { Metadata } from "next";
import Link from "next/link";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";
import ArticleCardGrid from "@/components/ArticleCardGrid";
import { getArticles } from "@/lib/contentStore";

export const metadata: Metadata = {
  title: "Editorial Policy & Fact-Checking Standards",
  description:
    "Explore the editorial guidelines, fact-checking methodology, corrections policy, and AI-assisted content ethics of Crypto Airdrop AI.",
  alternates: { canonical: "/editorial-policy/" },
};

import EditorialFrameworkView from "@/components/EditorialFrameworkView";
import initialEditorialPillars from "@/data/editorial_framework.json";

export default async function EditorialPolicyPage() {
  const articles = await getArticles("editorial");
  const steps = initialEditorialPillars;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Editorial Policy", "item": "https://cryptoairdropai.com/editorial-policy/" }
    ]
  };

  return (
    <section className="section" style={{ position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap" style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / Editorial Policy &amp; Standards
        </div>

        <MotionFade delay={0.05} direction="up" style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", marginBottom: 12 }}>
            <span className="pill-badge" style={{ background: "rgba(5, 150, 105, 0.08)", color: "var(--emerald)", fontWeight: 700 }}>
              🛡️ Integrity &amp; Transparency Mandate
            </span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 800, letterSpacing: "-0.025em", margin: "8px 0 16px", fontFamily: "var(--font-serif)", color: "var(--text-bright)" }}>
            Editorial Policy &amp; Ethics
          </h1>
          <p style={{ fontSize: "1.15rem", color: "var(--text)", maxWidth: 720, margin: "0 auto", lineHeight: 1.65, opacity: 0.88 }}>
            Our binding charter for fact-checking, zero sponsored listings, and algorithmic non-custodial research.
          </p>
        </MotionFade>

        {/* 4 Pillars Bento Grid */}
        <EditorialFrameworkView initialPillars={steps} />

        {/* 8K Editorial Articles Section */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                Editorial Integrity &amp; Ethics Publications
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.92rem", margin: "4px 0 0", fontWeight: 500 }}>
                Deep dives on crypto journalism standards, compliance, and regulatory disclosures
              </p>
            </div>
          </div>
          <ArticleCardGrid articles={articles} basePath="/editorial-policy/" />
        </div>

        {/* Accountability Statement */}
        <MotionCard style={{ padding: 32, textAlign: "center", background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 8, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>Found an Inaccuracy or Outdated Information?</h3>
          <p style={{ color: "var(--text)", fontSize: "0.95rem", maxWidth: 640, margin: "0 auto 20px", opacity: 0.88 }}>
            We guarantee a 24–48 hour turn-around for verified factual corrections.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12 }}>
            <Link href="/contact/" className="btn btn-primary" style={{ fontSize: "0.85rem" }}>
              Submit Correction to Editorial Desk
            </Link>
          </div>
        </MotionCard>
      </div>
    </section>
  );
}
