import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
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
  assert.match(html, /南海 Rapi:t \/ 机场急行/);
  assert.match(html, /交通耗时/);
  assert.match(html, /真实地图/);
  assert.match(html, /OpenStreetMap/);
  assert.match(html, /Google Maps/);
  assert.match(html, /Google Maps 高评价餐厅/);
  assert.match(html, /地图日期筛选/);
  assert.match(html, /全部日期/);
  assert.match(html, /10月4日/);
  assert.match(html, /相邻两点 Google Maps 导航/);
  assert.match(html, /两点导航/);
  assert.match(html, /整段路线/);
  assert.match(html, /料理屋まえかわ/);
  assert.match(html, /Mouriya Honten/);
  assert.match(html, /Google Maps 4\.8 · 16,590 条评价/);
  assert.match(html, /水谷茶屋/);
  assert.match(html, /布引香草园/);
  assert.match(html, /从山景走到海港，神户当天往返/);
  assert.match(html, /永观堂/);
  assert.match(html, /参考旧行程/);
  assert.match(html, /不安排清水寺夜游/);
  assert.match(html, /伏见稻荷放到烟火当天/);
  assert.match(html, /USJ 后睡到自然醒，再慢走大阪南区/);
  assert.match(html, /退房后顺路游奈良，晚上回到大阪/);
  assert.doesNotMatch(html, /任天堂博物馆|Nintendo Museum/);
  assert.doesNotMatch(html, /彩色虚线|行程先后顺序/);
  assert.doesNotMatch(html, /09\.28|十日关西/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview/);
});
