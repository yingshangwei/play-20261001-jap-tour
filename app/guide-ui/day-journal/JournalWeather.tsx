"use client";

import { useEffect, useId, useState } from "react";
import type { DayJournalTemplateId, DayJournalWeather } from "@/app/guide-core/types";
import {
  fetchJournalWeather, localWeatherDate, weatherAdvice, weatherDescription, weatherWindow,
  WEATHER_REFRESH_MS, WEATHER_STALE_MS,
  type WeatherSnapshot, type WeatherValues,
} from "@/app/guide-core/weather";
import styles from "./weather.module.css";

const unit = (value: number | null | undefined, suffix: string) => value === null || value === undefined ? "暂无数据" : `${Math.round(value * 10) / 10}${suffix}`;
function updatedTime(timestamp: number, timezone: string) {
  return new Intl.DateTimeFormat("zh-CN", { timeZone: timezone, month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(timestamp);
}

export default function JournalWeather({ config, template }: { config: DayJournalWeather; template: DayJournalTemplateId }) {
  const id = useId();
  const [now, setNow] = useState<number | null>(null);
  const [snapshot, setSnapshot] = useState<WeatherSnapshot | null>(null);
  const [requestState, setRequestState] = useState<"loading" | "ready" | "error">("loading");
  const [selected, setSelected] = useState(config.locations[0]?.id ?? "");
  const [refresh, setRefresh] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const localDate = now === null ? "" : localWeatherDate(config.timezone, now);

  useEffect(() => {
    // Update age labels without making a network request every minute.
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let disposed = false;
    let controller: AbortController | undefined;
    let lastAttempt = 0;
    async function update(force = false) {
      if (!force && Date.now() - lastAttempt < WEATHER_REFRESH_MS) return;
      lastAttempt = Date.now();
      controller?.abort();
      controller = new AbortController();
      const active = controller;
      const windowState = weatherWindow(config, lastAttempt);
      setNow(lastAttempt);
      if (!localDate) return;
      if (windowState.kind === "past" || windowState.kind === "future" || !config.locations.length) {
        setSnapshot(null);
        setRequestState("ready");
        return;
      }
      setRequestState("loading");
      const timeout = window.setTimeout(() => active.abort(), 12_000);
      try {
        const result = await fetchJournalWeather(config, active.signal, lastAttempt);
        if (!disposed && controller === active) {
          setSnapshot(result);
          setRequestState("ready");
        }
      } catch {
        if (!disposed && controller === active) setRequestState("error");
      } finally {
        window.clearTimeout(timeout);
      }
    }
    // Defer to avoid effect-driven synchronous rendering and keep SSR deterministic.
    void Promise.resolve().then(() => { if (!disposed) void update(true); });
    const onVisible = () => { if (document.visibilityState === "visible") void update(); };
    const timer = window.setInterval(onVisible, WEATHER_REFRESH_MS);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      disposed = true;
      controller?.abort();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [config, refresh, localDate]);

  const period = now === null ? null : weatherWindow(config, now);
  const location = config.locations.find((place) => place.id === selected) ?? config.locations[0];
  const data = snapshot?.locations.find((place) => place.id === location?.id);
  const current = period?.kind === "today" ? data?.current : null;
  const daily = data?.daily;
  const expired = Boolean(now && snapshot && (now - snapshot.fetchedAt >= WEATHER_STALE_MS || current && now - current.timestamp >= WEATHER_STALE_MS));
  const canQuery = period?.kind === "today" || period?.kind === "forecast";
  const hasData = Boolean(current || daily?.min !== null && daily?.min !== undefined);
  const status = expired ? "数据已过期" : requestState === "loading" ? "更新中" : requestState === "error" ? "更新失败" : period?.kind === "today" && current ? "当前天气" : canQuery ? "当日预报" : "暂不可用";
  const metrics: WeatherValues = current ?? {
    temperature: null, apparent: daily?.apparentMax ?? null, code: daily?.code ?? null, probability: daily?.probability ?? null,
    precipitation: null, wind: daily?.wind ?? null, gust: daily?.gust ?? null,
  };
  const advice = hasData ? weatherAdvice(metrics) : [];

  return (
    <section className={styles.weather} data-template={template} aria-labelledby={`${id}-title`} data-weather-date={config.date}>
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>WEATHER · <time dateTime={config.date}>{config.date}</time></p>
          <h2 id={`${id}-title`}>当天当地天气</h2>
        </div>
        <button type="button" className={styles.refresh} onClick={() => setRefresh((value) => value + 1)} disabled={requestState === "loading" && now !== null} aria-label="刷新天气">{requestState === "loading" ? "更新中…" : "刷新天气 ↻"}</button>
      </div>

      <div className={styles.context}>
        {config.locations.length ? (
          <label htmlFor={`${id}-location`}>当天地点
            <select id={`${id}-location`} value={location?.id ?? ""} onChange={(event) => setSelected(event.target.value)}>
              {config.locations.map((place) => <option value={place.id} key={place.id}>{place.name}</option>)}
            </select>
          </label>
        ) : null}
        <span>当地时间 · {config.timezone}</span>
      </div>

      <p className={styles.status} role="status" aria-live="polite">
        <strong>{status}</strong>
        {snapshot ? <span>获取于 {updatedTime(snapshot.fetchedAt, config.timezone)}</span> : null}
      </p>

      {period?.kind === "future" ? <p className={styles.message}>这一天尚未进入预报范围，暂不可用。预计 {period.availableFrom} 起可查询，请在出发前 1–3 天再次确认。</p> : null}
      {period?.kind === "past" ? <p className={styles.message}>手账日期已过去，实时天气不适用于这一天。当前模块暂不提供历史天气。</p> : null}
      {!config.locations.length ? <p className={styles.message}>当天地点尚未匹配，天气暂不可用。</p> : null}
      {canQuery && requestState === "error" ? <p className={styles.message}>{snapshot ? "天气刷新失败，以下保留上次结果，请稍后重试。" : "天气暂不可用，请检查网络后刷新重试。"}</p> : null}
      {expired ? <p className={styles.message}>上次天气数据已超过 1 小时，请刷新后再作为出行参考。</p> : null}
      {canQuery && requestState === "ready" && !hasData ? <p className={styles.message}>该地点暂未返回完整天气，请稍后刷新；其他地点可继续查看。</p> : null}

      {canQuery && hasData ? (
        <>
          <div className={styles.summary}>
            <div className={styles.condition}>
              <strong>{current ? unit(current.temperature, "°C") : `${unit(daily?.min, "°C")} – ${unit(daily?.max, "°C")}`}</strong>
              <span>{weatherDescription(current ? current.code : daily?.code ?? null)}</span>
              <small>{current ? `${current.time.slice(11, 16)} 当地当前 · 模型估算` : "当天预报"}</small>
            </div>
            <dl className={styles.metrics}>
              <div><dt>最低 / 最高</dt><dd>{unit(daily?.min, "°C")} / {unit(daily?.max, "°C")}</dd></div>
              <div><dt>{current ? "当前体感" : "体感范围"}</dt><dd>{current ? unit(current.apparent, "°C") : `${unit(daily?.apparentMin, "°C")} / ${unit(daily?.apparentMax, "°C")}`}</dd></div>
              <div><dt>全天最高降水概率</dt><dd>{unit(daily?.probability, "%")}</dd></div>
              <div><dt>{current ? "当前风速 / 阵风" : "最大风速 / 阵风"}</dt><dd>{unit(metrics.wind, " km/h")} / {unit(metrics.gust, " km/h")}</dd></div>
              {current ? <div><dt>近 {Math.round(current.interval / 60)} 分钟降水</dt><dd>{unit(current.precipitation, " mm")}</dd></div> : null}
            </dl>
          </div>
          {period?.kind === "today" && !current ? <p className={styles.message}>当前天气暂缺，以上为当天预报。</p> : null}
          {advice.length ? <div className={styles.advice}><strong>出行注意</strong><p>{advice.join(" ")}</p></div> : null}
        </>
      ) : null}

      <button type="button" className={styles.disclosure} aria-expanded={expanded} aria-controls={`${id}-details`} onClick={() => setExpanded((value) => !value)}>
        {expanded ? "收起" : "展开"}沿途分时天气 · {config.stops.length} 次停靠 <span aria-hidden="true">{expanded ? "−" : "+"}</span>
      </button>
      <div id={`${id}-details`} hidden={!expanded} className={styles.details}>
        <p>按当天路线顺序，取到达或出发时段的整点预报。时刻以原交通安排为准。</p>
        <ol className={styles.stops}>
          {config.stops.map((stop, index) => {
            const place = config.locations.find((item) => item.id === stop.locationId);
            const hour = canQuery && stop.time ? snapshot?.locations.find((item) => item.id === stop.locationId)?.hourly.find((item) => item.time === `${config.date}T${stop.time!.slice(0, 2)}:00`) : undefined;
            const warnings = hour ? weatherAdvice(hour) : [];
            return (
              <li key={`${stop.locationId}-${index}`}>
                <div className={styles.stopTitle}><time>{stop.time ?? "时间待定"}</time><strong>{place?.name ?? "地点未匹配"}</strong></div>
                <p>{hour ? `${hour.time.slice(11, 16)} 预报 · ${weatherDescription(hour.code)} · ${unit(hour.temperature, "°C")} · 体感 ${unit(hour.apparent, "°C")} · 降水 ${unit(hour.probability, "%")} / ${unit(hour.precipitation, " mm")} · 风 ${unit(hour.wind, " km/h")} / 阵风 ${unit(hour.gust, " km/h")}` : "该时段天气暂不可用"}</p>
                <small>{stop.timingLabel}</small>
                {warnings.length ? <div className={styles.stopAdvice}><strong>注意：</strong>{warnings.join(" ")}{stop.fallback ? <p>原有交通备选：{stop.fallback}</p> : null}<p>请按本页既有雨备处理，固定项目仍以手账安排为准。</p></div> : null}
                {place?.officialHref ? <a href={place.officialHref} target="_blank" rel="noreferrer">查看场所官网与公告 ↗</a> : null}
              </li>
            );
          })}
        </ol>
      </div>
      <noscript><p>启用 JavaScript 后可获取最新天气，手账正文仍可正常阅读。</p></noscript>
    </section>
  );
}
