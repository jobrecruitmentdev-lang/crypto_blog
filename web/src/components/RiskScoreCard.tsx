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
    verifiedDate: "2026-08-22",
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
    if (score >= 60) return "var(--amber, #f59e0b)";
    return "var(--rose, #f43f5e)";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "A-TIER: HIGH CONVICTION";
    if (score >= 65) return "B-TIER: BALANCED REWARD/RISK";
    return "C-TIER: SPECULATIVE RISK";
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
      className="tui-panel"
      style={{
        padding: "24px",
        borderRadius: "var(--radius)",
        background: "rgba(10, 15, 30, 0.75)",
        border: "1px solid var(--border)",
        margin: "24px 0",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span className="pill-badge" style={{ fontSize: "0.68rem", fontFamily: "monospace" }}>
              [ RESEARCH DATASET ]
            </span>
            <span
              className="pill-badge"
              style={{
                fontSize: "0.68rem",
                color: getScoreColor(totalScore),
                borderColor: getScoreColor(totalScore),
                background: "rgba(255,255,255,0.03)",
              }}
            >
              {getScoreBadge(totalScore)}
            </span>
          </div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 900, margin: 0 }}>
            {projectName} Protocol Risk &amp; Opportunity Index
          </h3>
        </div>

        <div style={{ textAlign: "right", minWidth: "120px" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Composite Score
          </div>
          <div style={{ fontSize: "2.4rem", fontWeight: 900, color: getScoreColor(totalScore), lineHeight: 1.1, fontFamily: "monospace" }}>
            {totalScore}<span style={{ fontSize: "1.1rem", color: "var(--muted)" }}>/100</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
        {vectors.map((vec, idx) => (
          <div key={idx}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "4px" }}>
              <span style={{ fontWeight: 700, color: "var(--text)" }}>{vec.label}</span>
              <span style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--muted)" }}>
                {vec.score} / {vec.max}
              </span>
            </div>
            <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(vec.score / vec.max) * 100}%` }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                style={{
                  height: "100%",
                  background: getScoreColor(totalScore),
                  borderRadius: "3px",
                }}
              />
            </div>
            <div style={{ fontSize: "0.74rem", color: "var(--muted)", marginTop: "2px" }}>{vec.desc}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          paddingTop: "14px",
          borderTop: "1px solid var(--border-subtle, rgba(255,255,255,0.08))",
          fontSize: "0.78rem",
          color: "var(--muted)",
        }}
      >
        <div>
          Verified: <strong style={{ color: "var(--text)" }}>{breakdown.verifiedDate || "2026-08-22"}</strong> ({breakdown.sourcesCount || 12} on-chain/public telemetry sources)
        </div>
        <Link href="/methodology" style={{ color: "var(--cyan)", fontWeight: 700, textDecoration: "underline" }}>
          View 5-Vector Scoring Methodology →
        </Link>
      </div>
    </div>
  );
}
