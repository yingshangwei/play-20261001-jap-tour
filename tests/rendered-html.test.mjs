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
  assert.match(html, /Google Maps 高评价餐厅/);
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
  assert.match(html, /退房后直达岚山，再入住京都/);
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
  assert.equal(source.match(/^ {4}kind: "/gm)?.length, 44);
  assert.equal(source.match(/suggestedTime: "/g)?.length, 44);
  assert.equal(source.match(/duration: "/g)?.length, 44);
  assert.equal(source.match(/route: "/g)?.length, 44);
  assert.equal(source.match(/fallback: "/g)?.length, 44);
  assert.equal(source.match(/departurePlan: "/g)?.length, 44);
  assert.equal(source.match(/arrivalPlan: "/g)?.length, 44);
  assert.equal(source.match(/stayPlan: "/g)?.length, 44);
  assert.equal(source.match(/^ {4}timingStatus: "/gm)?.length, 44);
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
