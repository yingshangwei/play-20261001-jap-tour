"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LayerGroup, Map as LeafletMap, Marker } from "leaflet";
import { getTransitLeg } from "@/app/guide-core/defineGuide";
import { dayRouteHref, pointsForDay, splitRouteForMobile } from "@/app/guide-core/dayRoutes";
import type { GuideAreaId, GuideDay, GuideDayId, GuideRouteModel, Place, VisitGuide } from "@/app/guide-core/types";
import DayOverview from "@/app/guide-ui/travel/DayOverview";
import TransitCard from "@/app/guide-ui/travel/TransitCard";

type Category = "all" | "spot" | "restaurant" | "stay";
type DateFilter = "all" | GuideDayId;
type TransportMode = "walking" | "transit";

const ROUTE_ARROW_MIN_ZOOM = 12;
const categoryLabels: Record<Category, string> = { all: "全部", spot: "景点", restaurant: "餐厅", stay: "住宿" };

function googleSearch(query: string) { return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`; }
function googleDirections(origin: string, destination: string, waypoints: string[] = [], mode?: TransportMode) {
  const travelMode = mode ? `&travelmode=${mode}` : "";
  const base = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}${travelMode}`;
  return waypoints.length ? `${base}&waypoints=${encodeURIComponent(waypoints.join("|"))}` : base;
}
function popupHtml(point: Place, visit?: VisitGuide) {
  const escape = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
  const detail = point.guide ? `<span class="leaflet-popup-guide">${point.guide}</span>` : "";
  const fit = point.fit ? `<p>${point.fit}</p>` : "";
  const visitSummary = visit ? `<p class="leaflet-popup-visit"><b>${escape(visit.priority)} · ${escape(visit.duration)}</b><br/>${escape(visit.focus)}</p>` : "";
  return `<div class="trip-popup"><strong>${point.name}</strong><small>${point.meta}</small><span class="leaflet-popup-date">日期 ${point.dates.join(" / ")}</span>${detail}${visitSummary || fit}<a href="${googleSearch(point.googleQuery)}" target="_blank" rel="noreferrer">在 Google Maps 查看 ↗</a></div>`;
}
function orderForPoint(date: DateFilter, pointId: string, dayById: Map<GuideDayId, GuideDay>, pointById: Map<string, Place>) {
  if (date === "all") return null;
  const orderedPointIds = (dayById.get(date)?.segments ?? [])
    .flatMap((segment) => segment.pointIds)
    .filter((id, index, ids) => pointById.get(id)?.category !== "stay" && ids.indexOf(id) === index);
  const index = orderedPointIds.indexOf(pointId);
  return index >= 0 ? index + 1 : null;
}
function buildIcon(
  L: typeof import("leaflet"),
  point: Place,
  date: DateFilter,
  dayById: Map<GuideDayId, GuideDay>,
  pointById: Map<string, Place>,
) {
  const order = point.category === "stay" ? null : orderForPoint(date, point.id, dayById, pointById);
  const symbol = point.category === "stay" ? "住" : order ?? (point.category === "restaurant" ? "食" : "景");
  return L.divIcon({ className: "trip-marker-wrap", html: `<span class="trip-marker marker-${point.category}${order ? " marker-ordered" : ""}">${symbol}</span>`, iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -15] });
}

function getDefaultArea(model: GuideRouteModel) {
  const area = model.map.areas.find((candidate) => candidate.id === model.map.defaultAreaId);
  if (!area) throw new Error(`Unknown default map area: ${model.map.defaultAreaId}`);
  return area;
}

export default function TripMap({ model }: { model: GuideRouteModel }) {
  const { map: mapConfig, places, days } = model;
  const pointById = useMemo(() => new Map(places.map((point) => [point.id, point])), [places]);
  const dayById = useMemo(() => new Map(days.map((day) => [day.id, day])), [days]);
  const areaById = useMemo(() => new Map(mapConfig.areas.map((area) => [area.id, area])), [mapConfig.areas]);
  const restaurants = useMemo(() => places.filter((point) => point.category === "restaurant"), [places]);
  const dateOptions = useMemo<Array<[DateFilter, string]>>(
    () => [["all", "全部日期"], ...days.map((day) => [day.id, day.filterLabel] as [GuideDayId, string])],
    [days],
  );
  const defaultArea = getDefaultArea(model);
  const mapElement = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const markerEntries = useRef<Array<{ marker: Marker; point: Place }>>([]);
  const arrowLayer = useRef<LayerGroup | null>(null);
  const [category, setCategory] = useState<Category>("all");
  const [area, setArea] = useState<GuideAreaId>(mapConfig.defaultAreaId);
  const [selectedDate, setSelectedDate] = useState<DateFilter>("all");
  const [arrowState, setArrowState] = useState<"idle" | "zoom" | "visible">("idle");
  const [mapRevision, setMapRevision] = useState(0);
  const selectedDay = selectedDate === "all" ? undefined : dayById.get(selectedDate);


  useEffect(() => {
    let disposed = false;
    let resizeTimer: number | undefined;
    async function setupMap() {
      if (!mapElement.current || mapInstance.current) return;
      const L = await import("leaflet");
      if (disposed || !mapElement.current) return;
      leafletRef.current = L;
      const map = L.map(mapElement.current, { zoomControl: true, scrollWheelZoom: true, touchZoom: true, wheelPxPerZoomLevel: 72 });
      const routeArrowPane = map.createPane("routeArrowPane");
      routeArrowPane.style.zIndex = "590";
      routeArrowPane.style.pointerEvents = "none";
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "&copy; OpenStreetMap contributors" }).addTo(map);
      arrowLayer.current = L.layerGroup().addTo(map);
      markerEntries.current = places.map((point) => {
        const marker = L.marker(point.position, { icon: buildIcon(L, point, "all", dayById, pointById), title: point.name }).bindPopup(popupHtml(point), { maxWidth: 275 });
        marker.addTo(map);
        return { marker, point };
      });
      map.fitBounds(defaultArea.bounds, { padding: [24, 24] });
      mapInstance.current = map;
      setMapRevision((revision) => revision + 1);
      resizeTimer = window.setTimeout(() => { if (!disposed) map.invalidateSize(); }, 80);
    }
    setupMap();
    return () => { disposed = true; window.clearTimeout(resizeTimer); mapInstance.current?.remove(); mapInstance.current = null; leafletRef.current = null; markerEntries.current = []; arrowLayer.current = null; };
  }, [dayById, defaultArea.bounds, places, pointById]);

  useEffect(() => {
    const map = mapInstance.current;
    const L = leafletRef.current;
    if (!map || !L) return;
    const visiblePositions: [number, number][] = [];
    markerEntries.current.forEach(({ marker, point }) => {
      marker.setIcon(buildIcon(L, point, selectedDate, dayById, pointById));
      marker.setPopupContent(popupHtml(point, selectedDay?.visits?.[point.id]));
      const visible = (category === "all" || point.category === category) && (selectedDate === "all" || point.dates.includes(selectedDate));
      if (visible && !map.hasLayer(marker)) marker.addTo(map);
      if (!visible && map.hasLayer(marker)) marker.removeFrom(map);
      if (visible) visiblePositions.push(point.position);
    });
    if (selectedDate !== "all" && visiblePositions.length > 0) map.fitBounds(visiblePositions, { padding: [58, 58], maxZoom: 14 });
  }, [category, dayById, pointById, selectedDate, selectedDay, mapRevision]);

  useEffect(() => {
    if (!mapInstance.current || !leafletRef.current || !arrowLayer.current) return;
    const activeMap = mapInstance.current;
    const leaflet = leafletRef.current;
    const activeLayer = arrowLayer.current;

    function redrawRouteArrows() {
      activeLayer.clearLayers();
      if (selectedDate === "all") {
        setArrowState("idle");
        return;
      }
      if (activeMap.getZoom() < ROUTE_ARROW_MIN_ZOOM) {
        setArrowState("zoom");
        return;
      }

      let arrowCount = 0;
      const viewport = activeMap.getBounds().pad(0.18);
      (selectedDay?.segments ?? []).filter((segment) => segment.drawOnMap).forEach((segment, segmentIndex) => {
        const segmentPoints = segment.pointIds.map((id) => pointById.get(id)).filter((point): point is Place => Boolean(point));
        segmentPoints.slice(0, -1).forEach((point, pointIndex) => {
          const nextPoint = segmentPoints[pointIndex + 1];
          const categoryMatches = (candidate: Place) => category === "all" || candidate.category === category;
          if (!categoryMatches(point) || !categoryMatches(nextPoint)) return;
          if (!viewport.contains(point.position) || !viewport.contains(nextPoint.position)) return;

          const start = activeMap.latLngToContainerPoint(point.position);
          const end = activeMap.latLngToContainerPoint(nextPoint.position);
          const distance = start.distanceTo(end);
          if (distance < 34) return;

          const width = Math.min(Math.max(distance + 50, 84), 1100);
          const height = 76;
          const centerPoint = leaflet.point((start.x + end.x) / 2, (start.y + end.y) / 2);
          const center = activeMap.containerPointToLatLng(centerPoint);
          const rotation = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
          const bend = (segmentIndex + pointIndex) % 2 === 0 ? 15 : -15;
          const markerId = `route-arrow-${selectedDate.replace(".", "-")}-${segmentIndex}-${pointIndex}`;
          const path = `M 23 38 Q ${Math.round(width / 2)} ${38 + bend} ${width - 27} 38`;
          const html = `<svg class="trip-route-arrow" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="transform:rotate(${rotation}deg)" aria-hidden="true"><defs><marker id="${markerId}" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="9" markerHeight="9" orient="auto"><path d="M 0 0 L 12 6 L 0 12 Z" /></marker></defs><path class="trip-route-arrow-halo" d="${path}"/><path class="trip-route-arrow-stroke" d="${path}" marker-end="url(#${markerId})"/></svg>`;
          const icon = leaflet.divIcon({ className: "trip-route-arrow-wrap", html, iconSize: [width, height], iconAnchor: [width / 2, height / 2] });
          leaflet.marker(center, { icon, interactive: false, keyboard: false, pane: "routeArrowPane" }).addTo(activeLayer);
          arrowCount += 1;
        });
      });
      setArrowState(arrowCount > 0 ? "visible" : "zoom");
    }

    redrawRouteArrows();
    activeMap.on("zoomend moveend resize", redrawRouteArrows);
    return () => { activeMap.off("zoomend moveend resize", redrawRouteArrows); activeLayer.clearLayers(); };
  }, [category, pointById, selectedDate, selectedDay, mapRevision]);

  function focusArea(nextArea: GuideAreaId) { const target = areaById.get(nextArea); if (!target) return; setArea(nextArea); mapInstance.current?.fitBounds(target.bounds, { padding: [24, 24] }); }
  const visiblePointCount = places.filter((point) => (category === "all" || point.category === category) && (selectedDate === "all" || point.dates.includes(selectedDate))).length;
  const visibleRestaurants = selectedDate === "all" ? restaurants : restaurants.filter((restaurant) => restaurant.dates.includes(selectedDate));
  const selectedSegments = selectedDay?.segments ?? [];
  const dayPoints = selectedDay ? pointsForDay(selectedDay, pointById) : [];
  const fullDayHref = dayRouteHref(dayPoints);
  const mobileParts = dayPoints.length > 5 || !fullDayHref ? splitRouteForMobile(dayPoints) : [];

  return (
    <div className="real-map-panel">
      <div className="real-map-toolbar">
        <div className="map-control-group" aria-label="地图区域">{mapConfig.areas.map((mapArea) => <button className={area === mapArea.id ? "active" : ""} type="button" key={mapArea.id} onClick={() => focusArea(mapArea.id)}>{mapArea.label}</button>)}</div>
        <div className="map-control-group category-controls" aria-label="地图标记筛选">{Object.entries(categoryLabels).map(([key, label]) => <button className={category === key ? "active" : ""} type="button" key={key} onClick={() => setCategory(key as Category)}>{label}</button>)}</div>
      </div>
      <div className="map-date-filter">
        <div className="map-date-heading"><strong>按日期</strong><span aria-live="polite">{selectedDate === "all" ? `全程 · ${visiblePointCount} 个点位` : `${selectedDate} · ${visiblePointCount} 个点位`}</span></div>
        <div className="map-date-scroller" aria-label="地图日期筛选">{dateOptions.map(([value, label]) => <button className={selectedDate === value ? "active" : ""} type="button" key={value} aria-pressed={selectedDate === value} onClick={() => setSelectedDate(value)}><small>{value === "all" ? "全程" : value}</small><span>{label}</span></button>)}</div>
      </div>
      <div className="map-legend real-legend" aria-label="地图图例"><span><i className="real-legend-dot spot-dot" />景点</span><span><i className="real-legend-dot restaurant-dot" />餐厅</span><span><i className="real-legend-dot stay-dot" />住宿</span><span>日期筛选后，行程内景点和餐厅按顺序编号</span><span className={`map-arrow-state state-${arrowState}`}>{arrowState === "idle" ? "选中某天后显示片区箭头" : arrowState === "visible" ? "片区箭头已显示" : "继续放大到片区查看箭头"}</span></div>
      <div className="leaflet-map" ref={mapElement} aria-label={mapConfig.ariaLabel} />
      <p className="map-disclaimer">底图使用 OpenStreetMap；选中某天并放大到片区后，粗黑弧形箭头表示当天区域内的游览顺序。跨城交通不画长线，住宿首尾和每一段真实导航都在下方列出；时刻卡区分已核班次、部分核实与预计时间。双指滚动或捏合可缩放地图，点击标记可打开 Google Maps。</p>

      <section className="day-route-detail" aria-label="当天详细行程">
        {selectedDate === "all" ? <div className="day-route-empty"><strong>选择上方某一天</strong><p>即可查看从哪里几点出发、建议班次、预计几点到、到达后游览 / 停留多久，以及每一段的 Google Maps 导航、首末班约束与无法乘坐时的备用方案。</p></div> : (
          <>
            <div className="day-route-header"><div><span>{selectedDate}</span><h3>{selectedDay?.title}</h3></div><small>每一段都可打开 Google Maps；公共交通卡另附运营方时刻入口</small></div>
            {selectedDay && <DayOverview day={selectedDay} model={model} />}
            {dayPoints.length > 1 && <article className="day-full-route">
              <div className="day-full-route-intro">
                <div>
                  <span>GOOGLE MAPS · 全天总览</span>
                  <strong>{dayPoints[0].name} → {dayPoints.at(-1)?.name}</strong>
                  <p>全天链接用于查看停靠顺序，Google Maps 可能选择单一交通方式；铁路和步行请以下方逐段卡片为准。{dayPoints.some((point) => point.category === "stay") && "住宿地址请按最终确认信息核对。"}</p>
                </div>
                {fullDayHref && <a className="day-full-route-button" href={fullDayHref} target="_blank" rel="noreferrer">在 Google Maps 打开全天路线图 <span>↗</span></a>}
              </div>
              <ol className="day-full-route-stops" aria-label={`${selectedDate} 全天路线顺序`}>
                {dayPoints.map((point, index) => <li key={`${point.id}-${index}`}><b>{String(index + 1).padStart(2, "0")}</b><span>{point.name}</span></li>)}
              </ol>
              {mobileParts.length > 0 && <div className="day-full-route-mobile">
                <p>{!fullDayHref && "当天点位超出单链接容量，已保留完整顺序并拆成连续路线。"}手机浏览器最多支持 3 个途经点；若全天链接丢点，请依次打开以下分段，或使用下方逐段导航。</p>
                <div>{mobileParts.map((points, index) => {
                  const href = dayRouteHref(points);
                  return href && <a href={href} target="_blank" rel="noreferrer" key={index}>第 {index + 1} 段：{points[0].name} → {points.at(-1)?.name} ↗</a>;
                })}</div>
              </div>}
            </article>}
            <details className="transit-audit-note">
              <summary>班次核对说明 · 如何理解“预计”与“已核”</summary>
              <p>{mapConfig.transitAuditNote}</p>
            </details>
            {selectedSegments.map((segment) => {
              const segmentPoints = segment.pointIds.map((id) => pointById.get(id)).filter((point): point is Place => Boolean(point));
              const segmentLegs = segmentPoints.slice(0, -1).map((from, index) => ({
                from,
                to: segmentPoints[index + 1],
                detail: getTransitLeg(model, selectedDate, from.id, segmentPoints[index + 1].id),
              }));
              const isClosedTransitLoop = segment.mode === "transit" && segmentPoints[0]?.id === segmentPoints.at(-1)?.id;
              const wholeRoute = segmentPoints.length > 1 && !isClosedTransitLoop ? googleDirections(segmentPoints[0].googleQuery, segmentPoints.at(-1)!.googleQuery, segmentPoints.slice(1, -1).map((point) => point.googleQuery), segment.mode) : null;
              return <article className="day-segment" key={segment.label}>
                <div className="day-segment-title"><div><strong>{segment.label}</strong><p>{segment.note}</p></div><div className="day-segment-actions"><span>{segmentLegs.length} 段交通</span>{wholeRoute && <a href={wholeRoute} target="_blank" rel="noreferrer">整段路线 ↗</a>}</div></div>
                <div className="day-leg-grid">
                  {segmentLegs.map(({ from, to, detail }, index) => {
                    const directionsMode = detail?.kind === "步行" ? "walking" : "transit";
                    return detail ? <TransitCard key={`${from.id}-${to.id}`} from={from} to={to} leg={detail}
                      visit={selectedDay?.visits?.[to.id]} index={index + 1}
                      href={googleDirections(from.googleQuery, to.googleQuery, [], directionsMode)} />
                      : <p className="day-leg-missing" key={`${from.id}-${to.id}`}>这段交通资料缺失，请暂时使用 Google Maps 导航并在出发前核对。</p>;
                  })}
                </div>
              </article>;
            })}
          </>
        )}
      </section>

      <details className="map-dining-fold" key={selectedDate}>
      <summary>{selectedDate === "all" ? "全程" : selectedDate} 餐厅候选与顺路备选 · {visibleRestaurants.length} 家</summary>
      <p className="map-dining-note">{mapConfig.diningNote}</p>
      <div className="restaurant-pin-grid">
        {visibleRestaurants.length === 0 && <p className="restaurant-pin-empty">这一天不安排园外或正式餐厅，优先保留机动时间。</p>}
        {visibleRestaurants.map((restaurant) => {
          const fitClass = restaurant.fitLevel === "顺路" ? "best" : restaurant.fitLevel === "预订型" ? "swap" : "detour";
          return <article className="restaurant-pin-card" key={restaurant.id}><div className="restaurant-pin-top"><div className="restaurant-pin-meta"><span>{restaurant.meta}</span><b>建议 {restaurant.dates.join(" / ")}</b></div><em className={`fit-${fitClass}`}>{restaurant.fitLevel}</em></div><h4>{restaurant.name}</h4><strong>{restaurant.guide}</strong><p>{restaurant.fit}</p><div className="restaurant-pin-links"><a href={googleSearch(restaurant.googleQuery)} target="_blank" rel="noreferrer">Google Maps ↗</a>{restaurant.official && <a href={restaurant.official} target="_blank" rel="noreferrer">官方 / 预约 ↗</a>}</div></article>;
        })}
      </div>
      </details>
    </div>
  );
}
