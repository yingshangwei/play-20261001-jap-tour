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
  assert.match(html, /任天堂博物馆/);
  assert.match(html, /城阳秋花火/);
  assert.match(html, /大阪 3晚 · 京都 4晚 · 大阪 1晚/);
  assert.match(html, /南海 Rapi:t \/ 机场急行/);
  assert.match(html, /交通耗时/);
  assert.match(html, /真实地图/);
  assert.match(html, /OpenStreetMap/);
  assert.match(html, /Google Maps/);
  assert.match(html, /候选餐厅与行程的距离关系/);
  assert.match(html, /料理屋まえかわ/);
  assert.match(html, /萬寿寺はくらん/);
  assert.match(html, /太庵 \/ Taian/);
  assert.match(html, /神户 \/ 西宫/);
  assert.match(html, /菊乃井本店/);
  assert.match(html, /永观堂/);
  assert.match(html, /参考旧行程/);
  assert.match(html, /不安排清水寺夜游/);
  assert.match(html, /伏见稻荷放在 10\.06 清晨/);
  assert.match(html, /京懐石 吉泉/);
  assert.doesNotMatch(html, /09\.28|十日关西/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview/);
});
