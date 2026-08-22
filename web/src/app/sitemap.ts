import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/cms/blogService';
import { AIRDROPS } from '@/lib/data';

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
      url: `${baseUrl}/methodology/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
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

  // Dynamic Blog Entries (queried from Supabase Single Source of Truth)
  const posts = await getAllPosts();
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.date),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Dynamic Project Entries (Crawlable research pages)
  const projectEntries: MetadataRoute.Sitemap = AIRDROPS.map((airdrop) => ({
    url: `${baseUrl}/projects/${airdrop.slug}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [
    ...corePages,
    ...blogEntries,
    ...projectEntries,
  ];
}
