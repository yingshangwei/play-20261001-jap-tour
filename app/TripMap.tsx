"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker, Polyline } from "leaflet";

type Area = "kansai" | "kyoto" | "osaka" | "kobe";
type Category = "all" | "spot" | "restaurant" | "stay";

type MapPoint = {
  id: string;
  name: string;
  area: Area;
  category: Exclude<Category, "all">;
  position: [number, number];
  meta: string;
  address?: string;
  googleQuery: string;
  guide?: string;
  fit?: string;
  fitLevel?: "最顺" | "可替换" | "需专程";
  official?: string;
};

const spots: MapPoint[] = [
  { id: "kix", name: "关西国际机场", area: "kansai", category: "spot", position: [34.4359, 135.2435], meta: "09.29 抵达 · 10.07 返程", googleQuery: "Kansai International Airport" },
  { id: "osaka-stay", name: "大阪住宿 · 难波 / 心斋桥", area: "osaka", category: "stay", position: [34.6676, 135.5012], meta: "09.29–10.02 · 3晚；10.06 · 1晚", googleQuery: "Namba Osaka" },
  { id: "usj", name: "USJ", area: "osaka", category: "spot", position: [34.6656, 135.4325], meta: "09.30 · 全天", googleQuery: "Universal Studios Japan" },
  { id: "shinsaibashi", name: "心斋桥", area: "osaka", category: "spot", position: [34.6748, 135.5012], meta: "09.29 首晚 + 10.06 收尾", googleQuery: "Shinsaibashi Osaka" },
  { id: "osaka-castle", name: "大阪城公园", area: "osaka", category: "spot", position: [34.6872, 135.5254], meta: "10.06", googleQuery: "Osaka Castle" },
  { id: "nara", name: "奈良公园 · 春日山", area: "kansai", category: "spot", position: [34.6829, 135.8546], meta: "10.01 · 当天往返", googleQuery: "Nara Park" },
  { id: "kyoto-stay", name: "京都住宿 · 京都站附近", area: "kyoto", category: "stay", position: [34.9858, 135.7588], meta: "10.02–10.06 · 4晚", googleQuery: "Kyoto Station" },
  { id: "ginkakuji", name: "银阁寺 · 哲学之道", area: "kyoto", category: "spot", position: [35.027, 135.7982], meta: "10.02 · 东山步行线", googleQuery: "Ginkakuji Kyoto" },
  { id: "eikando", name: "永观堂", area: "kyoto", category: "spot", position: [35.0144, 135.7919], meta: "10.02 · 16:00 前受付", googleQuery: "Eikando Temple Kyoto" },
  { id: "nanzenji", name: "南禅寺", area: "kyoto", category: "spot", position: [35.0114, 135.793], meta: "10.02 · 永观堂之后", googleQuery: "Nanzenji Temple Kyoto" },
  { id: "arashiyama", name: "岚山竹林", area: "kyoto", category: "spot", position: [35.0168, 135.6713], meta: "10.03", googleQuery: "Arashiyama Bamboo Forest" },
  { id: "nintendo", name: "任天堂博物馆", area: "kyoto", category: "spot", position: [34.8926, 135.7842], meta: "10.04 · 预约入馆", googleQuery: "Nintendo Museum Uji" },
  { id: "byodoin", name: "平等院 · 宇治川", area: "kyoto", category: "spot", position: [34.8901, 135.8072], meta: "10.04 · 博物馆之后", googleQuery: "Byodoin Temple Uji" },
  { id: "joyo", name: "城阳秋花火", area: "kyoto", category: "spot", position: [34.8445, 135.7972], meta: "10.04 · 19:00", googleQuery: "Kizugawa Athletic Park Joyo Kyoto" },
  { id: "kurama", name: "鞍马寺", area: "kyoto", category: "spot", position: [35.1179, 135.7707], meta: "10.05 · 徒步起点", googleQuery: "Kurama-dera Kyoto" },
  { id: "kifune", name: "贵船神社", area: "kyoto", category: "spot", position: [35.1219, 135.7629], meta: "10.05 · 徒步终点", googleQuery: "Kifune Shrine Kyoto" },
  { id: "fushimi-inari", name: "伏见稻荷大社", area: "kyoto", category: "spot", position: [34.9671, 135.7727], meta: "10.06 · 6:30 可选短线", googleQuery: "Fushimi Inari Taisha" },
];

export const restaurantPoints: MapPoint[] = [
  {
    id: "maekawa", name: "料理屋まえかわ", area: "kyoto", category: "restaurant", position: [34.99826, 135.767593],
    meta: "京都 · 日本料理", address: "京都市下京区难波町405", googleQuery: "料理屋まえかわ 京都",
    guide: "MICHELIN 京都 2026 ★", fit: "10.02 东山散步后或 10.03 晚餐；离清水五条约 300m。", fitLevel: "最顺", official: "https://ryouriya-maekawa.com/",
  },
  {
    id: "gion-nanba", name: "祇園 なん波 / Gion Nanba", area: "kyoto", category: "restaurant", position: [35.004158, 135.775818],
    meta: "京都祇园 · 京怀石", address: "京都市东山区祇园町北侧279-7", googleQuery: "Gion Nanba Kyoto",
    guide: "截图候选 · 往届 MICHELIN 入选", fit: "10.02 八坂神社、祇园路线内，几乎不绕路。", fitLevel: "最顺", official: "https://kyotonanba.com/",
  },
  {
    id: "mizuno", name: "水の / Mizuno", area: "kyoto", category: "restaurant", position: [35.006409, 135.775757],
    meta: "京都祇园 · 日本料理", address: "京都市东山区中之町245-2", googleQuery: "水の 京都 新門前",
    guide: "MICHELIN 京都 2026 入选", fit: "10.02 祇园晚餐最顺；18:00 统一开席，需提前到。", fitLevel: "最顺", official: "https://www.tablecheck.com/en/mizuno-kyoto",
  },
  {
    id: "hakuran", name: "萬寿寺はくらん", area: "kyoto", category: "restaurant", position: [34.997776, 135.758514],
    meta: "京都五条 · 日本料理", address: "京都市下京区御供石町358", googleQuery: "萬寿寺はくらん 京都",
    guide: "MICHELIN 京都 2026 ★", fit: "离京都站住宿最近，适合 10.03 或 10.05 晚餐。", fitLevel: "最顺", official: "https://manjujihakuran.com/",
  },
  {
    id: "hyotei", name: "瓢亭 / Hyotei", area: "kyoto", category: "restaurant", position: [35.01141, 135.786011],
    meta: "京都南禅寺 · 京怀石", address: "京都市左京区南禅寺草川町35", googleQuery: "Hyotei Kyoto",
    guide: "MICHELIN 京都 2026 ★★★", fit: "10.02 南禅寺路线旁；午餐最省时间。", fitLevel: "最顺", official: "https://hyotei.co.jp/en/",
  },
  {
    id: "kikunoi", name: "菊乃井本店", area: "kyoto", category: "restaurant", position: [35.000397, 135.781204],
    meta: "京都东山 · 京怀石", address: "京都市东山区下河原町459", googleQuery: "Kikunoi Honten Kyoto",
    guide: "MICHELIN 京都 2026 ★★★", fit: "10.02 圆山公园、八坂神社之后直接步行抵达。", fitLevel: "最顺", official: "https://kikunoi.jp/en/",
  },
  {
    id: "kichisen", name: "京懐石 吉泉 / Kichisen", area: "kyoto", category: "restaurant", position: [35.035683, 135.771378],
    meta: "京都下鸭 · 京怀石", address: "京都市左京区下鸭森本町5", googleQuery: "Kyokaiseki Kichisen Kyoto",
    guide: "MICHELIN 京都 2026 ★★", fit: "10.05 贵船回程经过出町柳时最顺，建议预留换装与休息。", fitLevel: "最顺", official: "https://www.kichisen-kyoto.com/en/",
  },
  {
    id: "taian", name: "太庵 / Taian", area: "osaka", category: "restaurant", position: [34.673367, 135.507217],
    meta: "大阪心斋桥 · 日本料理", address: "大阪市中央区岛之内1-21-2", googleQuery: "Taian Osaka",
    guide: "MICHELIN 大阪 2026 ★★★", fit: "10.06 心斋桥收尾日最顺，步行即可回难波一带。", fitLevel: "最顺", official: "https://guide.michelin.com/jp/ja/osaka-region/osaka/restaurant/taian",
  },
  {
    id: "la-cime", name: "La Cime", area: "osaka", category: "restaurant", position: [34.685772, 135.503525],
    meta: "大阪本町 · 现代法餐", address: "大阪市中央区瓦町3-2-15", googleQuery: "La Cime Osaka",
    guide: "MICHELIN 大阪 2026 ★★", fit: "10.06 大阪城、中之岛之后最顺，地铁回难波方便。", fitLevel: "最顺", official: "https://www.la-cime.com/",
  },
  {
    id: "aragawa", name: "麤皮 / Aragawa", area: "kobe", category: "restaurant", position: [34.697136, 135.189606],
    meta: "神户北野 · 炭火牛排", address: "神户市中央区中山手通2-15-18", googleQuery: "Aragawa Kobe",
    guide: "截图候选 · 高端牛排", fit: "仅在 10.01 把奈良换成神户时顺路；从三宫步行约 10–15 分钟。", fitLevel: "可替换", official: "https://aragawa.co.jp/",
  },
  {
    id: "mouriya", name: "モーリヤ本店 / Mouriya Honten", area: "kobe", category: "restaurant", position: [34.693119, 135.191193],
    meta: "神户三宫 · 神户牛", address: "神户市中央区下山手通2-1-17", googleQuery: "Mouriya Honten Kobe",
    guide: "截图候选 · 神户牛排", fit: "神户备选日最容易插入，紧邻三宫站。", fitLevel: "可替换", official: "https://www.mouriya.co.jp/en/head",
  },
  {
    id: "uemura", name: "料理屋 植むら", area: "kobe", category: "restaurant", position: [34.697174, 135.191757],
    meta: "神户北野坂 · 日本料理", address: "神户市中央区中山手通1-24-14", googleQuery: "料理屋植むら 神戸",
    guide: "往届 MICHELIN ★★", fit: "18:00 / 21:00 分批开席；只有采用神户备选日才建议。", fitLevel: "可替换", official: "https://www.ryouriya-uemura.com/",
  },
  {
    id: "komago", name: "子孫 / Komago", area: "kobe", category: "restaurant", position: [34.762573, 135.33165],
    meta: "西宫甲阳园 · 日本料理", address: "西宫市甲阳园本庄町5-21", googleQuery: "子孫 KOMAGO 西宮",
    guide: "往届 MICHELIN ★★★", fit: "不在大阪—京都主线上；需要从大阪专程往返，不建议硬塞。", fitLevel: "需专程", official: "https://komago-cuisine.com/",
  },
];

const allPoints = [...spots, ...restaurantPoints];

const routeLines = [
  { label: "09.29 抵达", color: "#ef6a39", points: [[34.4359, 135.2435], [34.6676, 135.5012], [34.6748, 135.5012]] as [number, number][] },
  { label: "09.30 USJ", color: "#355c45", points: [[34.6676, 135.5012], [34.6656, 135.4325], [34.6676, 135.5012]] as [number, number][] },
  { label: "10.01 奈良", color: "#567762", points: [[34.6676, 135.5012], [34.6829, 135.8546], [34.6676, 135.5012]] as [number, number][] },
  { label: "10.02 东山", color: "#ef6a39", points: [[34.6676, 135.5012], [34.9858, 135.7588], [35.027, 135.7982], [35.0144, 135.7919], [35.0114, 135.793], [35.0037, 135.778]] as [number, number][] },
  { label: "10.03 岚山", color: "#355c45", points: [[34.9858, 135.7588], [35.0168, 135.6713], [34.9858, 135.7588]] as [number, number][] },
  { label: "10.04 宇治烟火", color: "#d59d2f", points: [[34.9858, 135.7588], [34.8926, 135.7842], [34.8901, 135.8072], [34.8445, 135.7972], [34.9858, 135.7588]] as [number, number][] },
  { label: "10.05 贵船", color: "#355c45", points: [[34.9858, 135.7588], [35.1179, 135.7707], [35.1219, 135.7629], [34.9858, 135.7588]] as [number, number][] },
  { label: "10.06–07 返程", color: "#ef6a39", points: [[34.9858, 135.7588], [34.6872, 135.5254], [34.6748, 135.5012], [34.6676, 135.5012], [34.4359, 135.2435]] as [number, number][] },
];

const areaBounds: Record<Area, [[number, number], [number, number]]> = {
  kansai: [[34.39, 135.14], [35.16, 135.9]],
  kyoto: [[34.82, 135.64], [35.15, 135.83]],
  osaka: [[34.62, 135.4], [34.72, 135.56]],
  kobe: [[34.66, 135.14], [34.79, 135.38]],
};

const areaLabels: Record<Area, string> = { kansai: "关西全程", kyoto: "京都", osaka: "大阪", kobe: "神户 / 西宫" };
const categoryLabels: Record<Category, string> = { all: "全部", spot: "景点", restaurant: "餐厅", stay: "住宿" };

const routeButtons = [
  ["09.29 机场→难波", "Kansai International Airport", "Namba Osaka", ""],
  ["09.30 难波→USJ", "Namba Osaka", "Universal Studios Japan", ""],
  ["10.01 难波→奈良", "Namba Osaka", "Nara Park", ""],
  ["10.02 大阪→京都东山", "Namba Osaka", "Gion Kyoto", "Kyoto Station|Ginkakuji Kyoto|Eikando Temple Kyoto|Nanzenji Temple Kyoto"],
  ["10.03 京都→岚山", "Kyoto Station", "Arashiyama Bamboo Forest", ""],
  ["10.04 任天堂→宇治→烟火", "Kyoto Station", "Kizugawa Athletic Park Joyo", "Nintendo Museum Uji|Byodoin Temple Uji"],
  ["10.05 鞍马→贵船", "Kyoto Station", "Kifune Shrine Kyoto", "Kurama-dera Kyoto"],
  ["10.06 可选伏见稻荷", "Kyoto Station", "Kyoto Station", "Fushimi Inari Taisha"],
  ["10.06 京都→大阪", "Kyoto Station", "Namba Osaka", "Osaka Castle|Shinsaibashi"],
  ["10.07 难波→KIX", "Namba Osaka", "Kansai International Airport", ""],
];

function googleSearch(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function googleDirections(origin: string, destination: string, waypoints: string) {
  const base = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
  return waypoints ? `${base}&waypoints=${encodeURIComponent(waypoints)}` : base;
}

function popupHtml(point: MapPoint) {
  const detail = point.guide ? `<span class="leaflet-popup-guide">${point.guide}</span>` : "";
  const fit = point.fit ? `<p>${point.fit}</p>` : "";
  return `<div class="trip-popup"><strong>${point.name}</strong><small>${point.meta}</small>${detail}${fit}<a href="${googleSearch(point.googleQuery)}" target="_blank" rel="noreferrer">Google Maps 导航 ↗</a></div>`;
}

export default function TripMap() {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const markerEntries = useRef<Array<{ marker: Marker; point: MapPoint }>>([]);
  const lineEntries = useRef<Polyline[]>([]);
  const [category, setCategory] = useState<Category>("all");
  const [area, setArea] = useState<Area>("kansai");

  useEffect(() => {
    let disposed = false;

    async function setupMap() {
      if (!mapElement.current || mapInstance.current) return;
      const L = await import("leaflet");
      if (disposed || !mapElement.current) return;

      const map = L.map(mapElement.current, { zoomControl: true, scrollWheelZoom: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      markerEntries.current = allPoints.map((point) => {
        const symbol = point.category === "restaurant" ? "食" : point.category === "stay" ? "住" : "景";
        const icon = L.divIcon({
          className: "trip-marker-wrap",
          html: `<span class="trip-marker marker-${point.category}">${symbol}</span>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
          popupAnchor: [0, -15],
        });
        const marker = L.marker(point.position, { icon, title: point.name }).bindPopup(popupHtml(point), { maxWidth: 265 });
        marker.addTo(map);
        return { marker, point };
      });

      lineEntries.current = routeLines.map((route) => {
        const line = L.polyline(route.points, { color: route.color, weight: 3, opacity: 0.72, dashArray: "7 7" });
        line.bindTooltip(route.label, { sticky: true });
        line.addTo(map);
        return line;
      });

      map.fitBounds(areaBounds.kansai, { padding: [24, 24] });
      mapInstance.current = map;
      window.setTimeout(() => map.invalidateSize(), 80);
    }

    setupMap();
    return () => {
      disposed = true;
      mapInstance.current?.remove();
      mapInstance.current = null;
      markerEntries.current = [];
      lineEntries.current = [];
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    markerEntries.current.forEach(({ marker, point }) => {
      const visible = category === "all" || point.category === category;
      if (visible && !map.hasLayer(marker)) marker.addTo(map);
      if (!visible && map.hasLayer(marker)) marker.removeFrom(map);
    });
    lineEntries.current.forEach((line) => {
      const visible = category === "all" || category === "spot" || category === "stay";
      if (visible && !map.hasLayer(line)) line.addTo(map);
      if (!visible && map.hasLayer(line)) line.removeFrom(map);
    });
  }, [category]);

  function focusArea(nextArea: Area) {
    setArea(nextArea);
    mapInstance.current?.fitBounds(areaBounds[nextArea], { padding: [24, 24] });
  }

  return (
    <div className="real-map-panel">
      <div className="real-map-toolbar">
        <div className="map-control-group" aria-label="地图区域">
          {Object.entries(areaLabels).map(([key, label]) => (
            <button className={area === key ? "active" : ""} type="button" key={key} onClick={() => focusArea(key as Area)}>{label}</button>
          ))}
        </div>
        <div className="map-control-group category-controls" aria-label="地图标记筛选">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button className={category === key ? "active" : ""} type="button" key={key} onClick={() => setCategory(key as Category)}>{label}</button>
          ))}
        </div>
      </div>

      <div className="map-legend real-legend" aria-label="地图图例">
        <span><i className="real-legend-dot spot-dot" />景点</span>
        <span><i className="real-legend-dot restaurant-dot" />候选餐厅</span>
        <span><i className="real-legend-dot stay-dot" />住宿</span>
        <span><i className="legend-line day-line" />行程先后顺序</span>
      </div>

      <div className="leaflet-map" ref={mapElement} aria-label="关西景点、住宿与餐厅交互地图" />
      <p className="map-disclaimer">底图为 OpenStreetMap 实际地理数据；彩色虚线表示游览顺序，不代表具体铁轨。点击任意标记可跳转 Google Maps 获取当日实时换乘。</p>

      <div className="google-route-strip" aria-label="按日期打开 Google Maps 路线">
        {routeButtons.map(([label, origin, destination, waypoints]) => (
          <a href={googleDirections(origin, destination, waypoints)} target="_blank" rel="noreferrer" key={label}>{label}<span>↗</span></a>
        ))}
      </div>

      <div className="restaurant-map-heading">
        <div>
          <p className="eyebrow dark">DINING PINS</p>
          <h3>候选餐厅与行程的距离关系</h3>
        </div>
        <p>星级按 2026 京都・大阪当前榜单标示；兵库餐厅显示往届荣誉或截图候选。预约前仍需查看餐厅官方页面。</p>
      </div>

      <div className="restaurant-pin-grid">
        {restaurantPoints.map((restaurant) => {
          const fitClass = restaurant.fitLevel === "最顺" ? "best" : restaurant.fitLevel === "可替换" ? "swap" : "detour";
          return (
          <article className="restaurant-pin-card" key={restaurant.id}>
            <div className="restaurant-pin-top">
              <span>{restaurant.meta}</span>
              <em className={`fit-${fitClass}`}>{restaurant.fitLevel}</em>
            </div>
            <h4>{restaurant.name}</h4>
            <strong>{restaurant.guide}</strong>
            <p>{restaurant.fit}</p>
            <div className="restaurant-pin-links">
              <a href={googleSearch(restaurant.googleQuery)} target="_blank" rel="noreferrer">地图 ↗</a>
              {restaurant.official && <a href={restaurant.official} target="_blank" rel="noreferrer">官方 / 预约 ↗</a>}
            </div>
          </article>
          );
        })}
      </div>
    </div>
  );
}
