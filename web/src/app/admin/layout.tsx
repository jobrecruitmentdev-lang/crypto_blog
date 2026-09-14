import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Command Center — Crypto Airdrop AI",
  description: "Administrative control center for cryptoairdropai.com content, projects, and automation pipelines.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
