---
title: Supabase Headless CMS & Autonomous Publishing Engine
tags: [moc, supabase, cms, database, automation, indexing, groq]
updated: 2026-08-20
---

# ⚡ Supabase Headless CMS & AI Auto-Indexing Engine

**Purpose:** Complete technical reference for the Supabase PostgreSQL 17 database CMS and autonomous Python publishing pipeline.

**Summary:** Details the database table schemas, Row Level Security (RLS) policies, Next.js dynamic querying layer, Groq LLM AEO generation, and instant search engine notification systems.

---

## 1. Database Topology (Supabase PostgreSQL 17.6)

- **Host**: `aws-0-ap-northeast-1.pooler.supabase.com:6543` (Connection Pooler)
- **Project Ref**: `oebuqronflnytkdyckxi`
- **Project URL**: `https://oebuqronflnytkdyckxi.supabase.co`

### Schema: `public.posts`
```sql
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    tldr TEXT,
    body TEXT NOT NULL,
    category TEXT DEFAULT 'Crypto Airdrops',
    read_time TEXT DEFAULT '5 min',
    author_name TEXT DEFAULT 'Editorial Desk',
    author_slug TEXT DEFAULT 'editorial-desk',
    cover_image_url TEXT,
    faqs JSONB DEFAULT '[]'::jsonb,
    key_takeaways JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'published',
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Performance Indexes
CREATE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_published_at ON public.posts(published_at DESC);

-- Security: RLS Public Read Policy
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Published Posts" ON public.posts FOR SELECT USING (status = 'published');
```

---

## 2. Autonomous AI Pipeline (`automation/main.py`)

1. **Keyword Queue / Scout**: Fetches pending topics from Google Sheets or curated high-authority clusters.
2. **Groq Cloud AI (`openai/gpt-oss-120b`)**: Generates the article with:
   - 40–60 word Quick Answer Box (`tldr`).
   - 4 Key Takeaways.
   - 4 FAQPage structured items.
   - Semantic HTML body with `<ol>` testnet actions.
3. **Database Insertion**: `modules/supabase_uploader.py` inserts the record into Supabase PostgreSQL.
4. **Instant Indexing Push**:
   - **Google Indexing API**: Sends `URL_UPDATED` notification using service account `cosmic-mariner-503804-c4-981c45ff145b.json`.
   - **IndexNow API**: Pings Bing & Yandex at `https://api.indexnow.org/indexnow`.

---

## 3. Related Notes
- [[000-Index]]
- [[MOC-SEO-AEO-GEO]]
- [[Supabase-and-Auto-Indexing-Pipeline]]
- [[2026-08-20-Supabase-Headless-CMS-Migration]]
