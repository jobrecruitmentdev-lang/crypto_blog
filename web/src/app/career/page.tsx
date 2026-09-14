import type { Metadata } from "next";
import Link from "next/link";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";

export const metadata: Metadata = {
  title: "Careers & Open Positions — Join Crypto Airdrop AI",
  description:
    "Explore open career opportunities, Web3 engineering roles, and research positions at Crypto Airdrop AI and partner entities.",
  alternates: { canonical: "/career/" },
};

export default function CareerPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Career", "item": "https://cryptoairdropai.com/career/" },
    ],
  };

  return (
    <section className="section" style={{ position: "relative" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="wrap" style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / Career
        </div>

        <MotionFade delay={0.05} direction="up" style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", marginBottom: 12 }}>
            <span className="pill-badge success">💼 Open Opportunities</span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 900, letterSpacing: "-0.03em", margin: "8px 0 16px" }}>
            Careers &amp; Opportunities
          </h1>
          <p style={{ fontSize: "1.15rem", color: "var(--muted)", maxWidth: 680, margin: "0 auto", lineHeight: 1.6 }}>
            Join our mission to bring cryptographic verification, real-time analytics, and transparent research to decentralized ecosystems.
          </p>
        </MotionFade>

        {/* PR Marketing Careers Widget for Apex Pvt Limited */}
        <MotionCard style={{ padding: "32px 24px", marginBottom: 48, background: "rgba(10, 17, 34, 0.75)", border: "1px solid var(--border)", minHeight: "450px" }}>
          {/* PR Marketing Careers Widget for Apex Pvt Limited */}
          <div id="crm-careers" data-company="apex-pvt-limited" style={{ minHeight: "400px", width: "100%" }} />
          <script src="https://prmarketingventures.com/assets/career-widget.js" async></script>
        </MotionCard>

        {/* Culture & Benefits Bento Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 48 }}>
          <MotionCard style={{ padding: 24 }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>🌐</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8 }}>Global &amp; Remote-First</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.6, margin: 0 }}>
              Work autonomously from anywhere in the world. We value deep work, output, and cryptographic precision over arbitrary hours.
            </p>
          </MotionCard>

          <MotionCard style={{ padding: 24 }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>⚡</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8 }}>Cutting-Edge Tech Stack</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.6, margin: 0 }}>
              Build high-performance distributed scrapers, indexing pipelines, and real-time Web3 security tools across 50+ blockchains.
            </p>
          </MotionCard>

          <MotionCard style={{ padding: 24 }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>📈</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8 }}>Rapid Career Growth</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.6, margin: 0 }}>
              Collaborate directly with senior engineers, protocol researchers, and growth leads in high-impact Web3 initiatives.
            </p>
          </MotionCard>
        </div>

        {/* Trust & Standards Link Hub */}
        <MotionCard style={{ padding: 28, textAlign: "center" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8 }}>Have Questions About Working With Us?</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginBottom: 20 }}>
            Learn more about our organizational standards or reach our talent team.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12 }}>
            <Link href="/about/" className="btn btn-outline" style={{ fontSize: "0.85rem" }}>
              About Us &amp; Mission
            </Link>
            <Link href="/editorial-policy/" className="btn btn-outline" style={{ fontSize: "0.85rem" }}>
              Editorial Standards
            </Link>
            <Link href="/contact/" className="btn btn-primary" style={{ fontSize: "0.85rem" }}>
              Contact Editorial Desk
            </Link>
          </div>
        </MotionCard>
      </div>
    </section>
  );
}
