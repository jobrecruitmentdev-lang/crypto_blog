export type AirdropStatus = "Ongoing" | "Confirmed";
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
}

export interface TickerItem {
  sym: string;
  price: string;
  chg: string;
  up: boolean;
}

export interface BlogPost {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  date: string;
  read: string;
  body: string;
  coverImage?: string;
}

export interface Guide {
  slug: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  desc: string;
  body: string;
}

export interface Faq {
  q: string;
  a: string;
}
