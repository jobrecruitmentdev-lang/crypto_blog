"use client";

import { useState, useEffect } from "react";
import { MotionCard } from "@/components/ui/MotionWrapper";

export interface MethodologyStep {
  step: string;
  title: string;
  icon: string;
  desc: string;
  metric: string;
}

interface MethodologyFrameworkViewProps {
  initialSteps: MethodologyStep[];
}

export default function MethodologyFrameworkView({ initialSteps }: MethodologyFrameworkViewProps) {
  const [steps, setSteps] = useState<MethodologyStep[]>(initialSteps);

  useEffect(() => {
    async function syncFramework() {
      try {
        const apiBase = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
          ? "https://cryptoairdropai.com/api"
          : "/api";

        const res = await fetch(`${apiBase}/framework.php?type=methodology`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.steps) && data.steps.length > 0) {
            setSteps(data.steps);
          }
        }
      } catch (err) {
        // quiet fallback
      }
    }
    syncFramework();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 54 }}>
      {steps.map((s, idx) => (
        <MotionCard key={idx} style={{ padding: "24px 28px", display: "flex", alignItems: "flex-start", gap: 20, background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
          <div style={{ fontSize: "1.8rem", flexShrink: 0, marginTop: 2 }}>{s.icon}</div>
          <div style={{ flexGrow: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                Stage {s.step}: {s.title}
              </h3>
              <span className="pill-badge success" style={{ fontSize: "0.72rem" }}>
                {s.metric}
              </span>
            </div>
            <p style={{ color: "var(--text)", fontSize: "0.93rem", lineHeight: 1.65, margin: 0, opacity: 0.88 }}>
              {s.desc}
            </p>
          </div>
        </MotionCard>
      ))}
    </div>
  );
}
