import type { Metadata } from "next";
import { cache } from "react";
import { getJournalDay } from "@/app/guide-core/defineGuide";
import DayJournal from "@/app/guide-ui/day-journal/DayJournal";
import { loadGuide } from "@/guides/registry";

export const dynamic = "force-static";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "play-20261001-jap-tour";
const assetPrefix = process.env.GITHUB_ACTIONS === "true" ? `/${repositoryName}` : "";

const loadDayOne = cache(async () => {
  const guide = await loadGuide("kansai-2026");
  return getJournalDay(guide, "2026-09-29");
});

export async function generateMetadata(): Promise<Metadata> {
  return (await loadDayOne()).metadata;
}

export default async function DayOnePage() {
  return <DayJournal config={await loadDayOne()} backHref="./" assetPrefix={assetPrefix} />;
}
