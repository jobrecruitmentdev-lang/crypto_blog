"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Intelligence" },
  { href: "/guides", label: "Guides" },
  { href: "/methodology", label: "Methodology" },
  { href: "/authors", label: "Analysts" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const SECONDARY_LINKS = [
  { href: "/editorial-policy", label: "Editorial Policy & Ethics" },
  { href: "/disclaimer", label: "Financial Disclaimer" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/faq", label: "FAQ & Security" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
        <Link className="logo" href="/" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <Image src="/logo-primary.svg" alt="Crypto Airdrop AI" width={160} height={32} priority />
        </Link>

        {/* Desktop Navigation */}
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

          {/* Standards & Legal Dropdown */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              type="button"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--muted)",
                fontSize: "13px",
                fontWeight: 700,
                padding: "6px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                borderRadius: "var(--radius-sm)",
              }}
            >
              Legal &amp; More <span style={{ fontSize: "10px" }}>▼</span>
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    width: 220,
                    background: "#080d1a",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "8px 0",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                    zIndex: 110,
                  }}
                >
                  {SECONDARY_LINKS.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={() => {
                        setDropdownOpen(false);
                        setMobileOpen(false);
                      }}
                      style={{
                        display: "block",
                        padding: "8px 16px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: mounted && normalizedPath === s.href ? "var(--cyan)" : "var(--muted)",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#fff";
                        e.currentTarget.style.background = "rgba(0, 240, 255, 0.06)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = mounted && normalizedPath === s.href ? "var(--cyan)" : "var(--muted)";
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {s.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
