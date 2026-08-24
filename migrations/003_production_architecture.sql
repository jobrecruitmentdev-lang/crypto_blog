-- ==============================================================================
-- Migration 003: Production Publishing, Releases, Entities & Atomic Finalization
-- ==============================================================================

-- 1. Ensure public.posts table has all required columns and constraints
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    tldr TEXT NOT NULL,
    body TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Ecosystem Alpha',
    read_time VARCHAR(50) DEFAULT '5 min read',
    author_name VARCHAR(100) DEFAULT 'Crypto Airdrop AI Intelligence Engine',
    author_slug VARCHAR(100) DEFAULT 'ai-intelligence-engine',
    cover_image_url TEXT,
    faqs JSONB DEFAULT '[]'::jsonb,
    key_takeaways JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Apply Constraints safely
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_post_status'
    ) THEN
        ALTER TABLE public.posts ADD CONSTRAINT chk_post_status 
        CHECK (status IN ('draft', 'staged', 'published', 'failed'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_published_lifecycle'
    ) THEN
        ALTER TABLE public.posts ADD CONSTRAINT chk_published_lifecycle 
        CHECK (
            (status = 'published' AND published_at IS NOT NULL) OR
            (status IN ('draft', 'staged', 'failed') AND published_at IS NULL)
        );
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status_published ON public.posts(status, published_at DESC);

-- 2. Create PUBLICATION_RELEASES Table (First-Class Deployment Entity)
CREATE TABLE IF NOT EXISTS public.publication_releases (
    release_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
    commit_sha VARCHAR(40),
    build_id VARCHAR(50),
    manifest_sha256 VARCHAR(64),
    sitemap_sha256 VARCHAR(64),
    status VARCHAR(30) NOT NULL DEFAULT 'created',
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    deployed_at TIMESTAMPTZ,
    verified_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_release_status'
    ) THEN
        ALTER TABLE public.publication_releases ADD CONSTRAINT chk_release_status 
        CHECK (status IN ('created', 'building', 'built', 'contract_passed', 'deploying', 'deployed', 'smoke_passed', 'published', 'failed'));
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_releases_status ON public.publication_releases(status);
CREATE INDEX IF NOT EXISTS idx_releases_target_post ON public.publication_releases(target_post_id);

-- 3. Create POST_ENTITIES Relational Mapping Table
CREATE TABLE IF NOT EXISTS public.post_entities (
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_slug VARCHAR(255) NOT NULL,
    anchor_text VARCHAR(255) NOT NULL,
    target_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (post_id, entity_type, entity_slug)
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_entity_type'
    ) THEN
        ALTER TABLE public.post_entities ADD CONSTRAINT chk_entity_type 
        CHECK (entity_type IN ('project', 'guide', 'author'));
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_post_entities_lookup ON public.post_entities(entity_slug, entity_type);

-- 4. Create PUBLICATION_RUNS Table (Stage-Level Audit Logs)
CREATE TABLE IF NOT EXISTS public.publication_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    release_id UUID NOT NULL REFERENCES public.publication_releases(release_id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    content_validation_status VARCHAR(20) DEFAULT 'passed',
    build_status VARCHAR(20) DEFAULT 'pending',
    contract_test_status VARCHAR(20) DEFAULT 'pending',
    deploy_status VARCHAR(20) DEFAULT 'pending',
    production_smoke_status VARCHAR(20) DEFAULT 'pending',
    discovery_ping_status VARCHAR(20) DEFAULT 'pending',
    error_log TEXT,
    started_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_pub_runs_release_id ON public.publication_runs(release_id);

-- 5. Create ATOMIC IDEMPOTENT FINALIZATION RPC FUNCTION
CREATE OR REPLACE FUNCTION public.finalize_publication(
    p_release_id UUID,
    p_post_id UUID,
    p_manifest_hash VARCHAR(64) DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_post_status VARCHAR(20);
    v_target_post UUID;
BEGIN
    -- 1. Verify release exists
    SELECT target_post_id INTO v_target_post
    FROM public.publication_releases
    WHERE release_id = p_release_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Release % not found', p_release_id;
    END IF;
    
    IF v_target_post != p_post_id THEN
        RAISE EXCEPTION 'Target post mismatch for release %', p_release_id;
    END IF;

    -- 2. Check post current status
    SELECT status INTO v_post_status
    FROM public.posts
    WHERE id = p_post_id;
    
    -- Idempotent check
    IF v_post_status = 'published' THEN
        RETURN TRUE;
    END IF;

    IF v_post_status != 'staged' THEN
        RAISE EXCEPTION 'Post % is not in staged state (current: %)', p_post_id, v_post_status;
    END IF;

    -- 3. Atomic Updates
    UPDATE public.posts
    SET status = 'published',
        published_at = now(),
        updated_at = now()
    WHERE id = p_post_id;

    UPDATE public.publication_releases
    SET status = 'published',
        manifest_sha256 = COALESCE(p_manifest_hash, manifest_sha256),
        verified_at = now(),
        completed_at = now()
    WHERE release_id = p_release_id;

    UPDATE public.publication_runs
    SET production_smoke_status = 'passed',
        completed_at = now()
    WHERE release_id = p_release_id;

    RETURN TRUE;
END;
$$;
