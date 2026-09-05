import type { Metadata } from "next";
import { cache } from "react";
import { getJournalDay } from "@/app/guide-core/defineGuide";
import DayJournal from "@/app/guide-ui/day-journal/DayJournal";
import { loadGuide } from "@/guides/registry";

export const dynamic = "force-static";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "play-20261001-jap-tour";
const assetPrefix = process.env.GITHUB_ACTIONS === "true" ? `/${repositoryName}` : "";
const loadDayThree = cache(async () => getJournalDay(await loadGuide("kansai-2026-plan-2"), "2026-10-01"));

export async function generateMetadata(): Promise<Metadata> {
  return (await loadDayThree()).metadata;
}

export default async function DayThreePage() {
  const backHref = `${assetPrefix}/guides/kansai-2026-plan-2${assetPrefix ? ".html" : ""}`;
  return <DayJournal config={await loadDayThree()} backHref={backHref} assetPrefix={assetPrefix} />;
}
