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

export interface BlogPost {
  slug: string;
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
  faqs?: BlogFaq[];
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
}

export interface Faq {
  q: string;
  a: string;
}
