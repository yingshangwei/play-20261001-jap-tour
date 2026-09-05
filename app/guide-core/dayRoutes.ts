import type { GuideDay, Place } from "./types";

/** Collapse adjacent segment junctions, never later revisits or the return to lodging. */
export function pointsForDay(day: Pick<GuideDay, "segments">, pointById: ReadonlyMap<string, Place>): Place[] {
  const points: Place[] = [];
  for (const segment of day.segments) {
    for (const id of segment.pointIds) {
      const point = pointById.get(id);
      if (!point) throw new Error(`Unknown route place: ${id}`);
      if (points.at(-1)?.id !== id) points.push(point);
    }
  }
  return points;
}

/** Three intermediate waypoints per mobile-browser URL, sharing each handoff stop. */
export function splitRouteForMobile(points: readonly Place[], maxPoints = 5): Place[][] {
  if (!Number.isInteger(maxPoints) || maxPoints < 2 || maxPoints > 5) {
    throw new Error("A mobile route must contain between two and five places");
  }
  const parts: Place[][] = [];
  for (let index = 0; index < points.length - 1; index += maxPoints - 1) {
    parts.push(points.slice(index, index + maxPoints));
  }
  return parts;
}

/** Overview only: omitting travelmode does not promise mixed-mode navigation. */
export function dayRouteHref(points: readonly Place[]): string | null {
  // Maps URLs allow nine intermediate waypoints outside mobile browsers.
  if (points.length < 2 || points.length > 11) return null;
  const build = (queries: string[]) => {
    const params = new URLSearchParams({ api: "1", origin: queries[0], destination: queries.at(-1)! });
    if (queries.length > 2) params.set("waypoints", queries.slice(1, -1).join("|"));
    return `https://www.google.com/maps/dir/?${params}`;
  };
  const namedHref = build(points.map((point) => point.googleQuery));
  if (namedHref.length <= 2048) return namedHref;
  const coordinateHref = build(points.map((point) => point.position.join(",")));
  return coordinateHref.length <= 2048 ? coordinateHref : null;
}
