import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
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
    "The leading USA and global portal for verified crypto news, airdrop research, on-chain guides, and Web3 security analysis. 100% independent and non-custodial.",
  openGraph: {
    title: "Crypto Airdrop AI — Discover Verified Crypto Airdrops & Research",
    description: "Daily fact-checked crypto guides, retroactive airdrop tutorials, and DeFi market research for global and US investors.",
    type: "website",
    url: "https://cryptoairdropai.com",
    siteName: "Crypto Airdrop AI",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@cryptoairdropai",
    creator: "@cryptoairdropai",
  },
  verification: {
    google: "ZWut5izBb5y1wY8Lyo6m-h8uDPr9ufrdHzHA-Il6788",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "@id": "https://cryptoairdropai.com/#organization",
    "name": "Crypto Airdrop AI",
    "alternateName": ["CryptoAirdropAI", "Crypto Airdrop AI Intelligence Desk"],
    "url": "https://cryptoairdropai.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://cryptoairdropai.com/logo-primary.svg",
      "width": "240",
      "height": "48"
    },
    "description": "Crypto Airdrop AI is an independent, non-custodial Web3 market intelligence portal tracking, fact-checking, and vetting crypto token airdrops across 50+ blockchains.",
    "foundingDate": "2026",
    "areaServed": ["US", "CA", "GB", "EU", "Global"],
    "knowsAbout": [
      "Cryptocurrency Airdrops",
      "Decentralized Finance (DeFi)",
      "Ethereum Layer 2 Rollups",
      "Solana Blockchain Ecosystem",
      "Smart Contract Auditing",
      "Sybil Resistance Heuristics",
      "Tokenomics & TGE Distribution Models"
    ],
    "sameAs": [
      "https://twitter.com/cryptoairdropai",
      "https://t.me/cryptoairdropai"
    ],
    "publishingPrinciples": "https://cryptoairdropai.com/editorial-policy",
    "correctionsPolicy": "https://cryptoairdropai.com/editorial-policy",
    "actionableFeedbackPolicy": "https://cryptoairdropai.com/contact",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "editorial & security desk",
      "url": "https://cryptoairdropai.com/contact",
      "availableLanguage": ["English"]
    }
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://cryptoairdropai.com/#website",
    "url": "https://cryptoairdropai.com",
    "name": "Crypto Airdrop AI",
    "alternateName": "CryptoAirdropAI",
    "publisher": {
      "@id": "https://cryptoairdropai.com/#organization"
    },
    "inLanguage": "en-US",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://cryptoairdropai.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EQV8X32D88"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-EQV8X32D88');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
