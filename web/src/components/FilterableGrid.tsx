"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Airdrop, ProjectItem } from "@/lib/types";
import AirdropCard from "./AirdropCard";

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "ALL" },
  { key: "ongoing", label: "ONGOING" },
  { key: "confirmed", label: "CONFIRMED" },
  { key: "easy", label: "EASY ENTRY" },
  { key: "medium", label: "MEDIUM" },
];

export default function FilterableGrid({ airdrops }: { airdrops: (Airdrop | ProjectItem)[] }) {
  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    if (active === "all") return airdrops;
    return airdrops.filter(
      (a) =>
        a.status.some((s) => s.toLowerCase() === active) ||
        a.difficulty.toLowerCase() === active
    );
  }, [airdrops, active]);

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { all: airdrops.length };
    for (const f of FILTERS) {
      if (f.key === "all") continue;
      counts[f.key] = airdrops.filter(
        (a) =>
          a.status.some((s) => s.toLowerCase() === f.key) ||
          a.difficulty.toLowerCase() === f.key
      ).length;
    }
    return counts;
  }, [airdrops]);

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
