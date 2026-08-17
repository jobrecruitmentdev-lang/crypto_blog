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
        <Link className="logo" href="/" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <Image src="/logo-primary.svg" alt="Crypto Airdrop AI" width={185} height={34} priority />
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
