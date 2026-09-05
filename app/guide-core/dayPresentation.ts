import { planTimeLabel } from "./journeyPlayback";
import type { GuideDay, GuideRouteModel, TransitLeg } from "./types";

export function transitTimes(leg: TransitLeg) {
  return {
    departure: leg.displayTimes?.departure ?? planTimeLabel(leg.departurePlan, "待定", "first"),
    arrival: leg.displayTimes?.arrival ?? planTimeLabel(leg.arrivalPlan, "待定", "last"),
  };
}

/** Use the configured order (including return visits), never sort by prose clocks. */
export function dayPresentation(model: GuideRouteModel, day: GuideDay) {
  const legs = day.segments.flatMap((segment) => segment.pointIds.slice(0, -1).flatMap((from, index) => {
    const leg = model.transitLegs.find((candidate) => candidate.dayId === day.id
      && candidate.fromPlaceId === from && candidate.toPlaceId === segment.pointIds[index + 1]);
    return leg ? [leg] : [];
  }));
  const first = legs[0];
  const last = legs.at(-1);
  return {
    legs,
    departure: first ? transitTimes(first).departure : "待定",
    arrival: last ? transitTimes(last).arrival : "待定",
    destination: model.places.find((place) => place.id === last?.toPlaceId)?.name ?? "待定",
  };
}
