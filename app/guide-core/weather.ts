import { pointsForDay } from "./dayRoutes";
import type { DayJournalConfig, DayJournalWeather, TravelGuideManifest } from "./types";

export const WEATHER_REFRESH_MS = 15 * 60 * 1000;
export const WEATHER_STALE_MS = 60 * 60 * 1000;
const DAY_MS = 86_400_000;

export function deriveJournalWeather(guide: TravelGuideManifest, journal: DayJournalConfig): DayJournalWeather {
  const day = guide.days.find((candidate) => candidate.date === journal.date);
  const points = day ? pointsForDay(day, new Map(guide.places.map((place) => [place.id, place]))) : [];
  const legs = guide.transitLegs.filter((leg) => leg.dayId === day?.id);
  return {
    guideId: guide.id,
    date: journal.date,
    timezone: guide.timezone,
    locations: [...new Map(points.map((place) => [place.id, {
      id: place.id, name: place.name, position: [...place.position] as [number, number], officialHref: place.official,
    }])).values()],
    stops: points.map((place, index) => {
      const incoming = legs.find((leg) => leg.fromPlaceId === points[index - 1]?.id && leg.toPlaceId === place.id);
      const outgoing = legs.find((leg) => leg.fromPlaceId === place.id && leg.toPlaceId === points[index + 1]?.id);
      const timingLabel = incoming?.arrivalPlan ?? outgoing?.departurePlan ?? "当天停靠，时间待定";
      const times = timingLabel.match(/\b(?:[01]?\d|2[0-3]):[0-5]\d\b/g);
      // Arrival plans can list intermediate stations. Use the destination's final time.
      const time = (incoming ? times?.at(-1) : times?.[0])?.padStart(5, "0") ?? null;
      return { locationId: place.id, time, timingLabel, fallback: outgoing?.fallback ?? incoming?.fallback };
    }),
  };
}

export function localWeatherDate(timezone: string, now = Date.now()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export function weatherWindow(config: Pick<DayJournalWeather, "date" | "timezone">, now = Date.now()) {
  const today = localWeatherDate(config.timezone, now);
  const distance = Math.round((Date.parse(`${config.date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / DAY_MS);
  if (distance < 0) return { kind: "past" as const };
  if (distance > 15) return { kind: "future" as const, availableFrom: new Date(Date.parse(`${config.date}T00:00:00Z`) - 15 * DAY_MS).toISOString().slice(0, 10) };
  return { kind: distance === 0 ? "today" as const : "forecast" as const };
}

export type WeatherValues = {
  temperature: number | null;
  apparent: number | null;
  code: number | null;
  precipitation: number | null;
  probability: number | null;
  wind: number | null;
  gust: number | null;
};
export type LocationWeather = {
  id: string;
  current: (WeatherValues & { time: string; timestamp: number; interval: number }) | null;
  daily: { code: number | null; min: number | null; max: number | null; apparentMin: number | null; apparentMax: number | null; probability: number | null; wind: number | null; gust: number | null } | null;
  hourly: Array<WeatherValues & { time: string }>;
};
export type WeatherSnapshot = { fetchedAt: number; locations: LocationWeather[] };

const fields = {
  temperature: "temperature_2m", apparent: "apparent_temperature", code: "weather_code",
  precipitation: "precipitation", probability: "precipitation_probability", wind: "wind_speed_10m", gust: "wind_gusts_10m",
} as const;
type JsonObject = Record<string, unknown>;
function object(value: unknown): JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as JsonObject : {};
}
function number(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function at(data: JsonObject, key: string, index: number) {
  return number(Array.isArray(data[key]) ? data[key][index] : null);
}
function values(data: JsonObject, index?: number): WeatherValues {
  return Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, index === undefined ? number(data[field]) : at(data, field, index)])) as WeatherValues;
}

export function weatherUrl(config: DayJournalWeather, now = Date.now()): string {
  const params = new URLSearchParams({
    latitude: config.locations.map((place) => place.position[0]).join(","),
    longitude: config.locations.map((place) => place.position[1]).join(","),
    timezone: config.timezone,
    start_date: config.date, end_date: config.date,
    temperature_unit: "celsius", wind_speed_unit: "kmh", precipitation_unit: "mm",
    hourly: Object.values(fields).join(","),
    daily: "weather_code,temperature_2m_min,temperature_2m_max,apparent_temperature_min,apparent_temperature_max,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max",
  });
  if (weatherWindow(config, now).kind === "today") params.set("current", Object.values(fields).filter((field) => field !== "precipitation_probability").join(","));
  return `https://api.open-meteo.com/v1/forecast?${params}`;
}

export function parseWeatherResponse(raw: unknown, config: DayJournalWeather, now = Date.now()): WeatherSnapshot {
  const payloads = Array.isArray(raw) ? raw : [raw];
  if (payloads.length !== config.locations.length) throw new Error("Weather location count mismatch");
  const today = weatherWindow(config, now).kind === "today";
  const locations = config.locations.map((location, index): LocationWeather => {
    const data = object(payloads[index]);
    const daily = object(data.daily);
    const dailyIndex = Array.isArray(daily.time) ? daily.time.indexOf(config.date) : -1;
    const hours = object(data.hourly);
    const hourly = (Array.isArray(hours.time) ? hours.time : []).flatMap((time, i) => typeof time === "string" && time.startsWith(`${config.date}T`) ? [{ time, ...values(hours, i) }] : []);
    const currentData = object(data.current);
    const currentTime = typeof currentData.time === "string" ? currentData.time : "";
    const offset = number(data.utc_offset_seconds);
    const timestamp = offset === null ? NaN : Date.parse(`${currentTime}Z`) - offset * 1000;
    const current = today && currentTime.startsWith(`${config.date}T`) && Number.isFinite(timestamp) && timestamp <= now + 15 * 60 * 1000 && number(currentData.temperature_2m) !== null
      ? { ...values(currentData), time: currentTime, timestamp, interval: number(currentData.interval) ?? 900 } : null;
    return {
      id: location.id, current, hourly,
      daily: dailyIndex < 0 ? null : {
        code: at(daily, "weather_code", dailyIndex), min: at(daily, "temperature_2m_min", dailyIndex), max: at(daily, "temperature_2m_max", dailyIndex),
        apparentMin: at(daily, "apparent_temperature_min", dailyIndex), apparentMax: at(daily, "apparent_temperature_max", dailyIndex),
        probability: at(daily, "precipitation_probability_max", dailyIndex), wind: at(daily, "wind_speed_10m_max", dailyIndex), gust: at(daily, "wind_gusts_10m_max", dailyIndex),
      },
    };
  });
  if (!locations.some((place) => place.current || place.daily?.min !== null && place.daily?.min !== undefined || place.hourly.some((hour) => hour.temperature !== null))) throw new Error("Weather data unavailable");
  return { fetchedAt: now, locations };
}

export async function fetchJournalWeather(config: DayJournalWeather, signal: AbortSignal, now = Date.now(), fetcher: typeof fetch = fetch): Promise<WeatherSnapshot> {
  const window = weatherWindow(config, now);
  if (window.kind !== "today" && window.kind !== "forecast") throw new Error("Date outside forecast window");
  if (!config.locations.length || config.locations.some(({ position: [lat, lon] }) => !Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180)) throw new Error("Weather coordinates unavailable");
  const response = await fetcher(weatherUrl(config, now), { signal, cache: "no-store" });
  if (!response.ok) throw new Error(`Weather request failed (${response.status})`);
  return parseWeatherResponse(await response.json(), config, now);
}

export function weatherDescription(code: number | null): string {
  if (code === 0) return "晴";
  if (code === 1) return "大部晴朗";
  if (code === 2) return "多云";
  if (code === 3) return "阴";
  if (code === 45 || code === 48) return "雾";
  if ([51, 53, 55].includes(code ?? -1)) return "毛毛雨";
  if ([56, 57, 66, 67].includes(code ?? -1)) return "冻雨";
  if (code === 61) return "小雨";
  if (code === 63) return "中雨";
  if (code === 65) return "大雨";
  if ([71, 73, 75, 77, 85, 86].includes(code ?? -1)) return "降雪";
  if ([80, 81, 82].includes(code ?? -1)) return "阵雨";
  if ([95, 96, 99].includes(code ?? -1)) return "雷暴";
  return "天气状况暂无数据";
}

export function weatherAdvice(values: WeatherValues): string[] {
  const advice: string[] = [];
  if (values.code !== null && [95, 96, 99].includes(values.code)) advice.push("预报有雷暴，出发前查看场所公告并核对原有交通备选。");
  if ((values.probability ?? 0) >= 50 || (values.precipitation ?? 0) >= 0.1) advice.push("有降水可能，带雨具，湿滑路段放慢脚步。");
  if ((values.gust ?? 0) >= 40 || (values.wind ?? 0) >= 30) advice.push("风较强，缆车、河岸等室外段出发前查看运营公告。");
  if (values.apparent !== null && values.apparent >= 30) advice.push("体感偏热，备饮水并安排室内休息。");
  if (values.apparent !== null && values.apparent <= 10) advice.push("体感偏凉，带一件保暖外套。");
  return advice;
}
