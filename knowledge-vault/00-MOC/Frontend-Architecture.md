---
title: Frontend Architecture
tags: [architecture, frontend, react, moc]
updated: 2026-08-15
---

# Frontend Architecture

**Purpose:** Document the high-level UI/UX choices, component strategies, and rendering patterns for CryptoDrop.

**Summary:** The frontend is a statically exported Next.js application leveraging pure CSS variables for theming and Framer Motion for premium 21st.dev-style micro-interactions.

## Content
- **Global Page Transitions**: We use Next.js `template.tsx` combined with `framer-motion` to wrap all page routes. Unlike `layout.tsx`, the template file re-mounts on every navigation, ensuring smooth entrance animations (fade + slide up) across the entire site without manual per-page wiring.
- **Theming & Styling**: We prioritize Vanilla CSS (`globals.css`) using CSS variables (`--primary`, `--bg`, `--surface`) over heavy utility frameworks (Tailwind) to keep the bundle size minimal and the design strictly controlled.
- **Component Registry**: We align our interaction design with 21st.dev standards—clean, performant, and heavily relying on subtle CSS animations and Framer Motion layout transitions.

## Related
- [[2026-08-15-Global-Framer-Transitions]]
- Repo: `../../web/src/app/template.tsx`
- Repo: `../../web/src/app/globals.css`
