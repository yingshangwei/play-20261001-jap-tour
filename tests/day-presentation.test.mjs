import assert from "node:assert/strict";
import test from "node:test";
import { register } from "node:module";
import { createHash } from "node:crypto";
register("./config-loader.mjs", import.meta.url);
const { dayPresentation, transitTimes } = await import("../app/guide-core/dayPresentation.ts");
const { getJourneyModel } = await import("../app/guide-core/defineGuide.ts");
const { loadGuide, guideCatalog } = await import("../guides/registry.ts");
const plan = await loadGuide("kansai-2026");
const leg = (id) => plan.transitLegs.find((item) => item.id === id);

test("shared day summaries use actual endpoint clocks, preserve return visits and work without research fields", async () => {
  for (const entry of guideCatalog) {
    const guide = await loadGuide(entry.id);
    const before = JSON.stringify(guide);
    for (const day of guide.days) {
      const summary = dayPresentation(guide, day);
      assert.equal(summary.legs.length, day.segments.reduce((n, segment) => n + segment.pointIds.length - 1, 0));
      assert.equal(summary.departure, transitTimes(summary.legs[0]).departure);
      assert.equal(summary.arrival, transitTimes(summary.legs.at(-1)).arrival);
      assert.equal(summary.destination, guide.places.find((place) => place.id === summary.legs.at(-1).toPlaceId).name);
    }
    assert.equal(JSON.stringify(guide), before);
  }
  assert.equal(transitTimes(leg("10.05:kifune-yui>kyoto-stay")).departure, "15:20");
  assert.match(dayPresentation(plan, plan.days.at(-1)).departure, /难波 07:40\n心斋桥 07:25/);
});

test("plan-one corrections keep anchors, 45 legs and consistent animation timing", () => {
  assert.equal(plan.days[0].date, "2026-09-29");
  assert.equal(plan.days.at(-1).date, "2026-10-07");
  const anchors = { "09.29": "shinsaibashi", "09.30": "usj", "10.02": "nunobiki", "10.03": "arashiyama-bamboo", "10.04": "philosopher", "10.05": "kifune", "10.06": "fushimi-inari" };
  for (const [date, place] of Object.entries(anchors)) assert.ok(plan.days.find((day) => day.id === date).segments.some((segment) => segment.pointIds.includes(place)));
  assert.ok(plan.days.find((day) => day.id === "10.04").segments.some((segment) => segment.pointIds.includes("joyo")));
  const steps = getJourneyModel(plan).steps.filter((step) => leg(`${step.date}:${step.from.id}>${step.to.id}`));
  assert.equal(steps.length, 45);
  for (const step of steps) {
    const times = transitTimes(leg(`${step.date}:${step.from.id}>${step.to.id}`));
    assert.equal(step.departureTime, times.departure);
    assert.equal(step.arrivalTime, times.arrival);
  }
  assert.equal(transitTimes(leg("10.04:philosopher>nanzenji")).arrival, "11:15");
  assert.match(leg("10.04:philosopher>nanzenji").duration, /70.*20/);
  assert.match(leg("10.05:kyoto-stay>kifune").route, /10:00.*10:28/);
  assert.match(leg("10.05:kyoto-stay>kifune").verification.pending, /巴士.*待确认/);
  assert.equal(leg("10.05:kyoto-stay>kifune").timingStatus, "部分核实");
  assert.match(leg("10.04:joyo>kyoto-stay").fallback, /22:05–22:15/);
  assert.match(leg("10.06:fushimi-inari>todaiji").stayPlan, /12:05–12:40/);
  assert.match(leg("10.06:kasuga>osaka-stay").serviceBoundary.detail, /16:20/);
  assert.doesNotMatch(leg("10.06:kasuga>osaka-stay").serviceBoundary.detail, /已核到分钟|16:35/);
});

test("this plan-one research does not mutate plan-two content (pre-edit baseline)", async () => {
  const other = await loadGuide("kansai-2026-plan-2");
  const baseline = {
    days: "6edfba70951eb9ce39948e114e46556559f81db5982e876e9ac019374093f711",
    places: "862f7b5d1cd10b37b6cd557d58768f829ae0121b5f6ec48a19369e2e50b9f442",
    transitLegs: "a3a8e1562a6a855cb47c17c1331204e7725e06642dee53785c22b76f2277ab4b",
    home: "8e0b6aeda437978b5f60a4e1747419bf09b71edd30192848d5c6185d5e2921cf",
    journalDays: "532be0e7926e61878536a496589247bdd5e1200c68c6a57210633a2224ab955e",
  };
  for (const [field, hash] of Object.entries(baseline)) assert.equal(createHash("sha256").update(JSON.stringify(other[field])).digest("hex"), hash, `Update baseline only for an authorized plan-two content change: ${field}`);
});

test("visit research only targets real stops on the selected day and cites dated sources", () => {
  for (const day of plan.days) {
    const stops = new Set(day.segments.flatMap((segment) => segment.pointIds));
    for (const [id, visit] of Object.entries(day.visits ?? {})) {
      assert.ok(stops.has(id), `${day.id}: ${id}`);
      assert.ok(visit.focus && visit.duration && visit.priority);
      visit.sources?.forEach((source) => {
        assert.equal(new URL(source.href).protocol, "https:");
        assert.equal(source.checkedAt, "2026-09-06");
      });
    }
  }
});
