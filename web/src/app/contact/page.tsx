import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";

export const metadata: Metadata = {
  title: "Contact Us — Editorial Desk, Security & Inquiries",
  description:
    "Get in touch with Crypto Airdrop AI. Submit editorial corrections, submit new airdrops for review, or reach our security desk.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Crypto Airdrop AI",
    "url": "https://cryptoairdropai.com/contact",
    "description": "Official contact hub for Crypto Airdrop AI editorial, support, and business inquiries.",
    "mainEntity": {
      "@type": "Organization",
      "name": "Crypto Airdrop AI",
      "url": "https://cryptoairdropai.com",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "email": "editorial@cryptoairdropai.com",
          "contactType": "Editorial & Corrections Desk",
          "availableLanguage": ["English"]
        },
        {
          "@type": "ContactPoint",
          "email": "security@cryptoairdropai.com",
          "contactType": "Security & Vulnerability Reporting",
          "availableLanguage": ["English"]
        },
        {
          "@type": "ContactPoint",
          "email": "contact@cryptoairdropai.com",
          "contactType": "General Inquiries & Submissions",
          "availableLanguage": ["English"]
        }
      ]
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Contact Us", "item": "https://cryptoairdropai.com/contact" }
    ]
  };

  const inboxes = [
    {
      title: "Editorial & Fact-Checking",
      email: "editorial@cryptoairdropai.com",
      desc: "Report outdated snapshot deadlines, incorrect step instructions, or submit factual corrections.",
      badge: "24–48h SLA",
    },
    {
      title: "Security & Vulnerability",
      email: "security@cryptoairdropai.com",
      desc: "Report malicious proxy contracts, phishing clones, or protocol exploits for immediate delisting.",
      badge: "Priority Queue",
    },
    {
      title: "Protocol Submissions",
      email: "submissions@cryptoairdropai.com",
      desc: "Submit your decentralized application or token distribution campaign for evaluation.",
      badge: "Open Ingestion",
    },
  ];

  return (
    <section className="section" style={{ position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap" style={{ maxWidth: 940, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / Contact Us
        </div>

        <MotionFade delay={0.05} direction="up" style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", marginBottom: 12 }}>
            <span className="pill-badge" style={{ background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)", fontWeight: 700 }}>
              ✉️ Dedicated Research Inboxes
            </span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 800, letterSpacing: "-0.025em", margin: "8px 0 16px", fontFamily: "var(--font-serif)", color: "var(--text-bright)" }}>
            Contact &amp; Corrections Hub
          </h1>
          <p style={{ fontSize: "1.2rem", color: "var(--text)", maxWidth: 680, margin: "0 auto", lineHeight: 1.65, opacity: 0.88 }}>
            Reach our research desk, submit protocol updates, or flag smart contract vulnerabilities.
          </p>
        </MotionFade>

        {/* 8K Dedicated Communication Nexus Banner */}
        <div 
          style={{ 
            position: "relative", 
            width: "100%", 
            aspectRatio: "21/9", 
            borderRadius: "14px", 
            overflow: "hidden", 
            marginBottom: 44,
            border: "1px solid var(--border)",
            boxShadow: "0 6px 24px rgba(0, 0, 0, 0.05)"
          }}
        >
          <Image
            src="/images/generated/editorial-integrity-charter-and-fact-checking-code-featured-v2.jpg"
            alt="Crypto Airdrop AI Dedicated Research Inboxes"
            fill
            priority
            sizes="(max-width: 940px) 100vw, 940px"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Dedicated Channels */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 48 }}>
          {inboxes.map((item, idx) => (
            <MotionCard key={idx} style={{ padding: 28, background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span className="pill-badge success" style={{ fontSize: "0.72rem" }}>{item.badge}</span>
              </div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 8px", color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>{item.title}</h2>
              <a href={`mailto:${item.email}`} style={{ color: "var(--accent)", fontWeight: 700, fontSize: "0.95rem", display: "block", marginBottom: 12, textDecoration: "none" }}>
                {item.email}
              </a>
              <p style={{ color: "var(--text)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0, opacity: 0.88 }}>
                {item.desc}
              </p>
            </MotionCard>
          ))}
        </div>

        {/* Interactive Form Section */}
        <MotionCard style={{ padding: 36, marginBottom: 48, background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 8, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
            Send an Encrypted Inquiry
          </h2>
          <p style={{ color: "var(--text)", fontSize: "0.95rem", marginBottom: 28, opacity: 0.88 }}>
            Our team reviews every submission with on-chain simulation tools.
          </p>
          <ContactForm />
        </MotionCard>

        {/* Cross Link Footer */}
        <MotionCard style={{ padding: 32, textAlign: "center", background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>Learn More About Our Standards</h3>
          <p style={{ color: "var(--text)", fontSize: "0.95rem", marginBottom: 20, opacity: 0.88 }}>
            Discover our vetting criteria or read our full editorial disclosure.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12 }}>
            <Link href="/editorial-policy/" className="btn btn-outline" style={{ fontSize: "0.85rem" }}>
              📖 Editorial Policy
            </Link>
            <Link href="/methodology/" className="btn btn-primary" style={{ fontSize: "0.85rem" }}>
              🔬 Evaluation Methodology
            </Link>
          </div>
        </MotionCard>
      </div>
    </section>
  );
}
