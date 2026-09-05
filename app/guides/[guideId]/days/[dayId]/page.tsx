import type { Metadata } from "next";
import { getJournalDay } from "@/app/guide-core/defineGuide";
import DayJournal from "@/app/guide-ui/day-journal/DayJournal";
import { guideCatalog, loadGuide } from "@/guides/registry";

export const dynamic = "force-static";
export const dynamicParams = false;

type GuideDayPageProps = { params: Promise<{ guideId: string; dayId: string }> };

export async function generateStaticParams() {
  const guides = await Promise.all(guideCatalog.map(({ id }) => loadGuide(id)));
  return guides.flatMap((guide) => guide.journalDays.map((day) => ({ guideId: guide.id, dayId: day.id })));
}

async function loadConfiguredDay(params: GuideDayPageProps["params"]) {
  const { guideId, dayId } = await params;
  return { guideId, day: getJournalDay(await loadGuide(guideId), dayId) };
}

export async function generateMetadata({ params }: GuideDayPageProps): Promise<Metadata> {
  return (await loadConfiguredDay(params)).day.metadata;
}

export default async function GuideDayPage({ params }: GuideDayPageProps) {
  const { guideId, day } = await loadConfiguredDay(params);
  const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "play-20261001-jap-tour";
  const assetPrefix = process.env.GITHUB_ACTIONS === "true" ? `/${repositoryName}` : "";
  const backHref = process.env.GITHUB_ACTIONS === "true"
    ? `/${repositoryName}/guides/${guideId}.html`
    : `/guides/${guideId}`;
  return <DayJournal config={day} backHref={backHref} assetPrefix={assetPrefix} />;
}
