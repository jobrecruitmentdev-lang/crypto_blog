"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Airdrop } from "@/lib/types";
import AirdropCard from "./AirdropCard";

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "ALL DEPLOYMENTS" },
  { key: "ongoing", label: "ONGOING" },
  { key: "confirmed", label: "CONFIRMED DROPS" },
  { key: "easy", label: "EASY" },
  { key: "medium", label: "MEDIUM" },
];

export default function FilterableGrid({ airdrops }: { airdrops: Airdrop[] }) {
  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    if (active === "all") return airdrops;
    return airdrops.filter(
      (a) =>
        a.status.some((s) => s.toLowerCase() === active) ||
        a.difficulty.toLowerCase() === active
    );
  }, [airdrops, active]);

  return (
    <>
      <div
        className="filter-bar"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 24,
          padding: "6px",
          background: "rgba(10, 17, 34, 0.6)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        {FILTERS.map((f) => {
          const isSelected = active === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              type="button"
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: isSelected ? "1px solid var(--cyan)" : "1px solid transparent",
                background: isSelected ? "var(--cyan-glow)" : "transparent",
                color: isSelected ? "var(--cyan)" : "var(--muted)",
                fontSize: "0.78rem",
                fontWeight: 800,
                letterSpacing: "0.05em",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              [{f.label}]
            </button>
          );
        })}
      </div>

      <motion.div
        layout
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
          gap: 20,
        }}
      >
        <AnimatePresence>
          {filtered.map((a) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              key={a.slug}
            >
              <AirdropCard airdrop={a} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
