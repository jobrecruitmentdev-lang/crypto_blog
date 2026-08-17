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
            <Link className="blog-card" href={`/blog/${p.slug}`}>
              <div className="blog-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span className="pill-badge" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                    {p.tag}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                    {p.read} read
                  </span>
                </div>

                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 10px", lineHeight: 1.4, color: "var(--text)" }}>
                  {p.title}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: 20 }}>
                  {p.excerpt}
                </p>

                <div className="blog-meta">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 12, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
                      {author?.avatar || "🤖"}
                    </div>
                    <span style={{ fontWeight: 600, color: "var(--text)" }}>{author?.name || "Editorial Desk"}</span>
                  </div>
                  <span>{p.date}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
