"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { BlogPost } from "@/lib/types";
import { getAuthorBySlug } from "@/lib/data";

export default function BlogGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="blog-grid">
      {posts.map((p, idx) => {
        const author = getAuthorBySlug(p.authorSlug);
        const imageSrc = (p as any).featuredImage || (p as any).coverImage || `/images/generated/${p.slug}-featured.jpg` || "/images/generated/berachain-v2-proof-of-liquidity-tge-breakdown-2026-featured.jpg";

        return (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
          >
            <Link className="blog-card" href={`/blog/${p.slug}/`} style={{ textDecoration: "none", display: "flex", flexDirection: "column", height: "100%", padding: 0, overflow: "hidden" }}>
              {/* 8K Card Image Banner */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16/9",
                  background: "var(--surface-sunken)",
                  borderBottom: "1px solid var(--border)",
                  overflow: "hidden"
                }}
              >
                <Image
                  src={imageSrc}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
                  className="hover:scale-105"
                />
                <div style={{ position: "absolute", top: 12, left: 12 }}>
                  <span
                    className="pill-badge"
                    style={{
                      fontSize: "0.7rem",
                      background: "rgba(255, 255, 255, 0.95)",
                      color: "var(--accent)",
                      border: "1px solid var(--border)",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.06)",
                      fontWeight: 700
                    }}
                  >
                    {p.tag}
                  </span>
                </div>
              </div>

              <div className="blog-body" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: "0.76rem", color: "var(--muted)", fontWeight: 600 }}>
                    {p.date}
                  </span>
                  <span style={{ fontSize: "0.76rem", color: "var(--muted)", fontWeight: 500 }}>
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
                  <span style={{ fontSize: "0.74rem", color: "var(--emerald)", fontWeight: 700 }}>● 8K VERIFIED</span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
