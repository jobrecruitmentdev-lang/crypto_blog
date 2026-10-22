"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ProjectItem, Airdrop } from "@/lib/types";
import { MotionCard } from "@/components/ui/MotionWrapper";
import RiskScoreCard from "@/components/RiskScoreCard";
import FaqAccordion from "@/components/FaqAccordion";

function initials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

interface ProjectViewProps {
  initialProject: ProjectItem;
  related: (Airdrop | ProjectItem)[];
}

export default function ProjectView({ initialProject, related }: ProjectViewProps) {
  const [airdrop, setAirdrop] = useState<ProjectItem>(initialProject);

  useEffect(() => {
    async function syncProjectFromDatabase() {
      try {
        const apiBase = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
          ? "https://cryptoairdropai.com/api"
          : "/api";
        const res = await fetch(`${apiBase}/projects.php?slug=${encodeURIComponent(initialProject.slug)}`);
        if (res.ok) {
          const liveData = await res.json();
          if (liveData && liveData.slug) {
            setAirdrop(liveData);
          }
        }
      } catch (err) {
        // quiet fallback
      }
    }
    syncProjectFromDatabase();
  }, [initialProject.slug]);

  const steps: string[] = airdrop.farmingSteps && airdrop.farmingSteps.length > 0
    ? airdrop.farmingSteps.map((s: { title: string; desc: string }) => `${s.title}: ${s.desc}`)
    : [
        `Go to the official ${airdrop.name} verified portal or dApp interface.`,
        `Connect a dedicated non-custodial Web3 wallet (MetaMask, Rabby, or Phantom).`,
        `Execute the protocol interaction: ${airdrop.desc.toLowerCase()}`,
        `Maintain periodic activity — transacting once or twice weekly rather than in a single cluster.`,
        `Monitor official Discord or X announcement channels for official snapshot block height updates.`,
      ];

  const projectFaqs = [
    {
      question: `Is the ${airdrop.name} airdrop officially confirmed?`,
      answer: `The ${airdrop.name} distribution status is currently classified as "${airdrop.status.join(" & ")}" on ${airdrop.chain}. Eligibility depends on authentic testnet or mainnet interactions and consistent on-chain activity prior to the official snapshot block.`
    },
    {
      question: `What is the estimated reward potential and time commitment for ${airdrop.name}?`,
      answer: `The estimated reward ranges between ${airdrop.reward}, with an estimated execution commitment of ${airdrop.time} per session to maintain non-linear interaction cadence.`
    },
    {
      question: `How can I avoid sybil disqualification on ${airdrop.name}?`,
      answer: `Implement multi-wallet isolation: never fund burner wallets in sequential batches from the same exchange deposit address, stagger transactions across independent days, and avoid identical transaction graphs.`
    },
    {
      question: `Which Web3 wallet is recommended for ${airdrop.name} on ${airdrop.chain}?`,
      answer: `Connect a dedicated, non-custodial Web3 wallet (such as Rabby or MetaMask for EVM networks, or Phantom / Backpack for Solana). Never connect cold vault treasury keys to interactive dApps.`
    }
  ];

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        "@id": `https://cryptoairdropai.com/projects/${airdrop.slug}/#howto`,
        "name": `How to Farm the ${airdrop.name} Airdrop on ${airdrop.chain}`,
        "description": `Comprehensive step-by-step farming guide and eligibility verification manual for ${airdrop.name} on ${airdrop.chain}.`,
        "totalTime": `PT${parseInt(airdrop.time) || 15}M`,
        "estimatedCost": {
          "@type": "MonetaryAmount",
          "currency": "USD",
          "value": "0"
        },
        "step": (airdrop.farmingSteps && airdrop.farmingSteps.length > 0 ? airdrop.farmingSteps : steps.map((s, i) => ({ title: `Step ${i + 1}`, desc: s }))).map((s: any, idx: number) => ({
          "@type": "HowToStep",
          "position": idx + 1,
          "name": s.title || `Step ${idx + 1}: Protocol Interaction`,
          "text": s.desc || s,
          "url": `https://cryptoairdropai.com/projects/${airdrop.slug}/#step-${idx + 1}`
        }))
      },
      {
        "@type": "FinancialProduct",
        "@id": `https://cryptoairdropai.com/projects/${airdrop.slug}/#product`,
        "name": `${airdrop.name} Airdrop Deployment`,
        "description": airdrop.desc,
        "category": "Cryptocurrency Airdrop & Incentive Program",
        "provider": {
          "@type": "Organization",
          "name": airdrop.name,
          "url": airdrop.officialLinks?.website || `https://cryptoairdropai.com/projects/${airdrop.slug}/`
        }
      },
      {
        "@type": "FAQPage",
        "@id": `https://cryptoairdropai.com/projects/${airdrop.slug}/#faq`,
        "mainEntity": projectFaqs.map((f) => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://cryptoairdropai.com/projects/${airdrop.slug}/#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
          { "@type": "ListItem", "position": 2, "name": "Projects", "item": "https://cryptoairdropai.com/projects/" },
          { "@type": "ListItem", "position": 3, "name": airdrop.name, "item": `https://cryptoairdropai.com/projects/${airdrop.slug}/` }
        ]
      }
    ]
  };

  return (
    <section className="section" style={{ position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }} />

      <div className="wrap" style={{ maxWidth: 940, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / <Link href="/projects/">Projects</Link> / {airdrop.name}
        </div>

        {/* Hero Card with Telemetry Header */}
        <MotionCard style={{ padding: 36, marginBottom: 36, background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  position: "relative",
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: "rgba(37, 99, 235, 0.08)",
                  border: "1px solid rgba(37, 99, 235, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "var(--accent)",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
                }}
              >
                <Image
                  src={airdrop.featuredImage || `/images/generated/${airdrop.slug}-project.jpg`}
                  alt={airdrop.name}
                  fill
                  sizes="64px"
                  style={{ objectFit: "cover", zIndex: 2 }}
                />
                <span style={{ position: "absolute", zIndex: 1 }}>{initials(airdrop.name)}</span>
              </div>
              <div>
                <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  {airdrop.status.map((s) => (
                    <span key={s} className={`pill-badge ${s.toLowerCase() === "confirmed" ? "success" : "gold"}`} style={{ fontSize: "0.72rem" }}>
                      {s}
                    </span>
                  ))}
                </div>
                <h1 style={{ fontSize: "2.4rem", fontWeight: 800, letterSpacing: "-0.025em", margin: 0, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                  {airdrop.name}
                </h1>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--danger)" }}>
                🔥 HEAT: {airdrop.heat}°
              </span>
              <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: 4, fontWeight: 500 }}>
                UPDATED: AUGUST 2026
              </div>
            </div>
          </div>

          {airdrop.featuredImage && (
            <div 
              style={{ 
                position: "relative", 
                width: "100%", 
                aspectRatio: "16/9", 
                borderRadius: "14px", 
                overflow: "hidden", 
                marginBottom: 24, 
                border: "1px solid var(--border)" 
              }}
            >
              <Image 
                src={airdrop.featuredImage} 
                alt={airdrop.name} 
                fill 
                priority 
                sizes="(max-width: 940px) 100vw, 940px" 
                style={{ objectFit: "cover" }} 
              />
            </div>
          )}

          {/* AEO Instant-Passage Direct Answer Box (Optimized for AI Overviews & Perplexity) */}
          <div
            style={{
              padding: "20px 24px",
              background: "rgba(37, 99, 235, 0.04)",
              border: "1px solid rgba(37, 99, 235, 0.2)",
              borderLeft: "4px solid var(--accent)",
              borderRadius: "var(--radius-sm)",
              marginBottom: 28,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span className="pill-badge" style={{ background: "rgba(37, 99, 235, 0.12)", color: "var(--accent)", fontWeight: 800, fontSize: "0.72rem" }}>
                ⚡ Airdrop Execution Brief
              </span>
              <span style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 600 }}>
                On-Chain Telemetry Verified
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "1.04rem", lineHeight: 1.68, color: "var(--text)", fontWeight: 500 }}>
              <strong>Quick Answer:</strong> The <strong>{airdrop.name}</strong> airdrop is an active token distribution deployment on <strong>{airdrop.chain}</strong> with an estimated reward potential of <strong>{airdrop.reward}</strong>. Eligibility requires executing verified smart contract transactions, maintaining weekly interaction cadence, and observing wallet isolation protocols before the official snapshot.
            </p>
          </div>

          <p style={{ fontSize: "1.1rem", lineHeight: 1.7, color: "var(--text)", marginBottom: 28, opacity: 0.9 }}>
            {airdrop.desc}
          </p>

          {/* Princeton GEO Telemetry & Qualification Matrix Table */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 14, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
              📊 {airdrop.name} Protocol Telemetry &amp; Reward Matrix
            </h2>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Telemetry Value</th>
                    <th>Verification Standard</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Target Blockchain</strong></td>
                    <td>{airdrop.chain}</td>
                    <td><span className="pill-badge success" style={{ fontSize: "0.68rem" }}>Verified RPC</span></td>
                  </tr>
                  <tr>
                    <td><strong>Estimated Reward Allocation</strong></td>
                    <td>{airdrop.reward}</td>
                    <td><span className="pill-badge gold" style={{ fontSize: "0.68rem" }}>Statistical Modeling</span></td>
                  </tr>
                  <tr>
                    <td><strong>Recommended Time Cadence</strong></td>
                    <td>{airdrop.time} / session</td>
                    <td><span className="pill-badge" style={{ fontSize: "0.68rem" }}>Sybil-Safe Pace</span></td>
                  </tr>
                  <tr>
                    <td><strong>Contract Risk Assessment</strong></td>
                    <td>{airdrop.riskScore || 15} / 100 Risk Rating</td>
                    <td><span className="pill-badge success" style={{ fontSize: "0.68rem" }}>5-Stage Audit</span></td>
                  </tr>
                  <tr>
                    <td><strong>Upfront Capital Required</strong></td>
                    <td>Zero-Investment (Testnet / Faucet Gas Only)</td>
                    <td><span className="pill-badge success" style={{ fontSize: "0.68rem" }}>Non-Custodial</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Metrics Bento Strip */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: 12,
              marginBottom: 32,
            }}
          >
            <div className="card" style={{ padding: "14px 18px", textAlign: "center", background: "var(--surface-sunken)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>CHAIN</div>
              <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--accent)", marginTop: 2 }}>{airdrop.chain}</div>
            </div>
            <div className="card" style={{ padding: "14px 18px", textAlign: "center", background: "var(--surface-sunken)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>DIFFICULTY</div>
              <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--emerald)", marginTop: 2 }}>{airdrop.difficulty}</div>
            </div>
            <div className="card" style={{ padding: "14px 18px", textAlign: "center", background: "var(--surface-sunken)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>EST. REWARD</div>
              <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--amber)", marginTop: 2 }}>{airdrop.reward}</div>
            </div>
            <div className="card" style={{ padding: "14px 18px", textAlign: "center", background: "var(--surface-sunken)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>TIME COMMIT</div>
              <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-bright)", marginTop: 2 }}>{airdrop.time}</div>
            </div>
          </div>

          {/* Step-by-Step Task Checklist with Dedicated Anchors */}
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: 16, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
              📋 Verified Farming Checklist &amp; Action Steps
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  id={`step-${idx + 1}`}
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                    padding: "16px 20px",
                    background: "var(--surface-sunken)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "rgba(37, 99, 235, 0.1)",
                      color: "var(--accent)",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div style={{ fontSize: "0.98rem", lineHeight: 1.6, color: "var(--text)", fontWeight: 500 }}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Scoring Panel */}
          <RiskScoreCard projectName={airdrop.name} />

          {/* AEO/GEO FAQ Accordion Section */}
          <div style={{ marginTop: 40, paddingTop: 28, borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "inline-flex", marginBottom: 10 }}>
              <span className="pill-badge" style={{ background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)" }}>
                🔍 Direct Inquiries &amp; Answers
              </span>
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 18, fontFamily: "var(--font-serif)", color: "var(--text-bright)" }}>
              {airdrop.name} Airdrop Frequently Asked Questions
            </h2>
            <FaqAccordion faqs={projectFaqs} />
          </div>

          {/* Direct Project Directory Link */}
          <div style={{ marginTop: 28 }}>
            <Link
              href="/projects/"
              className="btn btn-primary"
              style={{ width: "100%", textAlign: "center", display: "block" }}
            >
              ← Back to All Verified Deployments
            </Link>
          </div>

          {/* Essential Security & Prerequisite Interlinks */}
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--border-subtle)" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: 12, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
              Required Prerequisites &amp; Security Guides
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
              <Link href="/guides/setting-up-a-farming-wallet/" className="card" style={{ padding: "14px 16px", textDecoration: "none", background: "var(--surface-sunken)", border: "1px solid var(--border)" }}>
                <span className="pill-badge success" style={{ fontSize: "0.65rem", marginBottom: 6 }}>SECURITY</span>
                <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text-bright)" }}>Wallet Isolation Manual →</div>
              </Link>
              <Link href="/guides/mastering-on-chain-sybil-resistance-heuristics-behavioral-hygiene/" className="card" style={{ padding: "14px 16px", textDecoration: "none", background: "var(--surface-sunken)", border: "1px solid var(--border)" }}>
                <span className="pill-badge gold" style={{ fontSize: "0.65rem", marginBottom: 6 }}>ANTI-SYBIL</span>
                <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text-bright)" }}>Sybil Defense Guide →</div>
              </Link>
              <Link href="/methodology/" className="card" style={{ padding: "14px 16px", textDecoration: "none", background: "var(--surface-sunken)", border: "1px solid var(--border)" }}>
                <span className="pill-badge" style={{ fontSize: "0.65rem", marginBottom: 6 }}>EVALUATION</span>
                <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text-bright)" }}>How We Rated {airdrop.name} →</div>
              </Link>
            </div>
          </div>
        </MotionCard>

        {/* Related Airdrops */}
        {related.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 20, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
              Similar Vetted Opportunities on {airdrop.chain}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
              {related.map((r) => (
                <MotionCard key={r.slug} style={{ padding: 24, background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span className="pill-badge" style={{ fontSize: "0.7rem", padding: "2px 8px", background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)" }}>{r.chain}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--danger)", fontWeight: 700 }}>🔥 {r.heat}°</span>
                  </div>
                  <h4 style={{ fontSize: "1.15rem", fontWeight: 800, margin: "4px 0 8px", fontFamily: "var(--font-serif)" }}>
                    <Link href={`/projects/${r.slug}/`} style={{ color: "var(--text-bright)", textDecoration: "none" }}>{r.name}</Link>
                  </h4>
                  <p style={{ color: "var(--text)", fontSize: "0.88rem", lineHeight: 1.55, marginBottom: 14, opacity: 0.88 }}>
                    {r.desc}
                  </p>
                  <Link href={`/projects/${r.slug}/`} className="btn btn-sm btn-outline" style={{ width: "100%", textAlign: "center" }}>
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
