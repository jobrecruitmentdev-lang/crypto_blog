"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section className="section" style={{ padding: "32px 0 48px" }}>
      <div className="wrap">
        <div
          className="tui-panel newsletter-bento"
          style={{
            padding: "36px 32px",
            background: "linear-gradient(135deg, rgba(10, 17, 34, 0.95), rgba(4, 7, 13, 0.95))",
            border: "1px solid var(--border)",
          }}
        >
          <div>
            <div style={{ display: "inline-flex", marginBottom: 10 }}>
              <span className="pill-badge" style={{ fontSize: "0.72rem" }}>
                ⚡ [ ALPHA TELEMETRY DISPATCH ]
              </span>
            </div>
            <h3 style={{ fontSize: "1.7rem", fontWeight: 900, letterSpacing: "-0.02em", color: "var(--text-bright)", marginBottom: 8 }}>
              Never Miss a Snapshot Window
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
              Get verified smart contract updates, point system changes, and confirmed token airdrops delivered weekly. Zero spam, zero ads.
            </p>
          </div>

          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
                e.currentTarget.reset();
              }}
              style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
            >
              <input
                type="email"
                placeholder={subscribed ? "✓ Verified & Subscribed!" : "Enter wallet or research email..."}
                required
                style={{
                  flex: 1,
                  minWidth: 220,
                  padding: "12px 16px",
                  background: "rgba(0, 240, 255, 0.04)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text)",
                  fontFamily: "ui-monospace, monospace",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />
              <button className="btn btn-primary" type="submit" style={{ whiteSpace: "nowrap" }}>
                Subscribe →
              </button>
            </form>
            <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: "0.76rem", color: "var(--muted)", fontFamily: "monospace" }}>
              <span>🔒 256-BIT ENCRYPTED</span>
              <span>⚡ INSTANT UNSUBSCRIBE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
