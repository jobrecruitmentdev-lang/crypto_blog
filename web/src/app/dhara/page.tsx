"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { ProjectItem, Article, PageType, Difficulty, AirdropStatus } from "@/lib/types";

// Default seed data
import initialProjectsData from "@/data/projects.json";
import initialArticlesData from "@/data/articles.json";

type NavSection =
  | "home"
  | "projects"
  | "intelligence"
  | "guides"
  | "methodology"
  | "editorial"
  | "about"
  | "contact"
  | "automation";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  credentials: string;
}

interface StatItem {
  id: string;
  label: string;
  value: string;
  change?: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  department: string;
  subject: string;
  message: string;
  date: string;
  status: "new" | "read" | "resolved";
}

interface InboxDepartment {
  id: string;
  title: string;
  email: string;
  desc: string;
  sla: string;
}

export default function DharaPage() {
  // ----------------------------------------------------
  // Authentication State
  // ----------------------------------------------------
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? sessionStorage.getItem("dhara_authenticated") : null;
    setIsAuthenticated(saved === "true");
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim() === "chaiwala" && passwordInput === "Hostinger ki masi 4786") {
      sessionStorage.setItem("dhara_authenticated", "true");
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid username or password. Access denied.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("dhara_authenticated");
    setIsAuthenticated(false);
    setUsernameInput("");
    setPasswordInput("");
  };

  // ----------------------------------------------------
  // Navigation & Data Stores
  // ----------------------------------------------------
  const [activeSection, setActiveSection] = useState<NavSection>("home");
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjectsData as ProjectItem[]);
  const [articles, setArticles] = useState<Article[]>(initialArticlesData as Article[]);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Home Page Settings
  const [homeHeroHeadline, setHomeHeroHeadline] = useState("Daily fact-checked crypto guides, retroactive airdrop tutorials, and DeFi market research.");
  const [homeLeadStorySlug, setHomeLeadStorySlug] = useState("berachain-v2-proof-of-liquidity-tge-breakdown-2026");
  const [homeTickerItems, setHomeTickerItems] = useState([
    { sym: "BTC", price: "$64,250", chg: "+2.4%", up: true },
    { sym: "ETH", price: "$3,480", chg: "+1.8%", up: true },
    { sym: "SOL", price: "$152", chg: "-0.5%", up: false },
    { sym: "BERA", price: "$14.20", chg: "+8.9%", up: true },
    { sym: "MONAD", price: "$28.50", chg: "+12.1%", up: true },
  ]);

  // About Page Settings & Team CRUD
  const [aboutMission, setAboutMission] = useState(
    "Crypto Airdrop AI is an independent, non-custodial crypto research portal, token distribution aggregator, and Web3 education platform."
  );
  const [aboutFoundingYear, setAboutFoundingYear] = useState("2026");
  const [aboutStats, setAboutStats] = useState<StatItem[]>([
    { id: "stat-1", label: "Audited Testnets", value: "150+" },
    { id: "stat-2", label: "Fact-Checked Guides", value: "85+" },
    { id: "stat-3", label: "Sybil Filtered Capital", value: "$4.2M+" },
    { id: "stat-4", label: "Zero-Custody Guaranteed", value: "100%" },
  ]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "tm-1",
      name: "Security Sentinel AI",
      role: "Lead Smart Contract Auditor",
      bio: "Automated static analyzer and bytecode verification daemon specialized in EVM/SVM proxy security.",
      avatar: "/authors/security-sentinel.png",
      credentials: "PhD Cryptography · Formal Verification Specialist",
    },
    {
      id: "tm-2",
      name: "AI Intelligence Engine",
      role: "On-Chain Alpha Researcher",
      bio: "Machine-assisted blockchain heuristics tracker monitoring validator emission graphs and sybil clusters.",
      avatar: "/authors/intelligence-engine.png",
      credentials: "MSc Distributed Systems · Ex-DeFi Quant",
    },
    {
      id: "tm-3",
      name: "Editorial Desk",
      role: "Fact-Checking & Compliance",
      bio: "Human verification panel enforcing zero-sponsored listings and cryptographic audit standards.",
      avatar: "/authors/editorial-desk.png",
      credentials: "10+ Years Financial Journalism · Anti-Sybil Council",
    },
  ]);

  // Contact Desk Inboxes & Inquiries CRUD
  const [contactInboxes, setContactInboxes] = useState<InboxDepartment[]>([
    {
      id: "inbox-1",
      title: "Editorial & Fact-Checking",
      email: "editorial@cryptoairdropai.com",
      desc: "Report outdated snapshot deadlines, incorrect step instructions, or factual corrections.",
      sla: "24–48h SLA",
    },
    {
      id: "inbox-2",
      title: "Security & Vulnerability",
      email: "security@cryptoairdropai.com",
      desc: "Report malicious proxy contracts, phishing clones, or protocol exploits for delisting.",
      sla: "Priority Queue (< 4h)",
    },
    {
      id: "inbox-3",
      title: "Protocol Submissions",
      email: "contact@cryptoairdropai.com",
      desc: "Submit new Layer-1/Layer-2 testnet protocols for independent cryptographic audit.",
      sla: "3–5 Days Review",
    },
  ]);

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([
    {
      id: "msg-101",
      name: "Alex Vance",
      email: "alex@paradigm-research.eth",
      department: "Editorial & Fact-Checking",
      subject: "Monad Parallel EVM RPC Update",
      message: "Hey team, Monad testnet RPC port updated in the latest testnet release. Please verify contract address.",
      date: "2026-09-14 14:15",
      status: "new",
    },
    {
      id: "msg-102",
      name: "Elena Rostova",
      email: "elena@berachain-validator.xyz",
      department: "Protocol Submissions",
      subject: "Royco Boyco BGT Vault Metrics Verification",
      message: "Providing on-chain verification proof for Royco Boyco vault liquidity numbers for your Bera breakdown.",
      date: "2026-09-13 18:40",
      status: "read",
    },
  ]);

  // Modals for CRUD
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isNewArticle, setIsNewArticle] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [isNewTeamMember, setIsNewTeamMember] = useState(false);
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);

  // Automation runner state
  const [autoCategory, setAutoCategory] = useState<PageType>("intelligence");
  const [autoTopic, setAutoTopic] = useState("");
  const [isRunningAuto, setIsRunningAuto] = useState(false);
  const [terminalLog, setTerminalLog] = useState<string[]>([
    "[SYSTEM] Dhara Command Center initialized in restricted mode.",
    "[STATUS] Connected to secure administrative data layer.",
  ]);

  // Check daemon status
  useEffect(() => {
    async function checkServer() {
      try {
        const res = await fetch("http://localhost:8080/api/health", { method: "GET" });
        if (res.ok) {
          setServerOnline(true);
          const dataRes = await fetch("http://localhost:8080/api/data");
          if (dataRes.ok) {
            const json = await dataRes.json();
            if (json.projects?.length) setProjects(json.projects);
            if (json.articles?.length) setArticles(json.articles);
          }
          return;
        }
      } catch (e) {
        // offline
      }
      setServerOnline(false);
    }
    checkServer();
  }, []);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setTerminalLog((prev) => [`[${time}] ${msg}`, ...prev]);
  };

  // ----------------------------------------------------
  // Persistence Helpers
  // ----------------------------------------------------
  const saveProjectsToBackend = async (updated: ProjectItem[]) => {
    setProjects(updated);
    if (serverOnline) {
      try {
        await fetch("http://localhost:8080/api/save/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projects: updated }),
        });
        addLog(`Projects successfully persisted (${updated.length} items).`);
      } catch (e) {
        addLog(`Failed to persist projects: ${e}`);
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
        addLog(`Articles successfully persisted (${updated.length} items).`);
      } catch (e) {
        addLog(`Failed to persist articles: ${e}`);
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
      addLog(`Created project: ${editingProject.name} (${editingProject.slug})`);
    } else {
      updated = projects.map((p) => (p.slug === editingProject.slug ? editingProject : p));
      addLog(`Updated project: ${editingProject.name} (${editingProject.slug})`);
    }

    saveProjectsToBackend(updated);
    setEditingProject(null);
  };

  const handleDeleteProject = (slug: string) => {
    if (confirm(`Are you sure you want to permanently delete project '${slug}'?`)) {
      const updated = projects.filter((p) => p.slug !== slug);
      saveProjectsToBackend(updated);
      addLog(`Deleted project: ${slug}`);
    }
  };

  // ----------------------------------------------------
  // Articles CRUD Handlers (for Intelligence, Guides, Methodology, Editorial)
  // ----------------------------------------------------
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    let updated: Article[];
    if (isNewArticle) {
      updated = [editingArticle, ...articles];
      addLog(`Created article: ${editingArticle.title} (${editingArticle.slug})`);
    } else {
      updated = articles.map((a) => (a.slug === editingArticle.slug ? editingArticle : a));
      addLog(`Updated article: ${editingArticle.title} (${editingArticle.slug})`);
    }

    saveArticlesToBackend(updated);
    setEditingArticle(null);
  };

  const handleDeleteArticle = (slug: string) => {
    if (confirm(`Are you sure you want to permanently delete article '${slug}'?`)) {
      const updated = articles.filter((a) => a.slug !== slug);
      saveArticlesToBackend(updated);
      addLog(`Deleted article: ${slug}`);
    }
  };

  // ----------------------------------------------------
  // Team CRUD Handlers
  // ----------------------------------------------------
  const handleSaveTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeamMember) return;

    let updated: TeamMember[];
    if (isNewTeamMember) {
      updated = [...teamMembers, { ...editingTeamMember, id: `tm-${Date.now()}` }];
      addLog(`Added team analyst: ${editingTeamMember.name}`);
    } else {
      updated = teamMembers.map((m) => (m.id === editingTeamMember.id ? editingTeamMember : m));
      addLog(`Updated team analyst: ${editingTeamMember.name}`);
    }
    setTeamMembers(updated);
    setEditingTeamMember(null);
  };

  const handleDeleteTeamMember = (id: string) => {
    if (confirm("Delete this team member?")) {
      setTeamMembers(teamMembers.filter((m) => m.id !== id));
      addLog(`Deleted team member ID: ${id}`);
    }
  };

  // ----------------------------------------------------
  // Contact Message Handlers
  // ----------------------------------------------------
  const toggleMessageStatus = (id: string) => {
    setContactMessages(
      contactMessages.map((msg) => {
        if (msg.id === id) {
          const nextStatus = msg.status === "new" ? "read" : msg.status === "read" ? "resolved" : "new";
          addLog(`Marked inquiry #${id} as '${nextStatus}'.`);
          return { ...msg, status: nextStatus };
        }
        return msg;
      })
    );
  };

  const handleDeleteMessage = (id: string) => {
    if (confirm("Delete this message inquiry?")) {
      setContactMessages(contactMessages.filter((m) => m.id !== id));
      addLog(`Deleted inquiry #${id}.`);
    }
  };

  // ----------------------------------------------------
  // Automation Runner
  // ----------------------------------------------------
  const handleRunAutomation = async () => {
    if (!autoTopic.trim()) {
      alert("Please enter a research topic.");
      return;
    }

    setIsRunningAuto(true);
    addLog(`Initiating autonomous pipeline for [${autoCategory.toUpperCase()}]: "${autoTopic}"...`);

    if (serverOnline) {
      try {
        const res = await fetch("http://localhost:8080/api/generate/article", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category: autoCategory, topic: autoTopic }),
        });
        const data = await res.json();
        if (data.status === "success") {
          addLog(`[SUCCESS] Article generated (${data.word_count} words).`);
          addLog(`[IMAGES] 3 Studio 8K visuals rendered: featured, middle, pre_faq.`);
          addLog(`[FAQS] Generated ${data.article.faqs?.length || 4} Schema FAQs.`);
          setArticles((prev) => [data.article, ...prev]);
        } else {
          addLog(`[ERROR] Generation failed: ${data.message}`);
        }
      } catch (err) {
        addLog(`[ERROR] Daemon connection failed: ${err}`);
      }
    } else {
      // Mock local generation when daemon not running
      setTimeout(() => {
        const slug = autoTopic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const newArt: Article = {
          slug,
          pageType: autoCategory,
          tag: autoCategory === "intelligence" ? "Market Alpha" : autoCategory === "guides" ? "Farming Runbook" : "Audit Paper",
          title: autoTopic,
          excerpt: `Comprehensive 2,400-word cryptographic analysis of ${autoTopic} covering tokenomics, smart contract risk, and sybil defense.`,
          tldr: `Key on-chain mechanisms, distribution economics, and audit findings for ${autoTopic}.`,
          keyTakeaways: [
            "Strict wallet isolation hygiene prevents automated cluster detection.",
            "Multi-stage bytecode verification confirms proxy timelock safety.",
            "Weekly execution cadence recommended over single-burst farming.",
          ],
          date: new Date().toISOString().split("T")[0],
          read: "11 min read",
          authorSlug: "security-sentinel-ai",
          featuredImage: `/images/generated/${slug}-featured.jpg`,
          middleImage: `/images/generated/${slug}-middle.jpg`,
          preFaqImage: `/images/generated/${slug}-pre_faq.jpg`,
          body: `## Comprehensive Technical Evaluation\n\nThis article provides an in-depth 2,400+ word cryptographic assessment of ${autoTopic}...\n\n### 1. Protocol Architecture & Invariants\n\nDetailed breakdown of bytecode, smart contract state transitions, and verification metrics.\n\n### 2. Sybil Defense Heuristics\n\nClustering graphs, timing analysis, and wallet distribution standards.`,
          faqs: [
            { question: `What are the core requirements for ${autoTopic}?`, answer: "Interacting across verified smart contracts with isolated testnet wallets." },
            { question: "How does the protocol prevent sybil clusters?", answer: "Through heuristic deposit clustering and transaction graph analysis." },
            { question: "What is the expected token distribution timeline?", answer: "Post-testnet completion and final smart contract security audit." },
            { question: "Are user private keys ever exposed?", answer: "Zero custody: interactions occur directly through non-custodial Web3 wallets." },
          ],
        };
        setArticles((prev) => [newArt, ...prev]);
        addLog(`[LOCAL SIMULATION] Created article "${autoTopic}" (${autoCategory}).`);
        setIsRunningAuto(false);
        setAutoTopic("");
      }, 1500);
      return;
    }

    setIsRunningAuto(false);
    setAutoTopic("");
  };

  // Filtered lists for each section
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.chain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || p.status.includes(statusFilter as AirdropStatus);
      return matchSearch && matchStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  const countWords = (text?: string) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const getArticlesByCategory = (cat: PageType) => {
    return articles.filter((a) => {
      const matchCategory = cat === "intelligence" ? a.pageType === "intelligence" || !a.pageType : a.pageType === cat;
      const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.slug.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  };

  // ----------------------------------------------------
  // AUTH GUARD VIEW
  // ----------------------------------------------------
  if (isAuthenticated === null) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8FAFC", color: "#0F172A", fontFamily: "var(--font-sans)" }}>
        <div style={{ padding: 24, fontSize: "0.95rem", color: "#64748B" }}>Checking authorization...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8FAFC", padding: 20, fontFamily: "var(--font-sans)" }}>
        <div style={{ maxWidth: 420, width: "100%", background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "36px 32px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 9999, background: "rgba(37, 99, 235, 0.08)", color: "#2563EB", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>
              🔒 Restricted Enclave
            </div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#0F172A", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
              Dhara Command Center
            </h1>
            <p style={{ fontSize: "0.88rem", color: "#64748B", margin: 0, lineHeight: 1.5 }}>
              Institutional access gate for Crypto Airdrop AI. Please enter authorized operator credentials.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {authError && (
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(220, 38, 38, 0.08)", border: "1px solid rgba(220, 38, 38, 0.25)", color: "#DC2626", fontSize: "0.85rem", fontWeight: 600 }}>
                ⚠️ {authError}
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                Operator Username
              </label>
              <input
                type="text"
                autoFocus
                placeholder="Enter username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 8,
                  border: "1px solid #CBD5E1",
                  background: "#FFFFFF",
                  fontSize: "0.95rem",
                  color: "#0F172A",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                Security Key / Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 8,
                  border: "1px solid #CBD5E1",
                  background: "#FFFFFF",
                  fontSize: "0.95rem",
                  color: "#0F172A",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: 8,
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: "none",
                background: "#2563EB",
                color: "#FFFFFF",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
                transition: "all 0.15s ease"
              }}
            >
              Unlock Command Center →
            </button>
          </form>

          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #F1F5F9", textAlign: "center" }}>
            <Link href="/" style={{ fontSize: "0.82rem", color: "#64748B", textDecoration: "none", fontWeight: 600 }}>
              ← Return to Public Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // FULL DASHBOARD WITH DEDICATED SIDEBAR
  // ----------------------------------------------------
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC", fontFamily: "var(--font-sans)", color: "#0F172A" }}>
      
      {/* ==================================================== */}
      {/* 1. LEFT FIXED SIDEBAR */}
      {/* ==================================================== */}
      <aside
        style={{
          width: 270,
          background: "#FFFFFF",
          borderRight: "1px solid #E2E8F0",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          boxShadow: "2px 0 10px rgba(0, 0, 0, 0.02)",
          zIndex: 50,
          flexShrink: 0,
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontWeight: 900, fontSize: "1.1rem" }}>
              ⚡
            </div>
            <div>
              <div style={{ fontSize: "1rem", fontWeight: 900, letterSpacing: "-0.02em", color: "#0F172A" }}>
                DHARA COMMAND
              </div>
              <div style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 600 }}>
                Institutional CMS Enclave
              </div>
            </div>
          </div>

          {/* Operator Badge */}
          <div style={{ marginTop: 14, padding: "8px 12px", background: "#F8FAFC", borderRadius: 8, border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>
              👤 chaiwala
            </div>
            <span style={{ fontSize: "0.7rem", color: "#059669", fontWeight: 700, background: "rgba(5, 150, 105, 0.1)", padding: "2px 6px", borderRadius: 4 }}>
              ONLINE
            </span>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          
          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", padding: "8px 10px 4px" }}>
            Main Pages (CRUD)
          </div>

          {[
            { id: "home", label: "Home Page", icon: "🏠", badge: null },
            { id: "projects", label: "Projects Hub", icon: "🚀", badge: projects.length },
            { id: "intelligence", label: "Intelligence Hub", icon: "🧠", badge: articles.filter(a => a.pageType === "intelligence" || !a.pageType).length },
            { id: "guides", label: "Tactical Guides", icon: "📘", badge: articles.filter(a => a.pageType === "guides").length },
            { id: "methodology", label: "Methodology Papers", icon: "🔬", badge: articles.filter(a => a.pageType === "methodology").length },
            { id: "editorial", label: "Editorial Policy", icon: "⚖️", badge: articles.filter(a => a.pageType === "editorial").length },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id as NavSection);
                setSearchQuery("");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 12px",
                borderRadius: 8,
                border: "none",
                background: activeSection === item.id ? "#2563EB" : "transparent",
                color: activeSection === item.id ? "#FFFFFF" : "#334155",
                fontWeight: activeSection === item.id ? 700 : 600,
                fontSize: "0.86rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.12s ease",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "1.05rem" }}>{item.icon}</span>
                {item.label}
              </span>
              {item.badge !== null && (
                <span
                  style={{
                    fontSize: "0.72rem",
                    padding: "2px 7px",
                    borderRadius: 999,
                    background: activeSection === item.id ? "rgba(255,255,255,0.25)" : "#F1F5F9",
                    color: activeSection === item.id ? "#FFFFFF" : "#64748B",
                    fontWeight: 700,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", padding: "16px 10px 4px" }}>
            Site Configuration (CRUD)
          </div>

          {[
            { id: "about", label: "About Us Page", icon: "🏛️", badge: teamMembers.length + " team" },
            { id: "contact", label: "Contact Desk", icon: "📬", badge: contactMessages.filter(m => m.status === "new").length + " new" },
            { id: "automation", label: "AI Automation Studio", icon: "🤖", badge: "GROQ" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id as NavSection);
                setSearchQuery("");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 12px",
                borderRadius: 8,
                border: "none",
                background: activeSection === item.id ? "#2563EB" : "transparent",
                color: activeSection === item.id ? "#FFFFFF" : "#334155",
                fontWeight: activeSection === item.id ? 700 : 600,
                fontSize: "0.86rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.12s ease",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "1.05rem" }}>{item.icon}</span>
                {item.label}
              </span>
              {item.badge && (
                <span
                  style={{
                    fontSize: "0.7rem",
                    padding: "2px 7px",
                    borderRadius: 999,
                    background: activeSection === item.id ? "rgba(255,255,255,0.25)" : "#F1F5F9",
                    color: activeSection === item.id ? "#FFFFFF" : "#64748B",
                    fontWeight: 700,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Sidebar Footer Controls */}
        <div style={{ padding: "14px 16px", borderTop: "1px solid #F1F5F9", display: "flex", flexDirection: "column", gap: 8 }}>
          <Link
            href="/"
            target="_blank"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "8px 12px",
              borderRadius: 8,
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              color: "#334155",
              fontSize: "0.82rem",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Live Website ↗
          </Link>

          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "8px 12px",
              borderRadius: 8,
              background: "rgba(220, 38, 38, 0.06)",
              border: "1px solid rgba(220, 38, 38, 0.2)",
              color: "#DC2626",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            🔒 Lock &amp; Sign Out
          </button>
        </div>
      </aside>

      {/* ==================================================== */}
      {/* 2. MAIN WORKSPACE CANVAS */}
      {/* ==================================================== */}
      <main style={{ flex: 1, minWidth: 0, padding: "28px 36px", overflowY: "auto" }}>
        
        {/* Top Operational Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
              Dhara Enclave / {activeSection.toUpperCase()} CRUD
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
              {activeSection === "home" && "🏠 Home Page Management"}
              {activeSection === "projects" && "🚀 Verified Crypto Projects"}
              {activeSection === "intelligence" && "🧠 Market Intelligence Articles"}
              {activeSection === "guides" && "📘 Tactical Farming Guides"}
              {activeSection === "methodology" && "🔬 5-Stage Audit Methodology"}
              {activeSection === "editorial" && "⚖️ Editorial Charters & Standards"}
              {activeSection === "about" && "🏛️ About Us & Research Team"}
              {activeSection === "contact" && "📬 Contact Desk & Inquiries"}
              {activeSection === "automation" && "🤖 Autonomous AI Generation Studio"}
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 20,
                background: serverOnline ? "rgba(5, 150, 105, 0.08)" : "rgba(217, 119, 6, 0.08)",
                border: `1px solid ${serverOnline ? "rgba(5, 150, 105, 0.25)" : "rgba(217, 119, 6, 0.25)"}`,
                fontSize: "0.78rem",
                fontWeight: 600,
              }}
            >
              <span style={{ color: serverOnline ? "#059669" : "#D97706", fontWeight: 800 }}>●</span>
              <span style={{ color: serverOnline ? "#059669" : "#D97706" }}>
                DAEMON: {serverOnline ? "ONLINE (PORT 8080)" : "STANDALONE"}
              </span>
            </div>

            {/* Contextual "+ Add New" Actions */}
            {activeSection === "projects" && (
              <button
                onClick={() => {
                  setEditingProject({
                    slug: `project-${Date.now()}`,
                    name: "New Airdrop Protocol",
                    chain: "Ethereum",
                    status: ["Ongoing"],
                    reward: "$1,500 Est",
                    difficulty: "Medium",
                    time: "15 mins",
                    heat: 85,
                    desc: "Comprehensive protocol description and eligibility checklist.",
                    tags: ["Testnet", "DeFi"],
                    riskScore: 24,
                  });
                  setIsNewProject(true);
                }}
                style={{ padding: "8px 16px", borderRadius: 8, background: "#2563EB", color: "#FFF", fontWeight: 700, fontSize: "0.85rem", border: "none", cursor: "pointer", boxShadow: "0 2px 6px rgba(37,99,235,0.2)" }}
              >
                + Add Project
              </button>
            )}

            {(activeSection === "intelligence" || activeSection === "guides" || activeSection === "methodology" || activeSection === "editorial") && (
              <button
                onClick={() => {
                  const targetCat = activeSection as PageType;
                  setEditingArticle({
                    slug: `new-${activeSection}-${Date.now()}`,
                    pageType: targetCat,
                    tag: targetCat === "intelligence" ? "Market Intelligence" : targetCat === "guides" ? "Farming Playbook" : targetCat === "methodology" ? "Audit Framework" : "Editorial Standard",
                    title: `New ${targetCat.toUpperCase()} Article`,
                    excerpt: "Short introductory summary for search and feed cards.",
                    tldr: "Core executive takeaway.",
                    keyTakeaways: ["Key rule 1", "Key rule 2"],
                    date: new Date().toISOString().split("T")[0],
                    read: "10 min read",
                    authorSlug: "security-sentinel-ai",
                    body: "## Introduction\n\nEnter rich cryptographic article body here (2,200 to 2,500 words recommended)...",
                    featuredImage: "/images/generated/placeholder-featured.jpg",
                    middleImage: "/images/generated/placeholder-middle.jpg",
                    preFaqImage: "/images/generated/placeholder-pre_faq.jpg",
                    faqs: [
                      { question: "What is the primary requirement?", answer: "Follow the non-custodial testnet interaction guidelines." },
                      { question: "How does the protocol mitigate sybil vectors?", answer: "Through continuous on-chain transaction graph analysis." },
                    ],
                  });
                  setIsNewArticle(true);
                }}
                style={{ padding: "8px 16px", borderRadius: 8, background: "#2563EB", color: "#FFF", fontWeight: 700, fontSize: "0.85rem", border: "none", cursor: "pointer", boxShadow: "0 2px 6px rgba(37,99,235,0.2)" }}
              >
                + Create Article
              </button>
            )}

            {activeSection === "about" && (
              <button
                onClick={() => {
                  setEditingTeamMember({
                    id: `tm-${Date.now()}`,
                    name: "New Analyst",
                    role: "Web3 Research Specialist",
                    bio: "Analyzes on-chain liquidity depth and protocol contract safety.",
                    avatar: "/authors/editorial-desk.png",
                    credentials: "Audit Specialist",
                  });
                  setIsNewTeamMember(true);
                }}
                style={{ padding: "8px 16px", borderRadius: 8, background: "#2563EB", color: "#FFF", fontWeight: 700, fontSize: "0.85rem", border: "none", cursor: "pointer", boxShadow: "0 2px 6px rgba(37,99,235,0.2)" }}
              >
                + Add Analyst
              </button>
            )}
          </div>
        </div>

        {/* ==================================================== */}
        {/* SECTION 1: HOME PAGE CRUD */}
        {/* ==================================================== */}
        {activeSection === "home" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Bento Lead Story Config */}
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 14 }}>
                Lead Intelligence Story (CoinDesk Bento 65% Card)
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: 6 }}>
                    Select Lead Story Article
                  </label>
                  <select
                    value={homeLeadStorySlug}
                    onChange={(e) => {
                      setHomeLeadStorySlug(e.target.value);
                      addLog(`Home Lead Story set to '${e.target.value}'.`);
                    }}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: "0.9rem" }}
                  >
                    {articles.map((art) => (
                      <option key={art.slug} value={art.slug}>
                        [{art.pageType?.toUpperCase() || "BLOG"}] {art.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: 6 }}>
                    Hero Main Subtitle
                  </label>
                  <input
                    type="text"
                    value={homeHeroHeadline}
                    onChange={(e) => setHomeHeroHeadline(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: "0.9rem" }}
                  />
                </div>
              </div>
            </div>

            {/* Live Ticker Items CRUD */}
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>
                  Top Ticker Announcement Strip
                </h3>
                <button
                  onClick={() => {
                    const sym = prompt("Token Symbol (e.g. SUI):", "SUI");
                    const price = prompt("Price (e.g. $1.85):", "$1.85");
                    const chg = prompt("24h Change (e.g. +4.2%):", "+4.2%");
                    if (sym && price) {
                      setHomeTickerItems([...homeTickerItems, { sym, price, chg: chg || "0%", up: !chg?.includes("-") }]);
                      addLog(`Added ticker item: ${sym}`);
                    }
                  }}
                  style={{ padding: "6px 12px", borderRadius: 6, background: "#F1F5F9", border: "1px solid #CBD5E1", color: "#334155", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}
                >
                  + Add Ticker Item
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                {homeTickerItems.map((item, idx) => (
                  <div key={idx} style={{ padding: "12px 14px", background: "#F8FAFC", borderRadius: 8, border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>{item.sym}</div>
                      <div style={{ fontSize: "0.82rem", color: "#64748B" }}>
                        {item.price} <span style={{ color: item.up ? "#059669" : "#DC2626", fontWeight: 700 }}>{item.chg}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setHomeTickerItems(homeTickerItems.filter((_, i) => i !== idx));
                        addLog(`Removed ticker item: ${item.sym}`);
                      }}
                      style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "1rem" }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* SECTION 2: PROJECTS HUB CRUD */}
        {/* ==================================================== */}
        {activeSection === "projects" && (
          <div>
            {/* Search & Filter bar */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="Search projects by name, chain, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, minWidth: 260, padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: "0.9rem" }}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: "0.9rem", fontWeight: 600 }}
              >
                <option value="all">All Statuses</option>
                <option value="Ongoing">Ongoing Testnets</option>
                <option value="Confirmed">Confirmed Distributions</option>
                <option value="Potential">Potential Speculation</option>
              </select>
            </div>

            {/* Table */}
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                    <th style={{ padding: "12px 16px", fontWeight: 800, color: "#475569" }}>Protocol / Symbol</th>
                    <th style={{ padding: "12px 16px", fontWeight: 800, color: "#475569" }}>Blockchain</th>
                    <th style={{ padding: "12px 16px", fontWeight: 800, color: "#475569" }}>Status</th>
                    <th style={{ padding: "12px 16px", fontWeight: 800, color: "#475569" }}>Est. Reward</th>
                    <th style={{ padding: "12px 16px", fontWeight: 800, color: "#475569" }}>Risk</th>
                    <th style={{ padding: "12px 16px", fontWeight: 800, color: "#475569", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((p) => (
                    <tr key={p.slug} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 800, color: "#0F172A" }}>{p.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748B" }}>/projects/{p.slug}/</div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ padding: "3px 8px", borderRadius: 4, background: "#F1F5F9", fontWeight: 700, fontSize: "0.75rem", color: "#334155" }}>
                          {p.chain}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: 4,
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            background: p.status.includes("Confirmed") ? "rgba(5, 150, 105, 0.1)" : "rgba(37, 99, 235, 0.1)",
                            color: p.status.includes("Confirmed") ? "#059669" : "#2563EB",
                          }}
                        >
                          {p.status.join(", ")}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: "#059669" }}>
                        {p.reward}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: (p.riskScore || 20) > 40 ? "#D97706" : "#059669" }}>
                          {p.riskScore || 18}/100
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <button
                          onClick={() => {
                            setEditingProject({ ...p });
                            setIsNewProject(false);
                          }}
                          style={{ padding: "5px 10px", borderRadius: 6, background: "#F1F5F9", border: "1px solid #CBD5E1", color: "#2563EB", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", marginRight: 8 }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.slug)}
                          style={{ padding: "5px 10px", borderRadius: 6, background: "rgba(220, 38, 38, 0.08)", border: "1px solid rgba(220, 38, 38, 0.2)", color: "#DC2626", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* SECTION 3-6: ARTICLES HUBS CRUD (Intelligence, Guides, Methodology, Editorial) */}
        {/* ==================================================== */}
        {(activeSection === "intelligence" || activeSection === "guides" || activeSection === "methodology" || activeSection === "editorial") && (
          <div>
            {/* Search */}
            <div style={{ marginBottom: 20 }}>
              <input
                type="text"
                placeholder={`Search ${activeSection} articles by title or keyword...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: "0.9rem" }}
              />
            </div>

            {/* Articles Table */}
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                    <th style={{ padding: "12px 16px", fontWeight: 800, color: "#475569" }}>Article Title</th>
                    <th style={{ padding: "12px 16px", fontWeight: 800, color: "#475569" }}>Tag / Category</th>
                    <th style={{ padding: "12px 16px", fontWeight: 800, color: "#475569" }}>Word Count</th>
                    <th style={{ padding: "12px 16px", fontWeight: 800, color: "#475569" }}>8K Images</th>
                    <th style={{ padding: "12px 16px", fontWeight: 800, color: "#475569" }}>FAQs</th>
                    <th style={{ padding: "12px 16px", fontWeight: 800, color: "#475569", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getArticlesByCategory(activeSection as PageType).map((art) => {
                    const words = countWords(art.body);
                    const hasAllImages = Boolean(art.featuredImage && art.middleImage && art.preFaqImage);
                    const faqCount = art.faqs?.length || 0;

                    return (
                      <tr key={art.slug} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ fontWeight: 800, color: "#0F172A" }}>{art.title}</div>
                          <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
                            /{activeSection === "intelligence" ? "blog" : activeSection}/{art.slug}/
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ padding: "3px 8px", borderRadius: 4, background: "#F1F5F9", fontWeight: 700, fontSize: "0.75rem", color: "#334155" }}>
                            {art.tag}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span
                            style={{
                              padding: "3px 8px",
                              borderRadius: 4,
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              background: words >= 2000 ? "rgba(5, 150, 105, 0.1)" : "rgba(217, 119, 6, 0.1)",
                              color: words >= 2000 ? "#059669" : "#D97706",
                            }}
                          >
                            {words.toLocaleString()} words
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: hasAllImages ? "#059669" : "#D97706" }}>
                            {hasAllImages ? "✓ 3/3 8K Visuals" : "⚠️ Incomplete"}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: faqCount >= 4 ? "#059669" : "#D97706" }}>
                            {faqCount} FAQs Schema
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px", textAlign: "right" }}>
                          <button
                            onClick={() => {
                              setEditingArticle({ ...art });
                              setIsNewArticle(false);
                            }}
                            style={{ padding: "5px 10px", borderRadius: 6, background: "#F1F5F9", border: "1px solid #CBD5E1", color: "#2563EB", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", marginRight: 8 }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art.slug)}
                            style={{ padding: "5px 10px", borderRadius: 6, background: "rgba(220, 38, 38, 0.08)", border: "1px solid rgba(220, 38, 38, 0.2)", color: "#DC2626", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}
                          >
                            Delete
                          </button>
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
        {/* SECTION 7: ABOUT US PAGE CRUD */}
        {/* ==================================================== */}
        {activeSection === "about" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Mission Statement Editor */}
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 14 }}>
                About Us Mission &amp; Guarantees
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: 6 }}>
                    Mission Statement
                  </label>
                  <textarea
                    rows={3}
                    value={aboutMission}
                    onChange={(e) => setAboutMission(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: "0.9rem", resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: 6 }}>
                      Founding Year
                    </label>
                    <input
                      type="text"
                      value={aboutFoundingYear}
                      onChange={(e) => setAboutFoundingYear(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end" }}>
                    <button
                      onClick={() => addLog("About Us core text updated.")}
                      style={{ padding: "10px 18px", borderRadius: 8, background: "#2563EB", color: "#FFF", fontWeight: 700, border: "none", cursor: "pointer" }}
                    >
                      Save Mission Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Research Team Members CRUD */}
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 16 }}>
                Research Analysts &amp; Leadership Team
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                {teamMembers.map((member) => (
                  <div key={member.id} style={{ padding: 18, background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "1rem" }}>{member.name}</div>
                        <div style={{ fontSize: "0.78rem", color: "#2563EB", fontWeight: 700 }}>{member.role}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => {
                            setEditingTeamMember({ ...member });
                            setIsNewTeamMember(false);
                          }}
                          style={{ padding: "4px 8px", borderRadius: 4, background: "#FFFFFF", border: "1px solid #CBD5E1", fontSize: "0.72rem", cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTeamMember(member.id)}
                          style={{ padding: "4px 8px", borderRadius: 4, background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)", color: "#DC2626", fontSize: "0.72rem", cursor: "pointer" }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.5, margin: "0 0 8px" }}>{member.bio}</p>
                    <div style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 600 }}>🎓 {member.credentials}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* SECTION 8: CONTACT DESK & INQUIRIES CRUD */}
        {/* ==================================================== */}
        {activeSection === "contact" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Departments */}
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 14 }}>
                Department Routing Inboxes
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                {contactInboxes.map((inbox) => (
                  <div key={inbox.id} style={{ padding: 16, background: "#F8FAFC", borderRadius: 8, border: "1px solid #E2E8F0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontWeight: 800, fontSize: "0.92rem" }}>{inbox.title}</span>
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.1)", padding: "2px 6px", borderRadius: 4 }}>
                        {inbox.sla}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#2563EB", fontWeight: 600, marginBottom: 6 }}>
                      {inbox.email}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#64748B", lineHeight: 1.4 }}>
                      {inbox.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inquiries Table */}
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>
                  Incoming Contact Submissions &amp; Reports ({contactMessages.length})
                </h3>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                    <th style={{ padding: "12px 16px", fontWeight: 800, color: "#475569" }}>Sender</th>
                    <th style={{ padding: "12px 16px", fontWeight: 800, color: "#475569" }}>Department</th>
                    <th style={{ padding: "12px 16px", fontWeight: 800, color: "#475569" }}>Subject</th>
                    <th style={{ padding: "12px 16px", fontWeight: 800, color: "#475569" }}>Date</th>
                    <th style={{ padding: "12px 16px", fontWeight: 800, color: "#475569" }}>Status</th>
                    <th style={{ padding: "12px 16px", fontWeight: 800, color: "#475569", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contactMessages.map((msg) => (
                    <tr key={msg.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 800 }}>{msg.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748B" }}>{msg.email}</div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#334155" }}>
                          {msg.department}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontWeight: 600 }}>
                        {msg.subject}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "0.78rem", color: "#64748B" }}>
                        {msg.date}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <button
                          onClick={() => toggleMessageStatus(msg.id)}
                          style={{
                            padding: "3px 8px",
                            borderRadius: 4,
                            fontWeight: 700,
                            fontSize: "0.72rem",
                            border: "none",
                            cursor: "pointer",
                            background: msg.status === "new" ? "rgba(220, 38, 38, 0.1)" : msg.status === "read" ? "rgba(37, 99, 235, 0.1)" : "rgba(5, 150, 105, 0.1)",
                            color: msg.status === "new" ? "#DC2626" : msg.status === "read" ? "#2563EB" : "#059669",
                          }}
                        >
                          {msg.status.toUpperCase()}
                        </button>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <button
                          onClick={() => setViewingMessage(msg)}
                          style={{ padding: "5px 10px", borderRadius: 6, background: "#F1F5F9", border: "1px solid #CBD5E1", color: "#2563EB", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", marginRight: 8 }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          style={{ padding: "5px 10px", borderRadius: 6, background: "rgba(220, 38, 38, 0.08)", border: "1px solid rgba(220, 38, 38, 0.2)", color: "#DC2626", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* SECTION 9: AI AUTOMATION STUDIO */}
        {/* ==================================================== */}
        {activeSection === "automation" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Automation Trigger Card */}
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: "1.5rem" }}>🤖</span>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 900, margin: 0 }}>
                    Autonomous Groq AI &amp; 8K Image Engine
                  </h3>
                  <div style={{ fontSize: "0.82rem", color: "#64748B" }}>
                    Generates 2,200-2,500 word deep-dive guides with 3 unique 8K studio visuals and 4-6 schema FAQs.
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "220px 1fr auto", gap: 14, marginTop: 18 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: 6 }}>
                    Target Hub
                  </label>
                  <select
                    value={autoCategory}
                    onChange={(e) => setAutoCategory(e.target.value as PageType)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: "0.9rem", fontWeight: 600 }}
                  >
                    <option value="intelligence">🧠 Intelligence Hub</option>
                    <option value="guides">📘 Tactical Guides</option>
                    <option value="methodology">🔬 Methodology Hub</option>
                    <option value="editorial">⚖️ Editorial Policy</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: 6 }}>
                    Research Topic / Protocol Keyword
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Movement Network Move-EVM Bridge Security Framework 2026"
                    value={autoTopic}
                    onChange={(e) => setAutoTopic(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: "0.9rem" }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button
                    onClick={handleRunAutomation}
                    disabled={isRunningAuto}
                    style={{
                      padding: "11px 22px",
                      borderRadius: 8,
                      background: isRunningAuto ? "#94A3B8" : "#2563EB",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      fontSize: "0.92rem",
                      border: "none",
                      cursor: isRunningAuto ? "not-allowed" : "pointer",
                      boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
                    }}
                  >
                    {isRunningAuto ? "⚡ Synthesizing..." : "Run Generator →"}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Terminal */}
            <div style={{ background: "#0F172A", borderRadius: 12, border: "1px solid #334155", padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, borderBottom: "1px solid #1E293B", paddingBottom: 10 }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#38BDF8", fontFamily: "monospace" }}>
                  ● LIVE DAEMON LOGS
                </span>
                <button
                  onClick={() => setTerminalLog(["[SYSTEM] Log cleared."])}
                  style={{ background: "none", border: "none", color: "#64748B", fontSize: "0.75rem", cursor: "pointer" }}
                >
                  Clear Terminal
                </button>
              </div>
              <div style={{ height: 260, overflowY: "auto", fontFamily: "monospace", fontSize: "0.82rem", color: "#E2E8F0", display: "flex", flexDirection: "column", gap: 6 }}>
                {terminalLog.map((log, idx) => (
                  <div key={idx} style={{ color: log.includes("[ERROR]") ? "#F87171" : log.includes("[SUCCESS]") ? "#4ADE80" : "#E2E8F0" }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ==================================================== */}
      {/* EDIT/ADD PROJECT MODAL */}
      {/* ==================================================== */}
      {editingProject && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: "#FFFFFF", borderRadius: 16, maxWidth: 640, width: "100%", maxHeight: "90vh", overflowY: "auto", padding: 28, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 900, marginBottom: 18 }}>
              {isNewProject ? "Create New Crypto Project" : `Edit Project: ${editingProject.name}`}
            </h2>

            <form onSubmit={handleSaveProject} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Name</label>
                  <input
                    type="text"
                    required
                    value={editingProject.name}
                    onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Slug</label>
                  <input
                    type="text"
                    required
                    disabled={!isNewProject}
                    value={editingProject.slug}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", background: isNewProject ? "#FFF" : "#F1F5F9" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Chain</label>
                  <input
                    type="text"
                    required
                    value={editingProject.chain}
                    onChange={(e) => setEditingProject({ ...editingProject, chain: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Reward</label>
                  <input
                    type="text"
                    value={editingProject.reward}
                    onChange={(e) => setEditingProject({ ...editingProject, reward: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Difficulty</label>
                  <select
                    value={editingProject.difficulty}
                    onChange={(e) => setEditingProject({ ...editingProject, difficulty: e.target.value as Difficulty })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1" }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Description</label>
                <textarea
                  rows={3}
                  value={editingProject.desc}
                  onChange={(e) => setEditingProject({ ...editingProject, desc: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  style={{ padding: "8px 16px", borderRadius: 6, background: "#F1F5F9", border: "1px solid #CBD5E1", cursor: "pointer", fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", borderRadius: 6, background: "#2563EB", color: "#FFF", border: "none", cursor: "pointer", fontWeight: 700 }}
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* EDIT/ADD ARTICLE MODAL */}
      {/* ==================================================== */}
      {editingArticle && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: "#FFFFFF", borderRadius: 16, maxWidth: 820, width: "100%", maxHeight: "90vh", overflowY: "auto", padding: 28, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 900, margin: 0 }}>
                {isNewArticle ? "Draft New Article" : `Edit: ${editingArticle.title}`}
              </h2>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: countWords(editingArticle.body) >= 2000 ? "#059669" : "#D97706" }}>
                Word Count: {countWords(editingArticle.body).toLocaleString()} words
              </span>
            </div>

            <form onSubmit={handleSaveArticle} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Title</label>
                  <input
                    type="text"
                    required
                    value={editingArticle.title}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Slug</label>
                  <input
                    type="text"
                    required
                    disabled={!isNewArticle}
                    value={editingArticle.slug}
                    onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", background: isNewArticle ? "#FFF" : "#F1F5F9" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Excerpt (Summary)</label>
                <textarea
                  rows={2}
                  value={editingArticle.excerpt}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Featured 8K Image</label>
                  <input
                    type="text"
                    value={editingArticle.featuredImage || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, featuredImage: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "0.78rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Middle 8K Image</label>
                  <input
                    type="text"
                    value={editingArticle.middleImage || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, middleImage: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "0.78rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Pre-FAQ 8K Image</label>
                  <input
                    type="text"
                    value={editingArticle.preFaqImage || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, preFaqImage: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "0.78rem" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                  Full Article Body Markdown (2,200 to 2,500 words)
                </label>
                <textarea
                  rows={10}
                  value={editingArticle.body}
                  onChange={(e) => setEditingArticle({ ...editingArticle, body: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.5 }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  style={{ padding: "8px 16px", borderRadius: 6, background: "#F1F5F9", border: "1px solid #CBD5E1", cursor: "pointer", fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", borderRadius: 6, background: "#2563EB", color: "#FFF", border: "none", cursor: "pointer", fontWeight: 700 }}
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* VIEW CONTACT INQUIRY MODAL */}
      {/* ==================================================== */}
      {viewingMessage && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: "#FFFFFF", borderRadius: 16, maxWidth: 540, width: "100%", padding: 28, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2563EB", background: "rgba(37,99,235,0.1)", padding: "2px 8px", borderRadius: 4 }}>
                  {viewingMessage.department}
                </span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 900, margin: "8px 0 2px" }}>{viewingMessage.subject}</h3>
                <div style={{ fontSize: "0.8rem", color: "#64748B" }}>
                  From: {viewingMessage.name} &lt;{viewingMessage.email}&gt; · {viewingMessage.date}
                </div>
              </div>
              <button
                onClick={() => setViewingMessage(null)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#94A3B8" }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: "#F8FAFC", borderRadius: 8, padding: 16, border: "1px solid #E2E8F0", fontSize: "0.9rem", lineHeight: 1.6, color: "#334155", marginBottom: 20 }}>
              {viewingMessage.message}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <a
                href={`mailto:${viewingMessage.email}?subject=Re: ${viewingMessage.subject}`}
                style={{ padding: "8px 16px", borderRadius: 6, background: "#2563EB", color: "#FFF", fontWeight: 700, textDecoration: "none", fontSize: "0.85rem" }}
              >
                Draft Email Reply ↗
              </a>
              <button
                onClick={() => {
                  toggleMessageStatus(viewingMessage.id);
                  setViewingMessage(null);
                }}
                style={{ padding: "8px 16px", borderRadius: 6, background: "#F1F5F9", border: "1px solid #CBD5E1", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}
              >
                Mark as Handled
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
