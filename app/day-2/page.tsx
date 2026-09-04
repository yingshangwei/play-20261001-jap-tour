import type { Metadata } from "next";
import { cache } from "react";
import { getJournalDay } from "@/app/guide-core/defineGuide";
import DayJournal from "@/app/guide-ui/day-journal/DayJournal";
import { loadGuide } from "@/guides/registry";

export const dynamic = "force-static";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "play-20261001-jap-tour";
const assetPrefix = process.env.GITHUB_ACTIONS === "true" ? `/${repositoryName}` : "";

const loadDayTwo = cache(async () => {
  const guide = await loadGuide("kansai-2026");
  return getJournalDay(guide, "2026-09-30");
});

export async function generateMetadata(): Promise<Metadata> {
  return (await loadDayTwo()).metadata;
}

export default async function DayTwoPage() {
  return <DayJournal config={await loadDayTwo()} backHref="./" assetPrefix={assetPrefix} />;
}
