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
    default: "CryptoDrop — Live Crypto Airdrop Tracker | 1,240+ Verified Airdrops",
    template: "%s | CryptoDrop",
  },
  description:
    "Track free crypto airdrops across Ethereum, Solana, Base, Arbitrum & 50+ chains. Verified, updated daily. Find confirmed, hot and upcoming airdrops before everyone else.",
  openGraph: {
    title: "CryptoDrop — Discover the Latest Crypto Airdrops",
    type: "website",
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
    "name": "CryptoDrop",
    "alternateName": "CryptoAirdropAI",
    "url": "https://cryptoairdropai.com",
    "logo": "https://cryptoairdropai.com/logo.png",
    "description": "CryptoDrop tracks and verifies free crypto token airdrops across Ethereum, Solana and every major blockchain.",
    "sameAs": [
      "https://twitter.com/cryptoairdropai",
      "https://t.me/cryptoairdropai",
      "https://discord.gg/cryptoairdropai"
    ]
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://cryptoairdropai.com",
    "name": "CryptoDrop",
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
