import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, getGuideBySlug, getAuthorBySlug } from "@/lib/data";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: `${guide.title} — Step-by-Step Guide`,
    description: guide.desc,
    alternates: { canonical: `/guides/${slug}/` },
    openGraph: {
      title: `${guide.title} | Crypto Airdrop AI Guide`,
      description: guide.desc,
      type: "article",
      url: `https://cryptoairdropai.com/guides/${slug}`,
    }
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const author = getAuthorBySlug(guide.authorSlug || "security-sentinel-ai");

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://cryptoairdropai.com/guides" },
      { "@type": "ListItem", "position": 3, "name": guide.title, "item": `https://cryptoairdropai.com/guides/${slug}` }
    ]
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `https://cryptoairdropai.com/guides/${slug}#howto`,
    "name": guide.title,
    "description": guide.desc,
    "totalTime": "PT15M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "author": {
      "@type": "Person",
      "name": author?.name || "Security Sentinel AI",
      "url": `https://cryptoairdropai.com/authors/${author?.slug || 'security-sentinel-ai'}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Crypto Airdrop AI",
      "url": "https://cryptoairdropai.com",
      "logo": "https://cryptoairdropai.com/logo-primary.svg"
    }
  };

  return (
    <section className="section" style={{ position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <div className="wrap post-body" style={{ maxWidth: 860, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 24, fontSize: "0.9rem", color: "var(--muted)" }}>
          <Link href="/">Home</Link> / <Link href="/guides">Guides</Link> / <span style={{ color: "var(--text)" }}>{guide.title}</span>
        </div>

        <MotionFade delay={0.05} direction="up">
          <div style={{ display: "inline-flex", marginBottom: 14 }}>
            <span className="pill-badge success">{guide.level} Tutorial</span>
          </div>

          <h1 style={{ fontSize: "2.6rem", lineHeight: 1.15, marginBottom: 16, fontWeight: 900, letterSpacing: "-0.025em" }}>
            {guide.title}
          </h1>

          <p style={{ color: "var(--muted)", fontSize: "1.1rem", lineHeight: 1.6, marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
            {guide.desc}
          </p>
        </MotionFade>

        {/* Main Body */}
        <div className="post-content" dangerouslySetInnerHTML={{ __html: guide.body }} style={{ fontSize: "1.08rem", lineHeight: 1.75 }} />

        {/* Security Warning */}
        <MotionCard style={{ marginTop: 48, padding: 28, borderLeft: "4px solid var(--amber)" }}>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: 8, color: "var(--amber)" }}>
            ⚠️ Safe Execution Rules &amp; Non-Custodial Protocol
          </h3>
          <p style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.6, margin: 0 }}>
            Never approve infinite token spends on new contracts. Maintain separate hot wallets for testing unverified dApps, and disconnect your wallet from sites when finished.
          </p>
        </MotionCard>

        {/* Cross Navigation */}
        <div style={{ marginTop: 40, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <Link href="/guides" className="btn btn-outline btn-sm">
            ← Back to All Guides
          </Link>
          <Link href="/methodology" className="btn btn-primary btn-sm">
            Our Vetting Methodology →
          </Link>
        </div>
      </div>
    </section>
  );
}
