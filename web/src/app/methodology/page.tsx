import type { Metadata } from "next";
import Link from "next/link";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";
import ArticleCardGrid from "@/components/ArticleCardGrid";
import { getArticles } from "@/lib/contentStore";

export const metadata: Metadata = {
  title: "Evaluation Methodology & Protocol Risk Scoring Framework",
  description:
    "Discover how Crypto Airdrop AI researches, audits, and rates crypto airdrops, DeFi protocols, and smart contract distributions.",
  alternates: { canonical: "/methodology/" },
};

import MethodologyFrameworkView from "@/components/MethodologyFrameworkView";
import initialMethodologySteps from "@/data/methodology_framework.json";

export default async function MethodologyPage() {
  const articles = await getArticles("methodology");
  const steps = initialMethodologySteps;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Methodology", "item": "https://cryptoairdropai.com/methodology/" }
    ]
  };

  return (
    <section className="section" style={{ position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap" style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / Methodology &amp; Audit Framework
        </div>

        <MotionFade delay={0.05} direction="up" style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", marginBottom: 12 }}>
            <span className="pill-badge" style={{ background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)", fontWeight: 700 }}>
              🔬 Quantitative Protocol Evaluation
            </span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 800, letterSpacing: "-0.025em", margin: "8px 0 16px", fontFamily: "var(--font-serif)", color: "var(--text-bright)" }}>
            The 5-Stage Audit Framework
          </h1>
          <p style={{ fontSize: "1.15rem", color: "var(--text)", maxWidth: 720, margin: "0 auto", lineHeight: 1.65, opacity: 0.88 }}>
            Every crypto project cataloged on Crypto Airdrop AI must pass through our deterministic 5-stage cryptographic filter.
          </p>
        </MotionFade>

        {/* 5-Stage Framework Bento */}
        <MethodologyFrameworkView initialSteps={steps} />

        {/* 8K Methodology & Audit Articles Section */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                Security &amp; Audit Research Papers
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.92rem", margin: "4px 0 0", fontWeight: 500 }}>
                Deep forensic audits, bytecode analysis, and protocol risk score breakdowns
              </p>
            </div>
          </div>
          <ArticleCardGrid articles={articles} basePath="/methodology/" />
        </div>

        {/* Cross Links */}
        <MotionCard style={{ padding: 32, textAlign: "center", background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>Need to Report a Security Concern?</h3>
          <p style={{ color: "var(--text)", fontSize: "0.95rem", marginBottom: 20, opacity: 0.88 }}>
            Reach our Security Sentinel desk for expedited smart contract vulnerability reviews.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12 }}>
            <Link href="/editorial-policy/" className="btn btn-outline" style={{ fontSize: "0.85rem" }}>
              Editorial Charter
            </Link>
            <Link href="/contact/" className="btn btn-primary" style={{ fontSize: "0.85rem" }}>
              Submit Vulnerability
            </Link>
          </div>
        </MotionCard>
      </div>
    </section>
  );
}
