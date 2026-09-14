import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dhara Command Center — Crypto Airdrop AI",
  description: "Secure administrative control center for cryptoairdropai.com content, projects, and automation pipelines.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DharaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
