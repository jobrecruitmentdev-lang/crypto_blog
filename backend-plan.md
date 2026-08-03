# CryptoDrop — Backend Architecture Plan (Strapi CMS)

> **Supersedes the previous version of this file.** Scope changed: the site
> is now blog-first. Content is authored in **Strapi** (self-hosted headless
> CMS) instead of a custom scraper/adapter/proxy pipeline. The whole
> data-acquisition subsystem from the old plan (source adapters, headless
> browser workers, residential proxy rotation, the two-VPS isolation split) is
> **dropped** — none of that is needed to run a blog. If the airdrop-directory
> scraping idea comes back later, that old plan is still in git history.

---

## 1. What Changed and Why

The original plan existed to solve one problem: sourcing structured airdrop
listing data from dozens of external sites safely. A blog doesn't have that
problem — content is written by you (or your writers) directly into a CMS.
That collapses most of the previous plan's complexity:

| Old plan | New plan |
|---|---|
| Python ingestion service, isolated VPS | Not needed |
| Adapter-per-source, headless Playwright, stealth patches | Not needed |
| Rotating residential proxies | Not needed |
| VPN for admin access | Still a good idea, much lower stakes now |
| Postgres schema for Project/Step/Faq/IngestionLog | Replaced by Strapi's own content types |
| DRAFT → review → publish gate (custom) | Native Strapi feature (Draft & Publish) |

---

## 2. Architecture

```
                    ┌───────────────────────────┐
                    │   Cloudflare (proxy/CDN)   │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │   Hostinger VPS (single)   │
                    │   Ubuntu 24.04             │
                    │                             │
                    │  Nginx (TLS via Certbot)    │
                    │   ├─ Next.js (PM2, :3000)   │  ← public site
                    │   └─ Strapi  (PM2, :1337)   │  ← CMS + admin, internal-only
                    │                             │
                    │  Postgres (shared by both:  │
                    │   Strapi's content tables,  │
                    │   and anything Next.js owns  │
                    │   directly, e.g. newsletter) │
                    └─────────────────────────────┘
```

One VPS is enough for this scope. Strapi's admin UI (`/admin`) should **not**
be publicly reachable at the edge — see Section 5.

---

## 3. Strapi Content Model

A single collection type covers the blog:

```
BlogPost
  title          Text (required)
  slug           UID (from title, required, unique)
  excerpt        Text
  body           Rich text (Blocks editor)
  coverImage     Media (single, image)
  tag            Enumeration (Guide, News, Opinion, ...)
  seoTitle       Text (optional override)
  seoDescription Text (optional override)
  author         Relation → Author collection (or just a Text field to start)
  publishedAt    (built-in — Draft & Publish gives you this for free)
```

Optional, add later if needed: `Category` collection (many-to-many with
BlogPost), `Author` collection if more than one person writes.

Strapi gives you, with zero custom code:
- Draft/Publish workflow (a post isn't live until explicitly published)
- Media library with image optimization
- Role-based permissions (separate "Editor" vs "Admin" roles for
  writers vs whoever manages users/settings)
- Auto-generated REST API (`/api/blog-posts`) and optional GraphQL

---

## 4. Next.js Integration

```
lib/
  cms/
    strapiClient.ts     # thin fetch wrapper — base URL + auth token from env
    blogService.ts       # getAllPosts(), getPostBySlug(), maps Strapi's
                          # response shape to the app's BlogPost type
app/
  blog/page.tsx           # calls blogService.getAllPosts()
  blog/[slug]/page.tsx    # calls blogService.getPostBySlug(slug)
```

This replaces the `lib/data.ts` mock `BLOG_POSTS` array with real calls to
Strapi — same shape as before (`slug`, `title`, `excerpt`, `body`, `tag`,
`date`), so the existing `BlogGrid` / blog post page components barely change.

**Rendering strategy**: ISR (`revalidate` on the blog routes), not full SSR —
blog content doesn't change on every request. Pair with a Strapi **webhook**
that calls a Next.js Route Handler on publish/update, which calls
`revalidateTag`/`revalidatePath` — so new posts go live immediately instead of
waiting for the next revalidation window, without needing SSR on every
request.

```
app/api/revalidate/route.ts   # POST endpoint, checks a shared secret,
                                # calls revalidatePath('/blog') + the post's path
```

Configure this URL as a webhook in Strapi (Settings → Webhooks → fires on
`entry.publish` for the BlogPost content type).

---

## 5. Security

- **Strapi admin is internal-only.** Bind it to localhost or a private
  interface; only reachable through the WireGuard VPN or an SSH tunnel — not
  through the public Nginx vhost. This is the highest-value security move
  here: an exposed CMS admin panel is the single most common way small sites
  get compromised.
- **API tokens, not open read access**: Strapi lets you scope API tokens
  (read-only vs full-access). Next.js's server-side fetch uses a read-only
  token; nothing about content mutation is reachable from the frontend.
- **Separate Postgres roles**: a `strapi` role owns Strapi's tables; if
  Next.js ever needs its own tables (newsletter signups, etc.), that's a
  separate role with no access to Strapi's tables.
- **Webhook secret**: the `/api/revalidate` route checks a shared secret
  header so random requests can't trigger revalidation spam.
- **Backups**: nightly `pg_dump` (covers Strapi's content + media
  references) + Strapi's uploaded media folder backed up separately (or move
  media to Cloudflare R2/S3-compatible storage from the start — simpler
  backup story and offloads the VPS disk).
- Standard hardening still applies from the original plan: `ufw` (only
  80/443/WireGuard port public), `fail2ban` on SSH, Let's Encrypt via
  Certbot, non-root deploy user, secrets in env vars never committed.

---

## 6. Deployment

- **Next.js**: `output: 'standalone'`, PM2-managed, Nginx reverse-proxies
  `:3000` → 443 for the public domain.
- **Strapi**: PM2-managed (`strapi start`), bound to `127.0.0.1:1337` (or a
  WireGuard-only interface) — not exposed on the public vhost at all. If you
  need remote access to the admin UI day-to-day, reach it over the VPN, or
  put a second Nginx server block for `admin.yourdomain.com` gated by HTTP
  basic auth + IP allowlist in addition to Strapi's own login.
- **Postgres**: one instance, two roles (`strapi_owner`, and whatever
  Next.js needs later).
- **Zero-downtime deploys**: `pm2 reload` for both processes on release,
  same as before.

---

## 7. Phased Roadmap

1. **Stand up Strapi** locally, define the `BlogPost` content type, confirm
   the REST API shape.
2. **Wire Next.js** to Strapi (`strapiClient.ts` + `blogService.ts`), swap
   the mock `BLOG_POSTS` data for live calls on `/blog` and `/blog/[slug]`.
3. **Deploy both to the Hostinger VPS**, Strapi admin locked to
   VPN-only access, Next.js public behind Cloudflare.
4. **Webhook-driven revalidation** so publishing in Strapi reflects on the
   live site within seconds, not on the next ISR window.
5. **(Optional, later)** extend the content model — categories, authors,
   related-posts — only if the blog actually needs them. Don't build ahead
   of what's being published.

---

## Open Questions for You

- Just you writing posts, or multiple authors? (Determines whether Strapi's
  role/permission setup needs more than one "Editor" role.)
- Keep media on the VPS disk, or point Strapi's upload provider at
  Cloudflare R2/S3 from day one? (Cheaper to set this up now than migrate
  later.)
- Does the airdrop-directory portion of the site stay on mock data
  indefinitely, get removed, or get revisited later? Doesn't block the blog
  work either way, but worth deciding so `plan.txt` reflects the real scope.
