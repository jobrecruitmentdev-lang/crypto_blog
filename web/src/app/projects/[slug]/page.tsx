import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AIRDROPS, getAirdropBySlug, getRelatedAirdrops } from "@/lib/data";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";
import RiskScoreCard from "@/components/RiskScoreCard";

function initials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

export function generateStaticParams() {
  return AIRDROPS.map((a) => ({ slug: a.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const airdrop = getAirdropBySlug(slug);
  if (!airdrop) return {};
  return {
    title: `${airdrop.name} Airdrop Guide & Farming Strategy — Crypto Airdrop AI`,
    description: `${airdrop.name} airdrop farming guide: verified rewards, difficulty, step-by-step testnet and mainnet actions.`,
    alternates: { canonical: `/projects/${slug}/` },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const airdrop = getAirdropBySlug(slug);
  if (!airdrop) notFound();

  const related = getRelatedAirdrops(airdrop);
  const steps = [
    `Go to the official ${airdrop.name} verified portal or dApp interface.`,
    `Connect a dedicated non-custodial Web3 wallet (MetaMask, Rabby, or Phantom).`,
    `Execute the protocol interaction: ${airdrop.desc.toLowerCase()}`,
    `Maintain periodic activity — transacting once or twice weekly rather than in a single cluster.`,
    `Monitor official Discord or X announcement channels for official snapshot block height updates.`,
  ];

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${airdrop.name} Airdrop Guide & Review`,
    "description": airdrop.desc,
    "url": `https://cryptoairdropai.com/projects/${slug}`,
    "publisher": {
      "@type": "Organization",
      "name": "Crypto Airdrop AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cryptoairdropai.com/logo-primary.svg"
      }
    },
    "author": {
      "@type": "Organization",
      "name": "Crypto Airdrop AI Research Desk",
      "url": "https://cryptoairdropai.com/authors/editorial-desk"
    }
  };

  return (
    <section className="section" style={{ position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />

      <div className="wrap" style={{ maxWidth: 940, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / <Link href="/">Airdrops</Link> / {airdrop.name}
        </div>

        {/* Hero Card with Telemetry Header */}
        <MotionCard style={{ padding: 36, marginBottom: 36 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: "linear-gradient(135deg, rgba(124, 92, 255, 0.25), rgba(0, 224, 164, 0.25))",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                {initials(airdrop.name)}
              </div>
              <div>
                <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  {airdrop.status.map((s) => (
                    <span key={s} className={`pill-badge ${s.toLowerCase() === "confirmed" ? "success" : "gold"}`} style={{ fontSize: "0.72rem" }}>
                      {s}
                    </span>
                  ))}
                </div>
                <h1 style={{ fontSize: "2.4rem", fontWeight: 900, letterSpacing: "-0.03em", margin: 0 }}>
                  {airdrop.name}
                </h1>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--danger)" }}>
                🔥 Heat Index: {airdrop.heat}°
              </span>
            </div>
          </div>

          <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: 28 }}>
            {airdrop.desc}
          </p>

          {/* Telemetry Matrix Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, background: "rgba(255,255,255,0.02)", padding: 20, borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>Chain</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)" }}>{airdrop.chain}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>Est. Reward</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--accent)" }}>{airdrop.reward}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>Difficulty</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--accent2)" }}>{airdrop.difficulty}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>Time Est.</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)" }}>{airdrop.time}</div>
            </div>
          </div>
        </MotionCard>

        {/* Proprietary 5-Vector Protocol Risk & Opportunity Scorecard */}
        <RiskScoreCard projectName={airdrop.name} />

        {/* Step by Step Action Checklist */}
        <MotionCard style={{ padding: 36, marginBottom: 36 }}>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 8 }}>
            Step-by-Step Farming Actions
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginBottom: 24 }}>
            Execute each step sequentially to maximize on-chain organic interaction points.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {steps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                  padding: 16,
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "var(--cyan-glow)",
                    color: "var(--cyan)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    flexShrink: 0,
                    fontFamily: "monospace",
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ fontSize: "1rem", color: "var(--text)", lineHeight: 1.6, paddingTop: 2 }}>
                  {step}
                </div>
              </div>
            ))}
          </div>

          {/* Essential Security & Prerequisite Interlinks */}
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--border-subtle)" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: 12, color: "var(--cyan)", fontFamily: "monospace" }}>
              [ REQUIRED PREREQUISITES &amp; SECURITY GUIDES ]
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
              <Link href="/guides/setting-up-a-farming-wallet" className="tui-panel" style={{ padding: "12px 16px", textDecoration: "none" }}>
                <span className="pill-badge success" style={{ fontSize: "0.65rem", marginBottom: 4 }}>SECURITY</span>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>Wallet Isolation Manual →</div>
              </Link>
              <Link href="/guides/avoiding-sybil-detection" className="tui-panel" style={{ padding: "12px 16px", textDecoration: "none" }}>
                <span className="pill-badge gold" style={{ fontSize: "0.65rem", marginBottom: 4 }}>ANTI-SYBIL</span>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>Sybil Defense Guide →</div>
              </Link>
              <Link href="/methodology" className="tui-panel" style={{ padding: "12px 16px", textDecoration: "none" }}>
                <span className="pill-badge" style={{ fontSize: "0.65rem", marginBottom: 4 }}>EVALUATION</span>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>How We Rated {airdrop.name} →</div>
              </Link>
            </div>
          </div>
        </MotionCard>

        {/* Related Airdrops */}
        {related.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 20 }}>
              Similar Vetted Opportunities on {airdrop.chain}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
              {related.map((r) => (
                <MotionCard key={r.slug} style={{ padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span className="pill-badge" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>{r.chain}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--danger)", fontWeight: 700 }}>🔥 {r.heat}°</span>
                  </div>
                  <h4 style={{ fontSize: "1.15rem", fontWeight: 800, margin: "4px 0 8px" }}>
                    <Link href={`/projects/${r.slug}`}>{r.name}</Link>
                  </h4>
                  <p style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.5, marginBottom: 14 }}>
                    {r.desc}
                  </p>
                  <Link href={`/projects/${r.slug}`} className="btn btn-sm btn-outline" style={{ width: "100%" }}>
                    View Guide →
                  </Link>
                </MotionCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
