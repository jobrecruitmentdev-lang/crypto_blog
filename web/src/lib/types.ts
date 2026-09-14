export type AirdropStatus = "Ongoing" | "Confirmed" | "Potential";
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Airdrop {
  slug: string;
  name: string;
  chain: string;
  status: AirdropStatus[];
  reward: string;
  difficulty: Difficulty;
  time: string;
  heat: number;
  desc: string;
  tags: string[];
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
  count: number;
  description?: string;
}

export interface TickerItem {
  sym: string;
  price: string;
  chg: string;
  up: boolean;
}

export interface Author {
  slug: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  credentials: string[];
  xUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export interface BlogFaq {
  question: string;
  answer: string;
}

export type PageType = "intelligence" | "guides" | "methodology" | "editorial";

export interface Article {
  slug: string;
  pageType?: PageType;
  tag: string;
  title: string;
  excerpt: string;
  tldr?: string;
  keyTakeaways?: string[];
  date: string;
  updatedAt?: string;
  read: string;
  authorSlug: string;
  body: string;
  featuredImage?: string;
  middleImage?: string;
  preFaqImage?: string;
  faqs?: BlogFaq[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface ProjectItem extends Airdrop {
  featuredImage?: string;
  farmingSteps?: { step: number; title: string; desc: string; link?: string }[];
  officialLinks?: { website?: string; twitter?: string; discord?: string; docs?: string };
  riskScore?: number;
}

export interface BlogPost extends Article {
  coverImage?: string;
}

export interface Guide {
  slug: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  desc: string;
  body: string;
  authorSlug?: string;
  updatedAt?: string;
  featuredImage?: string;
  middleImage?: string;
  preFaqImage?: string;
  faqs?: BlogFaq[];
}

export interface Faq {
  q: string;
  a: string;
}

