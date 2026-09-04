import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

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
  assert.match(html, /地图日期筛选/);
  assert.match(html, /全部日期/);
  assert.match(html, /10月4日/);
  assert.match(html, /相邻两点 Google Maps 导航/);
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

test("covers every consecutive itinerary leg with transit guidance", async () => {
  const source = await readFile(new URL("../app/transitData.ts", import.meta.url), "utf8");
  assert.equal(source.match(/^ {4}kind: "/gm)?.length, 45);
  assert.equal(source.match(/suggestedTime: "/g)?.length, 45);
  assert.equal(source.match(/duration: "/g)?.length, 45);
  assert.equal(source.match(/route: "/g)?.length, 45);
  assert.equal(source.match(/fallback: "/g)?.length, 45);
  assert.equal(source.match(/departurePlan: "/g)?.length, 45);
  assert.equal(source.match(/arrivalPlan: "/g)?.length, 45);
  assert.equal(source.match(/stayPlan: "/g)?.length, 45);
  assert.equal(source.match(/^ {4}timingStatus: "/gm)?.length, 45);
  assert.match(source, /最早班次/);
  assert.match(source, /最晚班次/);
  assert.match(source, /JR 长池/);
  assert.match(source, /京都巴士 33 路/);
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
