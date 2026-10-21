"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import type { TrackedAirdrop, TrackerCategory, TrackerStatus, DailyRoutine, TrackerStats } from "@/lib/types";
import seedData from "@/data/tracker_seed.json";

interface AirdropTrackerProps {
  apiBase: string;
  authToken: string;
  onLog?: (msg: string) => void;
}

const CATEGORY_CONFIG: Record<TrackerCategory, { label: string; icon: string; bg: string; color: string; border: string }> = {
  tap_to_earn: {
    label: "Tap-to-Earn (Telegram)",
    icon: "👆",
    bg: "#FDF4FF",
    color: "#C026D3",
    border: "#F5D0FE",
  },
  depin_node: {
    label: "DePIN / Node Mining",
    icon: "📡",
    bg: "#EFF6FF",
    color: "#2563EB",
    border: "#BFDBFE",
  },
  testnet: {
    label: "Zero-Cost Testnet",
    icon: "🧪",
    bg: "#ECFDF5",
    color: "#059669",
    border: "#A7F3D0",
  },
  retroactive: {
    label: "Retroactive / Mainnet",
    icon: "⛓️",
    bg: "#FFFBEB",
    color: "#D97706",
    border: "#FDE68A",
  },
  quest_social: {
    label: "Social / Daily Quest",
    icon: "🎯",
    bg: "#F0FDF4",
    color: "#16A34A",
    border: "#BBF7D0",
  },
  staking_defi: {
    label: "DeFi / Liquidity Staking",
    icon: "🥩",
    bg: "#EEF2FF",
    color: "#4F46E5",
    border: "#C7D2FE",
  },
  gaming_web3: {
    label: "Web3 Gaming",
    icon: "🎮",
    bg: "#FFF1F2",
    color: "#E11D48",
    border: "#FECDD3",
  },
};

const STATUS_CONFIG: Record<TrackerStatus, { label: string; icon: string; bg: string; color: string; border: string }> = {
  active: {
    label: "Active Farming",
    icon: "🟢",
    bg: "#ECFDF5",
    color: "#059669",
    border: "#A7F3D0",
  },
  snapshot: {
    label: "Snapshot Taken",
    icon: "🟡",
    bg: "#FFFBEB",
    color: "#D97706",
    border: "#FDE68A",
  },
  listing_soon: {
    label: "Listing Soon (TGE)",
    icon: "🚀",
    bg: "#FDF4FF",
    color: "#9333EA",
    border: "#E9D5FF",
  },
  claim_open: {
    label: "Claim Live",
    icon: "💎",
    bg: "#EFF6FF",
    color: "#1D4ED8",
    border: "#BFDBFE",
  },
  completed: {
    label: "Distributed / Ended",
    icon: "✅",
    bg: "#F1F5F9",
    color: "#475569",
    border: "#CBD5E1",
  },
  dropped: {
    label: "Dropped / Scam",
    icon: "❌",
    bg: "#FEF2F2",
    color: "#DC2626",
    border: "#FECACA",
  },
};

const ROUTINE_CONFIG: Record<DailyRoutine, { label: string; icon: string }> = {
  daily_tap: { label: "Daily Tap / Continuous", icon: "⚡" },
  daily_claim: { label: "Daily Check-in (1x/day)", icon: "📅" },
  eight_hour: { label: "Every 8 Hours (Claim)", icon: "⏳" },
  passive_node: { label: "100% Passive Node", icon: "🌐" },
  weekly_tx: { label: "Weekly Transactions", icon: "🔄" },
  as_needed: { label: "As Tasks Drop", icon: "🔔" },
};

export default function AirdropTracker({ apiBase, authToken, onLog }: AirdropTrackerProps) {
  const [items, setItems] = useState<TrackedAirdrop[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("dhara_airdrop_tracker");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // fallback to seed
      }
    }
    return seedData as TrackedAirdrop[];
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [activeNoteModal, setActiveNoteModal] = useState<TrackedAirdrop | null>(null);

  // Keep a stable ref to onLog to prevent parent re-renders from triggering re-fetches
  const onLogRef = useRef(onLog);
  useEffect(() => {
    onLogRef.current = onLog;
  }, [onLog]);

  // Guard ref to ensure initial API fetch only runs once on component mount
  const hasFetchedRef = useRef(false);

  // Debounce timers map per item & field
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && items.length > 0) {
      localStorage.setItem("dhara_airdrop_tracker", JSON.stringify(items));
    }
  }, [items]);

  // Fetch initial data from Hostinger MySQL API
  const fetchFromApi = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/tracker.php`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
          if (onLogRef.current) onLogRef.current(`[SYNC] Loaded ${data.items.length} airdrops from Hostinger MySQL.`);
        }
      }
    } catch (err) {
      console.warn("Tracker fetch failed, using local/cached state:", err);
    } finally {
      setLoading(false);
    }
  }, [apiBase, authToken]);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchFromApi();
    }
  }, [fetchFromApi]);

  // Real-time Auto-Save to Backend API
  const triggerAutoSave = useCallback(
    async (id: number | string, field: string, value: any, updatedRow?: TrackedAirdrop) => {
      setSaveStatus("saving");
      try {
        const res = await fetch(`${apiBase}/tracker.php`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            id,
            field,
            value,
            ...(updatedRow ? { updates: updatedRow } : {}),
          }),
        });

        if (res.ok) {
          setSaveStatus("saved");
          if (onLogRef.current) onLogRef.current(`[AUTO-SAVED] Field '${field}' for item #${id} saved.`);
        } else {
          setSaveStatus("error");
        }
      } catch (err) {
        console.warn("Auto-save network error, saved to local storage:", err);
        setSaveStatus("error");
      }
    },
    [apiBase, authToken]
  );

  // Handle Local State Change + Debounced/Instant Auto-Save
  const handleItemChange = (
    id: number | string,
    field: keyof TrackedAirdrop,
    val: any,
    instantSave = false
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: val };

          // Auto-recalculate expectedUsd when expectedTokens or estPrice changes
          if (field === "expectedTokens" || field === "estPrice") {
            const tokens = field === "expectedTokens" ? val : item.expectedTokens || "0";
            const price = field === "estPrice" ? Number(val) : item.estPrice || 0;
            const numericTokens = parseFloat(String(tokens).replace(/[^0-9.]/g, "")) || 0;
            updated.expectedUsd = Math.round(numericTokens * price * 100) / 100;
          }

          if (instantSave) {
            triggerAutoSave(id, field as string, val, updated);
          } else {
            // Debounce text inputs (400ms)
            const timerKey = `${id}_${String(field)}`;
            if (debounceTimers.current[timerKey]) {
              clearTimeout(debounceTimers.current[timerKey]);
            }
            setSaveStatus("saving");
            debounceTimers.current[timerKey] = setTimeout(() => {
              triggerAutoSave(id, field as string, val, updated);
              delete debounceTimers.current[timerKey];
            }, 400);
          }

          return updated;
        }
        return item;
      })
    );
  };

  // Add New Empty Row
  const handleAddNew = async () => {
    const tempId = Date.now();
    const newItem: TrackedAirdrop = {
      id: tempId,
      projectName: "New Airdrop",
      category: "tap_to_earn",
      status: "active",
      listingDate: "",
      listingQuarter: "Q4 2026",
      expectedTokens: "10000",
      estPrice: 0.01,
      expectedUsd: 100.0,
      actualReceivedUsd: 0.0,
      accountsCount: 1,
      dailyRoutine: "daily_claim",
      farmUrl: "",
      notes: "Enter strategy, wallet addresses, and claim notes here...",
      dailyTaskDone: false,
      sortOrder: 0,
    };

    setItems((prev) => [newItem, ...prev]);

    // Send to server
    try {
      const res = await fetch(`${apiBase}/tracker.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(newItem),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.item && data.item.id) {
          setItems((prev) =>
            prev.map((it) => (it.id === tempId ? { ...data.item } : it))
          );
          if (onLog) onLog(`[SUCCESS] Created new tracked airdrop #${data.item.id}`);
        }
      }
    } catch {
      // Retain local optimistic item
    }
  };

  // Delete Row
  const handleDelete = async (id: number | string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from your tracker?`)) return;

    setItems((prev) => prev.filter((it) => it.id !== id));

    try {
      await fetch(`${apiBase}/tracker.php?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (onLog) onLog(`[DELETED] Airdrop #${id} removed.`);
    } catch (err) {
      console.warn("Delete error:", err);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "Project Name",
      "Category",
      "Status",
      "Listing Date",
      "Listing Quarter",
      "Tokens Farmed",
      "Est Price ($)",
      "Expected USD ($)",
      "Actual Received USD ($)",
      "Accounts Count",
      "Daily Routine",
      "Farm Link",
      "Notes",
    ];

    const rows = items.map((it) => [
      `"${(it.projectName || "").replace(/"/g, '""')}"`,
      `"${it.category}"`,
      `"${it.status}"`,
      `"${it.listingDate || ""}"`,
      `"${it.listingQuarter || ""}"`,
      `"${it.expectedTokens || "0"}"`,
      it.estPrice || 0,
      it.expectedUsd || 0,
      it.actualReceivedUsd || 0,
      it.accountsCount || 1,
      `"${it.dailyRoutine}"`,
      `"${(it.farmUrl || "").replace(/"/g, '""')}"`,
      `"${(it.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cryptoairdrop_portfolio_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPI Calculations
  const stats: TrackerStats = useMemo(() => {
    let totalActive = 0;
    let totalExpectedUsd = 0;
    let totalActualUsd = 0;
    let listingThisMonth = 0;
    let dailyPending = 0;
    const currentMonth = new Date().toISOString().slice(0, 7);

    items.forEach((it) => {
      if (it.status === "active") totalActive++;
      totalExpectedUsd += Number(it.expectedUsd || 0);
      totalActualUsd += Number(it.actualReceivedUsd || 0);

      if (it.listingDate && it.listingDate.startsWith(currentMonth)) {
        listingThisMonth++;
      }

      if (it.status === "active" && !it.dailyTaskDone) {
        dailyPending++;
      }
    });

    return {
      totalItems: items.length,
      totalActive,
      totalExpectedUsd: Math.round(totalExpectedUsd * 100) / 100,
      totalActualUsd: Math.round(totalActualUsd * 100) / 100,
      listingThisMonth,
      dailyPending,
    };
  }, [items]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      if (filterCategory !== "all" && it.category !== filterCategory) return false;
      if (filterStatus !== "all" && it.status !== filterStatus) return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchName = it.projectName.toLowerCase().includes(q);
        const matchNotes = (it.notes || "").toLowerCase().includes(q);
        const matchQuarter = (it.listingQuarter || "").toLowerCase().includes(q);
        if (!matchName && !matchNotes && !matchQuarter) return false;
      }
      return true;
    });
  }, [items, filterCategory, filterStatus, searchQuery]);

  // Countdown Helper
  const getDaysCountdown = (dateStr?: string) => {
    if (!dateStr) return null;
    const target = new Date(dateStr).getTime();
    const today = new Date().setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { text: "Today!", color: "#DC2626", urgent: true };
    if (diffDays === 1) return { text: "Tomorrow!", color: "#EA580C", urgent: true };
    if (diffDays > 1 && diffDays <= 7) return { text: `${diffDays} days left`, color: "#D97706", urgent: true };
    if (diffDays > 7) return { text: `${diffDays} days`, color: "#059669", urgent: false };
    return { text: "Past Due", color: "#64748B", urgent: false };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {/* ------------------------------------------------------------- */}
      {/* 1. Header Toolbar & Real-Time Sync Indicator                  */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid #E2E8F0",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "1.5rem" }}>📊</span>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
              Airdrop Portfolio & Operations Tracker
            </h2>
            {/* Auto-Save Indicator Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 9999,
                fontSize: "0.74rem",
                fontWeight: 700,
                background:
                  saveStatus === "saved"
                    ? "#ECFDF5"
                    : saveStatus === "saving"
                    ? "#FFFBEB"
                    : "#FEF2F2",
                color:
                  saveStatus === "saved"
                    ? "#059669"
                    : saveStatus === "saving"
                    ? "#D97706"
                    : "#DC2626",
                border: `1px solid ${
                  saveStatus === "saved"
                    ? "#A7F3D0"
                    : saveStatus === "saving"
                    ? "#FDE68A"
                    : "#FECACA"
                }`,
                transition: "all 0.2s ease",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background:
                    saveStatus === "saved"
                      ? "#10B981"
                      : saveStatus === "saving"
                      ? "#F59E0B"
                      : "#EF4444",
                }}
              />
              {saveStatus === "saved" && "Hostinger Live ✓ Auto-Saved"}
              {saveStatus === "saving" && "Saving changes..."}
              {saveStatus === "error" && "Sync Offline (Saved locally)"}
            </div>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: "0.84rem", color: "#64748B" }}>
            Track live farming status, listing dates, expected token allocations & automated daily routines. All edits save automatically.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={fetchFromApi}
            disabled={loading}
            style={{
              padding: "9px 14px",
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              background: "#F8FAFC",
              color: "#334155",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            title="Refresh latest data from Hostinger MySQL"
          >
            🔄 {loading ? "Syncing..." : "Sync Live"}
          </button>

          <button
            onClick={handleExportCSV}
            style={{
              padding: "9px 14px",
              borderRadius: 8,
              border: "1px solid #CBD5E1",
              background: "#FFFFFF",
              color: "#0F172A",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            📥 Export CSV
          </button>

          <button
            onClick={handleAddNew}
            style={{
              padding: "9px 16px",
              borderRadius: 8,
              border: "none",
              background: "#2563EB",
              color: "#FFFFFF",
              fontSize: "0.84rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 2px 6px rgba(37,99,235,0.25)",
            }}
          >
            + Add Airdrop Track
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. Top Summary KPI Cards                                      */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 16,
        }}
      >
        {/* Metric 1 */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 14,
            border: "1px solid #E2E8F0",
            padding: "18px 20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Active Farms
            </span>
            <span style={{ fontSize: "1.2rem" }}>🌱</span>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0F172A" }}>
            {stats.totalActive}{" "}
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#94A3B8" }}>
              / {stats.totalItems} total
            </span>
          </div>
          <div style={{ fontSize: "0.76rem", color: "#059669", fontWeight: 600 }}>
            🟢 Ongoing farming campaigns
          </div>
        </div>

        {/* Metric 2 */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 14,
            border: "1px solid #E2E8F0",
            padding: "18px 20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Est. Portfolio Value
            </span>
            <span style={{ fontSize: "1.2rem" }}>💰</span>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#2563EB" }}>
            ${stats.totalExpectedUsd.toLocaleString()}{" "}
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748B" }}>USD</span>
          </div>
          <div style={{ fontSize: "0.76rem", color: "#64748B" }}>
            Actual Claimed: <strong style={{ color: "#059669" }}>${stats.totalActualUsd.toLocaleString()}</strong>
          </div>
        </div>

        {/* Metric 3 */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 14,
            border: "1px solid #E2E8F0",
            padding: "18px 20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Listing This Month
            </span>
            <span style={{ fontSize: "1.2rem" }}>🔥</span>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#D97706" }}>
            {stats.listingThisMonth}{" "}
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#94A3B8" }}>Projects</span>
          </div>
          <div style={{ fontSize: "0.76rem", color: "#D97706", fontWeight: 600 }}>
            TGE / Exchange listing imminent
          </div>
        </div>

        {/* Metric 4 */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 14,
            border: "1px solid #E2E8F0",
            padding: "18px 20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Daily Tasks Pending
            </span>
            <span style={{ fontSize: "1.2rem" }}>⏰</span>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: stats.dailyPending > 0 ? "#EA580C" : "#059669" }}>
            {stats.dailyPending}{" "}
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#94A3B8" }}>Routines</span>
          </div>
          <div style={{ fontSize: "0.76rem", color: "#64748B" }}>
            {stats.dailyPending === 0 ? "🎉 All daily claims completed!" : "Tap & check-ins to perform today"}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. Filter, Search & View Controls                             */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 14,
          border: "1px solid #E2E8F0",
          padding: "14px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 260 }}>
          <span style={{ color: "#94A3B8", fontSize: "0.95rem" }}>🔍</span>
          <input
            type="text"
            placeholder="Search airdrops by project name, notes, or quarter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "7px 12px",
              border: "1px solid #E2E8F0",
              borderRadius: 8,
              fontSize: "0.86rem",
              outline: "none",
              color: "#1E293B",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Category Dropdown Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: "7px 12px",
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              fontSize: "0.82rem",
              fontWeight: 600,
              background: "#F8FAFC",
              color: "#334155",
              cursor: "pointer",
            }}
          >
            <option value="all">All Categories ({items.length})</option>
            {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.icon} {cfg.label}
              </option>
            ))}
          </select>

          {/* Status Dropdown Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: "7px 12px",
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              fontSize: "0.82rem",
              fontWeight: 600,
              background: "#F8FAFC",
              color: "#334155",
              cursor: "pointer",
            }}
          >
            <option value="all">All Statuses ({items.length})</option>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.icon} {cfg.label}
              </option>
            ))}
          </select>

          {/* View Toggle */}
          <div
            style={{
              display: "flex",
              borderRadius: 8,
              background: "#F1F5F9",
              padding: 3,
              gap: 2,
            }}
          >
            <button
              onClick={() => setViewMode("table")}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                background: viewMode === "table" ? "#FFFFFF" : "transparent",
                color: viewMode === "table" ? "#2563EB" : "#64748B",
                fontWeight: 700,
                fontSize: "0.78rem",
                cursor: "pointer",
                boxShadow: viewMode === "table" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              }}
            >
              📑 Spreadsheet Table
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                background: viewMode === "kanban" ? "#FFFFFF" : "transparent",
                color: viewMode === "kanban" ? "#2563EB" : "#64748B",
                fontWeight: 700,
                fontSize: "0.78rem",
                cursor: "pointer",
                boxShadow: viewMode === "kanban" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              }}
            >
              📋 Kanban Board
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. SPREADSHEET GRID VIEW (Inline Auto-Save Table)             */}
      {/* ------------------------------------------------------------- */}
      {viewMode === "table" && (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 14,
            border: "1px solid #E2E8F0",
            overflowX: "auto",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "0.82rem",
            }}
          >
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#475569" }}>
                <th style={{ padding: "12px 14px", fontWeight: 700, width: 44, textAlign: "center" }}>✓</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, minWidth: 170 }}>Project Name</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, minWidth: 170 }}>Airdrop Type</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, minWidth: 150 }}>Farming Status</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, minWidth: 160 }}>Listing / TGE</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, minWidth: 110 }}>Tokens / Pts</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, minWidth: 95 }}>Est. Price ($)</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, minWidth: 110 }}>Est. Value ($)</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, minWidth: 70, textAlign: "center" }}>Accs</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, minWidth: 140 }}>Daily Routine</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, minWidth: 80, textAlign: "center" }}>Launch</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, minWidth: 140 }}>Notes / Strategy</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, width: 50, textAlign: "center" }}>Del</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={13} style={{ padding: 48, textAlign: "center", color: "#94A3B8" }}>
                    <div style={{ fontSize: "2rem", marginBottom: 8 }}>📭</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#475569" }}>
                      No airdrops match your search or filter
                    </div>
                    <p style={{ margin: "4px 0 16px", fontSize: "0.82rem" }}>
                      Add a new airdrop or clear active filters.
                    </p>
                    <button
                      onClick={handleAddNew}
                      style={{
                        padding: "7px 16px",
                        borderRadius: 6,
                        border: "none",
                        background: "#2563EB",
                        color: "#FFFFFF",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      + Add New Airdrop Track
                    </button>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const countdown = getDaysCountdown(item.listingDate);
                  const catCfg = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.tap_to_earn;
                  const statCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.active;

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: "1px solid #F1F5F9",
                        transition: "background 0.15s ease",
                        background: item.dailyTaskDone ? "#FAFDFB" : "#FFFFFF",
                      }}
                    >
                      {/* 1. Daily Task Done Checkbox */}
                      <td style={{ padding: "10px 14px", textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={!!item.dailyTaskDone}
                          onChange={(e) =>
                            handleItemChange(item.id, "dailyTaskDone", e.target.checked, true)
                          }
                          title="Check when today's farming/check-in action is completed"
                          style={{
                            cursor: "pointer",
                            width: 17,
                            height: 17,
                            accentColor: "#059669",
                          }}
                        />
                      </td>

                      {/* 2. Project Name (Inline text input) */}
                      <td style={{ padding: "8px 10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: "1rem" }}>{catCfg.icon}</span>
                          <input
                            type="text"
                            value={item.projectName}
                            onChange={(e) => handleItemChange(item.id, "projectName", e.target.value)}
                            placeholder="Airdrop Name"
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              border: "1px solid transparent",
                              borderRadius: 6,
                              fontWeight: 700,
                              color: "#0F172A",
                              fontSize: "0.86rem",
                              background: "transparent",
                              outline: "none",
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.border = "1px solid #93C5FD";
                              e.currentTarget.style.background = "#F8FAFC";
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.border = "1px solid transparent";
                              e.currentTarget.style.background = "transparent";
                            }}
                          />
                        </div>
                      </td>

                      {/* 3. Category Dropdown */}
                      <td style={{ padding: "8px 10px" }}>
                        <select
                          value={item.category}
                          onChange={(e) =>
                            handleItemChange(item.id, "category", e.target.value as TrackerCategory, true)
                          }
                          style={{
                            width: "100%",
                            padding: "5px 8px",
                            borderRadius: 6,
                            border: `1px solid ${catCfg.border}`,
                            background: catCfg.bg,
                            color: catCfg.color,
                            fontWeight: 700,
                            fontSize: "0.76rem",
                            cursor: "pointer",
                            outline: "none",
                          }}
                        >
                          {Object.entries(CATEGORY_CONFIG).map(([cKey, cCfg]) => (
                            <option key={cKey} value={cKey}>
                              {cCfg.icon} {cCfg.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 4. Status Dropdown */}
                      <td style={{ padding: "8px 10px" }}>
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleItemChange(item.id, "status", e.target.value as TrackerStatus, true)
                          }
                          style={{
                            width: "100%",
                            padding: "5px 8px",
                            borderRadius: 6,
                            border: `1px solid ${statCfg.border}`,
                            background: statCfg.bg,
                            color: statCfg.color,
                            fontWeight: 700,
                            fontSize: "0.76rem",
                            cursor: "pointer",
                            outline: "none",
                          }}
                        >
                          {Object.entries(STATUS_CONFIG).map(([sKey, sCfg]) => (
                            <option key={sKey} value={sKey}>
                              {sCfg.icon} {sCfg.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 5. Listing / TGE Date */}
                      <td style={{ padding: "8px 10px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <input
                            type="date"
                            value={item.listingDate || ""}
                            onChange={(e) =>
                              handleItemChange(item.id, "listingDate", e.target.value, true)
                            }
                            style={{
                              padding: "4px 6px",
                              borderRadius: 6,
                              border: "1px solid #E2E8F0",
                              fontSize: "0.76rem",
                              color: "#334155",
                              outline: "none",
                              background: "#F8FAFC",
                            }}
                          />
                          {countdown && (
                            <span
                              style={{
                                fontSize: "0.70rem",
                                fontWeight: 800,
                                color: countdown.color,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 3,
                              }}
                            >
                              {countdown.urgent && "⚡"} {countdown.text}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 6. Farmed Tokens */}
                      <td style={{ padding: "8px 10px" }}>
                        <input
                          type="text"
                          value={item.expectedTokens || ""}
                          onChange={(e) => handleItemChange(item.id, "expectedTokens", e.target.value)}
                          placeholder="e.g. 50000"
                          style={{
                            width: "100%",
                            padding: "5px 6px",
                            borderRadius: 6,
                            border: "1px solid #E2E8F0",
                            fontSize: "0.80rem",
                            fontWeight: 600,
                            color: "#1E293B",
                            outline: "none",
                            background: "#FFFFFF",
                          }}
                        />
                      </td>

                      {/* 7. Est Price ($) */}
                      <td style={{ padding: "8px 10px" }}>
                        <div style={{ position: "relative" }}>
                          <span
                            style={{
                              position: "absolute",
                              left: 6,
                              top: "50%",
                              transform: "translateY(-50%)",
                              fontSize: "0.76rem",
                              color: "#94A3B8",
                              fontWeight: 700,
                            }}
                          >
                            $
                          </span>
                          <input
                            type="number"
                            step="0.0001"
                            value={item.estPrice !== undefined ? item.estPrice : ""}
                            onChange={(e) =>
                              handleItemChange(item.id, "estPrice", parseFloat(e.target.value) || 0)
                            }
                            placeholder="0.00"
                            style={{
                              width: "100%",
                              padding: "5px 6px 5px 16px",
                              borderRadius: 6,
                              border: "1px solid #E2E8F0",
                              fontSize: "0.80rem",
                              fontWeight: 600,
                              color: "#1E293B",
                              outline: "none",
                              background: "#FFFFFF",
                            }}
                          />
                        </div>
                      </td>

                      {/* 8. Total Expected USD (Auto-calculated formula) */}
                      <td style={{ padding: "8px 10px" }}>
                        <div
                          style={{
                            padding: "5px 8px",
                            borderRadius: 6,
                            background: "#EFF6FF",
                            border: "1px solid #DBEAFE",
                            fontWeight: 800,
                            color: "#1D4ED8",
                            fontSize: "0.82rem",
                            textAlign: "right",
                          }}
                        >
                          ${Number(item.expectedUsd || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </td>

                      {/* 9. Accounts Count */}
                      <td style={{ padding: "8px 10px", textAlign: "center" }}>
                        <input
                          type="number"
                          min="1"
                          max="999"
                          value={item.accountsCount || 1}
                          onChange={(e) =>
                            handleItemChange(item.id, "accountsCount", parseInt(e.target.value, 10) || 1, true)
                          }
                          style={{
                            width: 50,
                            padding: "4px 4px",
                            borderRadius: 6,
                            border: "1px solid #E2E8F0",
                            fontSize: "0.80rem",
                            fontWeight: 700,
                            textAlign: "center",
                            color: "#334155",
                            background: "#F8FAFC",
                            outline: "none",
                          }}
                        />
                      </td>

                      {/* 10. Daily Routine */}
                      <td style={{ padding: "8px 10px" }}>
                        <select
                          value={item.dailyRoutine || "daily_claim"}
                          onChange={(e) =>
                            handleItemChange(item.id, "dailyRoutine", e.target.value as DailyRoutine, true)
                          }
                          style={{
                            width: "100%",
                            padding: "5px 6px",
                            borderRadius: 6,
                            border: "1px solid #E2E8F0",
                            background: "#F8FAFC",
                            color: "#334155",
                            fontSize: "0.74rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            outline: "none",
                          }}
                        >
                          {Object.entries(ROUTINE_CONFIG).map(([rKey, rCfg]) => (
                            <option key={rKey} value={rKey}>
                              {rCfg.icon} {rCfg.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 11. Launch Link */}
                      <td style={{ padding: "8px 10px", textAlign: "center" }}>
                        {item.farmUrl ? (
                          <a
                            href={item.farmUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 28,
                              height: 28,
                              borderRadius: 6,
                              background: "#EFF6FF",
                              color: "#2563EB",
                              fontSize: "0.85rem",
                              textDecoration: "none",
                              border: "1px solid #BFDBFE",
                            }}
                            title={`Open: ${item.farmUrl}`}
                          >
                            ↗
                          </a>
                        ) : (
                          <button
                            onClick={() => {
                              const url = prompt("Enter Telegram Bot or Website Link for " + item.projectName);
                              if (url !== null) {
                                handleItemChange(item.id, "farmUrl", url.trim(), true);
                              }
                            }}
                            style={{
                              background: "transparent",
                              border: "1px dashed #CBD5E1",
                              borderRadius: 6,
                              width: 28,
                              height: 28,
                              color: "#94A3B8",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                            }}
                            title="Add Launch Link"
                          >
                            +
                          </button>
                        )}
                      </td>

                      {/* 12. Notes / Strategy Popover Trigger */}
                      <td style={{ padding: "8px 10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <input
                            type="text"
                            value={item.notes || ""}
                            onChange={(e) => handleItemChange(item.id, "notes", e.target.value)}
                            placeholder="Add notes..."
                            style={{
                              width: 120,
                              padding: "4px 6px",
                              borderRadius: 6,
                              border: "1px solid #E2E8F0",
                              fontSize: "0.76rem",
                              color: "#475569",
                              outline: "none",
                              background: "#FFFFFF",
                            }}
                          />
                          <button
                            onClick={() => setActiveNoteModal(item)}
                            style={{
                              padding: "4px 6px",
                              borderRadius: 4,
                              border: "1px solid #E2E8F0",
                              background: "#F8FAFC",
                              color: "#64748B",
                              fontSize: "0.72rem",
                              cursor: "pointer",
                            }}
                            title="Expand notes & full wallet list"
                          >
                            📝
                          </button>
                        </div>
                      </td>

                      {/* 13. Delete Action */}
                      <td style={{ padding: "8px 10px", textAlign: "center" }}>
                        <button
                          onClick={() => handleDelete(item.id, item.projectName)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#EF4444",
                            cursor: "pointer",
                            fontSize: "0.95rem",
                            padding: "4px 6px",
                            borderRadius: 4,
                          }}
                          title="Delete airdrop from tracker"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. KANBAN BOARD VIEW (Pipeline Flow)                          */}
      {/* ------------------------------------------------------------- */}
      {viewMode === "kanban" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
            alignItems: "start",
          }}
        >
          {(["active", "snapshot", "listing_soon", "claim_open", "completed"] as TrackerStatus[]).map((colStatus) => {
            const colCfg = STATUS_CONFIG[colStatus];
            const colItems = filteredItems.filter((it) => it.status === colStatus);

            return (
              <div
                key={colStatus}
                style={{
                  background: "#F8FAFC",
                  borderRadius: 14,
                  border: `1px solid ${colCfg.border}`,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  minHeight: 380,
                }}
              >
                {/* Column Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{colCfg.icon}</span>
                    <strong style={{ fontSize: "0.88rem", color: "#0F172A" }}>{colCfg.label}</strong>
                  </div>
                  <span
                    style={{
                      background: colCfg.bg,
                      color: colCfg.color,
                      padding: "2px 8px",
                      borderRadius: 9999,
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      border: `1px solid ${colCfg.border}`,
                    }}
                  >
                    {colItems.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {colItems.map((item) => {
                    const catCfg = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.tap_to_earn;
                    const countdown = getDaysCountdown(item.listingDate);

                    return (
                      <div
                        key={item.id}
                        style={{
                          background: "#FFFFFF",
                          borderRadius: 10,
                          border: "1px solid #E2E8F0",
                          padding: 14,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <span
                              style={{
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                background: catCfg.bg,
                                color: catCfg.color,
                                padding: "2px 6px",
                                borderRadius: 4,
                                border: `1px solid ${catCfg.border}`,
                              }}
                            >
                              {catCfg.icon} {catCfg.label}
                            </span>
                            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0F172A", marginTop: 4 }}>
                              {item.projectName}
                            </div>
                          </div>

                          <button
                            onClick={() => handleDelete(item.id, item.projectName)}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#CBD5E1",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Value & Tokens */}
                        <div
                          style={{
                            background: "#F8FAFC",
                            borderRadius: 6,
                            padding: "6px 8px",
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.78rem",
                          }}
                        >
                          <span style={{ color: "#64748B" }}>Expected:</span>
                          <strong style={{ color: "#2563EB" }}>
                            ${Number(item.expectedUsd || 0).toLocaleString()} USD
                          </strong>
                        </div>

                        {/* Listing & Routine */}
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#64748B" }}>
                          <span>📅 {item.listingDate || "TBA"}</span>
                          {countdown && (
                            <strong style={{ color: countdown.color }}>{countdown.text}</strong>
                          )}
                        </div>

                        {/* Move Pipeline Dropdown */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                          <span style={{ fontSize: "0.70rem", color: "#94A3B8" }}>Move:</span>
                          <select
                            value={item.status}
                            onChange={(e) =>
                              handleItemChange(item.id, "status", e.target.value as TrackerStatus, true)
                            }
                            style={{
                              flex: 1,
                              padding: "3px 6px",
                              borderRadius: 4,
                              border: "1px solid #CBD5E1",
                              fontSize: "0.72rem",
                              fontWeight: 600,
                              background: "#FFFFFF",
                              color: "#334155",
                              cursor: "pointer",
                            }}
                          >
                            {Object.entries(STATUS_CONFIG).map(([sKey, sCfg]) => (
                              <option key={sKey} value={sKey}>
                                {sCfg.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. Expandable Notes & Strategy Modal                          */}
      {/* ------------------------------------------------------------- */}
      {activeNoteModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 16,
          }}
          onClick={() => setActiveNoteModal(null)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 16,
              width: "100%",
              maxWidth: 550,
              padding: 24,
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "1.3rem" }}>📝</span>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0F172A" }}>
                  Notes & Strategy — {activeNoteModal.projectName}
                </h3>
              </div>
              <button
                onClick={() => setActiveNoteModal(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  color: "#94A3B8",
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ margin: 0, fontSize: "0.82rem", color: "#64748B" }}>
              Keep track of wallet addresses, eligibility requirements, referral links, and snapshot conditions. All edits are auto-saved.
            </p>

            <textarea
              rows={6}
              value={activeNoteModal.notes || ""}
              onChange={(e) => {
                const val = e.target.value;
                setActiveNoteModal((prev) => (prev ? { ...prev, notes: val } : null));
                handleItemChange(activeNoteModal.id, "notes", val);
              }}
              placeholder="e.g. Wallet 1: 0x123... (Metamask)\nWallet 2: UQ... (Tonkeeper)\nRequirement: Need 5 transactions on mainnet before Nov 15th."
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "1px solid #CBD5E1",
                fontSize: "0.84rem",
                fontFamily: "monospace",
                color: "#0F172A",
                outline: "none",
                lineHeight: "1.5",
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "0.76rem", color: "#059669", fontWeight: 600 }}>
                🟢 Changes auto-saved directly to Hostinger
              </div>
              <button
                onClick={() => setActiveNoteModal(null)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 6,
                  border: "none",
                  background: "#2563EB",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
