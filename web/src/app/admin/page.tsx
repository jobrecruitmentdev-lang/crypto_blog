"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { ProjectItem, Article, PageType, Difficulty, AirdropStatus } from "@/lib/types";

// Default seed data as initial fallbacks
import initialProjectsData from "@/data/projects.json";
import initialArticlesData from "@/data/articles.json";

const CATEGORIES: { key: PageType; label: string; icon: string; desc: string }[] = [
  { key: "intelligence", label: "Intelligence Hub", icon: "🧠", desc: "On-chain alpha, TGE analysis & RPC tracking (2,200-2,500w + 3 8K images)" },
  { key: "guides", label: "Tactical Guides", icon: "📘", desc: "Multi-wallet sybil defense & execution runbooks (2,200-2,500w + 3 8K images)" },
  { key: "methodology", label: "Methodology Papers", icon: "🔬", desc: "Smart contract audit & heuristic verification papers (2,200-2,500w + 3 8K images)" },
  { key: "editorial", label: "Editorial Charters", icon: "⚖️", desc: "Fact-checking protocols & disclosure policies (2,200-2,500w + 3 8K images)" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "articles" | "automation">("overview");
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjectsData as ProjectItem[]);
  const [articles, setArticles] = useState<Article[]>(initialArticlesData as Article[]);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);

  // Filter & Search states
  const [projectSearch, setProjectSearch] = useState("");
  const [articleSearch, setArticleSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Modals
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isNewArticle, setIsNewArticle] = useState(false);

  // Automation runner state
  const [autoCategory, setAutoCategory] = useState<PageType>("intelligence");
  const [autoTopic, setAutoTopic] = useState("");
  const [isRunningAuto, setIsRunningAuto] = useState(false);
  const [terminalLog, setTerminalLog] = useState<string[]>([]);

  // Check Local Python Daemon Status
  useEffect(() => {
    async function checkServer() {
      try {
        const res = await fetch("http://localhost:8080/api/health", { method: "GET" });
        if (res.ok) {
          setServerOnline(true);
          // Load fresh data from disk if available
          const dataRes = await fetch("http://localhost:8080/api/data");
          if (dataRes.ok) {
            const json = await dataRes.json();
            if (json.projects?.length) setProjects(json.projects);
            if (json.articles?.length) setArticles(json.articles);
          }
          return;
        }
      } catch (e) {
        // server offline
      }
      setServerOnline(false);
    }
    checkServer();
  }, []);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setTerminalLog((prev) => [`[${time}] ${msg}`, ...prev]);
  };

  // Sync back to Python daemon or save to disk
  const saveProjectsToBackend = async (updated: ProjectItem[]) => {
    setProjects(updated);
    if (serverOnline) {
      try {
        await fetch("http://localhost:8080/api/save/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projects: updated }),
        });
        addLog(`Projects successfully persisted to disk (${updated.length} items).`);
      } catch (e) {
        addLog(`Failed to persist projects to daemon: ${e}`);
      }
    }
  };

  const saveArticlesToBackend = async (updated: Article[]) => {
    setArticles(updated);
    if (serverOnline) {
      try {
        await fetch("http://localhost:8080/api/save/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articles: updated }),
        });
        addLog(`Articles successfully persisted to disk (${updated.length} items).`);
      } catch (e) {
        addLog(`Failed to persist articles to daemon: ${e}`);
      }
    }
  };

  // ----------------------------------------------------
  // Projects CRUD Handlers
  // ----------------------------------------------------
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    let updated: ProjectItem[];
    if (isNewProject) {
      updated = [editingProject, ...projects];
      addLog(`Added new project: ${editingProject.name} (${editingProject.slug})`);
    } else {
      updated = projects.map((p) => (p.slug === editingProject.slug ? editingProject : p));
      addLog(`Updated project: ${editingProject.name} (${editingProject.slug})`);
    }

    saveProjectsToBackend(updated);
    setEditingProject(null);
    setIsNewProject(false);
  };

  const handleDeleteProject = (slug: string, name: string) => {
    if (confirm(`Delete project "${name}" (${slug})?`)) {
      const updated = projects.filter((p) => p.slug !== slug);
      saveProjectsToBackend(updated);
      addLog(`Deleted project: ${name} (${slug})`);
    }
  };

  // ----------------------------------------------------
  // Articles CRUD Handlers
  // ----------------------------------------------------
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    let updated: Article[];
    if (isNewArticle) {
      updated = [editingArticle, ...articles];
      addLog(`Added new article: ${editingArticle.title} [${editingArticle.pageType}]`);
    } else {
      updated = articles.map((a) => (a.slug === editingArticle.slug ? editingArticle : a));
      addLog(`Updated article: ${editingArticle.title} (${editingArticle.slug})`);
    }

    saveArticlesToBackend(updated);
    setEditingArticle(null);
    setIsNewArticle(false);
  };

  const handleDeleteArticle = (slug: string, title: string) => {
    if (confirm(`Delete article "${title}" (${slug})?`)) {
      const updated = articles.filter((a) => a.slug !== slug);
      saveArticlesToBackend(updated);
      addLog(`Deleted article: ${title} (${slug})`);
    }
  };

  // ----------------------------------------------------
  // Automation Trigger Handlers
  // ----------------------------------------------------
  const handleRunArticleAutomation = async () => {
    setIsRunningAuto(true);
    addLog(`Initiating ${autoCategory.toUpperCase()} Generation for topic: "${autoTopic || 'Auto-Scout Trending Alpha'}"...`);
    addLog("Requesting 3-stage progressive generation (2,200-2,500w) with Groq LLM + 3 8K Pollinations Flux images...");

    if (serverOnline) {
      try {
        const res = await fetch("http://localhost:8080/api/run/article", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category: autoCategory, topic: autoTopic }),
        });
        const result = await res.json();
        if (result.success) {
          addLog("Generation Succeeded! " + (result.stdout ? result.stdout.slice(-200) : "Article written to disk."));
          // Refresh articles
          const dataRes = await fetch("http://localhost:8080/api/data");
          if (dataRes.ok) {
            const fresh = await dataRes.json();
            if (fresh.articles) setArticles(fresh.articles);
          }
        } else {
          addLog("Generation Failed: " + (result.stderr || result.error || "Unknown error"));
        }
      } catch (err: any) {
        addLog("Daemon Execution Error: " + err.message);
      }
    } else {
      addLog("Local Daemon is OFFLINE. Run in terminal:");
      addLog(`python automation/modules/article_generator.py --category ${autoCategory} ${autoTopic ? `--topic "${autoTopic}"` : ""}`);
    }
    setIsRunningAuto(false);
  };

  const handleRunProjectScraper = async () => {
    setIsRunningAuto(true);
    addLog("Executing Automated Project Scraper & Protocol Enricher...");

    if (serverOnline) {
      try {
        const res = await fetch("http://localhost:8080/api/run/scraper", { method: "POST" });
        const result = await res.json();
        if (result.success) {
          addLog("Scraper Completed Successfully!");
          const dataRes = await fetch("http://localhost:8080/api/data");
          if (dataRes.ok) {
            const fresh = await dataRes.json();
            if (fresh.projects) setProjects(fresh.projects);
          }
        } else {
          addLog("Scraper Error: " + (result.stderr || "Check logs"));
        }
      } catch (err: any) {
        addLog("Scraper Execution Error: " + err.message);
      }
    } else {
      addLog("Local Daemon is OFFLINE. Run in terminal:");
      addLog("python automation/modules/project_scraper.py");
    }
    setIsRunningAuto(false);
  };

  // Export JSON Helper
  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered lists
  const filteredProjects = useMemo(() => {
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.chain.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.slug.toLowerCase().includes(projectSearch.toLowerCase())
    );
  }, [projects, projectSearch]);

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchCat = selectedCategory === "all" || a.pageType === selectedCategory;
      const matchQuery =
        a.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
        a.slug.toLowerCase().includes(articleSearch.toLowerCase()) ||
        (a.tag && a.tag.toLowerCase().includes(articleSearch.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [articles, selectedCategory, articleSearch]);

  const countWords = (text?: string) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-sunken)", color: "var(--text)" }}>
      {/* Admin Top Navigation */}
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
          position: "sticky",
          top: 0,
          zIndex: 40,
          padding: "16px 24px",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: "1.5rem" }}>⚡</span>
            <div>
              <h1 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-bright)", margin: 0, letterSpacing: "-0.02em" }}>
                CRYPTOAIRDROP<span style={{ color: "var(--accent)" }}>AI</span> / ADMIN COMMAND
              </h1>
              <span style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 500 }}>
                Multi-Hub Automation &amp; Central Content Store
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 20,
                background: serverOnline ? "rgba(5, 150, 105, 0.08)" : "rgba(217, 119, 6, 0.08)",
                border: `1px solid ${serverOnline ? "rgba(5, 150, 105, 0.25)" : "rgba(217, 119, 6, 0.25)"}`,
                fontSize: "0.78rem",
                fontWeight: 600,
              }}
            >
              <span style={{ color: serverOnline ? "var(--emerald)" : "var(--amber)", fontWeight: 800 }}>●</span>
              <span style={{ color: serverOnline ? "var(--emerald)" : "var(--amber)" }}>DAEMON: {serverOnline ? "ONLINE (PORT 8080)" : "OFFLINE (RUN admin_server.py)"}</span>
            </div>

            <Link href="/" className="btn btn-outline btn-sm" target="_blank" style={{ background: "var(--surface)" }}>
              Live Site ↗
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Wrapper */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 24px" }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: 10, borderBottom: "1px solid var(--border)", paddingBottom: 14, marginBottom: 28, flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("overview")}
            style={{
              padding: "10px 20px",
              borderRadius: "var(--radius-sm)",
              fontWeight: 700,
              fontSize: "0.9rem",
              background: activeTab === "overview" ? "var(--accent)" : "var(--surface)",
              color: activeTab === "overview" ? "#FFFFFF" : "var(--text)",
              border: activeTab === "overview" ? "1px solid var(--accent)" : "1px solid var(--border)",
              boxShadow: activeTab === "overview" ? "0 2px 4px rgba(37, 99, 235, 0.2)" : "0 1px 2px rgba(0,0,0,0.03)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            📊 Telemetry &amp; Overview
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            style={{
              padding: "10px 20px",
              borderRadius: "var(--radius-sm)",
              fontWeight: 700,
              fontSize: "0.9rem",
              background: activeTab === "projects" ? "var(--accent)" : "var(--surface)",
              color: activeTab === "projects" ? "#FFFFFF" : "var(--text)",
              border: activeTab === "projects" ? "1px solid var(--accent)" : "1px solid var(--border)",
              boxShadow: activeTab === "projects" ? "0 2px 4px rgba(37, 99, 235, 0.2)" : "0 1px 2px rgba(0,0,0,0.03)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            📡 Projects Manager ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab("articles")}
            style={{
              padding: "10px 20px",
              borderRadius: "var(--radius-sm)",
              fontWeight: 700,
              fontSize: "0.9rem",
              background: activeTab === "articles" ? "var(--accent)" : "var(--surface)",
              color: activeTab === "articles" ? "#FFFFFF" : "var(--text)",
              border: activeTab === "articles" ? "1px solid var(--accent)" : "1px solid var(--border)",
              boxShadow: activeTab === "articles" ? "0 2px 4px rgba(37, 99, 235, 0.2)" : "0 1px 2px rgba(0,0,0,0.03)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            📝 Multi-Hub Articles ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab("automation")}
            style={{
              padding: "10px 20px",
              borderRadius: "var(--radius-sm)",
              fontWeight: 700,
              fontSize: "0.9rem",
              background: activeTab === "automation" ? "var(--accent)" : "var(--surface)",
              color: activeTab === "automation" ? "#FFFFFF" : "var(--text)",
              border: activeTab === "automation" ? "1px solid var(--accent)" : "1px solid var(--border)",
              boxShadow: activeTab === "automation" ? "0 2px 4px rgba(37, 99, 235, 0.2)" : "0 1px 2px rgba(0,0,0,0.03)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            ⚡ Automation Triggers
          </button>
        </div>

        {/* ==================================================== */}
        {/* TAB 1: OVERVIEW & TELEMETRY */}
        {/* ==================================================== */}
        {activeTab === "overview" && (
          <div>
            {/* Top Metrics Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
              <div style={{ padding: 22, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>Total Projects Scraped</div>
                <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--accent)", marginTop: 6 }}>{projects.length}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--emerald)", marginTop: 4, fontWeight: 600 }}>✓ 100% 8K Emblems Generated</div>
              </div>

              <div style={{ padding: 22, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>Total Deep-Dive Articles</div>
                <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--text-bright)", marginTop: 6 }}>{articles.length}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--accent)", marginTop: 4, fontWeight: 600 }}>Across 4 Knowledge Hubs</div>
              </div>

              <div style={{ padding: 22, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>Visual Engine Coverage</div>
                <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--emerald)", marginTop: 6 }}>100%</div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 4, fontWeight: 500 }}>3 Unique 8K Images / Article</div>
              </div>

              <div style={{ padding: 22, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>Word Count Compliance</div>
                <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--amber)", marginTop: 6 }}>2,200 - 2,500w</div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 4, fontWeight: 500 }}>High-Depth SEO Standard</div>
              </div>
            </div>

            {/* Category Breakdown Table */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24, marginBottom: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 16, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                Knowledge Hub Architecture &amp; Independent Automations
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                {CATEGORIES.map((cat) => {
                  const count = articles.filter((a) => a.pageType === cat.key).length;
                  return (
                    <div
                      key={cat.key}
                      style={{
                        padding: 16,
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--surface-sunken)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontSize: "1.2rem" }}>{cat.icon}</span>
                        <span className="pill-badge" style={{ background: "var(--surface)", border: "1px solid var(--border)", fontWeight: 700 }}>{count} Articles</span>
                      </div>
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 6px", color: "var(--text-bright)" }}>{cat.label}</h3>
                      <p style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>
                        {cat.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions & Sync */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => downloadJSON(projects, "projects.json")} className="btn btn-outline btn-sm" style={{ background: "var(--surface)" }}>
                ⬇ Export projects.json
              </button>
              <button onClick={() => downloadJSON(articles, "articles.json")} className="btn btn-outline btn-sm" style={{ background: "var(--surface)" }}>
                ⬇ Export articles.json
              </button>
              <button
                onClick={() => {
                  setActiveTab("automation");
                }}
                className="btn btn-primary btn-sm"
              >
                ⚡ Open Automation Console
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: PROJECTS MANAGER (FULL CRUD) */}
        {/* ==================================================== */}
        {activeTab === "projects" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <input
                type="text"
                placeholder="Search projects by name, chain, or slug..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text-bright)",
                  minWidth: 320,
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => {
                    const newProj: ProjectItem = {
                      slug: "new-protocol",
                      name: "New Protocol",
                      chain: "Ethereum",
                      status: ["Ongoing"],
                      reward: "$500 - $2,500",
                      difficulty: "Easy",
                      time: "15 min/week",
                      heat: 80,
                      desc: "Comprehensive description of the protocol, testnet tasks, and confirmed token distribution.",
                      tags: ["DeFi", "Confirmed"],
                      featuredImage: "/images/generated/new-protocol-project.jpg",
                      farmingSteps: [
                        { step: 1, title: "Connect Web3 Wallet", desc: "Connect non-custodial wallet to verified app." },
                        { step: 2, title: "Deposit / Stake Liquidity", desc: "Interact with core contracts." },
                      ],
                      officialLinks: { website: "https://example.io", twitter: "https://x.com/example" },
                      riskScore: 15,
                    };
                    setEditingProject(newProj);
                    setIsNewProject(true);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  + Add Project
                </button>
                <button onClick={() => downloadJSON(projects, "projects.json")} className="btn btn-outline btn-sm" style={{ background: "var(--surface)" }}>
                  ⬇ Export JSON
                </button>
              </div>
            </div>

            {/* Projects Table */}
            <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--surface)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "var(--surface-sunken)", borderBottom: "1px solid var(--border)" }}>
                    <th style={{ padding: "12px 16px", color: "var(--muted)", fontWeight: 700 }}>Emblem</th>
                    <th style={{ padding: "12px 16px", color: "var(--muted)", fontWeight: 700 }}>Name &amp; Slug</th>
                    <th style={{ padding: "12px 16px", color: "var(--muted)", fontWeight: 700 }}>Chain</th>
                    <th style={{ padding: "12px 16px", color: "var(--muted)", fontWeight: 700 }}>Status</th>
                    <th style={{ padding: "12px 16px", color: "var(--muted)", fontWeight: 700 }}>Reward</th>
                    <th style={{ padding: "12px 16px", color: "var(--muted)", fontWeight: 700 }}>Difficulty</th>
                    <th style={{ padding: "12px 16px", color: "var(--muted)", fontWeight: 700 }}>Risk Score</th>
                    <th style={{ padding: "12px 16px", textAlign: "right", color: "var(--muted)", fontWeight: 700 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((p) => (
                    <tr key={p.slug} style={{ borderBottom: "1px solid var(--border-subtle)", transition: "background 0.2s" }} className="hover:bg-slate-50">
                      <td style={{ padding: "12px 16px" }}>
                        {p.featuredImage ? (
                          <img
                            src={p.featuredImage}
                            alt={p.name}
                            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--surface-sunken)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "var(--accent)" }}>
                            {p.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontWeight: 800, color: "var(--text-bright)" }}>{p.name}</div>
                        <div style={{ fontSize: "0.76rem", color: "var(--muted)", fontFamily: "monospace" }}>/projects/{p.slug}/</div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span className="pill-badge" style={{ background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)" }}>{p.chain}</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {p.status.map((st) => (
                          <span key={st} className={`pill-badge ${st === "Confirmed" ? "gold" : "success"}`} style={{ marginRight: 4 }}>
                            {st}
                          </span>
                        ))}
                      </td>
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--emerald)" }}>{p.reward}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span className={`pill-badge ${p.difficulty === "Easy" ? "success" : p.difficulty === "Medium" ? "gold" : ""}`}>
                          {p.difficulty}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--accent)" }}>
                        {p.riskScore ?? 15} / 100
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 8 }}>
                          <Link href={`/projects/${p.slug}/`} target="_blank" className="btn btn-outline btn-sm" style={{ padding: "4px 8px", fontSize: "0.76rem", background: "var(--surface)" }}>
                            View ↗
                          </Link>
                          <button
                            onClick={() => {
                              setEditingProject({ ...p });
                              setIsNewProject(false);
                            }}
                            className="btn btn-outline btn-sm"
                            style={{ padding: "4px 8px", fontSize: "0.76rem", background: "var(--surface)" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p.slug, p.name)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: "4px 8px", fontSize: "0.76rem", borderColor: "rgba(239, 68, 68, 0.4)", color: "#ef4444", background: "var(--surface)" }}
                          >
                            Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: ARTICLES MANAGER (FULL CRUD) */}
        {/* ==================================================== */}
        {activeTab === "articles" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`btn btn-sm ${selectedCategory === "all" ? "btn-primary" : "btn-outline"}`}
                  style={{ background: selectedCategory === "all" ? undefined : "var(--surface)" }}
                >
                  All ({articles.length})
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`btn btn-sm ${selectedCategory === cat.key ? "btn-primary" : "btn-outline"}`}
                    style={{ background: selectedCategory === cat.key ? undefined : "var(--surface)" }}
                  >
                    {cat.icon} {cat.label} ({articles.filter((a) => a.pageType === cat.key).length})
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <input
                  type="text"
                  placeholder="Filter articles..."
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    color: "var(--text-bright)",
                    fontSize: "0.85rem",
                    outline: "none",
                  }}
                />
                <button
                  onClick={() => {
                    const newArt: Article = {
                      slug: "new-article-slug",
                      pageType: (selectedCategory === "all" ? "intelligence" : selectedCategory) as PageType,
                      title: "New 2,500-Word Comprehensive Intelligence Report",
                      tag: "On-Chain Alpha",
                      excerpt: "High-level executive summary of this token distribution analysis.",
                      tldr: "Core key findings and telemetry conclusions.",
                      keyTakeaways: ["Key Takeaway 1", "Key Takeaway 2", "Key Takeaway 3"],
                      read: "10 min read",
                      authorSlug: "editorial-desk",
                      date: new Date().toISOString().substring(0, 10),
                      updatedAt: new Date().toISOString().substring(0, 10),
                      body: "## 1. Architectural Overview\n\nDetailed breakdown here...",
                      featuredImage: "/images/generated/new-article-slug-featured.jpg",
                      middleImage: "/images/generated/new-article-slug-middle.jpg",
                      preFaqImage: "/images/generated/new-article-slug-pre_faq.jpg",
                      faqs: [
                        { question: "Is this distribution confirmed?", answer: "Yes, verified by official contracts." },
                        { question: "What are the sybil criteria?", answer: "Non-linear transaction cadence." },
                      ],
                    };
                    setEditingArticle(newArt);
                    setIsNewArticle(true);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  + Write Article
                </button>
                <button onClick={() => downloadJSON(articles, "articles.json")} className="btn btn-outline btn-sm" style={{ background: "var(--surface)" }}>
                  ⬇ Export JSON
                </button>
              </div>
            </div>

            {/* Articles Table */}
            <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--surface)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "var(--surface-sunken)", borderBottom: "1px solid var(--border)" }}>
                    <th style={{ padding: "12px 16px", color: "var(--muted)", fontWeight: 700 }}>Image</th>
                    <th style={{ padding: "12px 16px", color: "var(--muted)", fontWeight: 700 }}>Hub Category</th>
                    <th style={{ padding: "12px 16px", color: "var(--muted)", fontWeight: 700 }}>Title &amp; Slug</th>
                    <th style={{ padding: "12px 16px", color: "var(--muted)", fontWeight: 700 }}>Word Count</th>
                    <th style={{ padding: "12px 16px", color: "var(--muted)", fontWeight: 700 }}>FAQs</th>
                    <th style={{ padding: "12px 16px", color: "var(--muted)", fontWeight: 700 }}>Date</th>
                    <th style={{ padding: "12px 16px", textAlign: "right", color: "var(--muted)", fontWeight: 700 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((art) => {
                    const words = countWords(art.body);
                    const isCompliant = words >= 2000;
                    const hubPath = art.pageType === "guides" ? "guides" : art.pageType === "methodology" ? "methodology" : art.pageType === "editorial" ? "editorial-policy" : "blog";
                    return (
                      <tr key={art.slug} style={{ borderBottom: "1px solid var(--border-subtle)", transition: "background 0.2s" }} className="hover:bg-slate-50">
                        <td style={{ padding: "12px 16px" }}>
                          {art.featuredImage ? (
                            <img
                              src={art.featuredImage}
                              alt={art.title}
                              style={{ width: 48, height: 32, borderRadius: 4, objectFit: "cover", border: "1px solid var(--border)" }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <span style={{ fontSize: "1.2rem" }}>📄</span>
                          )}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span className={`pill-badge ${art.pageType === "intelligence" ? "purple" : art.pageType === "methodology" ? "gold" : "success"}`}>
                            {art.pageType?.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", maxWidth: 360 }}>
                          <div style={{ fontWeight: 800, color: "var(--text-bright)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {art.title}
                          </div>
                          <div style={{ fontSize: "0.76rem", color: "var(--muted)", fontFamily: "monospace" }}>
                            /{hubPath}/{art.slug}/
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ color: isCompliant ? "var(--emerald)" : "var(--amber)", fontWeight: 700, fontFamily: "monospace" }}>
                            {words.toLocaleString()}w {isCompliant ? "✓" : "⚠️"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", fontFamily: "monospace", color: "var(--text-bright)" }}>
                          {art.faqs?.length ?? 0} FAQs
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: "0.8rem", color: "var(--muted)" }}>
                          {art.date}
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: 8 }}>
                            <Link href={`/${hubPath}/${art.slug}/`} target="_blank" className="btn btn-outline btn-sm" style={{ padding: "4px 8px", fontSize: "0.76rem", background: "var(--surface)" }}>
                              View ↗
                            </Link>
                            <button
                              onClick={() => {
                                setEditingArticle({ ...art });
                                setIsNewArticle(false);
                              }}
                              className="btn btn-outline btn-sm"
                              style={{ padding: "4px 8px", fontSize: "0.76rem", background: "var(--surface)" }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(art.slug, art.title)}
                              className="btn btn-outline btn-sm"
                              style={{ padding: "4px 8px", fontSize: "0.76rem", borderColor: "rgba(239, 68, 68, 0.4)", color: "#ef4444", background: "var(--surface)" }}
                            >
                              Del
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: AUTOMATION CONSOLE & LIVE TRIGGERS */}
        {/* ==================================================== */}
        {activeTab === "automation" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
              {/* Trigger Hub Article Generator */}
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: "1.5rem" }}>⚡</span>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                    Trigger Deep-Dive Article Generator
                  </h2>
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text)", lineHeight: 1.55, marginBottom: 20, opacity: 0.88 }}>
                  Generates an exhaustive 2,200–2,500 word publication, 3 topic-based 8K photorealistic Flux images, 4–6 randomized FAQs with schema, and auto-saves to the central store.
                </p>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: 6, color: "var(--text-bright)" }}>Target Knowledge Hub:</label>
                  <select
                    value={autoCategory}
                    onChange={(e) => setAutoCategory(e.target.value as PageType)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      background: "var(--surface-sunken)",
                      border: "1px solid var(--border)",
                      color: "var(--text-bright)",
                      borderRadius: "var(--radius-sm)",
                      outline: "none",
                    }}
                  >
                    <option value="intelligence">🧠 Intelligence Hub (/blog)</option>
                    <option value="guides">📘 Tactical Guides (/guides)</option>
                    <option value="methodology">🔬 Methodology Papers (/methodology)</option>
                    <option value="editorial">⚖️ Editorial Charter (/editorial-policy)</option>
                  </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: 6, color: "var(--text-bright)" }}>
                    Specific Topic (Leave blank for automated trend scouting):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Berachain PoL Validator Mechanics or LayerZero V2 Sybil Detection"
                    value={autoTopic}
                    onChange={(e) => setAutoTopic(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      background: "var(--surface-sunken)",
                      border: "1px solid var(--border)",
                      color: "var(--text-bright)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.88rem",
                      outline: "none",
                    }}
                  />
                </div>

                <button
                  disabled={isRunningAuto}
                  onClick={handleRunArticleAutomation}
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                >
                  {isRunningAuto ? "⏳ Executing 3-Stage Generation..." : `⚡ Generate 2,500w ${autoCategory.toUpperCase()} Article & 8K Images`}
                </button>
              </div>

              {/* Trigger Project Scraper */}
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <span style={{ fontSize: "1.5rem" }}>📡</span>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                      Crypto Airdrop Project Scraper
                    </h2>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text)", lineHeight: 1.55, marginBottom: 20, opacity: 0.88 }}>
                    Crawls decentralized sources, discovers high-potential testnets and confirmed token distributions, synthesizes step-by-step checklist tasks, generates 8K protocol emblems, and updates <code>projects.json</code>.
                  </p>

                  <div style={{ padding: 14, background: "var(--surface-sunken)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", marginBottom: 20 }}>
                    <div style={{ fontSize: "0.78rem", color: "var(--accent)", fontWeight: 700 }}>CRAWLER TELEMETRY</div>
                    <div style={{ fontSize: "0.85rem", marginTop: 4, color: "var(--text)" }}>
                      Active Sources: Coingecko, DefiLlama, Twitter RPC, GitHub Deployments
                    </div>
                  </div>
                </div>

                <button
                  disabled={isRunningAuto}
                  onClick={handleRunProjectScraper}
                  className="btn btn-outline"
                  style={{ width: "100%", borderColor: "var(--accent)", color: "var(--accent)", background: "var(--surface)" }}
                >
                  {isRunningAuto ? "⏳ Scraping & Synthesizing..." : "📡 Run Project Discovery & 8K Badge Generator"}
                </button>
              </div>
            </div>

            {/* Terminal Log Console */}
            <div style={{ background: "#0F172A", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 8 }}>
                <span style={{ fontSize: "0.82rem", color: "#60A5FA", fontFamily: "monospace", fontWeight: 700 }}>
                  TERMINAL EXECUTION LOG
                </span>
                <button
                  onClick={() => setTerminalLog([])}
                  style={{ background: "none", border: "none", color: "#94A3B8", fontSize: "0.75rem", cursor: "pointer" }}
                >
                  Clear Log
                </button>
              </div>

              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.82rem",
                  color: "#CBD5E1",
                  maxHeight: 280,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {terminalLog.length === 0 ? (
                  <div style={{ color: "#64748B" }}>No commands executed yet. Trigger an action above or run scripts in terminal.</div>
                ) : (
                  terminalLog.map((line, idx) => (
                    <div key={idx} style={{ color: line.includes("Failed") || line.includes("Error") ? "#EF4444" : line.includes("Succeeded") ? "#10B981" : "#CBD5E1" }}>
                      {line}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ==================================================== */}
      {/* MODAL: EDIT / NEW PROJECT */}
      {/* ==================================================== */}
      {editingProject && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 20,
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              width: "100%",
              maxWidth: 700,
              maxHeight: "90vh",
              overflowY: "auto",
              padding: 28,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                {isNewProject ? "Add New Project" : `Edit Project: ${editingProject.name}`}
              </h2>
              <button
                onClick={() => setEditingProject(null)}
                style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProject} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "var(--text-bright)" }}>Name:</label>
                  <input
                    type="text"
                    required
                    value={editingProject.name}
                    onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", background: "var(--surface-sunken)", border: "1px solid var(--border)", color: "var(--text-bright)", borderRadius: 4, outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "var(--text-bright)" }}>Slug:</label>
                  <input
                    type="text"
                    required
                    value={editingProject.slug}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", background: "var(--surface-sunken)", border: "1px solid var(--border)", color: "var(--text-bright)", borderRadius: 4, outline: "none" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "var(--text-bright)" }}>Chain:</label>
                  <input
                    type="text"
                    required
                    value={editingProject.chain}
                    onChange={(e) => setEditingProject({ ...editingProject, chain: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", background: "var(--surface-sunken)", border: "1px solid var(--border)", color: "var(--text-bright)", borderRadius: 4, outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "var(--text-bright)" }}>Reward Estimate:</label>
                  <input
                    type="text"
                    required
                    value={editingProject.reward}
                    onChange={(e) => setEditingProject({ ...editingProject, reward: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", background: "var(--surface-sunken)", border: "1px solid var(--border)", color: "var(--text-bright)", borderRadius: 4, outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "var(--text-bright)" }}>Difficulty:</label>
                  <select
                    value={editingProject.difficulty}
                    onChange={(e) => setEditingProject({ ...editingProject, difficulty: e.target.value as Difficulty })}
                    style={{ width: "100%", padding: "8px 12px", background: "var(--surface-sunken)", border: "1px solid var(--border)", color: "var(--text-bright)", borderRadius: 4, outline: "none" }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "var(--text-bright)" }}>Description:</label>
                <textarea
                  rows={3}
                  value={editingProject.desc}
                  onChange={(e) => setEditingProject({ ...editingProject, desc: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", background: "var(--surface-sunken)", border: "1px solid var(--border)", color: "var(--text-bright)", borderRadius: 4, outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "var(--text-bright)" }}>8K Emblem Image Path:</label>
                <input
                  type="text"
                  value={editingProject.featuredImage || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, featuredImage: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", background: "var(--surface-sunken)", border: "1px solid var(--border)", color: "var(--text-bright)", borderRadius: 4, outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
                <button type="button" onClick={() => setEditingProject(null)} className="btn btn-outline btn-sm" style={{ background: "var(--surface)" }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: EDIT / NEW ARTICLE */}
      {/* ==================================================== */}
      {editingArticle && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 20,
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              width: "100%",
              maxWidth: 900,
              maxHeight: "92vh",
              overflowY: "auto",
              padding: 28,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                  {isNewArticle ? "Write New Article" : `Edit Article: ${editingArticle.title}`}
                </h2>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 4 }}>
                  Current Word Count: <b style={{ color: countWords(editingArticle.body) >= 2000 ? "var(--emerald)" : "var(--amber)" }}>{countWords(editingArticle.body)} words</b> (Target: 2,200 - 2,500w)
                </div>
              </div>
              <button
                onClick={() => setEditingArticle(null)}
                style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveArticle} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "var(--text-bright)" }}>Knowledge Hub:</label>
                  <select
                    value={editingArticle.pageType}
                    onChange={(e) => setEditingArticle({ ...editingArticle, pageType: e.target.value as PageType })}
                    style={{ width: "100%", padding: "8px 12px", background: "var(--surface-sunken)", border: "1px solid var(--border)", color: "var(--text-bright)", borderRadius: 4, outline: "none" }}
                  >
                    <option value="intelligence">🧠 Intelligence (/blog)</option>
                    <option value="guides">📘 Guides (/guides)</option>
                    <option value="methodology">🔬 Methodology (/methodology)</option>
                    <option value="editorial">⚖️ Editorial (/editorial-policy)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "var(--text-bright)" }}>Article Title:</label>
                  <input
                    type="text"
                    required
                    value={editingArticle.title}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", background: "var(--surface-sunken)", border: "1px solid var(--border)", color: "var(--text-bright)", borderRadius: 4, outline: "none" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "var(--text-bright)" }}>Slug:</label>
                  <input
                    type="text"
                    required
                    value={editingArticle.slug}
                    onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", background: "var(--surface-sunken)", border: "1px solid var(--border)", color: "var(--text-bright)", borderRadius: 4, outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "var(--text-bright)" }}>Tag:</label>
                  <input
                    type="text"
                    value={editingArticle.tag}
                    onChange={(e) => setEditingArticle({ ...editingArticle, tag: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", background: "var(--surface-sunken)", border: "1px solid var(--border)", color: "var(--text-bright)", borderRadius: 4, outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "var(--text-bright)" }}>Read Time:</label>
                  <input
                    type="text"
                    value={editingArticle.read}
                    onChange={(e) => setEditingArticle({ ...editingArticle, read: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", background: "var(--surface-sunken)", border: "1px solid var(--border)", color: "var(--text-bright)", borderRadius: 4, outline: "none" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "var(--text-bright)" }}>Excerpt:</label>
                <textarea
                  rows={2}
                  value={editingArticle.excerpt}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", background: "var(--surface-sunken)", border: "1px solid var(--border)", color: "var(--text-bright)", borderRadius: 4, outline: "none" }}
                />
              </div>

              {/* 3 8K Images */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, marginBottom: 4, color: "var(--text-bright)" }}>1. Featured 8K Image:</label>
                  <input
                    type="text"
                    value={editingArticle.featuredImage || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, featuredImage: e.target.value })}
                    style={{ width: "100%", padding: "6px 10px", background: "var(--surface-sunken)", border: "1px solid var(--border)", color: "var(--text-bright)", borderRadius: 4, fontSize: "0.8rem", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, marginBottom: 4, color: "var(--text-bright)" }}>2. Middle 8K Image:</label>
                  <input
                    type="text"
                    value={editingArticle.middleImage || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, middleImage: e.target.value })}
                    style={{ width: "100%", padding: "6px 10px", background: "var(--surface-sunken)", border: "1px solid var(--border)", color: "var(--text-bright)", borderRadius: 4, fontSize: "0.8rem", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, marginBottom: 4, color: "var(--text-bright)" }}>3. Pre-FAQ 8K Image:</label>
                  <input
                    type="text"
                    value={editingArticle.preFaqImage || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, preFaqImage: e.target.value })}
                    style={{ width: "100%", padding: "6px 10px", background: "var(--surface-sunken)", border: "1px solid var(--border)", color: "var(--text-bright)", borderRadius: 4, fontSize: "0.8rem", outline: "none" }}
                  />
                </div>
              </div>

              {/* Body Content */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 4, color: "var(--text-bright)" }}>
                  Full Article Body (Markdown / HTML):
                </label>
                <textarea
                  rows={12}
                  required
                  value={editingArticle.body}
                  onChange={(e) => setEditingArticle({ ...editingArticle, body: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", background: "var(--surface-sunken)", border: "1px solid var(--border)", color: "var(--text-bright)", borderRadius: 4, fontFamily: "monospace", fontSize: "0.85rem", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
                <button type="button" onClick={() => setEditingArticle(null)} className="btn btn-outline btn-sm" style={{ background: "var(--surface)" }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
