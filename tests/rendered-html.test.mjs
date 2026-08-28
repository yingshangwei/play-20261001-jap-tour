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
  assert.match(html, /两座驻地/);
  assert.match(html, /09\.29–10\.02 · 3晚/);
  assert.match(html, /10\.02–10\.06 · 4晚/);
  assert.match(html, /南海 Rapi:t \/ 机场急行/);
  assert.match(html, /近铁奈良线/);
  assert.match(html, /近铁京都线/);
  assert.match(html, /JR 奈良线/);
  assert.match(html, /JR＋京阪＋叡山电铁/);
  assert.match(html, /交通耗时/);
  assert.match(html, /菊乃井本店/);
  assert.doesNotMatch(html, /09\.28|十日关西/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview/);
});
