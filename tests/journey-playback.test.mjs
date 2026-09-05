import assert from "node:assert/strict";
import test from "node:test";
import { register } from "node:module";

register("./config-loader.mjs", import.meta.url);
const { INITIAL_PLAYBACK, playbackReducer, planTimeLabel, stepDuration, travelProgress, curvePoint, routeNodes, resolveTransportModes, TRANSPORT_LABELS } = await import("../app/guide-core/journeyPlayback.ts");
const { getJourneyModel } = await import("../app/guide-core/defineGuide.ts");
const { guideCatalog, loadGuide } = await import("../guides/registry.ts");
const durations = [11000, 12000];
const tick = (state, delta = 100, speed = 1) => playbackReducer(state, { type: "tick", delta, speed, durations });
const toggle = (state) => playbackReducer(state, { type: "toggle", durations });

test("time labels use the final arrival and preserve estimated ranges", () => {
  assert.equal(planTimeLabel("西九条 06:54｜环球城 07:11｜USJ 闸口约 07:15"), "07:15");
  assert.equal(planTimeLabel("难波站约 16:15–16:35｜酒店约 16:30–16:50"), "16:30–16:50");
  assert.equal(planTimeLabel("酒店 08:15–08:30｜列车 09:00", "待定", "first"), "08:15–08:30");
  assert.equal(planTimeLabel("到达时间待定"), "待定");
});

test("pause preserves position, resume continues and speed changes only the increment", () => {
  let state = toggle(INITIAL_PLAYBACK);
  for (let i = 0; i < 25; i++) state = tick(state);
  assert.equal(state.elapsed, 2500);
  state = playbackReducer(state, { type: "pause" });
  assert.deepEqual(tick(state, 5000), state);
  state = tick(toggle(state), 100, 2);
  assert.equal(state.elapsed, 2700);
  assert.equal(state.index, 0);
  assert.equal(travelProgress(state.elapsed), .45);
});

test("arrival has dedicated reading time, final stop stays arrived, replay alone resets", () => {
  let state = { index: 0, elapsed: 5900, playing: true };
  state = tick(state);
  assert.equal(travelProgress(state.elapsed), 1);
  assert.equal(state.index, 0);
  for (let i = 0; i < 49; i++) state = tick(state);
  assert.equal(state.index, 0);
  state = tick(state);
  assert.deepEqual(state, { index: 1, elapsed: 0, playing: true });
  for (let i = 0; i < 120; i++) state = tick(state);
  assert.deepEqual(state, { index: 1, elapsed: 12000, playing: false });
  assert.equal(travelProgress(state.elapsed), 1);
  assert.deepEqual(toggle(state), { index: 0, elapsed: 0, playing: true });
});

test("selecting another leg stops playback, stalls cannot skip places, empty toggles are safe", () => {
  assert.deepEqual(playbackReducer({ index: 1, elapsed: 500, playing: true }, { type: "select", index: 0 }), INITIAL_PLAYBACK);
  assert.equal(tick(toggle(INITIAL_PLAYBACK), 60000).elapsed, 100);
  assert.deepEqual(playbackReducer(INITIAL_PLAYBACK, { type: "toggle", durations: [] }), INITIAL_PLAYBACK);
});

test("transport modes remain conservative and support explicit distinct vehicle types", () => {
  assert.deepEqual(resolveTransportModes("铁路", "JR 京都线新快速；无法乘坐时打车"), ["train"]);
  assert.deepEqual(resolveTransportModes("铁路", "地铁东西线"), ["metro"]);
  assert.deepEqual(resolveTransportModes("铁路＋巴士"), ["train", "bus"]);
  assert.deepEqual(resolveTransportModes("缆车＋步行"), ["cable-car", "walk"]);
  assert.deepEqual(resolveTransportModes("国际航班"), ["flight"]);
  for (const mode of Object.keys(TRANSPORT_LABELS)) assert.deepEqual(resolveTransportModes("other", "", [mode]), [mode]);
});

test("curve hits both nodes exactly and proceeds monotonically without easing resets", () => {
  const from = [95, 115], to = [260, 158];
  assert.deepEqual(curvePoint(from, to, 0), from);
  assert.deepEqual(curvePoint(from, to, 1), to);
  const samples = Array.from({ length: 101 }, (_, i) => curvePoint(from, to, i / 100));
  samples.slice(1).forEach(([x, y], i) => { assert.ok(x >= samples[i][0]); assert.ok(y >= samples[i][1]); });
  assert.equal(travelProgress(-10), 0);
  assert.equal(travelProgress(99999), 1);
});

test("every configuration retains its ground legs, times, modes, photo prefixes and revisits", async () => {
  for (const entry of guideCatalog) {
    const guide = await loadGuide(entry.id);
    const before = JSON.stringify(guide);
    const model = getJourneyModel(guide, "/preview-prefix");
    const ground = model.steps.slice(guide.journey.beforeSteps.length, model.steps.length - guide.journey.afterSteps.length || undefined);
    const count = guide.days.reduce((sum, day) => sum + day.segments.reduce((n, segment) => n + segment.pointIds.length - 1, 0), 0);
    assert.equal(ground.length, count);
    model.steps.forEach((step) => {
      assert.ok(step.transportModes.length > 0);
      step.transportModes.forEach((mode) => assert.ok(mode in TRANSPORT_LABELS));
      assert.ok(stepDuration(step) >= 10500 && stepDuration(step) <= 14000);
      if (step.media?.src.startsWith("/")) assert.ok(step.media.src.startsWith("/preview-prefix/"));
      if (step.fromMedia?.src.startsWith("/")) assert.ok(step.fromMedia.src.startsWith("/preview-prefix/"));
    });
    for (const day of guide.days) {
      const steps = model.steps.filter((step) => step.date === day.id);
      const route = routeNodes(steps);
      assert.equal(route.legs.length, steps.length);
      route.legs.forEach((leg, i) => {
        assert.equal(route.nodes[leg.from].point.id, steps[i].from.id);
        assert.equal(route.nodes[leg.to].point.id, steps[i].to.id);
      });
      if (steps.length > 1 && steps[0].from.id === steps.at(-1).to.id) assert.equal(route.nodes[0].point.id, route.nodes.at(-1).point.id);
    }
    assert.equal(JSON.stringify(guide), before);
  }
});

test("disconnected segments never fabricate a connecting edge", () => {
  const point = (id) => ({ id });
  const { nodes, legs } = routeNodes([{ from: point("a"), to: point("b") }, { from: point("c"), to: point("a") }]);
  assert.deepEqual(nodes.map((node) => node.point.id), ["a", "b", "c", "a"]);
  assert.deepEqual(legs, [{ from: 0, to: 1 }, { from: 2, to: 3 }]);
  assert.equal(nodes[1].outgoingStepIndex, undefined);
  assert.equal(nodes[2].incomingStepIndex, undefined);
});

test("each visit pairs its own incoming arrival and outgoing departure, never another day", () => {
  const point = (id) => ({ id });
  const pair = (from, to, date = "day-1") => ({ from: point(from), to: point(to), date });
  const steps = [pair("a", "b"), pair("b", "a"), pair("a", "c"), pair("c", "a"), pair("a", "b", "day-2")];
  const { nodes, legs } = routeNodes(steps);
  assert.deepEqual(nodes.map((node) => [node.point.id, node.incomingStepIndex, node.outgoingStepIndex]), [
    ["a", undefined, 0], ["b", 0, 1], ["a", 1, 2], ["c", 2, 3], ["a", 3, undefined],
    ["a", undefined, 4], ["b", 4, undefined],
  ]);
  assert.deepEqual(legs.at(-1), { from: 5, to: 6 });
});

test("hotel revisits, shrine timing and alternative hotels use the selected configuration", async () => {
  for (const id of ["kansai-2026", "kansai-2026-plan-2"]) {
    const relaxed = id.endsWith("plan-2");
    const model = getJourneyModel(await loadGuide(id));
    const visits = (day, placeId) => {
      const steps = model.steps.filter((step) => step.date === day);
      return routeNodes(steps).nodes.filter((node) => node.point.id === placeId).map((node) => [
        steps[node.incomingStepIndex]?.arrivalTime, steps[node.outgoingStepIndex]?.departureTime,
      ]);
    };
    assert.deepEqual(visits("10.03", "kyoto-stay"), [
      ["09:45–10:00", "10:05"], ["15:30", "17:45"], ["22:15–22:35", undefined],
    ]);
    assert.deepEqual(visits("10.05", "kifune"), [[relaxed ? "10:45" : "11:00–11:15", relaxed ? "11:30" : "12:00"]]);
    assert.deepEqual(visits("10.05", "kifune-yui"), [[relaxed ? "12:45" : "13:15", "15:20"]]);
    assert.deepEqual(visits("10.07", "osaka-stay"), [[undefined, "难波 07:40\n心斋桥 07:25"]]);
    assert.deepEqual(visits("10.07", "shanghai-flight-placeholder"), [["待定", undefined]]);
    assert.deepEqual(visits("10.06", "kasuga"), [[relaxed ? "15:45" : "15:35", relaxed ? "16:25" : "16:20"]]);
    assert.deepEqual(visits("10.06", "osaka-stay"), [[relaxed ? "18:15–18:35" : "18:05–18:25", undefined]]);
    assert.equal(visits("10.01", "osaka-stay").at(-1)[0], relaxed ? "16:00–16:15" : "18:40");
  }
});

test("origin photos have their own attribution and missing media never borrows a destination", async () => {
  const guide = await loadGuide("kansai-2026");
  for (const step of getJourneyModel(guide, "/photo-check").steps) {
    const configured = guide.journey.mediaByPlaceId[step.from.id];
    assert.equal(step.fromMedia.src, `/photo-check${configured.src}`);
    assert.equal(step.fromMedia.credit, configured.credit);
    assert.equal(step.fromMedia.license, configured.license);
    if (step.from.category === "stay") assert.match(step.fromMedia.label, /非酒店照片/);
  }
  const missing = { ...guide, journey: { ...guide.journey, mediaByPlaceId: { kix: guide.journey.mediaByPlaceId.kix } } };
  const first = getJourneyModel(missing).steps[0];
  assert.equal(first.fromMedia, undefined);
  assert.ok(first.media);
  const sample = getJourneyModel(await loadGuide("sample-weekend"));
  assert.ok(sample.steps.every((step) => !step.fromMedia && !step.media));
});
