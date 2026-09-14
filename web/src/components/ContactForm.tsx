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
        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: 8, color: "var(--text-bright)" }}>
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
                background: category === tab.id ? "var(--accent)" : "var(--surface)",
                color: category === tab.id ? "#fff" : "var(--text)",
                border: "1px solid var(--border)",
                fontWeight: 600,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: 6, color: "var(--text-bright)" }}>
            Your Name / Pseudonym
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Satoshi"
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "var(--surface-sunken)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--text-bright)",
              fontFamily: "var(--font-sans)",
              outline: "none",
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: 6, color: "var(--text-bright)" }}>
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="name@domain.com"
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "var(--surface-sunken)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--text-bright)",
              fontFamily: "var(--font-sans)",
              outline: "none",
            }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: 6, color: "var(--text-bright)" }}>
          Message / On-Chain Contract Links
        </label>
        <textarea
          required
          rows={5}
          placeholder="Provide protocol links, transaction hashes, or error details..."
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "var(--surface-sunken)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            color: "var(--text-bright)",
            fontFamily: "var(--font-sans)",
            outline: "none",
            resize: "vertical",
          }}
        />
      </div>

      <button className="btn btn-primary" type="submit" style={{ alignSelf: "flex-start", marginTop: 4 }}>
        Submit Message (24–48h SLA) →
      </button>

      {sent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: "14px 18px",
            borderRadius: "var(--radius)",
            background: "rgba(5, 150, 105, 0.08)",
            border: "1px solid rgba(5, 150, 105, 0.3)",
            color: "var(--emerald)",
            fontSize: "0.92rem",
            fontWeight: 700,
          }}
        >
          ✓ Message received! Our research desk will review your inquiry within 24 to 48 hours.
        </motion.div>
      )}
    </form>
  );
}
