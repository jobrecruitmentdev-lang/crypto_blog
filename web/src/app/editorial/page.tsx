import type { Metadata } from "next";
import Link from "next/link";
import ArticleCardGrid from "@/components/ArticleCardGrid";
import { getArticles } from "@/lib/contentStore";
import { MotionFade } from "@/components/ui/MotionWrapper";

export const metadata: Metadata = {
  title: "Editorial Standards & Crypto Journalism Ethics",
  description: "Independent Web3 editorial standards, anti-shilling enforcement, and journalistic research principles.",
  alternates: { canonical: "/editorial/" },
};

export default async function EditorialHubPage() {
  const articles = await getArticles("editorial");

  return (
    <section className="section" style={{ position: "relative" }}>
      <div className="wrap">
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / Editorial
        </div>

        <MotionFade delay={0.05} direction="up" style={{ marginBottom: 40 }}>
          <div style={{ display: "inline-flex", marginBottom: 12 }}>
            <span className="pill-badge success">🛡️ Journalistic Integrity</span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 900, letterSpacing: "-0.03em", margin: "8px 0 16px" }}>
            Editorial Standards &amp; Publications
          </h1>
          <p style={{ fontSize: "1.15rem", color: "var(--muted)", maxWidth: 720, lineHeight: 1.6 }}>
            Our verified policies on non-financial advice, anti-shilling rules, and cryptographic source verification.
          </p>
        </MotionFade>

        <ArticleCardGrid articles={articles} basePath="/editorial-policy/" />
      </div>
    </section>
  );
}
