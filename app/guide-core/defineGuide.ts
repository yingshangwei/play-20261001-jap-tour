import { googleMapsDirections, withPublicAssetPrefix } from "./links";
import type {
  DayJournalConfig,
  GuideRouteModel,
  JourneyConfiguredStep,
  JourneyModel,
  JourneyPoint,
  JourneyStep,
  Place,
  TransitLeg,
  TravelGuideManifest,
} from "./types";

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const weekdayLabels: readonly (readonly string[])[] = [
  ["周日", "星期日", "SUN", "SUNDAY"],
  ["周一", "星期一", "MON", "MONDAY"],
  ["周二", "星期二", "TUE", "TUESDAY"],
  ["周三", "星期三", "WED", "WEDNESDAY"],
  ["周四", "星期四", "THU", "THURSDAY"],
  ["周五", "星期五", "FRI", "FRIDAY"],
  ["周六", "星期六", "SAT", "SATURDAY"],
];

function weekdayMatchesDate(date: string, label: string) {
  const timestamp = Date.parse(`${date}T00:00:00Z`);
  if (Number.isNaN(timestamp)) return false;
  return weekdayLabels[new Date(timestamp).getUTCDay()].includes(label.trim().toUpperCase());
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

  const areaIds = new Set<string>();
  for (const area of guide.map.areas) {
    invariant(!areaIds.has(area.id), `Duplicate map area ${area.id} in ${guide.id}`);
    areaIds.add(area.id);
  }
  invariant(areaIds.has(guide.map.defaultAreaId), `Unknown default map area ${guide.map.defaultAreaId} in ${guide.id}`);

  const placeIds = new Set<string>();
  for (const place of guide.places) {
    invariant(!placeIds.has(place.id), `Duplicate place ${place.id} in ${guide.id}`);
    invariant(areaIds.has(place.area), `Unknown area ${place.area} for place ${place.id} in ${guide.id}`);
    placeIds.add(place.id);
  }

  const routeDayIds = new Set<string>();
  const routeDaysByDate = new Map<string, TravelGuideManifest["days"][number]>();
  const routeDayNumbers = new Set<number>();
  for (const day of guide.days) {
    invariant(!routeDayIds.has(day.id), `Duplicate route day ${day.id} in ${guide.id}`);
    invariant(!Number.isNaN(Date.parse(`${day.date}T00:00:00Z`)), `Invalid route date ${day.date} in ${guide.id}`);
    invariant(weekdayMatchesDate(day.date, day.weekday), `Route weekday mismatch for ${day.date} in ${guide.id}`);
    invariant(!routeDaysByDate.has(day.date), `Duplicate route date ${day.date} in ${guide.id}`);
    invariant(!routeDayNumbers.has(day.dayNumber), `Duplicate route day number ${day.dayNumber} in ${guide.id}`);
    routeDayIds.add(day.id);
    routeDaysByDate.set(day.date, day);
    routeDayNumbers.add(day.dayNumber);
  }
  invariant(routeDayIds.size > 0, `Guide ${guide.id} must contain at least one route day`);

  const journeyPlaceIds = new Set(placeIds);
  for (const place of guide.journey.supplementalPlaces) {
    invariant(!journeyPlaceIds.has(place.id), `Duplicate journey place ${place.id} in ${guide.id}`);
    invariant(areaIds.has(place.area), `Unknown area ${place.area} for journey place ${place.id} in ${guide.id}`);
    for (const dayId of place.dates) {
      invariant(routeDayIds.has(dayId), `Unknown display day ${dayId} for journey place ${place.id}`);
    }
    journeyPlaceIds.add(place.id);
  }

  invariant(guide.journey.presentation.titleLines.length > 0, `Journey title is required for ${guide.id}`);
  for (const [placeId, media] of Object.entries(guide.journey.mediaByPlaceId ?? {})) {
    if (!media) continue;
    invariant(
      [media.src, media.alt, media.label, media.caption, media.credit, media.license, media.sourceHref].every((value) => value.trim().length > 0),
      `Journey media must include a source, credit, license and description for ${placeId} in ${guide.id}`,
    );
  }
  const configuredStepIds = new Set<string>();
  for (const step of [...guide.journey.beforeSteps, ...guide.journey.afterSteps]) {
    invariant(!configuredStepIds.has(step.id), `Duplicate configured journey step ${step.id} in ${guide.id}`);
    invariant(routeDayIds.has(step.date), `Unknown day ${step.date} for journey step ${step.id}`);
    invariant(journeyPlaceIds.has(step.fromPlaceId), `Unknown origin ${step.fromPlaceId} for journey step ${step.id}`);
    invariant(journeyPlaceIds.has(step.toPlaceId), `Unknown destination ${step.toPlaceId} for journey step ${step.id}`);
    configuredStepIds.add(step.id);
  }

  const transitByRoute = new Map<string, TransitLeg>();
  for (const leg of guide.transitLegs) {
    invariant(routeDayIds.has(leg.dayId), `Unknown day ${leg.dayId} for transit leg ${leg.id}`);
    invariant(placeIds.has(leg.fromPlaceId), `Unknown origin ${leg.fromPlaceId} for transit leg ${leg.id}`);
    invariant(placeIds.has(leg.toPlaceId), `Unknown destination ${leg.toPlaceId} for transit leg ${leg.id}`);
    const routeKey = transitKey(leg.dayId, leg.fromPlaceId, leg.toPlaceId);
    invariant(leg.id === routeKey, `Transit leg id ${leg.id} must match ${routeKey}`);
    invariant(!transitByRoute.has(routeKey), `Duplicate transit route ${routeKey} in ${guide.id}`);
    transitByRoute.set(routeKey, leg);
  }

  for (const place of guide.places) {
    for (const dayId of place.dates) {
      invariant(routeDayIds.has(dayId), `Unknown display day ${dayId} for place ${place.id}`);
    }
  }

  for (const day of guide.days) {
    const segmentIds = new Set<string>();
    for (const segment of day.segments) {
      invariant(!segmentIds.has(segment.id), `Duplicate segment ${segment.id} on ${day.id}`);
      invariant(segment.pointIds.length >= 2, `Segment ${segment.id} on ${day.id} needs at least two places`);
      segmentIds.add(segment.id);
      for (const pointId of segment.pointIds) {
        invariant(placeIds.has(pointId), `Unknown place ${pointId} in segment ${segment.id} on ${day.id}`);
      }
      for (let index = 0; index < segment.pointIds.length - 1; index += 1) {
        const fromId = segment.pointIds[index];
        const toId = segment.pointIds[index + 1];
        invariant(
          transitByRoute.has(transitKey(day.id, fromId, toId)),
          `Missing transit leg ${day.id}:${fromId}>${toId}`,
        );
      }
    }
  }

  invariant(
    guide.home.itinerary.items.length === guide.days.length,
    `Home itinerary for ${guide.id} must cover every configured day`,
  );
  for (const [index, item] of guide.home.itinerary.items.entries()) {
    const routeDay = guide.days[index];
    invariant(routeDay?.id === item.date, `Home itinerary order mismatch at ${item.date} in ${guide.id}`);
    invariant(routeDay.weekday === item.day, `Home itinerary weekday mismatch for ${item.date} in ${guide.id}`);
  }
  for (const dayId of Object.keys(guide.home.itinerary.journalPaths)) {
    invariant(routeDayIds.has(dayId), `Unknown journal link day ${dayId} in ${guide.id}`);
  }
  invariant(routeDayIds.has(guide.home.feature.date), `Unknown feature date ${guide.home.feature.date} in ${guide.id}`);

  const restaurantNames = new Set<string>();
  for (const restaurant of guide.home.dining.items) {
    invariant(!restaurantNames.has(restaurant.name), `Duplicate home restaurant ${restaurant.name} in ${guide.id}`);
    restaurantNames.add(restaurant.name);
  }

  const bookingNumbers = new Set<string>();
  for (const booking of guide.home.booking.items) {
    invariant(!bookingNumbers.has(booking.number), `Duplicate booking number ${booking.number} in ${guide.id}`);
    bookingNumbers.add(booking.number);
  }

  const dayIds = new Set<string>();
  for (const day of guide.journalDays) {
    invariant(day.guideId === guide.id, `Day ${day.id} belongs to ${day.guideId}, expected ${guide.id}`);
    invariant(!dayIds.has(day.id), `Duplicate journal day id ${day.id} in ${guide.id}`);
    const routeDay = routeDaysByDate.get(day.date);
    invariant(routeDay, `Journal day ${day.id} uses unknown date ${day.date} in ${guide.id}`);
    invariant(routeDay.dayNumber === day.dayNumber, `Journal day number mismatch for ${day.id} in ${guide.id}`);
    invariant(weekdayMatchesDate(day.date, day.weekday), `Journal weekday mismatch for ${day.id} in ${guide.id}`);
    dayIds.add(day.id);
  }

  return guide;
}

export function transitKey(dayId: string, fromPlaceId: string, toPlaceId: string) {
  return `${dayId}:${fromPlaceId}>${toPlaceId}`;
}

export function getTransitLeg(
  model: Pick<GuideRouteModel, "transitLegs">,
  dayId: string,
  fromPlaceId: string,
  toPlaceId: string,
) {
  const id = transitKey(dayId, fromPlaceId, toPlaceId);
  return model.transitLegs.find((leg) => leg.id === id);
}

export function getGuideRouteModel(guide: TravelGuideManifest): GuideRouteModel {
  return {
    map: guide.map,
    places: guide.places,
    days: guide.days,
    transitLegs: guide.transitLegs,
  };
}

function journeyPoint(place: Place): JourneyPoint {
  return {
    id: place.id,
    name: place.name,
    category: place.category,
    position: place.position,
  };
}

function departureTime(plan: string, unknownTime: string) {
  return plan.match(/\d{2}:\d{2}/)?.[0] ?? unknownTime;
}

function journeyPlaceholder(guide: TravelGuideManifest, place: Place) {
  return guide.journey.placeholderLabels.byPlaceId[place.id]
    ?? guide.journey.placeholderLabels.byCategory[place.category];
}

function configuredJourneyStep(
  guide: TravelGuideManifest,
  step: JourneyConfiguredStep,
  placeById: Map<string, Place>,
  assetPrefix: string,
): JourneyStep {
  const from = placeById.get(step.fromPlaceId);
  const to = placeById.get(step.toPlaceId);
  invariant(from, `Unknown origin ${step.fromPlaceId} for journey step ${step.id}`);
  invariant(to, `Unknown destination ${step.toPlaceId} for journey step ${step.id}`);
  return {
    ...step,
    from: journeyPoint(from),
    to: journeyPoint(to),
    departureTime: departureTime(step.departurePlan, guide.journey.presentation.labels.unknownTime),
    placeholderLabel: journeyPlaceholder(guide, to),
    media: journeyMedia(guide, to.id, assetPrefix),
  };
}

function journeyMedia(guide: TravelGuideManifest, placeId: string, assetPrefix: string) {
  const media = guide.journey.mediaByPlaceId?.[placeId];
  return media ? { ...media, src: withPublicAssetPrefix(media.src, assetPrefix) } : undefined;
}

export function getJourneyModel(guide: TravelGuideManifest, assetPrefix = ""): JourneyModel {
  const placeById = new Map(
    [...guide.places, ...guide.journey.supplementalPlaces].map((place) => [place.id, place]),
  );
  const transitById = new Map(guide.transitLegs.map((leg) => [leg.id, leg]));
  const scheduledSteps = guide.days.flatMap((day) =>
    day.segments.flatMap((segment, segmentIndex) =>
      segment.pointIds.slice(0, -1).map((fromPlaceId, pointIndex) => {
        const toPlaceId = segment.pointIds[pointIndex + 1];
        const from = placeById.get(fromPlaceId);
        const to = placeById.get(toPlaceId);
        const transit = transitById.get(transitKey(day.id, fromPlaceId, toPlaceId));
        invariant(from, `Unknown origin ${fromPlaceId} in ${segment.id}`);
        invariant(to, `Unknown destination ${toPlaceId} in ${segment.id}`);
        invariant(transit, `Missing transit leg ${day.id}:${fromPlaceId}>${toPlaceId}`);
        const travelMode = transit.kind === "步行" ? "walking" : "transit";
        return {
          id: `${day.id}-${segmentIndex}-${pointIndex}-${fromPlaceId}-${toPlaceId}`,
          date: day.id,
          segment: segment.label,
          segmentNote: segment.note,
          from: journeyPoint(from),
          to: journeyPoint(to),
          mode: transit.kind,
          icon: guide.journey.transitIcons[transit.kind],
          duration: transit.duration,
          departurePlan: transit.departurePlan,
          departureTime: departureTime(transit.departurePlan, guide.journey.presentation.labels.unknownTime),
          arrivalPlan: transit.arrivalPlan,
          stayPlan: transit.stayPlan,
          route: transit.route,
          timingStatus: transit.timingStatus,
          navigationHref: googleMapsDirections(
            from.position.join(","),
            to.position.join(","),
            travelMode,
          ),
          placeholderLabel: journeyPlaceholder(guide, to),
          media: journeyMedia(guide, to.id, assetPrefix),
        } satisfies JourneyStep;
      }),
    ),
  );
  const steps = [
    ...guide.journey.beforeSteps.map((step) => configuredJourneyStep(guide, step, placeById, assetPrefix)),
    ...scheduledSteps,
    ...guide.journey.afterSteps.map((step) => configuredJourneyStep(guide, step, placeById, assetPrefix)),
  ];

  return {
    presentation: guide.journey.presentation,
    phaseSummary: `${steps.length} ${guide.journey.presentation.phaseUnit} · ${guide.journey.presentation.phaseSuffix}`,
    days: guide.days.map(({ id, weekday, areaLabel, title }) => ({ id, weekday, areaLabel, title })),
    steps,
  };
}

export function getJournalDay(guide: TravelGuideManifest, dayId: string) {
  const day = guide.journalDays.find((candidate) => candidate.id === dayId);
  invariant(day, `Unknown journal day ${dayId} in ${guide.id}`);
  return day;
}
