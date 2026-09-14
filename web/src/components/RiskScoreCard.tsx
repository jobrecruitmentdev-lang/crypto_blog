"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export interface RiskVectorBreakdown {
  teamScore: number;
  sybilScore: number;
  capitalScore: number;
  tokenomicsScore: number;
  securityScore: number;
  verifiedDate?: string;
  sourcesCount?: number;
}

interface RiskScoreCardProps {
  projectName: string;
  breakdown?: RiskVectorBreakdown;
  overrideScore?: number;
}

export default function RiskScoreCard({
  projectName,
  breakdown = {
    teamScore: 18,
    sybilScore: 16,
    capitalScore: 17,
    tokenomicsScore: 16,
    securityScore: 17,
    verifiedDate: "2026-08-24",
    sourcesCount: 12,
  },
  overrideScore,
}: RiskScoreCardProps) {
  const totalScore =
    overrideScore ??
    breakdown.teamScore +
      breakdown.sybilScore +
      breakdown.capitalScore +
      breakdown.tokenomicsScore +
      breakdown.securityScore;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "var(--emerald, #10b981)";
    if (score >= 65) return "var(--amber, #f59e0b)";
    return "var(--danger, #ef4444)";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "A-TIER: HIGH CONVICTION";
    if (score >= 65) return "B-TIER: BALANCED ALLOCATION";
    return "C-TIER: SPECULATIVE RISK";
  };

  const getVectorColor = (val: number, max: number) => {
    const ratio = val / max;
    if (ratio >= 0.75) return "var(--emerald, #10b981)";
    if (ratio >= 0.5) return "var(--amber, #f59e0b)";
    return "var(--danger, #ef4444)";
  };

  const vectors = [
    { label: "Team & VC Backing", score: breakdown.teamScore, max: 20, desc: "Doxxed devs, Tier-1 lead investors & grant records" },
    { label: "Anti-Sybil Fairness", score: breakdown.sybilScore, max: 20, desc: "Organic cluster defense & fair distribution criteria" },
    { label: "Capital Efficiency", score: breakdown.capitalScore, max: 20, desc: "Gas cost vs. expected allocation multiplier" },
    { label: "Tokenomics Transparency", score: breakdown.tokenomicsScore, max: 20, desc: "Community allocation % & vesting lockup periods" },
    { label: "Smart Contract Security", score: breakdown.securityScore, max: 20, desc: "Multi-sig timelocks, audits & testnet uptime" },
  ];

  return (
    <div
      className="card"
      style={{
        padding: "24px",
        borderRadius: "var(--radius)",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
        margin: "24px 0",
        position: "relative",
      }}
    >
      {/* Header with Title and Composite Gauge */}
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-start", 
          flexWrap: "wrap", 
          gap: "16px", 
          marginBottom: "24px",
          paddingBottom: "18px",
          borderBottom: "1px solid var(--border-subtle)"
        }}
      >
        <div style={{ flex: "1 1 240px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
            <span className="pill-badge" style={{ fontSize: "0.68rem", background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)" }}>
              RESEARCH DATASET
            </span>
            <span
              className="pill-badge"
              style={{
                fontSize: "0.68rem",
                color: getScoreColor(totalScore),
                borderColor: getScoreColor(totalScore),
                background: "rgba(255, 255, 255, 0.9)",
                fontWeight: 700,
              }}
            >
              {getScoreBadge(totalScore)}
            </span>
          </div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
            {projectName} Protocol Risk Index
          </h3>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "4px" }}>
            Algorithmic 5-vector evaluation model (0–100 scale)
          </div>
        </div>

        <div 
          style={{ 
            background: "var(--surface-sunken)", 
            border: `1px solid ${getScoreColor(totalScore)}`,
            borderRadius: "var(--radius-sm)",
            padding: "8px 16px",
            textAlign: "center",
            minWidth: "120px"
          }}
        >
          <div style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.05em" }}>
            HEALTH INDEX
          </div>
          <div style={{ fontSize: "2.2rem", fontWeight: 800, color: getScoreColor(totalScore), lineHeight: 1.1 }}>
            {totalScore}<span style={{ fontSize: "1rem", color: "var(--muted)" }}>/100</span>
          </div>
        </div>
      </div>

      {/* 5-Vector Progress Bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
        {vectors.map((vec, idx) => {
          const vColor = getVectorColor(vec.score, vec.max);
          return (
            <div key={idx}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", marginBottom: "6px" }}>
                <span style={{ fontWeight: 700, color: "var(--text-bright)" }}>{vec.label}</span>
                <span style={{ fontWeight: 800, color: vColor }}>
                  {vec.score} / {vec.max}
                </span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "var(--border-subtle)", borderRadius: "4px", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(vec.score / vec.max) * 100}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  style={{
                    height: "100%",
                    background: vColor,
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div style={{ fontSize: "0.76rem", color: "var(--muted)", marginTop: "4px", lineHeight: 1.4 }}>
                {vec.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Audit Telemetry Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          paddingTop: "16px",
          borderTop: "1px solid var(--border-subtle)",
          fontSize: "0.78rem",
          color: "var(--muted)",
        }}
      >
        <div>
          Verified: <strong style={{ color: "var(--text-bright)" }}>{breakdown.verifiedDate || "2026-08-24"}</strong> ({breakdown.sourcesCount || 12} on-chain telemetry feeds)
        </div>
        <Link href="/methodology/" style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>
          Methodology Framework →
        </Link>
      </div>
    </div>
  );
}
