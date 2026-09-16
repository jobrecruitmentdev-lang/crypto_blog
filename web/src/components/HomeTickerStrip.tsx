"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export interface TickerItem {
  id?: number;
  sym: string;
  price: string;
  chg: string;
  up: boolean;
  sort?: number;
}

export interface AlphaDispatchSetting {
  title: string;
  url: string;
}

interface Props {
  initialTicker: TickerItem[];
  initialAlphaDispatch: AlphaDispatchSetting;
}

export default function HomeTickerStrip({ initialTicker, initialAlphaDispatch }: Props) {
  const [ticker, setTicker] = useState<TickerItem[]>(initialTicker);
  const [alphaDispatch, setAlphaDispatch] = useState<AlphaDispatchSetting>(initialAlphaDispatch);

  useEffect(() => {
    let isMounted = true;

    async function fetchLiveTicker() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        
        const apiUrl = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
          ? "https://cryptoairdropai.com/api/ticker.php"
          : "/api/ticker.php";

        const res = await fetch(apiUrl, {
          signal: controller.signal,
          next: { revalidate: 60 }
        } as RequestInit);
        
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            if (Array.isArray(data.ticker) && data.ticker.length > 0) {
              setTicker(data.ticker);
            }
            if (data.alphaDispatch && data.alphaDispatch.title) {
              setAlphaDispatch(data.alphaDispatch);
            }
          }
        }
      } catch {
        // Quiet network fallback to initial SSR snapshot
      }
    }

    fetchLiveTicker();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="tui-top-bar" style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", color: "var(--muted)", fontSize: "0.82rem" }}>
      <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        <span>
          <span style={{ color: "var(--emerald)", fontWeight: 800 }}>●</span> RPC INGESTION: <b style={{ color: "var(--text-bright)" }}>OPTIMAL (14ms)</b>
        </span>
        
        {ticker.map((item, idx) => (
          <span key={item.id || item.sym || idx}>
            {item.sym}: <b style={{ color: "var(--text-bright)" }}>{item.price}</b>{" "}
            <span style={{ color: item.up ? "var(--emerald)" : "#EF4444", fontSize: "0.75rem", fontWeight: 700 }}>
              {item.chg}
            </span>
          </span>
        ))}

        <span>
          ACTIVE CHAINS: <b style={{ color: "var(--text-bright)" }}>50+ INDEXED</b>
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontWeight: 600, color: "var(--accent)" }}>ALPHA DISPATCH: </span>
        <Link 
          href={alphaDispatch.url || "/blog/how-to-farm-airdrops-safely-2026/"} 
          style={{ color: "var(--text-bright)", fontWeight: 600, textDecoration: "none" }}
        >
          {alphaDispatch.title || "2026 Security Playbook →"}
        </Link>
      </div>
    </div>
  );
}
