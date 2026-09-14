import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/cms/blogService';
import { getProjects, getArticles } from '@/lib/contentStore';
import { AIRDROPS, GUIDES, AUTHORS } from '@/lib/data';

export const revalidate = 3600; // ISR revalidate hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://cryptoairdropai.com';
  const now = new Date();

  // Core Authority & E-E-A-T Trust Pages
  const corePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/guides/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/career/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/methodology/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/editorial/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/editorial-policy/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/authors/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/disclaimer/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic Blog Entries
  const posts = await getAllPosts();
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.date),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Dynamic Project Entries (Merged from store & static)
  const storedProjects = await getProjects();
  const projectSlugMap = new Map<string, Date>();
  storedProjects.forEach((p) => projectSlugMap.set(p.slug, now));
  AIRDROPS.forEach((a) => {
    if (!projectSlugMap.has(a.slug)) {
      projectSlugMap.set(a.slug, now);
    }
  });

  const projectEntries: MetadataRoute.Sitemap = Array.from(projectSlugMap.keys()).map((slug) => ({
    url: `${baseUrl}/projects/${slug}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Dynamic Guides Entries (Merged from store & static)
  const storedGuides = await getArticles("guides");
  const guideSlugMap = new Map<string, Date>();
  storedGuides.forEach((g) => guideSlugMap.set(g.slug, g.updatedAt ? new Date(g.updatedAt) : new Date(g.date)));
  GUIDES.forEach((g) => {
    if (!guideSlugMap.has(g.slug)) {
      guideSlugMap.set(g.slug, g.updatedAt ? new Date(g.updatedAt) : now);
    }
  });

  const guideEntries: MetadataRoute.Sitemap = Array.from(guideSlugMap.entries()).map(([slug, lastMod]) => ({
    url: `${baseUrl}/guides/${slug}/`,
    lastModified: lastMod,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Dynamic Methodology Entries
  const methodologyArticles = await getArticles("methodology");
  const methodologyEntries: MetadataRoute.Sitemap = methodologyArticles.map((m) => ({
    url: `${baseUrl}/methodology/${m.slug}/`,
    lastModified: m.updatedAt ? new Date(m.updatedAt) : new Date(m.date),
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  // Dynamic Editorial Policy Entries
  const editorialArticles = await getArticles("editorial");
  const editorialEntries: MetadataRoute.Sitemap = editorialArticles.map((e) => ({
    url: `${baseUrl}/editorial-policy/${e.slug}/`,
    lastModified: e.updatedAt ? new Date(e.updatedAt) : new Date(e.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Dynamic Author Entries
  const authorEntries: MetadataRoute.Sitemap = AUTHORS.map((author) => ({
    url: `${baseUrl}/authors/${author.slug}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [
    ...corePages,
    ...blogEntries,
    ...projectEntries,
    ...guideEntries,
    ...methodologyEntries,
    ...editorialEntries,
    ...authorEntries,
  ];
}
