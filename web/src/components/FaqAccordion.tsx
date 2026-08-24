"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface FaqItem {
  question?: string;
  answer?: string;
  q?: string;
  a?: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  // First item open by default for immediate context
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        const qText = faq.question || faq.q || "";
        const aText = faq.answer || faq.a || "";

        return (
          <div
            key={idx}
            className="tui-panel"
            style={{
              borderRadius: "var(--radius-sm)",
              overflow: "hidden",
              border: isOpen ? "1px solid var(--border-glow)" : "1px solid var(--border)",
              transition: "border-color 0.2s ease",
            }}
          >
            <button
              onClick={() => toggle(idx)}
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${idx}`}
              id={`faq-question-${idx}`}
              style={{
                width: "100%",
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                background: "transparent",
                border: "none",
                color: isOpen ? "var(--cyan)" : "var(--text-bright)",
                textAlign: "left",
                fontWeight: 800,
                fontSize: "1.02rem",
                cursor: "pointer",
                minHeight: "44px",
              }}
            >
              <span>{qText}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "var(--cyan)",
                  fontSize: "0.85rem",
                }}
                aria-hidden="true"
              >
                ▼
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-answer-${idx}`}
                  role="region"
                  aria-labelledby={`faq-question-${idx}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div
                    style={{
                      padding: "0 20px 20px",
                      color: "var(--muted)",
                      lineHeight: 1.65,
                      fontSize: "0.95rem",
                      borderTop: "1px solid rgba(0, 240, 255, 0.06)",
                      paddingTop: "14px",
                    }}
                  >
                    {aText}
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
