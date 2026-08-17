"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Intelligence" },
  { href: "/guides", label: "Guides" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <header>
      <div className="wrap header-inner">
        <Link className="logo" href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Image src="/logo-primary.svg" alt="Crypto Airdrop AI" width={168} height={34} priority />
        </Link>

        <nav className={`main-nav${mobileOpen ? " mobile-open" : ""}`}>
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
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
                      left: 12,
                      right: 12,
                      height: 2,
                      background: "var(--accent)",
                      borderRadius: 2,
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          <div className="search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search protocols..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <Link href="/methodology" className="btn btn-sm btn-outline" style={{ display: "none" }}>
            Audit Framework
          </Link>

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
