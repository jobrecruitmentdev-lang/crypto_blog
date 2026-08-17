"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [category, setCategory] = useState("editorial");

  return (
    <form
      className="contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        e.currentTarget.reset();
      }}
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <div>
        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: 6, color: "var(--muted)" }}>
          Department Routing
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { id: "editorial", label: "Editorial & Corrections" },
            { id: "security", label: "Security & Vulnerability" },
            { id: "submission", label: "Airdrop Submission" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategory(tab.id)}
              className="btn btn-sm"
              style={{
                background: category === tab.id ? "var(--accent)" : "rgba(255,255,255,0.05)",
                color: category === tab.id ? "#fff" : "var(--muted)",
                border: "1px solid var(--border)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: 6, color: "var(--muted)" }}>
            Your Name / Pseudonym
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Satoshi"
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--text)",
              outline: "none",
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: 6, color: "var(--muted)" }}>
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="name@domain.com"
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--text)",
              outline: "none",
            }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: 6, color: "var(--muted)" }}>
          Message / On-Chain Contract Links
        </label>
        <textarea
          required
          rows={5}
          placeholder="Provide protocol links, transaction hashes, or error details..."
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            color: "var(--text)",
            outline: "none",
            resize: "vertical",
          }}
        />
      </div>

      <button className="btn btn-primary" type="submit" style={{ alignSelf: "flex-start", marginTop: 4 }}>
        🚀 Submit Message (24–48h SLA)
      </button>

      {sent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: "12px 16px",
            borderRadius: "var(--radius)",
            background: "rgba(0, 224, 164, 0.1)",
            border: "1px solid rgba(0, 224, 164, 0.3)",
            color: "var(--accent2)",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          ✓ Message received! Our research desk will review your inquiry within 24 to 48 hours.
        </motion.div>
      )}
    </form>
  );
}
