"use client";

import { useState, useEffect } from "react";
import { MotionCard } from "@/components/ui/MotionWrapper";

export interface EditorialPillar {
  num: string;
  title: string;
  desc: string;
  badge: string;
}

interface EditorialFrameworkViewProps {
  initialPillars: EditorialPillar[];
}

export default function EditorialFrameworkView({ initialPillars }: EditorialFrameworkViewProps) {
  const [pillars, setPillars] = useState<EditorialPillar[]>(initialPillars);

  useEffect(() => {
    async function syncFramework() {
      try {
        const apiBase = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
          ? "https://cryptoairdropai.com/api"
          : "/api";

        const res = await fetch(`${apiBase}/framework.php?type=editorial`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.pillars) && data.pillars.length > 0) {
            setPillars(data.pillars);
          }
        }
      } catch (err) {
        // quiet fallback
      }
    }
    syncFramework();
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 54 }}>
      {pillars.map((item, idx) => (
        <MotionCard key={idx} style={{ padding: 28, background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--accent)" }}>{item.num}</span>
            <span className="pill-badge" style={{ fontSize: "0.72rem", background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)" }}>{item.badge}</span>
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 10px", color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>{item.title}</h3>
          <p style={{ color: "var(--text)", fontSize: "0.93rem", lineHeight: 1.65, margin: 0, opacity: 0.88 }}>
            {item.desc}
          </p>
        </MotionCard>
      ))}
    </div>
  );
}
