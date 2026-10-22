import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug } from "@/lib/contentStore";
import { AIRDROPS, getAirdropBySlug as getLocalAirdropBySlug, getRelatedAirdrops } from "@/lib/data";
import type { ProjectItem } from "@/lib/types";
import ProjectView from "@/components/ProjectView";

export async function generateStaticParams() {
  const projects = await getProjects();
  const slugs = new Set(projects.map((p) => p.slug));
  AIRDROPS.forEach((a) => slugs.add(a.slug));
  return Array.from(slugs).map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const airdrop = (await getProjectBySlug(slug)) || getLocalAirdropBySlug(slug);
  if (!airdrop) return {};
  
  const siteUrl = "https://cryptoairdropai.com";
  const pageUrl = `${siteUrl}/projects/${slug}/`;
  const pageTitle = `${airdrop.name} Airdrop Farming Guide & Eligibility Checklist (2026)`;
  const pageDesc = `Comprehensive ${airdrop.name} airdrop guide on ${airdrop.chain}. Step-by-step verified farming tasks, sybil-safe strategies, estimated reward (${airdrop.reward}), and official snapshot criteria.`;
  const rawImage = (airdrop as any).featuredImage;
  const ogImage = rawImage 
    ? (rawImage.startsWith("http") ? rawImage : `${siteUrl}${rawImage}`)
    : `${siteUrl}/images/generated/${slug}-project.jpg`;

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: { canonical: pageUrl },
    keywords: [
      airdrop.name,
      `${airdrop.name} airdrop`,
      `${airdrop.name} farming guide`,
      `${airdrop.name} snapshot`,
      `${airdrop.chain} airdrops`,
      "crypto airdrop 2026",
      "testnet airdrop",
      "sybil resistance",
      "free crypto airdrop"
    ],
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: pageUrl,
      siteName: "Crypto Airdrop AI",
      type: "article",
      locale: "en_US",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${airdrop.name} Airdrop Verification & Telemetry Guide`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDesc,
      creator: "@cryptoairdropai",
      site: "@cryptoairdropai",
      images: [ogImage],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const rawAirdrop = (await getProjectBySlug(slug)) || getLocalAirdropBySlug(slug);
  if (!rawAirdrop) {
    notFound();
  }
  const airdrop: ProjectItem = rawAirdrop as ProjectItem;
  const related = getRelatedAirdrops(airdrop);

  return (
    <ProjectView initialProject={airdrop} related={related} />
  );
}
