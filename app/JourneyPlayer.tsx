"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LayerGroup, Map as LeafletMap, Marker } from "leaflet";
import { allPoints, daySegments, dayTitles, type ItineraryDate, type MapPoint } from "./TripMap";
import { getTransitLeg } from "./transitData";

type PlayerScope = "all" | ItineraryDate;

type JourneyStep = {
  id: string;
  date: ItineraryDate;
  segment: string;
  segmentNote: string;
  from: MapPoint;
  to: MapPoint;
  mode: string;
  duration: string;
  departurePlan: string;
  arrivalPlan: string;
  stayPlan: string;
  route: string;
  timingStatus: "已核班次" | "部分核实" | "预计时间";
  navigationHref?: string;
};

const dayOrder: ItineraryDate[] = ["09.29", "09.30", "10.01", "10.02", "10.03", "10.04", "10.05", "10.06", "10.07"];

const dayMeta: Record<ItineraryDate, { weekday: string; area: string }> = {
  "09.29": { weekday: "周二", area: "大阪抵达" },
  "09.30": { weekday: "周三", area: "USJ" },
  "10.01": { weekday: "周四", area: "大阪慢行" },
  "10.02": { weekday: "周五", area: "神户往返" },
  "10.03": { weekday: "周六", area: "岚山·换宿" },
  "10.04": { weekday: "周日", area: "京都·宇治·烟火" },
  "10.05": { weekday: "周一", area: "贵船" },
  "10.06": { weekday: "周二", area: "伏见·奈良·大阪" },
  "10.07": { weekday: "周三", area: "返沪" },
};

const shanghaiPlaceholder: MapPoint = {
  id: "shanghai-flight-placeholder",
  name: "上海出发机场 · 待确认",
  area: "kansai",
  category: "spot",
  position: [31.2304, 121.4737],
  dates: ["09.29", "10.07"],
  meta: "航班起降机场占位",
  googleQuery: "Shanghai",
};

const pointById = new Map(allPoints.map((point) => [point.id, point]));
const kix = pointById.get("kix")!;

function mapsHref(from: MapPoint, to: MapPoint, mode: string) {
  if (mode.includes("航班")) return undefined;
  const travelmode = mode === "步行" ? "walking" : "transit";
  return `https://www.google.com/maps/dir/?api=1&origin=${from.position.join(",")}&destination=${to.position.join(",")}&travelmode=${travelmode}`;
}

const scheduledSteps: JourneyStep[] = dayOrder.flatMap((date) =>
  daySegments[date].flatMap((segment, segmentIndex) =>
    segment.pointIds.slice(0, -1).flatMap((fromId, pointIndex) => {
      const toId = segment.pointIds[pointIndex + 1];
      const from = pointById.get(fromId);
      const to = pointById.get(toId);
      const detail = getTransitLeg(date, fromId, toId);
      if (!from || !to || !detail) return [];
      return [{
        id: `${date}-${segmentIndex}-${pointIndex}-${fromId}-${toId}`,
        date,
        segment: segment.label,
        segmentNote: segment.note,
        from,
        to,
        mode: detail.kind,
        duration: detail.duration,
        departurePlan: detail.departurePlan,
        arrivalPlan: detail.arrivalPlan,
        stayPlan: detail.stayPlan,
        route: detail.route,
        timingStatus: detail.timingStatus,
        navigationHref: mapsHref(from, to, detail.kind),
      }];
    }),
  ),
);

const journeySteps: JourneyStep[] = [
  {
    id: "09.29-shanghai-kix",
    date: "09.29",
    segment: "上海出发 · 航班占位",
    segmentNote: "当前只确认 9 月 29 日 14:00 抵达关西；上海具体机场与航班号以机票为准。",
    from: shanghaiPlaceholder,
    to: kix,
    mode: "国际航班",
    duration: "约 4 小时 · 具体航班待确认",
    departurePlan: "上海出发机场｜暂按 10:00 起飞",
    arrivalPlan: "关西国际机场｜14:00 落地",
    stayPlan: "入境、取行李约 80–100 分钟；15:20–15:40 前往南海站",
    route: "上海 → 大阪关西国际机场；机场与航班号暂用占位信息。",
    timingStatus: "部分核实",
  },
  ...scheduledSteps,
  {
    id: "10.07-kix-shanghai",
    date: "10.07",
    segment: "返沪航班 · 到达时间待补",
    segmentNote: "返程固定为 10 月 7 日 12:00 从关西机场起飞；上海落地机场与时间以最终机票为准。",
    from: kix,
    to: shanghaiPlaceholder,
    mode: "国际航班",
    duration: "以最终机票为准",
    departurePlan: "关西国际机场｜12:00 起飞",
    arrivalPlan: "上海｜到达机场与时间待确认",
    stayPlan: "落地后旅程结束",
    route: "大阪关西国际机场 → 上海；返沪到达信息暂用占位点。",
    timingStatus: "部分核实",
  },
];

function primaryTime(text: string) {
  return text.match(/\d{2}:\d{2}/)?.[0] ?? "待定";
}

function modeIcon(mode: string) {
  if (mode.includes("航班")) return "✈";
  if (mode.includes("缆车")) return "↟";
  if (mode.includes("巴士")) return "▣";
  if (mode.includes("铁路")) return "▤";
  return "→";
}

function statusClass(status: JourneyStep["timingStatus"]) {
  return status === "已核班次" ? "verified" : status === "部分核实" ? "partial" : "estimated";
}

export default function JourneyPlayer() {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const routeLayer = useRef<LayerGroup | null>(null);
  const travelerMarker = useRef<Marker | null>(null);
  const animationFrame = useRef<number | null>(null);
  const reducedMotion = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const [scope, setScope] = useState<PlayerScope>("all");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const visibleSteps = useMemo(
    () => scope === "all" ? journeySteps : journeySteps.filter((step) => step.date === scope),
    [scope],
  );
  const currentIndex = Math.min(stepIndex, visibleSteps.length - 1);
  const currentStep = visibleSteps[currentIndex];
  const progress = ((currentIndex + 1) / visibleSteps.length) * 100;
  const currentDayStep = visibleSteps.slice(0, currentIndex + 1).filter((step) => step.date === currentStep.date).length;
  const currentDayTotal = visibleSteps.filter((step) => step.date === currentStep.date).length;
  const recentSteps = visibleSteps.slice(Math.max(0, currentIndex - 2), Math.min(visibleSteps.length, currentIndex + 3));

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    let disposed = false;
    async function setupMap() {
      if (!mapElement.current || mapInstance.current) return;
      const L = await import("leaflet");
      if (disposed || !mapElement.current) return;
      leafletRef.current = L;
      const map = L.map(mapElement.current, {
        center: [34.83, 135.57],
        zoom: 8,
        scrollWheelZoom: true,
        touchZoom: true,
        zoomControl: false,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      mapInstance.current = map;
      setMapReady(true);
    }
    setupMap();
    return () => {
      disposed = true;
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      mapInstance.current?.remove();
      mapInstance.current = null;
      leafletRef.current = null;
      routeLayer.current = null;
      travelerMarker.current = null;
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const delay = 3200 / speed;
    const timer = window.setTimeout(() => {
      if (currentIndex >= visibleSteps.length - 1) {
        setPlaying(false);
        return;
      }
      setStepIndex((index) => index + 1);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [currentIndex, playing, speed, visibleSteps.length]);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapInstance.current;
    if (!L || !map || !mapReady || !currentStep) return;

    if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    routeLayer.current?.remove();
    const layer = L.layerGroup().addTo(map);
    routeLayer.current = layer;

    visibleSteps.slice(0, currentIndex).forEach((step) => {
      L.polyline([step.from.position, step.to.position], {
        color: "#355c45",
        weight: 3,
        opacity: .28,
        lineCap: "round",
      }).addTo(layer);
    });

    L.polyline([currentStep.from.position, currentStep.to.position], {
      color: "#ef6a39",
      weight: 5,
      opacity: .95,
      dashArray: "9 10",
      lineCap: "round",
    }).addTo(layer);
    L.circleMarker(currentStep.from.position, {
      radius: 6,
      color: "#fffdf8",
      weight: 3,
      fillColor: "#355c45",
      fillOpacity: 1,
    }).bindTooltip(currentStep.from.name).addTo(layer);
    L.circleMarker(currentStep.to.position, {
      radius: 8,
      color: "#fffdf8",
      weight: 3,
      fillColor: "#f5b94c",
      fillOpacity: 1,
    }).bindTooltip(currentStep.to.name).addTo(layer);

    const icon = L.divIcon({
      className: "journey-traveler-icon",
      html: `<span>${modeIcon(currentStep.mode)}</span>`,
      iconSize: [42, 42],
      iconAnchor: [21, 21],
    });
    const marker = L.marker(currentStep.from.position, { icon, interactive: false, keyboard: false }).addTo(layer);
    travelerMarker.current = marker;

    const bounds = L.latLngBounds([currentStep.from.position, currentStep.to.position]);
    map.fitBounds(bounds, { padding: [58, 58], maxZoom: 13, animate: !reducedMotion.current, duration: .65 });

    if (reducedMotion.current) {
      marker.setLatLng(currentStep.to.position);
      return;
    }

    const startedAt = performance.now();
    const animationDuration = Math.max(520, (playing ? 1500 : 900) / speed);
    const animate = (now: number) => {
      const raw = Math.min((now - startedAt) / animationDuration, 1);
      const eased = 1 - Math.pow(1 - raw, 3);
      marker.setLatLng([
        currentStep.from.position[0] + (currentStep.to.position[0] - currentStep.from.position[0]) * eased,
        currentStep.from.position[1] + (currentStep.to.position[1] - currentStep.from.position[1]) * eased,
      ]);
      if (raw < 1) animationFrame.current = requestAnimationFrame(animate);
    };
    animationFrame.current = requestAnimationFrame(animate);
  }, [currentIndex, currentStep, mapReady, playing, speed, visibleSteps]);

  function selectScope(nextScope: PlayerScope) {
    setPlaying(false);
    setScope(nextScope);
    setStepIndex(0);
  }

  function togglePlaying() {
    if (currentIndex >= visibleSteps.length - 1) setStepIndex(0);
    setPlaying((value) => !value);
  }

  function moveStep(delta: number) {
    setPlaying(false);
    setStepIndex((index) => Math.max(0, Math.min(visibleSteps.length - 1, index + delta)));
  }

  const placeholderType = currentStep.to.id === shanghaiPlaceholder.id
    ? "航班终点占位"
    : currentStep.to.category === "stay"
      ? "住宿区域占位"
      : currentStep.to.category === "restaurant"
        ? "餐厅候选点"
        : null;

  return (
    <section className="journey-player" id="journey" aria-labelledby="journey-title">
      <div className="journey-player-heading shell">
        <div>
          <p className="eyebrow">PLAY THE JOURNEY</p>
          <span className="section-note">{journeySteps.length} 个阶段 · 可按天播放</span>
        </div>
        <div>
          <h2 id="journey-title">让整段旅程，<br />沿着时间自己走起来。</h2>
          <p>点击播放后，地图会按真实日期逐段推进。每一步都说明几点从哪里出发、乘什么交通、几点到达，以及到达后停留多久；酒店与尚未锁定的餐厅暂用区域占位点。</p>
        </div>
      </div>

      <div className="journey-player-frame shell" onKeyDown={(event) => {
        if (event.key === "ArrowLeft") moveStep(-1);
        if (event.key === "ArrowRight") moveStep(1);
      }}>
        <div className="journey-map-stage">
          <div className="journey-map" ref={mapElement} aria-label="渐进式旅行过程地图" />
          <div className="journey-map-caption">
            <span>{currentStep.date} · {dayMeta[currentStep.date].weekday}</span>
            <strong>{dayTitles[currentStep.date]}</strong>
            <small>路线为动画示意，实际步行与换乘请使用下方 Google Maps 导航</small>
          </div>
        </div>

        <div className="journey-console">
          <div className="journey-day-scroller" aria-label="选择要播放的日期">
            <button type="button" className={scope === "all" ? "active" : ""} onClick={() => selectScope("all")}>
              <small>ALL</small><span>九日全程</span>
            </button>
            {dayOrder.map((date) => (
              <button type="button" className={scope === date ? "active" : ""} onClick={() => selectScope(date)} key={date}>
                <small>{date}</small><span>{dayMeta[date].area}</span>
              </button>
            ))}
          </div>

          <div className="journey-progress-block">
            <div><span>全程进度</span><strong>{currentIndex + 1} / {visibleSteps.length}</strong></div>
            <div className="journey-progress-track" aria-hidden="true"><i style={{ width: `${progress}%` }} /></div>
            <input aria-label="选择动画阶段" type="range" min="0" max={visibleSteps.length - 1} value={currentIndex} onChange={(event) => {
              setPlaying(false);
              setStepIndex(Number(event.target.value));
            }} />
          </div>

          <article className="journey-current-card" aria-live="polite">
            <div className="journey-step-topline">
              <span>DAY {dayOrder.indexOf(currentStep.date) + 1} · STEP {currentDayStep}/{currentDayTotal}</span>
              <em className={`timing-status status-${statusClass(currentStep.timingStatus)}`}>{currentStep.timingStatus}</em>
            </div>
            <div className="journey-clock">{primaryTime(currentStep.departurePlan)}</div>
            <p className="journey-segment-label">{currentStep.segment}</p>
            <div className="journey-place-line">
              <strong>{currentStep.from.name}</strong>
              <span><i>{modeIcon(currentStep.mode)}</i>{currentStep.mode}<small>{currentStep.duration}</small></span>
              <strong>{currentStep.to.name}</strong>
            </div>
            {placeholderType && <span className="journey-placeholder">{placeholderType}</span>}
            <dl className="journey-step-facts">
              <div><dt>从哪里 / 何时出发</dt><dd>{currentStep.departurePlan}</dd></div>
              <div><dt>预计几点到</dt><dd>{currentStep.arrivalPlan}</dd></div>
              <div><dt>到达后停留</dt><dd>{currentStep.stayPlan}</dd></div>
              <div><dt>怎么走</dt><dd>{currentStep.route}</dd></div>
            </dl>
            <p className="journey-step-note">{currentStep.segmentNote}</p>
            {currentStep.navigationHref && <a className="journey-nav-link" href={currentStep.navigationHref} target="_blank" rel="noreferrer">打开这一段 Google Maps 导航 ↗</a>}
          </article>

          <div className="journey-controls" aria-label="动画播放控制">
            <button type="button" onClick={() => moveStep(-1)} disabled={currentIndex === 0} aria-label="上一步">←</button>
            <button type="button" className="journey-play" onClick={togglePlaying}>{playing ? "暂停" : currentIndex === visibleSteps.length - 1 ? "重新播放" : "播放"}</button>
            <button type="button" onClick={() => moveStep(1)} disabled={currentIndex === visibleSteps.length - 1} aria-label="下一步">→</button>
            <div className="journey-speed" aria-label="播放速度">
              {[1, 2, 4].map((value) => <button type="button" className={speed === value ? "active" : ""} onClick={() => setSpeed(value)} key={value}>{value}×</button>)}
            </div>
          </div>

          <ol className="journey-mini-log" aria-label="当前阶段前后步骤">
            {recentSteps.map((step) => {
              const absoluteIndex = visibleSteps.indexOf(step);
              const state = absoluteIndex < currentIndex ? "done" : absoluteIndex === currentIndex ? "current" : "upcoming";
              return <li className={state} key={step.id}>
                <button type="button" onClick={() => { setPlaying(false); setStepIndex(absoluteIndex); }}>
                  <span>{primaryTime(step.departurePlan)}</span>
                  <strong>{step.from.name} → {step.to.name}</strong>
                  <small>{step.mode}</small>
                </button>
              </li>;
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
