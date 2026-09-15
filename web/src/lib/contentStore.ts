import fs from 'fs';
import path from 'path';
import { AIRDROPS, BLOG_POSTS, GUIDES } from './data';
import type { Article, ProjectItem, PageType } from './types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Initialize projects.json if not present
  if (!fs.existsSync(PROJECTS_FILE)) {
    const initialProjects: ProjectItem[] = AIRDROPS.map((a) => ({
      ...a,
      featuredImage: `/images/generated/${a.slug}-project.jpg`,
      farmingSteps: [
        { step: 1, title: "Connect Web3 Wallet", desc: `Connect a dedicated non-custodial wallet to the official ${a.name} portal.` },
        { step: 2, title: "Interact with Core Protocol", desc: a.desc },
        { step: 3, title: "Maintain Weekly On-Chain Cadence", desc: "Repeat interactions weekly to build consistent transaction longevity and bypass sybil clusters." }
      ],
      officialLinks: {
        website: `https://${a.slug}.io`,
        twitter: `https://twitter.com/${a.slug}`,
        docs: `https://docs.${a.slug}.io`
      },
      riskScore: a.difficulty === "Easy" ? 10 : a.difficulty === "Medium" ? 25 : 45
    }));
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(initialProjects, null, 2), 'utf-8');
  }

  // Initialize articles.json if not present
  if (!fs.existsSync(ARTICLES_FILE)) {
    const initialArticles: Article[] = [
      ...BLOG_POSTS.map((b) => ({
        ...b,
        pageType: "intelligence" as PageType,
        featuredImage: b.coverImage || `/images/generated/${b.slug}-featured.jpg`,
        middleImage: `/images/generated/${b.slug}-middle.jpg`,
        preFaqImage: `/images/generated/${b.slug}-pre_faq.jpg`,
        faqs: b.faqs || [
          { question: "Is this airdrop confirmed?", answer: "Yes, official protocol metrics point to verified reward distribution." },
          { question: "How to maximize allocation?", answer: "Maintain non-linear volume across different epochs to optimize sybil score." }
        ]
      })),
      ...GUIDES.map((g) => ({
        slug: g.slug,
        pageType: "guides" as PageType,
        tag: "Farming Playbook",
        title: g.title,
        excerpt: g.desc,
        tldr: g.desc,
        keyTakeaways: [
          "Follow isolated wallet security practices.",
          "Avoid identical transaction times across wallets.",
          "Fund gas from independent non-custodial exchanges."
        ],
        date: "2026-08-20",
        updatedAt: g.updatedAt || "2026-08-24",
        read: "6 min read",
        authorSlug: g.authorSlug || "ai-intelligence-engine",
        body: g.body,
        featuredImage: `/images/generated/${g.slug}-featured.jpg`,
        middleImage: `/images/generated/${g.slug}-middle.jpg`,
        preFaqImage: `/images/generated/${g.slug}-pre_faq.jpg`,
        faqs: [
          { question: "Can sybil filters detect multiple wallets from one CEX?", answer: "Yes, if multiple wallets receive initial gas from the exact same deposit address." },
          { question: "What is the safest funding route?", answer: "Use separate sub-accounts or variable withdrawal timing across independent funding vectors." }
        ]
      }))
    ];
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(initialArticles, null, 2), 'utf-8');
  }
}

// ----------------------------------------------------
// Projects CRUD
// ----------------------------------------------------
export function getProjectsSync(): ProjectItem[] {
  try {
    ensureDataFiles();
    const data = fs.readFileSync(PROJECTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.warn("Falling back to in-memory AIRDROPS:", error);
    return AIRDROPS;
  }
}

export async function getProjects(): Promise<ProjectItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch('https://cryptoairdropai.com/api/projects.php', {
      signal: controller.signal,
      next: { revalidate: 60 }
    } as RequestInit);
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.projects) && data.projects.length > 0) {
        return data.projects;
      }
    }
  } catch (err) {
    // Fallback quietly to file snapshot
  }
  return getProjectsSync();
}

export async function getProjectBySlug(slug: string): Promise<ProjectItem | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
}

export async function saveProject(project: ProjectItem): Promise<boolean> {
  try {
    ensureDataFiles();
    const projects = await getProjects();
    const index = projects.findIndex((p) => p.slug === project.slug);
    if (index >= 0) {
      projects[index] = { ...projects[index], ...project };
    } else {
      projects.unshift(project);
    }
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error("Failed to save project:", e);
    return false;
  }
}

export async function deleteProject(slug: string): Promise<boolean> {
  try {
    ensureDataFiles();
    const projects = await getProjects();
    const filtered = projects.filter((p) => p.slug !== slug);
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error("Failed to delete project:", e);
    return false;
  }
}

// ----------------------------------------------------
// Articles CRUD (Intelligence, Guides, Methodology, Editorial)
// ----------------------------------------------------
export function getArticlesSync(pageType?: PageType): Article[] {
  try {
    ensureDataFiles();
    const data = fs.readFileSync(ARTICLES_FILE, 'utf-8');
    const articles: Article[] = JSON.parse(data);
    if (pageType) {
      return articles.filter((a) => a.pageType === pageType);
    }
    return articles;
  } catch (error) {
    console.warn("Falling back to in-memory articles:", error);
    return [];
  }
}

export async function getArticles(pageType?: PageType): Promise<Article[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const url = pageType 
      ? `https://cryptoairdropai.com/api/articles.php?type=${encodeURIComponent(pageType)}`
      : 'https://cryptoairdropai.com/api/articles.php';
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 60 }
    } as RequestInit);
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.articles) && data.articles.length > 0) {
        return data.articles;
      }
    }
  } catch (err) {
    // Fallback quietly to file snapshot
  }
  return getArticlesSync(pageType);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug);
}

export async function saveArticle(article: Article): Promise<boolean> {
  try {
    ensureDataFiles();
    const articles = await getArticles();
    const index = articles.findIndex((a) => a.slug === article.slug);
    if (index >= 0) {
      articles[index] = { ...articles[index], ...article };
    } else {
      articles.unshift(article);
    }
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error("Failed to save article:", e);
    return false;
  }
}

export async function deleteArticle(slug: string): Promise<boolean> {
  try {
    ensureDataFiles();
    const articles = await getArticles();
    const filtered = articles.filter((a) => a.slug !== slug);
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error("Failed to delete article:", e);
    return false;
  }
}
