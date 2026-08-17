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
      className="tui-panel"
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
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
          <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--amber)", fontFamily: "monospace" }}>
            🔥 HEAT: {airdrop.heat}°
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
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
          >
            {initials(airdrop.name)}
          </div>
          <div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0, color: "var(--text-bright)" }}>
              <Link href={`/projects/${airdrop.slug}`}>{airdrop.name}</Link>
            </h3>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "monospace" }}>
              CHAIN: {airdrop.chain} · <span style={{ color: "var(--emerald)" }}>{airdrop.difficulty}</span>
            </div>
          </div>
        </div>

        <p style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.5, marginBottom: 16 }}>
          {airdrop.desc}
        </p>
      </div>

      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            background: "rgba(0, 240, 255, 0.02)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-sm)",
            padding: "8px 12px",
            marginBottom: 14,
            fontFamily: "monospace",
          }}
        >
          <div>
            <span style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase" }}>REWARD</span>
            <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--cyan)" }}>{airdrop.reward}</div>
          </div>
          <div>
            <span style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase" }}>TIME</span>
            <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text)" }}>{airdrop.time}</div>
          </div>
        </div>

        <Link href={`/projects/${airdrop.slug}`} className="btn btn-sm btn-primary" style={{ width: "100%" }}>
          Step-by-Step Guide →
        </Link>
      </div>
    </motion.div>
  );
}
