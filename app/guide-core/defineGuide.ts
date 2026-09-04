import type { DayJournalConfig, TravelGuideManifest } from "./types";

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function defineDayJournal<const T extends DayJournalConfig>(config: T): T {
  invariant(config.schemaVersion === 1, `Unsupported day journal schema for ${config.id}`);
  invariant(config.id.length > 0, "Day journal id is required");
  invariant(config.guideId.length > 0, `Guide id is required for ${config.id}`);
  invariant(config.sections.length > 0, `Day journal ${config.id} must contain at least one section`);

  const sectionIds = new Set<string>();
  for (const section of config.sections) {
    invariant(!sectionIds.has(section.id), `Duplicate section id ${section.id} in ${config.id}`);
    sectionIds.add(section.id);
  }

  return config;
}

export function defineTravelGuide<const T extends TravelGuideManifest>(guide: T): T {
  invariant(guide.schemaVersion === 1, `Unsupported guide schema for ${guide.id}`);
  invariant(guide.id.length > 0, "Guide id is required");
  invariant(guide.slug.length > 0, `Guide slug is required for ${guide.id}`);

  const dayIds = new Set<string>();
  for (const day of guide.journalDays) {
    invariant(day.guideId === guide.id, `Day ${day.id} belongs to ${day.guideId}, expected ${guide.id}`);
    invariant(!dayIds.has(day.id), `Duplicate journal day id ${day.id} in ${guide.id}`);
    dayIds.add(day.id);
  }

  return guide;
}

export function getJournalDay(guide: TravelGuideManifest, dayId: string) {
  const day = guide.journalDays.find((candidate) => candidate.id === dayId);
  invariant(day, `Unknown journal day ${dayId} in ${guide.id}`);
  return day;
}
