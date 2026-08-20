import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import { FAQS } from "@/lib/data";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Crypto Airdrops & Security",
  description: "Frequently asked questions about crypto airdrops, how to farm retroactive rewards, and how to protect your assets on-chain.",
  alternates: { canonical: "/faq/" },
};

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "FAQ", "item": "https://cryptoairdropai.com/faq" }
    ]
  };

  return (
    <section className="section" style={{ position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap" style={{ maxWidth: 860, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / FAQ
        </div>

        <MotionFade delay={0.05} direction="up" style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", marginBottom: 12 }}>
            <span className="pill-badge">❓ Direct Answers</span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 900, letterSpacing: "-0.03em", margin: "8px 0 16px" }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: "1.15rem", color: "var(--muted)", maxWidth: 620, margin: "0 auto", lineHeight: 1.6 }}>
            Clarifying airdrop criteria, sybil prevention, gas costs, and how to verify smart contracts safely.
          </p>
        </MotionFade>

        {/* Interactive Accordion */}
        <FaqAccordion faqs={FAQS} />

        {/* Support Callout */}
        <MotionCard style={{ marginTop: 56, padding: 32, textAlign: "center" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 8 }}>
            Still have an unanswered question?
          </h3>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginBottom: 20 }}>
            Reach our research and editorial desk directly for contract inquiries or technical clarifications.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <Link href="/contact" className="btn btn-primary btn-sm">
              Contact Desk
            </Link>
            <Link href="/methodology" className="btn btn-outline btn-sm">
              View Audit Methodology
            </Link>
          </div>
        </MotionCard>
      </div>
    </section>
  );
}
