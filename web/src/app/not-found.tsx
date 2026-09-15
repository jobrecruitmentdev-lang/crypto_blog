"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ArticleView from "@/components/ArticleView";
import ProjectView from "@/components/ProjectView";
import type { Article, ProjectItem } from "@/lib/types";

export default function NotFound() {
  const [loading, setLoading] = useState(true);
  const [matchedArticle, setMatchedArticle] = useState<Article | null>(null);
  const [matchedProject, setMatchedProject] = useState<ProjectItem | null>(null);
  const [hubInfo, setHubInfo] = useState<{ title: string; path: string }>({ title: "Intelligence", path: "/blog/" });

  useEffect(() => {
    async function checkDynamicRoute() {
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }

      const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
      const segments = path.split("/");

      if (segments.length >= 2) {
        const section = segments[0].toLowerCase();
        const slug = segments[1];

        const apiBase = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
          ? "https://cryptoairdropai.com/api"
          : "/api";

        if (section === "blog" || section === "guides" || section === "methodology" || section === "editorial-policy" || section === "editorial") {
          try {
            const res = await fetch(`${apiBase}/articles.php?slug=${encodeURIComponent(slug)}`);
            if (res.ok) {
              const art = await res.json();
              if (art && art.slug) {
                const title = section === "blog" ? "Intelligence" : section === "guides" ? "Guides" : section === "methodology" ? "Methodology" : "Editorial";
                const targetPath = section === "editorial" ? "/editorial-policy/" : `/${section}/`;
                setHubInfo({ title, path: targetPath });
                setMatchedArticle(art);
                setLoading(false);
                return;
              }
            }
          } catch (e) {
            // ignore
          }
        } else if (section === "projects") {
          try {
            const res = await fetch(`${apiBase}/projects.php?slug=${encodeURIComponent(slug)}`);
            if (res.ok) {
              const proj = await res.json();
              if (proj && proj.slug) {
                setMatchedProject(proj);
                setLoading(false);
                return;
              }
            }
          } catch (e) {
            // ignore
          }
        }
      }

      setLoading(false);
    }

    checkDynamicRoute();
  }, []);

  if (loading) {
    return (
      <div className="wrap error-page" style={{ padding: "80px 0", textAlign: "center" }}>
        <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>⚡</div>
        <p style={{ color: "var(--muted)" }}>Connecting to real-time decentralized registry...</p>
      </div>
    );
  }

  if (matchedArticle) {
    return (
      <ArticleView
        article={matchedArticle}
        hubTitle={hubInfo.title}
        hubPath={hubInfo.path}
      />
    );
  }

  if (matchedProject) {
    return (
      <ProjectView
        initialProject={matchedProject}
        related={[]}
      />
    );
  }

  return (
    <div className="wrap error-page">
      <div className="code gradient">404</div>
      <h1>This page doesn&apos;t exist</h1>
      <p>The airdrop or article you&apos;re looking for may have moved, expired, or been removed.</p>
      <Link href="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
