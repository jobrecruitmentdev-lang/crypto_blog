import json
import os
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECTS_FILE = os.path.join(BASE_DIR, "web", "src", "data", "projects.json")
ARTICLES_FILE = os.path.join(BASE_DIR, "web", "src", "data", "articles.json")
OUTPUT_SQL = os.path.join(BASE_DIR, "scripts", "seed_data.sql")

def sql_escape(val):
    if val is None:
        return "NULL"
    if isinstance(val, bool):
        return "1" if val else "0"
    if isinstance(val, (int, float)):
        return str(val)
    if isinstance(val, (dict, list)):
        val = json.dumps(val, ensure_ascii=False)
    # Escape single quotes and backslashes for MySQL
    s = str(val)
    s = s.replace("\\", "\\\\").replace("'", "\\'")
    return f"'{s}'"

with open(PROJECTS_FILE, "r", encoding="utf-8") as f:
    projects = json.load(f)

with open(ARTICLES_FILE, "r", encoding="utf-8") as f:
    articles = json.load(f)

print(f"Loaded {len(projects)} projects and {len(articles)} articles.")

sql_lines = [
    "-- CryptoAirdropAI Seed Data Migration",
    "SET NAMES utf8mb4;",
    "SET FOREIGN_KEY_CHECKS = 0;",
    "TRUNCATE TABLE projects;",
    "TRUNCATE TABLE articles;",
    ""
]

# Insert Projects
for p in projects:
    slug = sql_escape(p.get("slug"))
    name = sql_escape(p.get("name"))
    chain = sql_escape(p.get("chain"))
    status = sql_escape(p.get("status", []))
    reward = sql_escape(p.get("reward", ""))
    diff = sql_escape(p.get("difficulty", "Medium"))
    time_str = sql_escape(p.get("time", "15 min"))
    heat = sql_escape(p.get("heat", 100))
    desc = sql_escape(p.get("desc", ""))
    tags = sql_escape(p.get("tags", []))
    feat_img = sql_escape(p.get("featuredImage", ""))
    steps = sql_escape(p.get("farmingSteps", []))
    links = sql_escape(p.get("officialLinks", {}))
    risk = sql_escape(p.get("riskScore", 20))

    sql = f"""INSERT INTO projects (slug, name, chain, status, reward, difficulty, time, heat, description, tags, featured_image, farming_steps, official_links, risk_score, is_active)
VALUES ({slug}, {name}, {chain}, {status}, {reward}, {diff}, {time_str}, {heat}, {desc}, {tags}, {feat_img}, {steps}, {links}, {risk}, 1);"""
    sql_lines.append(sql)

sql_lines.append("")

# Insert Articles
for a in articles:
    slug = sql_escape(a.get("slug"))
    page_type = sql_escape(a.get("pageType", "intelligence"))
    tag = sql_escape(a.get("tag", "Ecosystem Alpha"))
    title = sql_escape(a.get("title", ""))
    excerpt = sql_escape(a.get("excerpt", ""))
    tldr = sql_escape(a.get("tldr", ""))
    key_takeaways = sql_escape(a.get("keyTakeaways", []))
    date_val = sql_escape(a.get("date", "2026-09-15"))
    updated_at_val = sql_escape(a.get("updatedAt", "2026-09-15"))
    read_time = sql_escape(a.get("read", "8 min read"))
    author_slug = sql_escape(a.get("authorSlug", "ai-intelligence-engine"))
    body = sql_escape(a.get("body", ""))
    feat_img = sql_escape(a.get("featuredImage", ""))
    mid_img = sql_escape(a.get("middleImage", ""))
    faq_img = sql_escape(a.get("preFaqImage", ""))
    faqs = sql_escape(a.get("faqs", []))
    seo = sql_escape(a.get("seo", {}))

    sql = f"""INSERT INTO articles (slug, page_type, tag, title, excerpt, tldr, key_takeaways, date, updated_at_date, read_time, author_slug, body, featured_image, middle_image, pre_faq_image, faqs, seo, is_published)
VALUES ({slug}, {page_type}, {tag}, {title}, {excerpt}, {tldr}, {key_takeaways}, {date_val}, {updated_at_val}, {read_time}, {author_slug}, {body}, {feat_img}, {mid_img}, {faq_img}, {faqs}, {seo}, 1);"""
    sql_lines.append(sql)

with open(OUTPUT_SQL, "w", encoding="utf-8") as f:
    f.write("\n".join(sql_lines))

print(f"Generated {OUTPUT_SQL} successfully! Total lines: {len(sql_lines)}")
