"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Airdrop, ProjectItem } from "@/lib/types";
import AirdropCard from "./AirdropCard";

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "ALL DEPLOYMENTS" },
  { key: "confirmed", label: "CONFIRMED" },
  { key: "solana", label: "SOLANA" },
  { key: "ethereum", label: "EVM & L2" },
  { key: "testnet", label: "TESTNET (FREE)" },
  { key: "depin", label: "DEPIN & AI" },
  { key: "easy", label: "EASY ENTRY" },
];

function matchesFilter(a: Airdrop | ProjectItem, key: string): boolean {
  if (key === "all") return true;
  if (key === "confirmed") {
    return a.status.some((s) => s.toLowerCase() === "confirmed");
  }
  if (key === "easy") {
    return a.difficulty.toLowerCase() === "easy";
  }
  if (key === "solana") {
    const chain = (a.chain || "").toLowerCase();
    const tags = (a.tags || []).map((t) => t.toLowerCase());
    return chain.includes("solana") || tags.includes("solana");
  }
  if (key === "ethereum") {
    const chain = (a.chain || "").toLowerCase();
    const tags = (a.tags || []).map((t) => t.toLowerCase());
    return (
      chain.includes("eth") ||
      chain.includes("arbitrum") ||
      chain.includes("optimism") ||
      chain.includes("base") ||
      chain.includes("blast") ||
      chain.includes("scroll") ||
      chain.includes("linea") ||
      chain.includes("zksync") ||
      chain.includes("polygon") ||
      tags.some((t) => t.includes("l2") || t.includes("evm") || t.includes("ethereum"))
    );
  }
  if (key === "testnet") {
    const desc = (a.desc || "").toLowerCase();
    const tags = (a.tags || []).map((t) => t.toLowerCase());
    const reward = (a.reward || "").toLowerCase();
    return (
      tags.some((t) => t.includes("testnet") || t.includes("free")) ||
      desc.includes("testnet") ||
      reward.includes("free")
    );
  }
  if (key === "depin") {
    const desc = (a.desc || "").toLowerCase();
    const tags = (a.tags || []).map((t) => t.toLowerCase());
    const name = (a.name || "").toLowerCase();
    return (
      tags.some((t) => t.includes("depin") || t.includes("ai")) ||
      desc.includes("depin") ||
      desc.includes("ai") ||
      name.includes("depin") ||
      name.includes("grass") ||
      name.includes("io.net") ||
      name.includes("gensyn")
    );
  }
  return (
    a.status.some((s) => s.toLowerCase() === key) ||
    a.difficulty.toLowerCase() === key
  );
}

export default function FilterableGrid({ airdrops }: { airdrops: (Airdrop | ProjectItem)[] }) {
  const [active, setActive] = useState("all");
  const [liveAirdrops, setLiveAirdrops] = useState<(Airdrop | ProjectItem)[]>(airdrops);

  useEffect(() => {
    async function syncLatest() {
      try {
        const apiBase = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
          ? "https://cryptoairdropai.com/api"
          : "/api";
        const res = await fetch(`${apiBase}/projects.php`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.projects) && data.projects.length > 0) {
            setLiveAirdrops(data.projects);
          }
        }
      } catch (e) {
        // silent fallback to pre-rendered
      }
    }
    syncLatest();
  }, []);

  const filtered = useMemo(() => {
    return liveAirdrops.filter((a) => matchesFilter(a, active));
  }, [liveAirdrops, active]);

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { all: liveAirdrops.length };
    for (const f of FILTERS) {
      if (f.key === "all") continue;
      counts[f.key] = liveAirdrops.filter((a) => matchesFilter(a, f.key)).length;
    }
    return counts;
  }, [liveAirdrops]);

  return (
    <>
      {/* CoinTracking-Style Horizontal Scroll Filter Tabs */}
      <div
        style={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          paddingBottom: "8px",
          marginBottom: "24px",
          scrollbarWidth: "none",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            gap: "8px",
            padding: "6px",
            background: "#FFFFFF",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            minWidth: "max-content",
          }}
          role="tablist"
          aria-label="Filter airdrops by status or difficulty"
        >
          {FILTERS.map((f) => {
            const isSelected = active === f.key;
            const count = filterCounts[f.key] || 0;
            return (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                type="button"
                role="tab"
                aria-selected={isSelected}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: isSelected ? "1px solid var(--cyan)" : "1px solid transparent",
                  background: isSelected ? "var(--cyan)" : "transparent",
                  color: isSelected ? "#FFFFFF" : "var(--muted)",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                }}
              >
                <span>{f.label}</span>
                <span
                  style={{
                    fontSize: "0.72rem",
                    padding: "2px 7px",
                    borderRadius: "10px",
                    background: isSelected ? "rgba(255, 255, 255, 0.25)" : "var(--bg-subtle)",
                    color: isSelected ? "#FFFFFF" : "var(--muted)",
                    fontWeight: 700,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid with cards */}
      {filtered.length === 0 ? (
        <div
          style={{
            padding: "48px 24px",
            textAlign: "center",
            margin: "20px 0",
            background: "#FFFFFF",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🔍</div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "8px" }}>No Protocols Found</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", maxWidth: "400px", margin: "0 auto 16px" }}>
            No airdrop opportunities match the active filter criteria. Reset the filter to browse all verified protocols.
          </p>
          <button onClick={() => setActive("all")} className="btn btn-sm btn-primary">
            Reset Filters
          </button>
        </div>
      ) : (
        <motion.div
          layout
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: 24,
          }}
        >
          <AnimatePresence>
            {filtered.map((a) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                key={a.slug}
              >
                <AirdropCard airdrop={a} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}
