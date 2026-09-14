"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogPost } from "@/lib/types";
import { getAuthorBySlug } from "@/lib/data";

export default function BlogGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="blog-grid">
      {posts.map((p, idx) => {
        const author = getAuthorBySlug(p.authorSlug);
        return (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
          >
            <Link className="blog-card" href={`/blog/${p.slug}/`} style={{ textDecoration: "none" }}>
              <div className="blog-body" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span className="pill-badge" style={{ fontSize: "0.7rem", padding: "2px 8px", background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)" }}>
                    {p.tag}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 500 }}>
                    {p.read} read
                  </span>
                </div>

                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 10px", lineHeight: 1.35, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                  {p.title}
                </h3>
                <p style={{ color: "var(--text)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: 20, flexGrow: 1, opacity: 0.88 }}>
                  {p.excerpt}
                </p>

                <div className="blog-meta" style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 13, background: "var(--surface-sunken)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
                      {author?.avatar || "🤖"}
                    </div>
                    <span style={{ fontWeight: 600, color: "var(--text-bright)", fontSize: "0.85rem" }}>{author?.name || "Editorial Desk"}</span>
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{p.date}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
