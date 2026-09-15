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
  return {
    title: `${airdrop.name} Airdrop Guide & Farming Strategy — Crypto Airdrop AI`,
    description: `${airdrop.name} airdrop farming guide: verified rewards, difficulty, step-by-step testnet and mainnet actions.`,
    alternates: { canonical: `/projects/${slug}/` },
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
