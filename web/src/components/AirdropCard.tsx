"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Airdrop, ProjectItem } from "@/lib/types";

function initials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

export default function AirdropCard({ airdrop }: { airdrop: Airdrop | ProjectItem }) {
  const projectItem = airdrop as ProjectItem;
  const imageSrc = projectItem.featuredImage || `/images/generated/${airdrop.slug}-project.jpg`;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.985 }}
      style={{
        background: "#FFFFFF",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        height: "100%",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div>
        {/* Top Status & Heat */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {airdrop.status.map((s) => (
              <span
                key={s}
                className={`pill-badge ${s.toLowerCase() === "confirmed" ? "gold" : "success"}`}
                style={{ fontSize: "0.68rem", padding: "3px 8px" }}
              >
                {s}
              </span>
            ))}
          </div>
          <div 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "4px", 
              fontSize: "0.8rem", 
              fontWeight: 700, 
              color: "var(--amber)", 
              fontFamily: "var(--font-mono)" 
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 23c6.075 0 11-4.925 11-11 0-4.004-2.143-7.509-5.357-9.429a1 1 0 00-1.428 1.144c.484 2.18-.328 4.285-1.929 5.285C13.286 9.625 13 8 13 6c0-2.5-1.5-4.5-3-5a1 1 0 00-1.286 1.286C9.286 4.5 9 6.5 8 8c-1.5 2.25-3 4.25-3 7 0 4.418 3.134 8 7 8z"/>
            </svg>
            <span>HEAT: {airdrop.heat}°</span>
          </div>
        </div>

        {/* Project Identity */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "10px",
              background: "var(--bg-alt)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "1rem",
              color: "var(--cyan)",
              fontFamily: "var(--font-mono)",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <img
              src={imageSrc}
              alt={airdrop.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                // Fallback to text initials
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <span style={{ position: "absolute" }}>{initials(airdrop.name)}</span>
          </div>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--text-bright)", fontFamily: "var(--font-sans)" }}>
              <Link href={`/projects/${airdrop.slug}/`} style={{ textDecoration: "none", color: "inherit" }}>
                {airdrop.name}
              </Link>
            </h3>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "2px", fontFamily: "var(--font-sans)" }}>
              <span>{airdrop.chain}</span> · <span style={{ color: "var(--emerald)", fontWeight: 600 }}>{airdrop.difficulty}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "18px" }}>
          {airdrop.desc}
        </p>
      </div>

      {/* Reward Metrics & Call to Action */}
      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            background: "var(--bg-alt)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            padding: "10px 14px",
            marginBottom: "16px",
          }}
        >
          <div>
            <span style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700 }}>
              EST. REWARD
            </span>
            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--emerald)", marginTop: "2px" }}>
              {airdrop.reward}
            </div>
          </div>
          <div>
            <span style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700 }}>
              TIME COMMIT
            </span>
            <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text-bright)", marginTop: "2px" }}>
              {airdrop.time}
            </div>
          </div>
        </div>

        <Link 
          href={`/projects/${airdrop.slug}/`} 
          className="btn btn-sm btn-primary" 
          style={{ width: "100%", display: "inline-flex", minHeight: "40px" }}
        >
          View Farming Strategy →
        </Link>
      </div>
    </motion.div>
  );
}
