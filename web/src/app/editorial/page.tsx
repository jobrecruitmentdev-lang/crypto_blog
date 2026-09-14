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
            <span className="pill-badge" style={{ background: "rgba(5, 150, 105, 0.08)", color: "var(--emerald)", fontWeight: 700 }}>
              🛡️ Journalistic Integrity
            </span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 800, letterSpacing: "-0.025em", margin: "8px 0 16px", fontFamily: "var(--font-serif)", color: "var(--text-bright)" }}>
            Editorial Standards &amp; Publications
          </h1>
          <p style={{ fontSize: "1.15rem", color: "var(--text)", maxWidth: 720, lineHeight: 1.65, opacity: 0.88 }}>
            Our verified policies on non-financial advice, anti-shilling rules, and cryptographic source verification.
          </p>
        </MotionFade>

        <ArticleCardGrid articles={articles} basePath="/editorial-policy/" />
      </div>
    </section>
  );
}
