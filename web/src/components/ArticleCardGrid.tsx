"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/types";
import { MotionCard } from "@/components/ui/MotionWrapper";

interface ArticleCardGridProps {
  articles: Article[];
  basePath: string; // e.g. "/blog" | "/guides" | "/methodology" | "/editorial-policy"
}

export default function ArticleCardGrid({ articles, basePath }: ArticleCardGridProps) {
  const [liveArticles, setLiveArticles] = useState<Article[]>(articles);

  useEffect(() => {
    async function syncArticlesFromDatabase() {
      try {
        const cleanPath = basePath.toLowerCase().replace(/\/+$/, "");
        let typeParam = "";
        if (cleanPath.includes("blog")) typeParam = "intelligence";
        else if (cleanPath.includes("guide")) typeParam = "guides";
        else if (cleanPath.includes("methodology")) typeParam = "methodology";
        else if (cleanPath.includes("editorial")) typeParam = "editorial";

        const apiBase = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
          ? "https://cryptoairdropai.com/api"
          : "/api";

        const url = typeParam ? `${apiBase}/articles.php?type=${typeParam}` : `${apiBase}/articles.php`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.articles)) {
            setLiveArticles(data.articles);
          }
        }
      } catch (err) {
        // quiet fallback to static initial props
      }
    }
    syncArticlesFromDatabase();
  }, [basePath]);

  if (!liveArticles || liveArticles.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0", color: "var(--muted)" }}>
        No published articles found in this category. Check back shortly for new automated intelligence drops.
      </div>
    );
  }

  const cleanBasePath = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
      {liveArticles.map((article) => (
        <MotionCard 
          key={article.slug} 
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            height: "100%", 
            padding: 0, 
            overflow: "hidden",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
          }}
        >
          {/* Card 8K Image Banner */}
          <Link href={`${cleanBasePath}/${article.slug}/`} style={{ textDecoration: "none", display: "block" }}>
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
                src={article.featuredImage || `/images/generated/${article.slug}-featured.jpg`}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
                className="hover:scale-105"
              />
              <div style={{ position: "absolute", top: 12, left: 12 }}>
                <span 
                  className="pill-badge" 
                  style={{ 
                    fontSize: "0.72rem", 
                    background: "rgba(255, 255, 255, 0.95)", 
                    color: "var(--accent)",
                    border: "1px solid var(--border)",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.06)",
                    fontWeight: 700
                  }}
                >
                  {article.tag}
                </span>
              </div>
            </div>
          </Link>

          {/* Card Content & Details */}
          <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 8, display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
              <span>{article.date}</span>
              <span>{article.read}</span>
            </div>

            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, lineHeight: 1.35, margin: "0 0 10px", fontFamily: "var(--font-serif)" }}>
              <Link 
                href={`${cleanBasePath}/${article.slug}/`} 
                style={{ color: "var(--text-bright)", textDecoration: "none", transition: "color 0.2s" }}
              >
                {article.title}
              </Link>
            </h3>

            <p style={{ color: "var(--text)", fontSize: "0.9rem", lineHeight: 1.55, margin: "0 0 16px", flexGrow: 1, opacity: 0.88 }}>
              {article.excerpt.length > 130 ? `${article.excerpt.substring(0, 130)}...` : article.excerpt}
            </p>

            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 14, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              <Link 
                href={`${cleanBasePath}/${article.slug}/`} 
                style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent)", textDecoration: "none" }}
              >
                Read Analysis →
              </Link>
            </div>
          </div>
        </MotionCard>
      ))}
    </div>
  );
}
