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
  metadataBase: new URL("https://cryptodrop.example"),
  title: {
    default: "CryptoDrop — Discover the Latest Crypto Airdrops 2026",
    template: "%s — CryptoDrop",
  },
  description:
    "CryptoDrop tracks and verifies the latest, hottest and confirmed crypto airdrops across Ethereum, Solana, and every major chain. Free daily updates.",
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
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
