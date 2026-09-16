"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import type { ProjectItem, Article, PageType, Difficulty, AirdropStatus } from "@/lib/types";

// Default seed data
import initialProjectsData from "@/data/projects.json";
import initialArticlesData from "@/data/articles.json";
import initialMethodologyStepsData from "@/data/methodology_framework.json";
import initialEditorialPillarsData from "@/data/editorial_framework.json";
import initialTickerData from "@/data/ticker.json";

interface TickerItem {
  id?: number;
  sym: string;
  price: string;
  chg: string;
  up: boolean;
  sort?: number;
}

interface MethodologyStepItem {
  step: string;
  title: string;
  icon: string;
  desc: string;
  metric: string;
}

interface EditorialPillarItem {
  num: string;
  title: string;
  desc: string;
  badge: string;
}

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
  credentials?: string;
  twitter?: string;
  linkedin?: string;
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

function ImageUploadBox({
  label,
  guideline,
  aspectRatio = "16:9",
  prefix = "upload",
  value,
  onChange,
  authToken,
  apiBase,
}: {
  label: string;
  guideline: string;
  aspectRatio?: "1:1" | "16:9";
  prefix?: string;
  value?: string;
  onChange: (url: string) => void;
  authToken: string;
  apiBase: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Max file size is 5MB");
      return;
    }

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", prefix);

    try {
      const res = await fetch(`${apiBase}/upload.php`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        onChange(data.url);
      } else {
        setUploadError(data.error || "Upload failed");
      }
    } catch (err: any) {
      setUploadError(err.message || "Network upload error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const previewHeight = aspectRatio === "1:1" ? 120 : 96;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155" }}>
        {label}
      </label>

      {/* Preview Box */}
      <div
        style={{
          width: "100%",
          height: previewHeight,
          borderRadius: 8,
          border: "2px dashed #CBD5E1",
          background: "#F8FAFC",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {value ? (
          <img
            src={value}
            alt={label}
            style={{
              width: "100%",
              height: "100%",
              objectFit: aspectRatio === "1:1" ? "contain" : "cover",
            }}
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "8px" }}>
            <span style={{ fontSize: "1.3rem", display: "block" }}>📷</span>
            <span style={{ fontSize: "0.72rem", color: "#94A3B8", fontWeight: 600 }}>No image uploaded</span>
          </div>
        )}

        {uploading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(15, 23, 42, 0.75)",
              color: "#FFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.76rem",
              fontWeight: 700,
              gap: 6,
              backdropFilter: "blur(2px)",
            }}
          >
            ⏳ Uploading &amp; Optimizing...
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Action Buttons & Guideline */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: "5px 10px",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#2563EB",
            background: "rgba(37,99,235,0.08)",
            border: "1px solid rgba(37,99,235,0.25)",
            borderRadius: 6,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          📁 {value ? "Replace Image" : "Upload Image"}
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            style={{
              background: "none",
              border: "none",
              fontSize: "0.72rem",
              color: "#EF4444",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ✕ Remove
          </button>
        )}
      </div>

      {uploadError && (
        <span style={{ fontSize: "0.72rem", color: "#EF4444", fontWeight: 600 }}>
          ⚠️ {uploadError}
        </span>
      )}

      <span style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 500 }}>
        {guideline}
      </span>
    </div>
  );
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

  const getApiBase = () => {
    if (typeof window !== "undefined") {
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return "https://cryptoairdropai.com/api";
      }
      return "/api";
    }
    return "https://cryptoairdropai.com/api";
  };

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("dhara_token") || "37568849179a39c94e5561a5e804d494a65c05651b7e51f8d393e4bbd24289a7";
    }
    return "37568849179a39c94e5561a5e804d494a65c05651b7e51f8d393e4bbd24289a7";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${getApiBase()}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput.trim(), password: passwordInput }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        sessionStorage.setItem("dhara_authenticated", "true");
        sessionStorage.setItem("dhara_token", data.token);
        setIsAuthenticated(true);
        setAuthError("");
        return;
      }
    } catch (err) {
      console.warn("API login network fallback:", err);
    }

    // Local fallback check
    if (usernameInput.trim() === "chaiwala" && passwordInput === "Hostinger ki masi 4786") {
      sessionStorage.setItem("dhara_authenticated", "true");
      sessionStorage.setItem("dhara_token", "37568849179a39c94e5561a5e804d494a65c05651b7e51f8d393e4bbd24289a7");
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid username or password. Access denied.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("dhara_authenticated");
    sessionStorage.removeItem("dhara_token");
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
  const [homeTickerItems, setHomeTickerItems] = useState<TickerItem[]>(
    (initialTickerData.ticker || [
      { sym: "BTC", price: "$64,250", chg: "+2.4%", up: true },
      { sym: "ETH", price: "$3,480", chg: "+1.8%", up: true },
      { sym: "SOL", price: "$152", chg: "-0.5%", up: false },
      { sym: "BERA", price: "$14.20", chg: "+8.9%", up: true },
      { sym: "MONAD", price: "$28.50", chg: "+12.1%", up: true },
    ]) as TickerItem[]
  );
  const [alphaTitle, setAlphaTitle] = useState(initialTickerData.alphaDispatch?.title || "2026 Security Playbook →");
  const [alphaUrl, setAlphaUrl] = useState(initialTickerData.alphaDispatch?.url || "/blog/how-to-farm-airdrops-safely-2026/");
  const [editingTickerItem, setEditingTickerItem] = useState<TickerItem | null>(null);
  const [isNewTicker, setIsNewTicker] = useState(false);

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

  // Framework Steps & Pillars CRUD
  const [methodologySteps, setMethodologySteps] = useState<MethodologyStepItem[]>(initialMethodologyStepsData as MethodologyStepItem[]);
  const [editorialPillars, setEditorialPillars] = useState<EditorialPillarItem[]>(initialEditorialPillarsData as EditorialPillarItem[]);
  const [editingStep, setEditingStep] = useState<MethodologyStepItem | null>(null);
  const [editingPillar, setEditingPillar] = useState<EditorialPillarItem | null>(null);

  // Check database connectivity & load live records
  useEffect(() => {
    async function loadDatabaseData() {
      try {
        const apiBase = getApiBase();
        const [projRes, artRes, methRes, editRes, tickerRes] = await Promise.all([
          fetch(`${apiBase}/projects.php?all=1`),
          fetch(`${apiBase}/articles.php?all=1`),
          fetch(`${apiBase}/framework.php?type=methodology`),
          fetch(`${apiBase}/framework.php?type=editorial`),
          fetch(`${apiBase}/ticker.php`)
        ]);

        if (tickerRes && tickerRes.ok) {
          const tickerJson = await tickerRes.json();
          if (Array.isArray(tickerJson.ticker) && tickerJson.ticker.length > 0) {
            setHomeTickerItems(tickerJson.ticker);
          }
          if (tickerJson.alphaDispatch && tickerJson.alphaDispatch.title) {
            setAlphaTitle(tickerJson.alphaDispatch.title);
            setAlphaUrl(tickerJson.alphaDispatch.url);
          }
        }

        if (methRes && methRes.ok) {
          const methJson = await methRes.json();
          if (Array.isArray(methJson.steps) && methJson.steps.length > 0) {
            setMethodologySteps(methJson.steps);
          }
        }

        if (editRes && editRes.ok) {
          const editJson = await editRes.json();
          if (Array.isArray(editJson.pillars) && editJson.pillars.length > 0) {
            setEditorialPillars(editJson.pillars);
          }
        }

        if (projRes.ok && artRes.ok) {
          const projJson = await projRes.json();
          const artJson = await artRes.json();

          if (Array.isArray(projJson.projects) && projJson.projects.length > 0) {
            setProjects(projJson.projects);
          }
          if (Array.isArray(artJson.articles) && artJson.articles.length > 0) {
            setArticles(artJson.articles);
          }

          setServerOnline(true);
          addLog(`[DB] Connected to Hostinger MySQL: loaded ${projJson.count || projJson.projects?.length} projects & ${artJson.count || artJson.articles?.length} articles.`);
          return;
        }
      } catch (e) {
        addLog(`[DB WARNING] Live API connection failed: ${e}. Using local cached snapshot.`);
      }
      setServerOnline(false);
    }
    loadDatabaseData();
  }, []);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setTerminalLog((prev) => [`[${time}] ${msg}`, ...prev]);
  };

  // ----------------------------------------------------
  // Projects CRUD Handlers (Direct MySQL REST API)
  // ----------------------------------------------------
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const token = getAuthToken();
    const isNew = isNewProject;
    const url = isNew 
      ? `${getApiBase()}/projects.php` 
      : `${getApiBase()}/projects.php?slug=${encodeURIComponent(editingProject.slug)}`;
    const method = isNew ? "POST" : "PUT";

    const payload: ProjectItem = {
      ...editingProject,
      featuredImage: editingProject.featuredImage?.trim() || `/images/generated/${editingProject.slug}-project.jpg`,
    };

    addLog(`[DB] Sending ${method} for project '${payload.slug}'...`);
    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const resData = await res.json();
        const saved = resData.project || payload;
        if (isNew) {
          setProjects((prev) => [saved, ...prev]);
          addLog(`[SUCCESS] Project created in MySQL: ${saved.name} (${saved.slug})`);
        } else {
          setProjects((prev) => prev.map((p) => (p.slug === saved.slug ? saved : p)));
          addLog(`[SUCCESS] Project updated in MySQL: ${saved.name} (${saved.slug})`);
        }
      } else {
        const err = await res.json();
        addLog(`[ERROR] Database save error: ${err.error || res.statusText}`);
      }
    } catch (err) {
      addLog(`[ERROR] Network error saving project: ${err}`);
      if (isNew) {
        setProjects((prev) => [payload, ...prev]);
      } else {
        setProjects((prev) => prev.map((p) => (p.slug === payload.slug ? payload : p)));
      }
    }
    setEditingProject(null);
  };

  const handleDeleteProject = async (slug: string) => {
    if (!confirm(`Are you sure you want to permanently delete project '${slug}' from the database?`)) return;

    const token = getAuthToken();
    addLog(`[DB] Deleting project '${slug}' from MySQL...`);
    try {
      const res = await fetch(`${getApiBase()}/projects.php?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.slug !== slug));
        addLog(`[SUCCESS] Project '${slug}' deleted from MySQL database.`);
      } else {
        const err = await res.json();
        addLog(`[ERROR] Deletion failed: ${err.error || res.statusText}`);
      }
    } catch (err) {
      addLog(`[ERROR] Network error deleting project: ${err}`);
      setProjects((prev) => prev.filter((p) => p.slug !== slug));
    }
  };

  // ----------------------------------------------------
  // Articles CRUD Handlers (Intelligence, Guides, Methodology, Editorial)
  // ----------------------------------------------------
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    const token = getAuthToken();
    const isNew = isNewArticle;
    const url = isNew 
      ? `${getApiBase()}/articles.php` 
      : `${getApiBase()}/articles.php?slug=${encodeURIComponent(editingArticle.slug)}`;
    const method = isNew ? "POST" : "PUT";

    const isSpecializedSection = editingArticle.pageType === "methodology" || editingArticle.pageType === "editorial";
    const payload: Article = {
      ...editingArticle,
      featuredImage: editingArticle.featuredImage?.trim() || (isSpecializedSection ? "" : `/images/generated/${editingArticle.slug}-featured.jpg`),
      middleImage: editingArticle.middleImage?.trim() || (isSpecializedSection ? "" : `/images/generated/${editingArticle.slug}-middle.jpg`),
      preFaqImage: editingArticle.preFaqImage?.trim() || (isSpecializedSection ? "" : `/images/generated/${editingArticle.slug}-pre_faq.jpg`),
    };

    const pageTypeStr = (payload.pageType || 'intelligence').toUpperCase();
    addLog(`[DB] Sending ${method} for [${pageTypeStr}] '${payload.slug}'...`);
    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const resData = await res.json();
        const saved = resData.article || payload;
        if (isNew) {
          setArticles((prev) => [saved, ...prev]);
          addLog(`[SUCCESS] Article created in MySQL: ${saved.title} (${saved.slug})`);
        } else {
          setArticles((prev) => prev.map((a) => (a.slug === saved.slug ? saved : a)));
          addLog(`[SUCCESS] Article updated in MySQL: ${saved.title} (${saved.slug})`);
        }
      } else {
        const err = await res.json();
        addLog(`[ERROR] Database save error: ${err.error || res.statusText}`);
      }
    } catch (err) {
      addLog(`[ERROR] Network error saving article: ${err}`);
      if (isNew) {
        setArticles((prev) => [payload, ...prev]);
      } else {
        setArticles((prev) => prev.map((a) => (a.slug === payload.slug ? payload : a)));
      }
    }
    setEditingArticle(null);
  };

  const handleDeleteArticle = async (slug: string) => {
    if (!confirm(`Are you sure you want to permanently delete article '${slug}' from the database?`)) return;

    const token = getAuthToken();
    addLog(`[DB] Deleting article '${slug}' from MySQL...`);
    try {
      const res = await fetch(`${getApiBase()}/articles.php?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.slug !== slug));
        addLog(`[SUCCESS] Article '${slug}' deleted from MySQL database.`);
      } else {
        const err = await res.json();
        addLog(`[ERROR] Deletion failed: ${err.error || res.statusText}`);
      }
    } catch (err) {
      addLog(`[ERROR] Network error deleting article: ${err}`);
      setArticles((prev) => prev.filter((a) => a.slug !== slug));
    }
  };

  // ----------------------------------------------------
  // Framework Steps & Pillars Handlers
  // ----------------------------------------------------
  const handleSaveMethodologyStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStep) return;
    const updated = methodologySteps.map((s) => s.step === editingStep.step ? editingStep : s);
    setMethodologySteps(updated);
    addLog(`[FRAMEWORK] Updated Methodology Stage ${editingStep.step}: ${editingStep.title}`);
    try {
      const token = getAuthToken();
      await fetch(`${getApiBase()}/framework.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ type: "methodology", steps: updated })
      });
      addLog(`[SUCCESS] Methodology Framework saved live.`);
    } catch (err) {
      addLog(`[FRAMEWORK] Saved locally: ${err}`);
    }
    setEditingStep(null);
  };

  const handleSaveEditorialPillar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPillar) return;
    const updated = editorialPillars.map((p) => p.num === editingPillar.num ? editingPillar : p);
    setEditorialPillars(updated);
    addLog(`[FRAMEWORK] Updated Editorial Pillar ${editingPillar.num}: ${editingPillar.title}`);
    try {
      const token = getAuthToken();
      await fetch(`${getApiBase()}/framework.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ type: "editorial", pillars: updated })
      });
      addLog(`[SUCCESS] Editorial Pillars saved live.`);
    } catch (err) {
      addLog(`[FRAMEWORK] Saved locally: ${err}`);
    }
    setEditingPillar(null);
  };

  // ----------------------------------------------------
  // Live Ticker & Alpha Dispatch Handlers
  // ----------------------------------------------------
  const handleSaveTickerItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTickerItem) return;

    const isUp = !editingTickerItem.chg.startsWith("-");
    const payload = {
      ...editingTickerItem,
      sym: editingTickerItem.sym.toUpperCase(),
      up: isUp
    };

    try {
      const token = getAuthToken();
      const method = isNewTicker ? "POST" : "PUT";
      const url = isNewTicker ? `${getApiBase()}/ticker.php` : `${getApiBase()}/ticker.php?id=${editingTickerItem.id}`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (isNewTicker && data.item) {
          setHomeTickerItems([...homeTickerItems, data.item]);
          addLog(`[TICKER] Added ticker symbol: ${data.item.sym} (${data.item.price})`);
        } else if (data.item) {
          setHomeTickerItems(homeTickerItems.map(item => item.id === data.item.id ? data.item : item));
          addLog(`[TICKER] Updated ticker symbol: ${data.item.sym} (${data.item.price})`);
        }
      } else {
        if (isNewTicker) {
          setHomeTickerItems([...homeTickerItems, { ...payload, id: Date.now() }]);
        } else {
          setHomeTickerItems(homeTickerItems.map(item => (item.id && item.id === editingTickerItem.id) || item.sym === editingTickerItem.sym ? payload : item));
        }
        addLog(`[TICKER] Saved locally (${data?.error || 'fallback'})`);
      }
    } catch (err) {
      if (isNewTicker) {
        setHomeTickerItems([...homeTickerItems, { ...payload, id: Date.now() }]);
      } else {
        setHomeTickerItems(homeTickerItems.map(item => (item.id && item.id === editingTickerItem.id) || item.sym === editingTickerItem.sym ? payload : item));
      }
      addLog(`[TICKER] Saved locally: ${err}`);
    }
    setEditingTickerItem(null);
  };

  const handleDeleteTickerItem = async (item: TickerItem, idx: number) => {
    if (!confirm(`Delete ticker symbol ${item.sym}?`)) return;

    setHomeTickerItems(homeTickerItems.filter((_, i) => i !== idx));
    addLog(`[TICKER] Removed ticker symbol: ${item.sym}`);

    if (item.id) {
      try {
        const token = getAuthToken();
        await fetch(`${getApiBase()}/ticker.php?id=${item.id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
        addLog(`[TICKER] Deleted from live database: ${item.sym}`);
      } catch (err) {
        addLog(`[TICKER] Removed locally, error deleting from DB: ${err}`);
      }
    }
  };

  const handleSaveAlphaDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      const res = await fetch(`${getApiBase()}/ticker.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          alphaDispatch: {
            title: alphaTitle,
            url: alphaUrl
          }
        })
      });
      if (res.ok) {
        addLog(`[TICKER] Alpha Dispatch link saved live: ${alphaTitle}`);
      } else {
        addLog(`[TICKER] Alpha Dispatch saved locally.`);
      }
    } catch (err) {
      addLog(`[TICKER] Alpha Dispatch saved locally: ${err}`);
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
            { id: "home", label: "Home", icon: "🏠", badge: null },
            { id: "projects", label: "Projects", icon: "🚀", badge: projects.length },
            { id: "intelligence", label: "Intelligence", icon: "🧠", badge: articles.filter(a => a.pageType === "intelligence" || !a.pageType).length },
            { id: "guides", label: "Guides", icon: "📘", badge: articles.filter(a => a.pageType === "guides").length },
            { id: "methodology", label: "Methodology", icon: "🔬", badge: articles.filter(a => a.pageType === "methodology").length },
            { id: "editorial", label: "Editorial", icon: "🛡️", badge: articles.filter(a => a.pageType === "editorial").length },
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
            { id: "about", label: "About", icon: "🏛️", badge: teamMembers.length + " team" },
            { id: "contact", label: "Inquiries", icon: "📩", badge: contactMessages.filter(m => m.status === "new").length + " new" },
            { id: "automation", label: "Automation", icon: "🤖", badge: "GROQ" },
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
              {activeSection === "home" && "🏠 Home Page"}
              {activeSection === "projects" && "🚀 Projects"}
              {activeSection === "intelligence" && "🧠 Intelligence"}
              {activeSection === "guides" && "📘 Guides"}
              {activeSection === "methodology" && "🔬 Methodology"}
              {activeSection === "editorial" && "🛡️ Editorial"}
              {activeSection === "about" && "🏛️ About"}
              {activeSection === "contact" && "📩 Inquiries"}
              {activeSection === "automation" && "🤖 Automation"}
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
                DATABASE: {serverOnline ? "HOSTINGER MYSQL (LIVE)" : "STANDALONE SNAPSHOT"}
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
                {activeSection === "methodology" 
                  ? "+ Add Methodology Paper" 
                  : activeSection === "editorial" 
                    ? "+ Add Editorial Policy" 
                    : activeSection === "guides" 
                      ? "+ Add Guide" 
                      : "+ Add Article"}
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
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>
                    Top Ticker Market Strip
                  </h3>
                  <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "#64748B" }}>
                    Live tokens shown at the very top of the homepage. Updates reflect immediately on the site.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingTickerItem({ sym: "", price: "$", chg: "+0.0%", up: true });
                    setIsNewTicker(true);
                  }}
                  style={{ padding: "8px 14px", borderRadius: 8, background: "#2563EB", border: "none", color: "#FFFFFF", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <span>+</span> Add Ticker Item
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
                {homeTickerItems.map((item, idx) => (
                  <div key={item.id || item.sym || idx} style={{ padding: "14px 16px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "1rem", color: "#0F172A", letterSpacing: "0.5px" }}>{item.sym}</div>
                      <div style={{ fontSize: "0.85rem", color: "#475569", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                        <b>{item.price}</b> 
                        <span style={{ color: item.up ? "#059669" : "#DC2626", fontWeight: 700, fontSize: "0.8rem", background: item.up ? "rgba(5, 150, 105, 0.1)" : "rgba(220, 38, 38, 0.1)", padding: "1px 6px", borderRadius: 4 }}>
                          {item.chg}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button
                        type="button"
                        title="Edit Ticker"
                        onClick={() => {
                          setEditingTickerItem(item);
                          setIsNewTicker(false);
                        }}
                        style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: 6, color: "#2563EB", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700, padding: "4px 8px" }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        title="Delete Ticker"
                        onClick={() => handleDeleteTickerItem(item, idx)}
                        style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: 6, color: "#DC2626", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700, padding: "4px 8px" }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Alpha Dispatch Announcement Link */}
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>
                  Alpha Dispatch Announcement Link
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "#64748B" }}>
                  The featured notice link displayed on the right side of the top ticker strip.
                </p>
              </div>

              <form onSubmit={handleSaveAlphaDispatch} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: 6 }}>
                      Link Title / Text
                    </label>
                    <input
                      type="text"
                      required
                      value={alphaTitle}
                      onChange={(e) => setAlphaTitle(e.target.value)}
                      placeholder="2026 Security Playbook →"
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: "0.9rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#475569", marginBottom: 6 }}>
                      Target Destination URL
                    </label>
                    <input
                      type="text"
                      required
                      value={alphaUrl}
                      onChange={(e) => setAlphaUrl(e.target.value)}
                      placeholder="/blog/how-to-farm-airdrops-safely-2026/"
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: "0.9rem" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                  <div style={{ fontSize: "0.82rem", color: "#64748B" }}>
                    Live Preview: <b style={{ color: "#2563EB" }}>ALPHA DISPATCH: </b> <span style={{ color: "#0F172A", fontWeight: 600 }}>{alphaTitle}</span> ({alphaUrl})
                  </div>
                  <button
                    type="submit"
                    style={{ padding: "9px 18px", borderRadius: 8, background: "#059669", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
                  >
                    Save Alpha Dispatch
                  </button>
                </div>
              </form>
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
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <img
                            src={p.featuredImage || `/images/generated/${p.slug}-project.jpg`}
                            alt={p.name}
                            style={{ width: 38, height: 38, borderRadius: 8, objectFit: "contain", background: "#F8FAFC", border: "1px solid #E2E8F0", padding: 2 }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='38' height='38' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 800, color: "#0F172A" }}>{p.name}</div>
                            <div style={{ fontSize: "0.75rem", color: "#64748B" }}>/projects/{p.slug}/</div>
                          </div>
                        </div>
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
                    const sectionPath = activeSection === "intelligence" 
                      ? "blog" 
                      : activeSection === "editorial" 
                        ? "editorial-policy" 
                        : activeSection;

                    return (
                      <tr key={art.slug} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            {(activeSection === "intelligence" || activeSection === "guides") && (
                              <img
                                src={art.featuredImage || (art.slug ? `/images/generated/${art.slug}-featured.jpg` : "")}
                                alt={art.title}
                                style={{ width: 46, height: 32, borderRadius: 6, objectFit: "cover", background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='46' height='32' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
                                }}
                              />
                            )}
                            <div>
                              <div style={{ fontWeight: 800, color: "#0F172A" }}>{art.title}</div>
                              <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
                                /{sectionPath}/{art.slug}/
                              </div>
                            </div>
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
                          {(activeSection === "intelligence" || activeSection === "guides") ? (
                            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: hasAllImages ? "#059669" : "#D97706" }}>
                              {hasAllImages ? "✓ 3/3 Visuals" : "⚠️ Upload Visuals"}
                            </span>
                          ) : (
                            <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#94A3B8" }}>
                              — Text Only
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: faqCount >= 4 ? "#059669" : "#D97706" }}>
                            {faqCount} FAQs Schema
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px", textAlign: "right" }}>
                          <a
                            href={`https://cryptoairdropai.com/${sectionPath}/${art.slug}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ padding: "5px 10px", borderRadius: 6, background: "#F1F5F9", border: "1px solid #CBD5E1", color: "#059669", fontWeight: 700, fontSize: "0.78rem", textDecoration: "none", marginRight: 8, display: "inline-block" }}
                          >
                            View ↗
                          </a>
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

            {/* Live Methodology 5-Stage Framework Editor */}
            {activeSection === "methodology" && (
              <div style={{ marginTop: 36, background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>
                      🛡️ The 5-Stage Audit Framework Configuration (Live Bento)
                    </h3>
                    <p style={{ color: "#64748B", fontSize: "0.82rem", margin: "4px 0 0" }}>
                      Configure the 5 quantitative filter stages displayed prominently on the public /methodology/ page.
                    </p>
                  </div>
                  <a
                    href="https://cryptoairdropai.com/methodology/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: "6px 12px", borderRadius: 6, background: "#F1F5F9", border: "1px solid #CBD5E1", color: "#059669", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none" }}
                  >
                    View Public Methodology Page ↗
                  </a>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {methodologySteps.map((step) => (
                    <div key={step.step} style={{ padding: 16, background: "#F8FAFC", borderRadius: 8, border: "1px solid #E2E8F0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                        <div style={{ fontSize: "1.6rem" }}>{step.icon}</div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontWeight: 800, fontSize: "0.95rem" }}>Stage {step.step}: {step.title}</span>
                            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#059669", background: "rgba(5,150,105,0.1)", padding: "2px 6px", borderRadius: 4 }}>{step.metric}</span>
                          </div>
                          <div style={{ fontSize: "0.83rem", color: "#475569", lineHeight: 1.5 }}>{step.desc}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditingStep({ ...step })}
                        style={{ padding: "6px 12px", borderRadius: 6, background: "#FFFFFF", border: "1px solid #CBD5E1", color: "#2563EB", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", flexShrink: 0 }}
                      >
                        Edit Stage
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live Editorial 4-Pillars Framework Editor */}
            {activeSection === "editorial" && (
              <div style={{ marginTop: 36, background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>
                      ⚖️ 4 Pillars of Integrity Framework Configuration (Live Bento)
                    </h3>
                    <p style={{ color: "#64748B", fontSize: "0.82rem", margin: "4px 0 0" }}>
                      Configure the 4 core pillars displayed prominently on the public /editorial-policy/ page.
                    </p>
                  </div>
                  <a
                    href="https://cryptoairdropai.com/editorial-policy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: "6px 12px", borderRadius: 6, background: "#F1F5F9", border: "1px solid #CBD5E1", color: "#059669", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none" }}
                  >
                    View Public Editorial Policy Page ↗
                  </a>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
                  {editorialPillars.map((pillar) => (
                    <div key={pillar.num} style={{ padding: 16, background: "#F8FAFC", borderRadius: 8, border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#2563EB" }}>{pillar.num}</span>
                          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#2563EB", background: "rgba(37,99,235,0.1)", padding: "2px 6px", borderRadius: 4 }}>{pillar.badge}</span>
                        </div>
                        <div style={{ fontWeight: 800, fontSize: "0.95rem", marginBottom: 6 }}>{pillar.title}</div>
                        <div style={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.5, marginBottom: 14 }}>{pillar.desc}</div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => setEditingPillar({ ...pillar })}
                          style={{ padding: "6px 12px", borderRadius: 6, background: "#FFFFFF", border: "1px solid #CBD5E1", color: "#2563EB", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}
                        >
                          Edit Pillar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                    <option value="intelligence">🧠 Intelligence</option>
                    <option value="guides">📘 Guides</option>
                    <option value="methodology">🔬 Methodology</option>
                    <option value="editorial">🛡️ Editorial</option>
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

              {/* Project Logo / Card Image Upload */}
              <div style={{ border: "1px solid #E2E8F0", borderRadius: 8, padding: 14, background: "#F8FAFC" }}>
                <ImageUploadBox
                  label="Project Logo / Card Image"
                  guideline="Recommended: 1:1 Square (e.g. 500x500 px) • Auto WebP • Max 5MB"
                  aspectRatio="1:1"
                  prefix="project"
                  value={editingProject.featuredImage || (editingProject.slug ? `/images/generated/${editingProject.slug}-project.jpg` : "")}
                  onChange={(url) => setEditingProject({ ...editingProject, featuredImage: url })}
                  authToken={getAuthToken()}
                  apiBase={getApiBase()}
                />
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
              {/* Category & Tag Bar */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Target Hub / Section</label>
                  <select
                    value={editingArticle.pageType || "intelligence"}
                    onChange={(e) => setEditingArticle({ ...editingArticle, pageType: e.target.value as PageType })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontWeight: 700, background: "#FFFFFF" }}
                  >
                    <option value="intelligence">🧠 Intelligence (/blog/)</option>
                    <option value="guides">📘 Guides (/guides/)</option>
                    <option value="methodology">🔬 Methodology (/methodology/)</option>
                    <option value="editorial">🛡️ Editorial (/editorial-policy/)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Badge / Tag</label>
                  <input
                    type="text"
                    required
                    value={editingArticle.tag || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, tag: e.target.value })}
                    placeholder="e.g. Audit Framework, Editorial Standard, Farming Playbook"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1" }}
                  />
                </div>
              </div>

              {/* Title & Slug */}
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
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Slug (URL Identifier)</label>
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

              {/* Author, Read Time, Date */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Author</label>
                  <select
                    value={editingArticle.authorSlug || "security-sentinel-ai"}
                    onChange={(e) => setEditingArticle({ ...editingArticle, authorSlug: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFFFFF" }}
                  >
                    <option value="security-sentinel-ai">Security Sentinel AI</option>
                    <option value="ai-intelligence-engine">AI Intelligence Engine</option>
                    <option value="editorial-desk">Editorial Desk</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Estimated Read Time</label>
                  <input
                    type="text"
                    value={editingArticle.read || "8 min read"}
                    onChange={(e) => setEditingArticle({ ...editingArticle, read: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Publish Date</label>
                  <input
                    type="date"
                    value={editingArticle.date || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setEditingArticle({ ...editingArticle, date: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1" }}
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Excerpt (Summary for Cards)</label>
                <textarea
                  rows={2}
                  value={editingArticle.excerpt}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1" }}
                />
              </div>

              {/* TLDR */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>TL;DR Executive Takeaway</label>
                <input
                  type="text"
                  value={editingArticle.tldr || ""}
                  onChange={(e) => setEditingArticle({ ...editingArticle, tldr: e.target.value })}
                  placeholder="Single key takeaway for executive preview"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1" }}
                />
              </div>

              {/* 3 Dedicated Image Slots for Intelligence & Guides only */}
              {(editingArticle.pageType === "intelligence" || editingArticle.pageType === "guides" || !editingArticle.pageType) && (
                <div style={{ border: "1px solid #E2E8F0", borderRadius: 8, padding: 16, background: "#F8FAFC" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <label style={{ fontSize: "0.86rem", fontWeight: 800, color: "#1E293B", margin: 0 }}>
                      📸 Article Visuals (3 Dedicated Image Slots)
                    </label>
                    <span style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 600 }}>
                      Upload directly from computer • Auto WebP
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                    <ImageUploadBox
                      label="1. Featured Header Banner"
                      guideline="Header 16:9 (e.g. 1200x675) • Max 5MB"
                      aspectRatio="16:9"
                      prefix="featured"
                      value={editingArticle.featuredImage || (editingArticle.slug ? `/images/generated/${editingArticle.slug}-featured.jpg` : "")}
                      onChange={(url) => setEditingArticle({ ...editingArticle, featuredImage: url })}
                      authToken={getAuthToken()}
                      apiBase={getApiBase()}
                    />
                    <ImageUploadBox
                      label="2. Middle In-Article Image"
                      guideline="In-Article 16:9 (e.g. 1200x675) • Max 5MB"
                      aspectRatio="16:9"
                      prefix="middle"
                      value={editingArticle.middleImage || (editingArticle.slug ? `/images/generated/${editingArticle.slug}-middle.jpg` : "")}
                      onChange={(url) => setEditingArticle({ ...editingArticle, middleImage: url })}
                      authToken={getAuthToken()}
                      apiBase={getApiBase()}
                    />
                    <ImageUploadBox
                      label="3. Pre-FAQ Visual Infographic"
                      guideline="Pre-FAQ 16:9 (e.g. 1200x675) • Max 5MB"
                      aspectRatio="16:9"
                      prefix="pre_faq"
                      value={editingArticle.preFaqImage || (editingArticle.slug ? `/images/generated/${editingArticle.slug}-pre_faq.jpg` : "")}
                      onChange={(url) => setEditingArticle({ ...editingArticle, preFaqImage: url })}
                      authToken={getAuthToken()}
                      apiBase={getApiBase()}
                    />
                  </div>
                </div>
              )}

              {/* Article Body */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                  Full Article Body Markdown (2,200 to 2,500 words)
                </label>
                <textarea
                  rows={9}
                  value={editingArticle.body}
                  onChange={(e) => setEditingArticle({ ...editingArticle, body: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.5 }}
                />
              </div>

              {/* Structured Schema FAQs Editor */}
              <div style={{ border: "1px solid #E2E8F0", borderRadius: 8, padding: 14, background: "#F8FAFC" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 800, color: "#1E293B", margin: 0 }}>
                    Structured Schema FAQs ({editingArticle.faqs?.length || 0})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const currentFaqs = editingArticle.faqs || [];
                      setEditingArticle({
                        ...editingArticle,
                        faqs: [...currentFaqs, { question: "New FAQ Question?", answer: "Comprehensive, factual answer." }]
                      });
                    }}
                    style={{ padding: "4px 10px", borderRadius: 4, background: "#2563EB", color: "#FFF", border: "none", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                  >
                    + Add FAQ
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 180, overflowY: "auto" }}>
                  {(editingArticle.faqs || []).map((faq, fIdx) => (
                    <div key={fIdx} style={{ background: "#FFF", border: "1px solid #CBD5E1", borderRadius: 6, padding: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                        <input
                          type="text"
                          placeholder="Question"
                          value={faq.question}
                          onChange={(e) => {
                            const next = [...(editingArticle.faqs || [])];
                            next[fIdx].question = e.target.value;
                            setEditingArticle({ ...editingArticle, faqs: next });
                          }}
                          style={{ flex: 1, padding: "6px 8px", borderRadius: 4, border: "1px solid #E2E8F0", fontSize: "0.82rem", fontWeight: 700 }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = (editingArticle.faqs || []).filter((_, i) => i !== fIdx);
                            setEditingArticle({ ...editingArticle, faqs: next });
                          }}
                          style={{ background: "rgba(220,38,38,0.1)", border: "none", color: "#DC2626", borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700 }}
                        >
                          ✕
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Answer"
                        value={faq.answer}
                        onChange={(e) => {
                          const next = [...(editingArticle.faqs || [])];
                          next[fIdx].answer = e.target.value;
                          setEditingArticle({ ...editingArticle, faqs: next });
                        }}
                        style={{ width: "100%", padding: "6px 8px", borderRadius: 4, border: "1px solid #E2E8F0", fontSize: "0.8rem", resize: "vertical" }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Public URL Live Banner */}
              <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 6, padding: "8px 12px", fontSize: "0.8rem", color: "#1D4ED8", display: "flex", alignItems: "center", gap: 6 }}>
                <span>🔗 Public URL:</span>
                <strong>
                  https://cryptoairdropai.com/{editingArticle.pageType === 'intelligence' ? 'blog' : editingArticle.pageType === 'editorial' ? 'editorial-policy' : editingArticle.pageType || 'blog'}/{editingArticle.slug}/
                </strong>
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
      {/* EDIT METHODOLOGY STAGE MODAL */}
      {/* ==================================================== */}
      {editingStep && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, padding: 20 }}>
          <div style={{ background: "#FFFFFF", borderRadius: 16, maxWidth: 540, width: "100%", padding: 28, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 900, margin: "0 0 16px" }}>
              Edit Methodology Stage {editingStep.step}
            </h2>
            <form onSubmit={handleSaveMethodologyStep} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Icon</label>
                  <input
                    type="text"
                    required
                    value={editingStep.icon}
                    onChange={(e) => setEditingStep({ ...editingStep, icon: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "1.2rem", textAlign: "center" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Stage Title</label>
                  <input
                    type="text"
                    required
                    value={editingStep.title}
                    onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1" }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Metric / Badge</label>
                <input
                  type="text"
                  required
                  value={editingStep.metric}
                  onChange={(e) => setEditingStep({ ...editingStep, metric: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Description</label>
                <textarea
                  rows={4}
                  required
                  value={editingStep.desc}
                  onChange={(e) => setEditingStep({ ...editingStep, desc: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "0.85rem", resize: "vertical" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setEditingStep(null)}
                  style={{ padding: "8px 16px", borderRadius: 6, background: "#F1F5F9", border: "1px solid #CBD5E1", cursor: "pointer", fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", borderRadius: 6, background: "#2563EB", color: "#FFF", border: "none", cursor: "pointer", fontWeight: 700 }}
                >
                  Save Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* EDIT EDITORIAL PILLAR MODAL */}
      {/* ==================================================== */}
      {editingPillar && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, padding: 20 }}>
          <div style={{ background: "#FFFFFF", borderRadius: 16, maxWidth: 540, width: "100%", padding: 28, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 900, margin: "0 0 16px" }}>
              Edit Editorial Pillar {editingPillar.num}
            </h2>
            <form onSubmit={handleSaveEditorialPillar} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Pillar Title</label>
                  <input
                    type="text"
                    required
                    value={editingPillar.title}
                    onChange={(e) => setEditingPillar({ ...editingPillar, title: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Badge / Tag</label>
                  <input
                    type="text"
                    required
                    value={editingPillar.badge}
                    onChange={(e) => setEditingPillar({ ...editingPillar, badge: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1" }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>Description</label>
                <textarea
                  rows={4}
                  required
                  value={editingPillar.desc}
                  onChange={(e) => setEditingPillar({ ...editingPillar, desc: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "0.85rem", resize: "vertical" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setEditingPillar(null)}
                  style={{ padding: "8px 16px", borderRadius: 6, background: "#F1F5F9", border: "1px solid #CBD5E1", cursor: "pointer", fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", borderRadius: 6, background: "#2563EB", color: "#FFF", border: "none", cursor: "pointer", fontWeight: 700 }}
                >
                  Save Pillar
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

      {/* ==================================================== */}
      {/* EDIT / ADD TICKER ITEM MODAL */}
      {/* ==================================================== */}
      {editingTickerItem && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, padding: 20 }}>
          <div style={{ background: "#FFFFFF", borderRadius: 16, maxWidth: 460, width: "100%", padding: 28, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 900, margin: "0 0 16px" }}>
              {isNewTicker ? "Add Ticker Item" : `Edit Ticker: ${editingTickerItem.sym}`}
            </h2>
            <form onSubmit={handleSaveTickerItem} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                  Symbol (e.g. BTC, ETH, SUI, MONAD)
                </label>
                <input
                  type="text"
                  required
                  placeholder="BTC"
                  value={editingTickerItem.sym}
                  onChange={(e) => setEditingTickerItem({ ...editingTickerItem, sym: e.target.value.toUpperCase() })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontWeight: 700 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                    Price (e.g. $64,250)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="$64,250"
                    value={editingTickerItem.price}
                    onChange={(e) => setEditingTickerItem({ ...editingTickerItem, price: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                    24h Change (e.g. +2.4% / -1.5%)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+2.4%"
                    value={editingTickerItem.chg}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingTickerItem({
                        ...editingTickerItem,
                        chg: val,
                        up: !val.startsWith("-")
                      });
                    }}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1" }}
                  />
                </div>
              </div>

              {/* Live Preview Badge */}
              <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px 14px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Live Preview:</span>
                <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>
                  {editingTickerItem.sym || "TOKEN"}: <b>{editingTickerItem.price || "$0.00"}</b>{" "}
                  <span style={{ color: !editingTickerItem.chg.startsWith("-") ? "#059669" : "#DC2626", fontWeight: 800 }}>
                    {editingTickerItem.chg || "+0.0%"}
                  </span>
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setEditingTickerItem(null)}
                  style={{ padding: "8px 16px", borderRadius: 6, background: "#F1F5F9", border: "1px solid #CBD5E1", cursor: "pointer", fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", borderRadius: 6, background: "#2563EB", color: "#FFF", border: "none", cursor: "pointer", fontWeight: 700 }}
                >
                  {isNewTicker ? "Add Item" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
