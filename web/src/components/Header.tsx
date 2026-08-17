"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Exactly 7 Core Primary SEO Pages
const PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Intelligence" },
  { href: "/guides", label: "Guides" },
  { href: "/methodology", label: "Methodology" },
  { href: "/editorial-policy", label: "Editorial" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const normalizedPath = (pathname || "/").replace(/\/$/, "") || "/";

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <header>
      <div className="wrap header-inner">
        <Link className="logo" href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, flexShrink: 0, textDecoration: "none" }}>
          <Image src="/icon.svg" alt="Crypto Airdrop AI" width={34} height={34} priority />
          <span style={{ fontSize: "1.32rem", fontWeight: 900, letterSpacing: "-0.025em", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#FFFFFF" }}>Crypto</span>
            <span style={{ color: "var(--cyan)" }}>Airdrop</span>
            <span style={{ 
              fontSize: "0.68rem", 
              fontWeight: 900, 
              color: "var(--emerald)", 
              background: "var(--emerald-glow)", 
              border: "1px solid rgba(16, 185, 129, 0.35)", 
              padding: "2px 6px", 
              borderRadius: "4px",
              fontFamily: "ui-monospace, monospace",
              letterSpacing: "0.06em",
              marginLeft: "2px"
            }}>AI</span>
          </span>
        </Link>

        {/* Desktop & Mobile Navigation (Strictly 7 Primary Pages) */}
        <nav className={`main-nav${mobileOpen ? " mobile-open" : ""}`}>
          {PRIMARY_LINKS.map((link) => {
            const isActive = mounted && (link.href === "/" ? normalizedPath === "/" : normalizedPath.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? "active" : ""}
                onClick={() => setMobileOpen(false)}
                style={{ position: "relative" }}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    style={{
                      position: "absolute",
                      bottom: -2,
                      left: 8,
                      right: 8,
                      height: 2,
                      background: "var(--cyan)",
                      borderRadius: 2,
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Search & Actions */}
        <div className="header-actions">
          <div className="search-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search protocol..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <button
            className="icon-btn burger"
            title="Menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
