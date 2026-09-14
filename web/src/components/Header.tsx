"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects/", label: "Projects" },
  { href: "/blog/", label: "Intelligence" },
  { href: "/guides/", label: "Guides" },
  { href: "/methodology/", label: "Methodology" },
  { href: "/editorial-policy/", label: "Editorial" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const burgerRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Handle Escape key to close mobile menu and restore focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
        burgerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const normalizedPath = (pathname || "/").replace(/\/$/, "") || "/";

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleCloseMenu() {
    setMobileOpen(false);
    burgerRef.current?.focus();
  }

  return (
    <>
      {/* Accessible Backdrop Overlay */}
      {mobileOpen && (
        <div 
          className="nav-backdrop" 
          onClick={handleCloseMenu}
          aria-hidden="true"
        />
      )}

      <header>
        <div className="wrap header-inner">
          <Link className="logo" href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, flexShrink: 0, textDecoration: "none" }}>
            <Image src="/icon.svg" alt="Crypto Airdrop AI" width={34} height={34} priority />
            <span style={{ fontSize: "1.32rem", fontWeight: 900, letterSpacing: "-0.025em", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "#0F172A" }}>Crypto</span>
              <span style={{ color: "var(--cyan)" }}>Airdrop</span>
              <span style={{ 
                fontSize: "0.68rem", 
                fontWeight: 900, 
                color: "var(--emerald)", 
                background: "rgba(5, 150, 105, 0.1)", 
                border: "1px solid rgba(5, 150, 105, 0.25)", 
                padding: "2px 6px", 
                borderRadius: "4px",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.06em",
                marginLeft: "2px"
              }}>AI</span>
            </span>
          </Link>

          {/* Desktop & Mobile Navigation */}
          <nav 
            ref={navRef}
            id="mobile-navigation"
            className={`main-nav${mobileOpen ? " mobile-open" : ""}`}
            aria-label="Main Navigation"
          >
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search protocol..."
                aria-label="Search protocol database"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>

            <button
              ref={burgerRef}
              className="icon-btn burger"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
