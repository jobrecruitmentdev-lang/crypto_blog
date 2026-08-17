"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Faq } from "@/lib/types";

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {faqs.map((f, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={f.q}
            className="glass-card"
            style={{
              padding: 0,
              overflow: "hidden",
              border: isOpen ? "1px solid rgba(124, 92, 255, 0.4)" : "1px solid var(--border)",
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: "100%",
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "transparent",
                border: "none",
                color: "var(--text)",
                fontSize: "1.05rem",
                fontWeight: 700,
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <span>{f.q}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: isOpen ? "var(--accent-glow)" : "rgba(255,255,255,0.05)",
                  color: isOpen ? "var(--accent)" : "var(--muted)",
                  fontSize: 14,
                  flexShrink: 0,
                  marginLeft: 16,
                }}
              >
                ▼
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div style={{ padding: "0 24px 22px", color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.65 }}>
                    {f.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
