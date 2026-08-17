"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Guide } from "@/lib/types";

export default function GuideGrid({ guides }: { guides: Guide[] }) {
  return (
    <div className="blog-grid">
      {guides.map((g, idx) => (
        <motion.div
          key={g.slug}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.05 }}
        >
          <Link className="blog-card" href={`/guides/${g.slug}`}>
            <div className="blog-body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span className="pill-badge success" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                  {g.level}
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>5 min read</span>
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 10px", color: "var(--text)" }}>
                {g.title}
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: 20 }}>
                {g.desc}
              </p>
              <div className="blog-meta">
                <span style={{ color: "var(--accent)", fontWeight: 700 }}>Read Tutorial →</span>
                <span>Self-Custodial</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
