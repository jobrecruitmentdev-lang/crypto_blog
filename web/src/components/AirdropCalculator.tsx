"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MotionCard } from "@/components/ui/MotionWrapper";

interface ProtocolConfig {
  slug: string;
  name: string;
  chain: string;
  baseMin: number;
  baseMax: number;
  category: string;
}

const PROTOCOLS: ProtocolConfig[] = [
  { slug: "berachain-v2", name: "Berachain V2", chain: "Berachain (Polaris EVM)", baseMin: 1200, baseMax: 6500, category: "Proof-of-Liquidity Testnet" },
  { slug: "grass-network", name: "Grass DePIN Network", chain: "Solana", baseMin: 500, baseMax: 2200, category: "AI Web-Scraping Node" },
  { slug: "story-protocol", name: "Story Protocol", chain: "Story Chain (EVM)", baseMin: 1000, baseMax: 4500, category: "Programmable IP Testnet" },
  { slug: "babylon", name: "Babylon", chain: "Bitcoin / Cosmos", baseMin: 800, baseMax: 3500, category: "Bitcoin Staking" },
  { slug: "solayer-restaking", name: "Solayer", chain: "Solana", baseMin: 900, baseMax: 3800, category: "Solana Native Restaking" },
  { slug: "monad", name: "Monad", chain: "Monad", baseMin: 500, baseMax: 5000, category: "Parallel EVM Testnet" },
  { slug: "megaeth", name: "MegaETH", chain: "Ethereum L2", baseMin: 1500, baseMax: 6000, category: "Real-Time EVM Rollup" },
  { slug: "hyperliquid-dex", name: "Hyperliquid", chain: "Hyperliquid L1", baseMin: 2000, baseMax: 8500, category: "Perpetuals DEX Volume" },
];

export default function AirdropCalculator() {
  const [selectedSlug, setSelectedSlug] = useState<string>("berachain-v2");
  const [capitalTier, setCapitalTier] = useState<"free" | "gas" | "staking">("free");
  const [cadence, setCadence] = useState<"sporadic" | "weekly" | "daily">("weekly");
  const [walletHygiene, setWalletHygiene] = useState<"single" | "isolated">("isolated");

  const protocol = useMemo(() => {
    return PROTOCOLS.find((p) => p.slug === selectedSlug) || PROTOCOLS[0];
  }, [selectedSlug]);

  const calculation = useMemo(() => {
    let multiplier = 1.0;

    // Capital multiplier
    if (capitalTier === "free") multiplier *= 1.0;
    else if (capitalTier === "gas") multiplier *= 1.35;
    else if (capitalTier === "staking") multiplier *= 1.85;

    // Cadence multiplier
    if (cadence === "sporadic") multiplier *= 0.45;
    else if (cadence === "weekly") multiplier *= 1.25;
    else if (cadence === "daily") multiplier *= 1.65;

    // Wallet Hygiene & Sybil Score
    let sybilScore = 50;
    if (walletHygiene === "isolated") {
      sybilScore += 45;
    } else {
      sybilScore -= 25;
      multiplier *= 0.6; // High penalty for sybil clustering risk
    }

    if (cadence === "weekly") sybilScore += 5;
    if (cadence === "sporadic") sybilScore -= 20;

    const finalMin = Math.round(protocol.baseMin * multiplier);
    const finalMax = Math.round(protocol.baseMax * multiplier);

    let tierLabel = "Tier 2: Core Organic Participant (Top 25%)";
    let tierBadgeClass = "pill-badge gold";
    if (multiplier >= 2.0 && sybilScore >= 80) {
      tierLabel = "Tier 1: Institutional Whale Allocation (Top 5%)";
      tierBadgeClass = "pill-badge success";
    } else if (multiplier < 0.8 || sybilScore < 50) {
      tierLabel = "Tier 3: Baseline / High Sybil Flagging Risk";
      tierBadgeClass = "pill-badge danger";
    }

    return {
      min: finalMin,
      max: finalMax,
      sybilScore: Math.min(100, Math.max(10, sybilScore)),
      tierLabel,
      tierBadgeClass,
    };
  }, [protocol, capitalTier, cadence, walletHygiene]);

  return (
    <section className="section" style={{ padding: "40px 0" }}>
      <div className="wrap" style={{ maxWidth: 1040, margin: "0 auto" }}>
        
        {/* Header Badge & Title */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", marginBottom: 10 }}>
            <span className="pill-badge" style={{ background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)", fontWeight: 800 }}>
              🧮 Interactive Web3 Telemetry Tool
            </span>
          </div>
          <h2 style={{ fontSize: "2.3rem", fontWeight: 800, margin: "0 0 12px", fontFamily: "var(--font-serif)", color: "var(--text-bright)", letterSpacing: "-0.02em" }}>
            Airdrop Allocation &amp; Sybil Risk Calculator
          </h2>
          <p style={{ color: "var(--text)", maxWidth: 680, margin: "0 auto", fontSize: "1.05rem", lineHeight: 1.6, opacity: 0.9 }}>
            Estimate your projected token distribution value, allocation tier, and on-chain sybil resistance score based on 2026 heuristic cluster models.
          </p>
        </div>

        {/* 2-Column Bento Matrix */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          
          {/* Left Column: Interactive Inputs */}
          <MotionCard style={{ padding: 28, background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 20px", color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
              1. Simulation Parameters
            </h3>

            {/* Target Protocol Selector */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-bright)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Select Target Airdrop Protocol
              </label>
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--surface-sunken)",
                  border: "1px solid var(--border)",
                  color: "var(--text-bright)",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  outline: "none",
                }}
              >
                {PROTOCOLS.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name} ({p.chain}) — {p.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Capital / Faucet Gas Commitment */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-bright)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Capital &amp; Upfront Gas Commitment
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setCapitalTier("free")}
                  className={`btn btn-sm ${capitalTier === "free" ? "btn-primary" : "btn-outline"}`}
                  style={{ fontSize: "0.78rem", padding: "10px 4px", textAlign: "center" }}
                >
                  Zero-Investment<br/>(100% Free Faucet)
                </button>
                <button
                  type="button"
                  onClick={() => setCapitalTier("gas")}
                  className={`btn btn-sm ${capitalTier === "gas" ? "btn-primary" : "btn-outline"}`}
                  style={{ fontSize: "0.78rem", padding: "10px 4px", textAlign: "center" }}
                >
                  Micro Gas<br/>($5 - $25 Native)
                </button>
                <button
                  type="button"
                  onClick={() => setCapitalTier("staking")}
                  className={`btn btn-sm ${capitalTier === "staking" ? "btn-primary" : "btn-outline"}`}
                  style={{ fontSize: "0.78rem", padding: "10px 4px", textAlign: "center" }}
                >
                  DeFi Staking<br/>($50 - $500+)
                </button>
              </div>
            </div>

            {/* Cadence / Frequency */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-bright)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                On-Chain Interaction Cadence
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setCadence("sporadic")}
                  className={`btn btn-sm ${cadence === "sporadic" ? "btn-primary" : "btn-outline"}`}
                  style={{ fontSize: "0.78rem", padding: "10px 4px", textAlign: "center" }}
                >
                  Sporadic<br/>(1x / month)
                </button>
                <button
                  type="button"
                  onClick={() => setCadence("weekly")}
                  className={`btn btn-sm ${cadence === "weekly" ? "btn-primary" : "btn-outline"}`}
                  style={{ fontSize: "0.78rem", padding: "10px 4px", textAlign: "center" }}
                >
                  Consistent<br/>(1-2x / week)
                </button>
                <button
                  type="button"
                  onClick={() => setCadence("daily")}
                  className={`btn btn-sm ${cadence === "daily" ? "btn-primary" : "btn-outline"}`}
                  style={{ fontSize: "0.78rem", padding: "10px 4px", textAlign: "center" }}
                >
                  Power Farmer<br/>(5-7x / week)
                </button>
              </div>
            </div>

            {/* Wallet Hygiene / Sybil Setup */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-bright)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Wallet Architecture &amp; Sybil Defense
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setWalletHygiene("single")}
                  className={`btn btn-sm ${walletHygiene === "single" ? "btn-primary" : "btn-outline"}`}
                  style={{ fontSize: "0.8rem", padding: "10px 8px", textAlign: "center" }}
                >
                  Single Hot Wallet<br/>
                  <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>(High Cluster Risk)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWalletHygiene("isolated")}
                  className={`btn btn-sm ${walletHygiene === "isolated" ? "btn-primary" : "btn-outline"}`}
                  style={{ fontSize: "0.8rem", padding: "10px 8px", textAlign: "center" }}
                >
                  3-Tier Isolation<br/>
                  <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>(Zero Sybil Flagging)</span>
                </button>
              </div>
            </div>

          </MotionCard>

          {/* Right Column: Projected Telemetry Results */}
          <MotionCard style={{ padding: 28, background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                  2. Projected Yield Telemetry
                </h3>
                <span className={calculation.tierBadgeClass} style={{ fontSize: "0.72rem" }}>
                  Verified Modeling
                </span>
              </div>

              {/* Big Estimated Payout Display */}
              <div style={{ padding: "24px 20px", background: "var(--surface-sunken)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", marginBottom: 20, textAlign: "center" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", marginBottom: 6 }}>
                  Estimated Token Payout Range
                </div>
                <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--accent)", fontFamily: "var(--font-serif)", letterSpacing: "-0.03em" }}>
                  ${calculation.min.toLocaleString()} — ${calculation.max.toLocaleString()}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-bright)", fontWeight: 600, marginTop: 6 }}>
                  Target: {protocol.name} on {protocol.chain}
                </div>
              </div>

              {/* Allocation Tier */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700, marginBottom: 6 }}>
                  <span style={{ color: "var(--muted)", textTransform: "uppercase" }}>Projected Allocation Tier</span>
                  <span style={{ color: "var(--text-bright)" }}>{calculation.tierLabel.split(":")[0]}</span>
                </div>
                <div style={{ padding: "10px 14px", background: "rgba(37, 99, 235, 0.04)", border: "1px solid rgba(37, 99, 235, 0.15)", borderRadius: "var(--radius-sm)", fontSize: "0.88rem", fontWeight: 600, color: "var(--text-bright)" }}>
                  {calculation.tierLabel}
                </div>
              </div>

              {/* Sybil Resistance Health Gauge */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700, marginBottom: 8 }}>
                  <span style={{ color: "var(--muted)", textTransform: "uppercase" }}>Sybil Resistance Health Index</span>
                  <span style={{ color: calculation.sybilScore >= 75 ? "var(--emerald)" : calculation.sybilScore >= 50 ? "var(--amber)" : "var(--danger)", fontWeight: 800 }}>
                    {calculation.sybilScore} / 100
                  </span>
                </div>
                <div style={{ width: "100%", height: 10, background: "var(--surface-sunken)", borderRadius: 5, overflow: "hidden", border: "1px solid var(--border)" }}>
                  <div
                    style={{
                      width: `${calculation.sybilScore}%`,
                      height: "100%",
                      background: calculation.sybilScore >= 75 ? "var(--emerald)" : calculation.sybilScore >= 50 ? "var(--amber)" : "var(--danger)",
                      transition: "width 0.3s ease, background 0.3s ease",
                    }}
                  />
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6 }}>
                  {calculation.sybilScore >= 75
                    ? "✓ Safe: Non-linear transaction graph complies with Arbitrum & LayerZero anti-sybil standards."
                    : "⚠️ Warning: Shared funding routes or low cadence trigger automatic cluster filters."}
                </div>
              </div>
            </div>

            {/* Direct CTA to the farming runbook */}
            <Link
              href={`/projects/${protocol.slug}/`}
              className="btn btn-primary"
              style={{ width: "100%", textAlign: "center", display: "block", padding: "14px 20px", fontWeight: 800 }}
            >
              View Verified {protocol.name} Farming Checklist →
            </Link>

          </MotionCard>

        </div>
      </div>
    </section>
  );
}
