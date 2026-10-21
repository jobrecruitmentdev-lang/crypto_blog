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



// ==============================================================================
// AIRDROP OPERATIONS & PORTFOLIO TRACKER (DHARA COMMAND)
// ==============================================================================

export type TrackerCategory =
  | "tap_to_earn"      // Telegram Bot / Tap-to-Earn (e.g. Hamster, Blum, Dogs, Major)
  | "depin_node"       // DePIN / Node Mining (e.g. Grass, Dawn, Nodepay)
  | "testnet"          // Zero Investment Testnet (e.g. Berachain, Monad, Tea)
  | "retroactive"      // Mainnet Volume / Bridge (e.g. Linea, Scroll, LayerZero)
  | "quest_social"     // Daily Quests / Social / Galxe (e.g. Zealy, Galxe, TaskOn)
  | "staking_defi"     // DeFi Liquidity / Restaking (e.g. EigenLayer, Symbiotic, Babylon)
  | "gaming_web3";     // Web3 Gaming / Play-to-Airdrop

export type TrackerStatus =
  | "active"           // Currently Farming
  | "snapshot"         // Snapshot Taken
  | "listing_soon"     // TGE / Listing Confirmed
  | "claim_open"       // Token Claiming is Live
  | "completed"        // Airdrop Distributed & Ended
  | "dropped";         // Dropped / Scam / Not Farming

export type DailyRoutine =
  | "daily_tap"        // Tap / Continuous
  | "daily_claim"      // Daily Check-in / Claim once a day
  | "eight_hour"       // Every 8 hours (Blum style)
  | "passive_node"     // 100% Passive (Grass style)
  | "weekly_tx"        // Weekly Transactions (EVM style)
  | "as_needed";       // Whenever tasks drop

export interface TrackedAirdrop {
  id: number | string;
  projectName: string;
  category: TrackerCategory;
  status: TrackerStatus;
  listingDate?: string;          // ISO Date string: YYYY-MM-DD
  listingQuarter?: string;       // e.g. "Q4 2026", "Late Oct 2026"
  expectedTokens?: string;       // e.g. "250,000 Pts" or "15,000"
  estPrice?: number;             // e.g. 0.005 ($)
  expectedUsd?: number;          // e.g. 75 ($)
  actualReceivedUsd?: number;    // e.g. 110 ($)
  accountsCount: number;         // e.g. 1, 5, 10
  dailyRoutine: DailyRoutine;
  farmUrl?: string;              // Direct link or Telegram bot URL
  notes?: string;                // Wallet address, tips, criteria
  dailyTaskDone?: boolean;       // Today's task checkbox
  dailyTaskDate?: string;        // Last date task was checked
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrackerStats {
  totalItems: number;
  totalActive: number;
  totalExpectedUsd: number;
  totalActualUsd: number;
  listingThisMonth: number;
  dailyPending: number;
}
