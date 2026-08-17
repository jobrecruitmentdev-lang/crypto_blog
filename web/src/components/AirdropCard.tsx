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
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card"
      style={{
        padding: 24,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {airdrop.status.map((s) => (
              <span
                key={s}
                className={`pill-badge ${s.toLowerCase() === "confirmed" ? "success" : "gold"}`}
                style={{ fontSize: "0.7rem", padding: "2px 8px" }}
              >
                {s}
              </span>
            ))}
          </div>
          <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--danger)" }}>
            🔥 {airdrop.heat}°
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              background: "linear-gradient(135deg, rgba(124, 92, 255, 0.2), rgba(0, 224, 164, 0.2))",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "1.1rem",
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {initials(airdrop.name)}
          </div>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--text)" }}>
              <Link href={`/projects/${airdrop.slug}`}>{airdrop.name}</Link>
            </h3>
            <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
              {airdrop.chain} · <span style={{ color: "var(--accent2)" }}>{airdrop.difficulty}</span>
            </div>
          </div>
        </div>

        <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: 18 }}>
          {airdrop.desc}
        </p>
      </div>

      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            padding: "10px 14px",
            marginBottom: 16,
          }}
        >
          <div>
            <span style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>Est. Reward</span>
            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--accent)" }}>{airdrop.reward}</div>
          </div>
          <div>
            <span style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>Time Required</span>
            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text)" }}>{airdrop.time}</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href={`/projects/${airdrop.slug}`} className="btn btn-sm btn-primary" style={{ width: "100%" }}>
            View Step-by-Step Guide →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
