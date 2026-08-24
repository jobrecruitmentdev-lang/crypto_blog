"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Airdrop } from "@/lib/types";

function initials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

export default function AirdropCard({ airdrop }: { airdrop: Airdrop }) {
  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.985 }}
      className="tui-panel"
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        height: "100%",
      }}
    >
      <div>
        {/* Top Status & Heat Telemetry */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {airdrop.status.map((s) => (
              <span
                key={s}
                className={`pill-badge ${s.toLowerCase() === "confirmed" ? "success" : "gold"}`}
                style={{ fontSize: "0.68rem", padding: "2px 6px" }}
              >
                [{s}]
              </span>
            ))}
          </div>
          <div 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "4px", 
              fontSize: "0.82rem", 
              fontWeight: 800, 
              color: "var(--amber)", 
              fontFamily: "monospace" 
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 23c6.075 0 11-4.925 11-11 0-4.004-2.143-7.509-5.357-9.429a1 1 0 00-1.428 1.144c.484 2.18-.328 4.285-1.929 5.285C13.286 9.625 13 8 13 6c0-2.5-1.5-4.5-3-5a1 1 0 00-1.286 1.286C9.286 4.5 9 6.5 8 8c-1.5 2.25-3 4.25-3 7 0 4.418 3.134 8 7 8z"/>
            </svg>
            <span>HEAT: {airdrop.heat}°</span>
          </div>
        </div>

        {/* Project Identity */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "8px",
              background: "rgba(0, 240, 255, 0.08)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "1rem",
              color: "var(--cyan)",
              fontFamily: "monospace",
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            {initials(airdrop.name)}
          </div>
          <div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0, color: "var(--text-bright)" }}>
              <Link href={`/projects/${airdrop.slug}/`} style={{ textDecoration: "none" }}>
                {airdrop.name}
              </Link>
            </h3>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "monospace", marginTop: "2px" }}>
              CHAIN: <span style={{ color: "var(--text)" }}>{airdrop.chain}</span> · <span style={{ color: "var(--emerald)" }}>{airdrop.difficulty}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.5, marginBottom: "16px" }}>
          {airdrop.desc}
        </p>
      </div>

      {/* Reward Metrics & Call to Action */}
      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            background: "rgba(0, 240, 255, 0.02)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-sm)",
            padding: "8px 12px",
            marginBottom: "14px",
            fontFamily: "monospace",
          }}
        >
          <div>
            <span style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>EST. REWARD</span>
            <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--cyan)", marginTop: "2px" }}>{airdrop.reward}</div>
          </div>
          <div>
            <span style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>TIME COMMIT</span>
            <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--text)", marginTop: "2px" }}>{airdrop.time}</div>
          </div>
        </div>

        <Link 
          href={`/projects/${airdrop.slug}/`} 
          className="btn btn-sm btn-primary" 
          style={{ width: "100%", display: "inline-flex", minHeight: "40px" }}
        >
          Step-by-Step Guide →
        </Link>
      </div>
    </motion.div>
  );
}
