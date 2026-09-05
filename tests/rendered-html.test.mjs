import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { register } from "node:module";

register("./config-loader.mjs", import.meta.url);

const { getJourneyModel, defineTravelGuide } = await import("../app/guide-core/defineGuide.ts");
const { pointsForDay, splitRouteForMobile, dayRouteHref } = await import("../app/guide-core/dayRoutes.ts");
const { kansai2026Guide } = await import("../guides/kansai-2026/guide.ts");
const { kansaiPlanTwoGuide } = await import("../guides/kansai-2026/configurations/plan-2/guide.ts");
const { loadGuide } = await import("../guides/registry.ts");

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

async function configuredJourneyCounts() {
  const guide = kansai2026Guide;
  const groundSteps = guide.days.reduce((total, day) => total + day.segments.reduce((count, segment) => count + segment.pointIds.length - 1, 0), 0);
  const configuredSteps = guide.journey.beforeSteps.length + guide.journey.afterSteps.length;
  return { groundSteps, totalSteps: groundSteps + configuredSteps };
}

test("server-renders the Kansai travel guide", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /九日关西/);
  assert.match(html, /09\.29 — 10\.07/);
  assert.match(html, /城阳秋花火/);
  assert.match(html, /大阪 4晚 · 京都 3晚 · 大阪 1晚/);
  assert.match(html, /南海 Rapi:t／空港急行/);
  assert.match(html, /交通摘要/);
  assert.match(html, /真实地图/);
  assert.match(html, /OpenStreetMap/);
  assert.match(html, /Google Maps/);
  assert.match(html, /餐厅候选与顺路备选/);
  assert.match(html, /让整段旅程/);
  assert.match(html, /个阶段 · 可按天播放/);
  assert.match(html, /上海出发机场 · 待确认/);
  assert.match(html, /选择动画阶段/);
  assert.match(html, /播放速度/);
  assert.match(html, /目的地实景/);
  assert.match(html, /\/journey-photos\/kix\.jpg/);
  assert.match(html, /Wikimedia Commons|commons\.wikimedia\.org/);
  assert.match(html, /正在前往/);
  assert.match(html, /地图日期筛选/);
  assert.match(html, /全部日期/);
  assert.match(html, /10月4日/);
  assert.match(html, /Google Maps 全天路线 \+ 逐段导航/);
  assert.match(html, /首末班约束/);
  assert.match(html, /无法乘坐时的备用方案/);
  assert.match(html, /从哪里几点出发/);
  assert.match(html, /预计几点到/);
  assert.match(html, /到达后游览 \/ 停留/);
  assert.match(html, /部分核实/);
  assert.match(html, /06:46 阪神/);
  assert.match(html, /作息/);
  assert.match(html, /常规作息 · 09:30 离店/);
  assert.match(html, /正常作息 · 09:00 离店/);
  assert.match(html, /08:26–08:32 JR/);
  assert.match(html, /料理屋まえかわ/);
  assert.match(html, /Mouriya Honten/);
  assert.match(html, /Google Maps 4\.8 · 16,590 条评价/);
  assert.match(html, /水谷茶屋/);
  assert.match(html, /布引香草园/);
  assert.match(html, /神户保留：从山景走到海港/);
  assert.match(html, /先把行李交给京都酒店，再轻装去岚山/);
  assert.match(html, /两次换宿 · 零次带大箱游览/);
  assert.match(html, /箱子先到位/);
  assert.match(html, /人再轻装出发/);
  assert.match(html, /09:45–10:05 京都酒店交箱/);
  assert.match(html, /宅急便酒店到酒店行李规则/);
  assert.match(html, /不使用伏见或奈良寄存柜/);
  assert.match(html, /哲学之道、宇治川与秋日烟火/);
  assert.match(html, /贵船神社是硬约束/);
  assert.match(html, /永观堂/);
  assert.match(html, /参考旧行程/);
  assert.match(html, /伏见稻荷顺移到奈良当天/);
  assert.match(html, /USJ 后睡到自然醒，再慢走大阪南区/);
  assert.match(html, /伏见稻荷之后，沿 JR 奈良线继续南下/);
  assert.doesNotMatch(html, /任天堂博物馆|Nintendo Museum/);
  assert.doesNotMatch(html, /彩色虚线|行程先后顺序/);
  assert.doesNotMatch(html, /09\.28|十日关西/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview/);
});

test("covers every configured itinerary leg with transit guidance", async () => {
  const source = await readFile(new URL("../guides/kansai-2026/transit.ts", import.meta.url), "utf8");
  const { groundSteps } = await configuredJourneyCounts();
  assert.equal(source.match(/^ {4}kind: "/gm)?.length, groundSteps);
  assert.equal(source.match(/suggestedTime: "/g)?.length, groundSteps);
  assert.equal(source.match(/duration: "/g)?.length, groundSteps);
  assert.equal(source.match(/route: "/g)?.length, groundSteps);
  assert.equal(source.match(/fallback: "/g)?.length, groundSteps);
  assert.equal(source.match(/departurePlan: "/g)?.length, groundSteps);
  assert.equal(source.match(/arrivalPlan: "/g)?.length, groundSteps);
  assert.equal(source.match(/stayPlan: "/g)?.length, groundSteps);
  assert.equal(source.match(/^ {4}timingStatus: "/gm)?.length, groundSteps);
  assert.match(source, /最早班次/);
  assert.match(source, /最晚班次/);
  assert.match(source, /JR 长池/);
  assert.match(source, /京都巴士 33 路/);
});

test("derives the journey player stage count from the selected guide", async () => {
  const [{ totalSteps }, response, playerSource] = await Promise.all([
    configuredJourneyCounts(),
    render(),
    readFile(new URL("../app/JourneyPlayer.tsx", import.meta.url), "utf8"),
  ]);
  const html = await response.text();
  assert.match(html, new RegExp(`${totalSteps} 个阶段 · 可按天播放`));
  assert.match(playerSource, /JourneyModel/);
  assert.doesNotMatch(playerSource, /GuideRouteModel|getTransitLeg|buildJourneySteps/);
  assert.doesNotMatch(playerSource, /kix|shanghai|大阪|京都|神户|奈良|关西/i);
  assert.doesNotMatch(playerSource, /\b(?:45|47)\b/);
});

test("keeps the map component decoupled from the Kansai guide package", async () => {
  const source = await readFile(new URL("../app/TripMap.tsx", import.meta.url), "utf8");
  assert.match(source, /GuideRouteModel/);
  assert.doesNotMatch(source, /guides\/kansai-2026|transitData|daySegments|allPoints|dayTitles/);
  assert.doesNotMatch(source, /大阪|京都|神户|奈良|关西/);
});

test("renders the home page from the selected guide configuration", async () => {
  const [pageSource, rootPageSource, layoutSource, homeSource, response] = await Promise.all([
    readFile(new URL("../app/guide-ui/GuideHome.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../guides/kansai-2026/home.ts", import.meta.url), "utf8"),
    render(),
  ]);
  const html = await response.text();
  assert.match(pageSource, /const home = guide\.home/);
  assert.doesNotMatch(pageSource, /const (?:days|luggagePlans|bookingCards|restaurants|referenceReview|practical)\s*=/);
  assert.doesNotMatch(pageSource, /大阪|京都|神户|奈良|贵船|伏见|城阳/);
  assert.doesNotMatch(layoutSource, /大阪|京都|神户|奈良|关西|KANSAI/);
  assert.match(rootPageSource, /<GuideHome guideId="kansai-2026"/);
  assert.match(homeSource, /九日关西/);
  assert.match(homeSource, /journalPaths:/);
  assert.match(html, /<meta name="description" content="9 月 29 日至 10 月 7 日大阪、神户、京都与奈良九日路线：USJ、贵船神社与城阳秋花火。"/);
});

test("server-renders every registered guide and the second journal template", async () => {
  const [kansaiResponse, sampleResponse, sampleDayResponse] = await Promise.all([
    render("/guides/kansai-2026"),
    render("/guides/sample-weekend"),
    render("/guides/sample-weekend/days/day-1"),
  ]);
  assert.equal(kansaiResponse.status, 200);
  assert.equal(sampleResponse.status, 200);
  assert.equal(sampleDayResponse.status, 200);

  const [kansaiHtml, sampleHtml, sampleDayHtml] = await Promise.all([
    kansaiResponse.text(), sampleResponse.text(), sampleDayResponse.text(),
  ]);
  assert.match(kansaiHtml, /九日关西/);
  assert.match(kansaiHtml, /\/guides\/kansai-2026\/days\/2026-09-29/);
  assert.match(sampleHtml, /一日城市周末/);
  assert.match(sampleHtml, /1 个阶段 · 按日播放/);
  assert.match(sampleHtml, /城市中央站/);
  assert.doesNotMatch(sampleHtml, /journey-place-photo|journey-photos|commons\.wikimedia\.org/);
  assert.match(sampleDayHtml, /COMPACT TEMPLATE/);
  assert.match(sampleDayHtml, /紧凑手账/);
  assert.match(sampleDayHtml, /模板验证说明/);
});

test("keeps destination media guide-owned, credited and prefixed for both configurations", async () => {
  for (const guide of [kansai2026Guide, kansaiPlanTwoGuide]) {
    const model = getJourneyModel(guide, "/test-prefix");
    const expectedGroundSteps = guide.days.reduce((total, day) => total + day.segments.reduce((count, segment) => count + segment.pointIds.length - 1, 0), 0);
    assert.equal(model.steps.length, expectedGroundSteps + guide.journey.beforeSteps.length + guide.journey.afterSteps.length);
    for (const step of model.steps) {
      const configured = guide.journey.mediaByPlaceId[step.to.id];
      assert.ok(configured, `${guide.id}: ${step.to.id} has destination media`);
      assert.equal(step.media.src, `/test-prefix${configured.src}`);
      assert.ok(step.media.credit && step.media.license && step.media.sourceHref);
      assert.match(step.media.sourceHref, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      if (step.to.category === "stay") assert.match(step.media.label, /非酒店照片/);
      if (step.to.category === "restaurant") assert.match(step.media.label, /餐厅候选/);
      if (step.to.id === "joyo") assert.match(step.media.label, /非城阳现场/);
    }
    const html = await (await render(`/guides/${guide.id}`)).text();
    const photo = html.match(/<figure class="journey-place-photo"[\s\S]*?<\/figure>/)?.[0];
    assert.ok(photo, "initial destination photograph is server rendered");
    const prefix = process.env.GITHUB_ACTIONS === "true" ? `/${process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "play-20261001-jap-tour"}` : "";
    assert.ok(photo.includes(`src="${prefix}/journey-photos/kix.jpg"`));
  }
  const sample = await loadGuide("sample-weekend");
  assert.ok(getJourneyModel(sample).steps.every((step) => step.media === undefined));
  const missing = { ...kansai2026Guide, journey: { ...kansai2026Guide.journey, mediaByPlaceId: {} } };
  assert.ok(getJourneyModel(missing).steps.every((step) => step.media === undefined), "no cross-guide or area fallback");
  assert.throws(() => defineTravelGuide({ ...missing, journey: { ...missing.journey, mediaByPlaceId: { kix: { ...kansai2026Guide.journey.mediaByPlaceId.kix, credit: "" } } } }), /Journey media must include/);
});

test("builds complete day routes and continuous mobile parts from each selected configuration", () => {
  for (const guide of [kansai2026Guide, kansaiPlanTwoGuide]) {
    const pointById = new Map(guide.places.map((point) => [point.id, point]));
    const transitIds = new Set(guide.transitLegs.map((leg) => leg.id));
    for (const day of guide.days) {
      const points = pointsForDay(day, pointById);
      assert.equal(points[0].id, day.segments[0].pointIds[0]);
      assert.equal(points.at(-1).id, day.segments.at(-1).pointIds.at(-1));
      assert.equal(points.length - 1, day.segments.reduce((sum, segment) => sum + segment.pointIds.length - 1, 0));
      points.slice(1).forEach((point, index) => assert.ok(transitIds.has(`${day.id}:${points[index].id}>${point.id}`), "every consecutive stop retains its transport card"));
      const href = dayRouteHref(points);
      assert.ok(href, `${guide.id} ${day.id}: complete URL fits`);
      const url = new URL(href);
      assert.equal(url.searchParams.get("api"), "1");
      assert.equal(url.searchParams.get("origin"), points[0].googleQuery);
      assert.equal(url.searchParams.get("destination"), points.at(-1).googleQuery);
      assert.deepEqual((url.searchParams.get("waypoints") ?? "").split("|").filter(Boolean), points.slice(1, -1).map((point) => point.googleQuery));
      assert.equal(url.searchParams.has("travelmode"), false, "overview must not force a false all-transit itinerary");
      const parts = splitRouteForMobile(points);
      assert.deepEqual(parts.flatMap((part, index) => index ? part.slice(1) : part), points);
      for (const part of parts) {
        assert.ok(part.length >= 2 && part.length <= 5);
        assert.ok(dayRouteHref(part).length <= 2048);
      }
    }
  }
  const placeMap = new Map(kansai2026Guide.places.map((point) => [point.id, point]));
  const revisits = pointsForDay({ segments: [{ pointIds: ["osaka-stay", "shinsaibashi", "osaka-stay"] }, { pointIds: ["osaka-stay", "dotonbori", "osaka-stay"] }] }, placeMap);
  assert.deepEqual(revisits.map((point) => point.id), ["osaka-stay", "shinsaibashi", "osaka-stay", "dotonbori", "osaka-stay"]);
  assert.throws(() => pointsForDay({ segments: [{ pointIds: ["unknown"] }] }, placeMap), /Unknown route place/);
  assert.equal(dayRouteHref([]), null);
  assert.equal(dayRouteHref(revisits.slice(0, 1)), null);
  assert.equal(dayRouteHref(Array(12).fill(revisits[0])), null, "never silently truncate a long day");
  assert.throws(() => splitRouteForMobile(revisits, 1), /between two and five/);
  assert.throws(() => splitRouteForMobile(revisits, 6), /between two and five/);
  const longNames = revisits.map((point) => ({ ...point, googleQuery: "长地点名".repeat(300) }));
  assert.ok(dayRouteHref(longNames).length <= 2048);
  assert.equal(new URL(dayRouteHref(longNames)).searchParams.get("origin"), revisits[0].position.join(","));
});

test("keeps the reusable guide home independent from registered guide packages", async () => {
  const source = await readFile(new URL("../app/guide-ui/GuideHome.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /guides\/kansai-2026|guides\/sample-weekend/);
  assert.doesNotMatch(source, /大阪|京都|神户|奈良|贵船|伏见|城阳/);
  assert.match(source, /guideCatalog\.filter/);
});

test("switches between real Kansai configurations and keeps their routes separate", async () => {
  const [original, optimized] = await Promise.all([render("/"), render("/guides/kansai-2026-plan-2")]);
  const originalHtml = await original.text();
  const optimizedHtml = await optimized.text();
  for (const html of [originalHtml, optimizedHtml]) {
    const switcher = html.match(/<nav class="guide-configurations[\s\S]*?<\/nav>/)?.[0];
    assert.ok(switcher, "configuration switcher is visible in the hero");
    assert.match(switcher, /配置 1 · 原行程/);
    assert.match(switcher, /配置 2 · 从容版/);
    assert.doesNotMatch(switcher, /sample-weekend/);
    assert.equal((switcher.match(/aria-current="page"/g) ?? []).length, 1);
  }
  assert.match(originalHtml, /USJ 后睡到自然醒，再慢走大阪南区/);
  assert.doesNotMatch(originalHtml, /恢复日做到一半/);
  assert.match(optimizedHtml, /恢复日做到一半，就安心回酒店/);
  assert.match(optimizedHtml, /先吃午餐再进大佛殿/);
  assert.match(optimizedHtml, /17:21/);
  assert.match(optimizedHtml, /08:26–08:32 JR/);
  const journals = [...optimizedHtml.matchAll(/href="([^"]*\/guides\/kansai-2026-plan-2\/days\/[^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(journals).size, 9, "all nine days link to this configuration's journals");
  const responses = await Promise.all(journals.map((href) => render(href.slice(href.indexOf("/guides/")).replace(/\.html$/, ""))));
  for (const response of responses) {
    assert.equal(response.status, 200);
    assert.match(await response.text(), /返回配置 2 总行程/);
  }
});

test("Day 3 compatibility page follows the recovery day and Day 8 keeps Fushimi before Nara", async () => {
  const [third, eighth] = await Promise.all([render("/day-3"), render("/guides/kansai-2026-plan-2/days/2026-10-06")]);
  const thirdHtml = await third.text();
  const eighthHtml = await eighth.text();
  assert.match(thirdHtml, /10:30/);
  assert.match(thirdHtml, /慶泽园/);
  assert.doesNotMatch(thirdHtml, /11–12 km|07:25|原始林/);
  assert.match(eighthHtml, /12:05–12:40/);
  assert.match(eighthHtml, /大箱已由京都酒店直送大阪酒店/);
  assert.match(eighthHtml, /特别参拜 16:00 结束/);
  assert.match(eighthHtml, /京都住宿.*伏见稻荷.*东大寺/s);
});

test("server-renders every guide registered in the catalog", async () => {
  const registry = await readFile(new URL("../guides/registry.ts", import.meta.url), "utf8");
  const catalogSource = registry.slice(registry.indexOf("guideCatalog"), registry.indexOf("guideLoaders"));
  const guideIds = [...catalogSource.matchAll(/id: "([^"]+)"/g)].map((match) => match[1]);
  assert.ok(guideIds.length > 1);
  const responses = await Promise.all(guideIds.map((guideId) => render(`/guides/${guideId}`)));
  responses.forEach((response, index) => assert.equal(response.status, 200, guideIds[index]));
});

test("keeps every guide-owned static asset resolvable from public", async () => {
  const guidesDirectory = new URL("../guides/", import.meta.url);
  const sourcePaths = (await readdir(guidesDirectory, { recursive: true }))
    .filter((path) => path.endsWith(".ts"));
  const assets = new Set();
  for (const sourcePath of sourcePaths) {
    const source = await readFile(new URL(sourcePath.replaceAll("\\", "/"), guidesDirectory), "utf8");
    for (const match of source.matchAll(/["'](\/[^"'?#]+\.(?:png|jpe?g|webp|svg|kml|pdf))["']/gi)) assets.add(match[1]);
  }
  assert.ok(assets.size > 0);
  await Promise.all([...assets].map((asset) => access(new URL(`../public${asset}`, import.meta.url))));
});

test("server-renders the Day 1 Osaka journal", async () => {
  const response = await render("/day-1");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /第一夜/);
  assert.match(html, /道顿堀 今井 本店/);
  assert.match(html, /わなか 千日前本店/);
  assert.match(html, /下载 Day 1 离线 KML/);
  assert.match(html, /南海官方时刻表/);
  assert.match(html, /不建偏好库/);
});

test("server-renders the Day 2 USJ journal from guide configuration", async () => {
  const response = await render("/day-2");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /从开园/);
  assert.match(html, /SUPER NINTENDO WORLD/);
  assert.match(html, /大阪难波 05:03/);
  assert.match(html, /23:12 作为完整返程/);
  assert.match(html, /Kinopio&#x27;s Cafe|Kinopio's Cafe/);
  assert.match(html, /Street Zombies/);
  assert.match(html, /下载 Day 2 离线 KML/);
  assert.match(html, /部分核实/);
  assert.doesNotMatch(html, /任天堂博物馆|Nintendo Museum/);
});
