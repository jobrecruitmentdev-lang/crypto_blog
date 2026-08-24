import os
import json
import uuid
import psycopg2
from config import Config, logger

DB_CONFIG = {
    'host': os.getenv('SUPABASE_DB_HOST', 'aws-0-ap-northeast-1.pooler.supabase.com'),
    'port': int(os.getenv('SUPABASE_DB_PORT', 6543)),
    'user': os.getenv('SUPABASE_DB_USER', 'postgres.oebuqronflnytkdyckxi'),
    'password': os.getenv('SUPABASE_DB_PASS', '9^VGH+Wff&#qtGy'),
    'dbname': os.getenv('SUPABASE_DB_NAME', 'postgres'),
    'sslmode': 'require'
}

def check_slug(slug: str) -> bool:
    """Returns True if slug is available, False if already exists."""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM public.posts WHERE slug = %s LIMIT 1;", (slug,))
        exists = cur.fetchone() is not None
        cur.close()
        conn.close()
        return not exists
    except Exception as e:
        logger.warning(f"DB check_slug fallback: {e}")
        return True

def stage_blog_post(slug: str, title: str, html_content: str, seo: dict, linked_entities: list = None, category_name: str = "Ecosystem Alpha") -> tuple[str, str, bool]:
    """
    Stages a new blog post in Supabase PostgreSQL:
    1. Inserts/Updates post with status='staged', published_at=NULL.
    2. Persists linked entities in public.post_entities.
    3. Creates a new publication release in public.publication_releases.
    4. Creates a publication run in public.publication_runs.
    Returns (post_id, release_id, success).
    """
    conn = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        conn.autocommit = False # Use explicit transaction
        cur = conn.cursor()

        # 1. Upsert Post in staged state
        payload = {
            "slug": slug,
            "title": title,
            "excerpt": seo.get("tldr", "")[:280] if seo.get("tldr") else title,
            "tldr": seo.get("tldr", ""),
            "body": html_content,
            "category": category_name or "Ecosystem Alpha",
            "read_time": seo.get("read_time", "5 min read"),
            "author_name": "Crypto Airdrop AI Intelligence Engine",
            "author_slug": "ai-intelligence-engine",
            "cover_image_url": None,
            "faqs": json.dumps(seo.get("faqs", [])),
            "key_takeaways": json.dumps(seo.get("key_takeaways", [])),
            "status": "staged"
        }

        query_post = """
        INSERT INTO public.posts (
            slug, title, excerpt, tldr, body, category, read_time,
            author_name, author_slug, cover_image_url, faqs, key_takeaways,
            status, published_at, created_at, updated_at
        ) VALUES (
            %(slug)s, %(title)s, %(excerpt)s, %(tldr)s, %(body)s, %(category)s, %(read_time)s,
            %(author_name)s, %(author_slug)s, %(cover_image_url)s, %(faqs)s, %(key_takeaways)s,
            %(status)s, NULL, now(), now()
        )
        ON CONFLICT (slug) DO UPDATE SET
            title = EXCLUDED.title,
            excerpt = EXCLUDED.excerpt,
            tldr = EXCLUDED.tldr,
            body = EXCLUDED.body,
            category = EXCLUDED.category,
            read_time = EXCLUDED.read_time,
            faqs = EXCLUDED.faqs,
            key_takeaways = EXCLUDED.key_takeaways,
            status = 'staged',
            published_at = NULL,
            updated_at = now()
        RETURNING id;
        """
        cur.execute(query_post, payload)
        post_id = str(cur.fetchone()[0])

        # 2. Persist post entities
        if linked_entities:
            for ent in linked_entities:
                cur.execute("""
                INSERT INTO public.post_entities (post_id, entity_type, entity_slug, anchor_text, target_url)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (post_id, entity_type, entity_slug) DO UPDATE SET
                    anchor_text = EXCLUDED.anchor_text,
                    target_url = EXCLUDED.target_url;
                """, (post_id, ent["entity_type"], ent["entity_slug"], ent["anchor_text"], ent["target_url"]))

        # 3. Create Publication Release
        release_id = str(uuid.uuid4())
        cur.execute("""
        INSERT INTO public.publication_releases (release_id, target_post_id, status, created_at)
        VALUES (%s, %s, 'created', now());
        """, (release_id, post_id))

        # 4. Create Publication Run
        cur.execute("""
        INSERT INTO public.publication_runs (release_id, post_id, content_validation_status, build_status, started_at)
        VALUES (%s, %s, 'passed', 'pending', now());
        """, (release_id, post_id))

        conn.commit()
        cur.close()
        conn.close()

        logger.info(f"[+] Post staged successfully in Supabase! Post ID: {post_id}, Release ID: {release_id}")
        return post_id, release_id, True

    except Exception as e:
        if conn:
            conn.rollback()
            conn.close()
        logger.error(f"[-] Supabase staging transaction failed for {slug}: {e}")
        return None, None, False
