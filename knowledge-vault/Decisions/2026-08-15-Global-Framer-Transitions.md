---
title: 2026-08-15 Global Framer Transitions
tags: [decision, frontend, ui]
updated: 2026-08-15
---

# 2026-08-15 Global Framer Transitions

**Purpose:** Document the decision to implement global page transitions using Framer Motion and Next.js `template.tsx`.

**Summary:** We adopted `template.tsx` over `layout.tsx` to wrap the app in a Framer Motion component, enabling automatic, 21st.dev-quality entrance animations on every page navigation.

## Context
To elevate the blog from a basic Next.js site to a premium media property, we needed smooth page transitions. Manually adding `motion.div` wrappers to every individual `page.tsx` is prone to errors, boilerplate-heavy, and difficult to maintain.

## Decision
We installed `framer-motion` and introduced `web/src/app/template.tsx`. This file wraps `{children}` in a `<motion.div>` with a predefined `initial`, `animate`, and `exit` state.

## Reason
In the Next.js App Router, `layout.tsx` preserves state and does not re-mount when navigating between pages that share the same layout. `template.tsx`, on the other hand, creates a new instance for each child on navigation. This natively triggers Framer Motion's `initial` animation state every time a user clicks a link, ensuring the animation plays consistently without complex routing hooks.

## Alternatives
- **Page-level Wrappers:** *Rejected* due to massive boilerplate.
- **Framer Motion `AnimatePresence` in Layout:** *Rejected* because `AnimatePresence` struggles with Next.js App Router's server components and suspense boundaries without significant client-side hacking.

## Consequences
- Every route navigation now has a sleek 400ms fade-and-slide-up animation.
- Slightly increased client bundle size due to `framer-motion`.

## Related
- [[Frontend-Architecture]]
