import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cryptoairdropai.com"),
  title: {
    default: "Crypto Airdrop AI — Independent Crypto Guides, Airdrop Tracking & Market Intelligence",
    template: "%s | Crypto Airdrop AI",
  },
  description:
    "The leading portal for verified crypto news, airdrop research, on-chain guides, and Web3 security analysis. 100% independent and non-custodial.",
  openGraph: {
    title: "Crypto Airdrop AI — Discover Verified Crypto Airdrops & Research",
    description: "Daily fact-checked crypto guides, retroactive airdrop tutorials, and DeFi market research.",
    type: "website",
    url: "https://cryptoairdropai.com",
    siteName: "Crypto Airdrop AI",
  },
  twitter: {
    card: "summary_large_image",
    site: "@cryptoairdropai",
    creator: "@cryptoairdropai",
  },
  verification: {
    google: "ZWut5izBb5y1wY8Lyo6m-h8uDPr9ufrdHzHA-Il6788",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Crypto Airdrop AI",
    "alternateName": "CryptoAirdropAI",
    "url": "https://cryptoairdropai.com",
    "logo": "https://cryptoairdropai.com/logo-primary.svg",
    "description": "Crypto Airdrop AI tracks, fact-checks, and verifies crypto token airdrops, DeFi protocols, and Web3 reward distributions across 50+ blockchains.",
    "sameAs": [
      "https://twitter.com/cryptoairdropai",
      "https://t.me/cryptoairdropai"
    ],
    "publishingPrinciples": "https://cryptoairdropai.com/editorial-policy"
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://cryptoairdropai.com",
    "name": "Crypto Airdrop AI",
    "alternateName": "CryptoAirdropAI",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://cryptoairdropai.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
