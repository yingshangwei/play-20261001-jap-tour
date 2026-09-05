import assert from "node:assert/strict";
import test from "node:test";
import { register } from "node:module";

register("./config-loader.mjs", import.meta.url);
const { getJournalDay } = await import("../app/guide-core/defineGuide.ts");
const { pointsForDay } = await import("../app/guide-core/dayRoutes.ts");
const { guideCatalog, loadGuide } = await import("../guides/registry.ts");
const { fetchJournalWeather, parseWeatherResponse, weatherWindow, weatherUrl, weatherAdvice, weatherDescription } = await import("../app/guide-core/weather.ts");

const now = Date.parse("2026-09-05T07:00:00Z");
const config = { guideId: "weather-test", date: "2026-09-05", timezone: "Asia/Tokyo", locations: [{ id: "a", name: "地点 A", position: [35, 135] }], stops: [] };
function payload(date = config.date) {
  return {
    utc_offset_seconds: 32400,
    current: { time: `${date}T16:00`, interval: 900, temperature_2m: 28, apparent_temperature: 30, weather_code: 3, precipitation: 0, wind_speed_10m: 12, wind_gusts_10m: 20 },
    daily: { time: [date], weather_code: [3], temperature_2m_min: [23], temperature_2m_max: [29], apparent_temperature_min: [24], apparent_temperature_max: [31], precipitation_probability_max: [60], wind_speed_10m_max: [15], wind_gusts_10m_max: [27] },
    hourly: { time: [`${date}T16:00`], temperature_2m: [28], apparent_temperature: [30], weather_code: [3], precipitation_probability: [0], precipitation: [0], wind_speed_10m: [12], wind_gusts_10m: [20] },
  };
}

test("all registered journals derive their own date, coordinates and route revisits immutably", async () => {
  for (const entry of guideCatalog) {
    const guide = await loadGuide(entry.id);
    const before = JSON.stringify(guide);
    for (const journal of guide.journalDays) {
      const weather = getJournalDay(guide, journal.id).weather;
      const routeDay = guide.days.find((day) => day.date === journal.date);
      const expected = pointsForDay(routeDay, new Map(guide.places.map((point) => [point.id, point])));
      assert.equal(weather.guideId, guide.id);
      assert.equal(weather.date, journal.date);
      assert.equal(weather.timezone, guide.timezone);
      assert.deepEqual(weather.stops.map((stop) => stop.locationId), expected.map((place) => place.id));
      for (const location of weather.locations) assert.deepEqual(location.position, guide.places.find((place) => place.id === location.id).position);
      weather.locations[0].position[0] = 0;
    }
    assert.equal(JSON.stringify(guide), before);
  }
});

test("date gates use destination timezone and include only today through day 15", () => {
  assert.equal(weatherWindow(config, now).kind, "today");
  assert.equal(weatherWindow({ ...config, date: "2026-09-20" }, now).kind, "forecast");
  assert.deepEqual(weatherWindow({ ...config, date: "2026-09-21" }, now), { kind: "future", availableFrom: "2026-09-06" });
  assert.equal(weatherWindow({ ...config, date: "2026-09-04" }, now).kind, "past");
  const midnight = Date.parse("2026-09-05T15:01:00Z");
  assert.equal(weatherWindow(config, midnight).kind, "past");
  assert.equal(weatherWindow({ ...config, timezone: "America/Los_Angeles" }, midnight).kind, "today");
});

test("requests bind all coordinates, chosen date, units and timezone; only today requests current conditions", () => {
  const places = { ...config, locations: [...config.locations, { id: "b", name: "B", position: [34, 136] }] };
  const url = new URL(weatherUrl(places, now));
  assert.equal(url.searchParams.get("latitude"), "35,34");
  assert.equal(url.searchParams.get("longitude"), "135,136");
  assert.equal(url.searchParams.get("start_date"), config.date);
  assert.equal(url.searchParams.get("end_date"), config.date);
  assert.equal(url.searchParams.get("timezone"), config.timezone);
  assert.equal(url.searchParams.get("wind_speed_unit"), "kmh");
  assert.ok(url.searchParams.has("current"));
  assert.equal(new URL(weatherUrl({ ...config, date: "2026-09-06" }, now)).searchParams.has("current"), false);
});

test("current timestamp is interpreted in provider offset; null stays missing, zero stays zero", () => {
  const raw = payload();
  raw.current.apparent_temperature = null;
  const data = parseWeatherResponse(raw, config, now).locations[0];
  assert.equal(data.current.timestamp, now);
  assert.equal(data.current.apparent, null);
  assert.equal(data.hourly[0].probability, 0);
  assert.equal(data.hourly[0].precipitation, 0);
  assert.equal(data.daily.max, 29);
});

test("unrelated days, malformed responses and wrong location counts cannot become current weather", () => {
  assert.throws(() => parseWeatherResponse(payload("2026-09-04"), config, now), /unavailable/);
  assert.throws(() => parseWeatherResponse({ error: true }, config, now), /unavailable/);
  assert.throws(() => parseWeatherResponse([payload(), payload()], config, now), /count/);
  const future = { ...config, date: "2026-09-06" };
  assert.equal(parseWeatherResponse(payload(future.date), future, now).locations[0].current, null);
  const wrongCurrent = payload();
  wrongCurrent.current.time = "2026-09-05T23:00";
  assert.equal(parseWeatherResponse(wrongCurrent, config, now).locations[0].current, null);
});

test("partial multi-location response preserves good locations without borrowing their weather", () => {
  const two = { ...config, locations: [...config.locations, { id: "b", name: "B", position: [36, 136] }] };
  const data = parseWeatherResponse([payload(), {}], two, now);
  assert.equal(data.locations[0].current.temperature, 28);
  assert.equal(data.locations[1].current, null);
  assert.equal(data.locations[1].daily, null);
});

test("transport time slots include destination arrival and later return to lodging", async () => {
  const guide = await loadGuide("kansai-2026");
  const weather = getJournalDay(guide, "2026-09-30").weather;
  assert.equal(weather.stops[0].locationId, weather.stops.at(-1).locationId);
  assert.equal(weather.stops[1].time, "07:15");
  assert.equal(weather.stops.at(-1).time, "23:05");
});

test("network, HTTP errors, abort signals and out-of-range dates are handled", async () => {
  const controller = new AbortController();
  let calls = 0;
  const fetcher = async (_url, options) => {
    calls++;
    assert.equal(options.signal, controller.signal);
    assert.equal(options.cache, "no-store");
    return new Response(JSON.stringify(payload()), { status: 200 });
  };
  assert.equal((await fetchJournalWeather(config, controller.signal, now, fetcher)).locations[0].current.temperature, 28);
  await assert.rejects(fetchJournalWeather({ ...config, date: "2026-10-01" }, controller.signal, now, fetcher), /window/);
  assert.equal(calls, 1);
  await assert.rejects(fetchJournalWeather(config, controller.signal, now, async () => new Response("Busy", { status: 429 })), /429/);
  await assert.rejects(fetchJournalWeather(config, controller.signal, now, async () => { throw new Error("Offline"); }), /Offline/);
});

test("weather codes and travel cautions give facts without inventing official alerts", () => {
  const normal = { temperature: 20, apparent: 20, code: 0, precipitation: 0, probability: 0, wind: 10, gust: 15 };
  assert.equal(weatherDescription(null), "天气状况暂无数据");
  assert.equal(weatherDescription(0), "晴");
  assert.deepEqual(weatherAdvice(normal), []);
  const advice = weatherAdvice({ ...normal, code: 95, gust: 50, probability: 80 });
  assert.equal(advice.length, 3);
  assert.match(advice.join(""), /雷暴/);
  assert.doesNotMatch(advice.join(""), /取消|官方警报|已停运/);
});
