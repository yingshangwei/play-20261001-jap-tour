"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";

type Area = "kansai" | "osaka" | "kobe" | "kyoto" | "nara";
type Category = "all" | "spot" | "restaurant" | "stay";
type ItineraryDate = "09.29" | "09.30" | "10.01" | "10.02" | "10.03" | "10.04" | "10.05" | "10.06" | "10.07";
type DateFilter = "all" | ItineraryDate;

type MapPoint = {
  id: string;
  name: string;
  area: Area;
  category: Exclude<Category, "all">;
  position: [number, number];
  dates: ItineraryDate[];
  meta: string;
  googleQuery: string;
  guide?: string;
  fit?: string;
  fitLevel?: "顺路" | "预订型" | "备选";
  official?: string;
};

type DaySegment = { label: string; note: string; pointIds: string[] };

const spots: MapPoint[] = [
  { id: "kix", name: "关西国际机场", area: "kansai", category: "spot", position: [34.4359, 135.2435], dates: ["09.29", "10.07"], meta: "抵达 / 返程", googleQuery: "Kansai International Airport" },
  { id: "osaka-stay", name: "大阪住宿 · 难波 / 心斋桥", area: "osaka", category: "stay", position: [34.6676, 135.5012], dates: ["09.29", "09.30", "10.01", "10.02", "10.06", "10.07"], meta: "前段 4 晚 · 最后一晚再住大阪", googleQuery: "Namba Osaka" },
  { id: "kyoto-stay", name: "京都住宿 · 京都站附近", area: "kyoto", category: "stay", position: [34.9858, 135.7588], dates: ["10.03", "10.04", "10.05", "10.06"], meta: "10.03–10.06 · 3 晚", googleQuery: "Kyoto Station" },

  { id: "shinsaibashi", name: "心斋桥筋", area: "osaka", category: "spot", position: [34.6748, 135.5012], dates: ["09.29", "10.06"], meta: "首晚必到 · 最后一晚可补购物", googleQuery: "Shinsaibashi-suji Shopping Street Osaka" },
  { id: "dotonbori", name: "道顿堀", area: "osaka", category: "spot", position: [34.6687, 135.5013], dates: ["09.29", "10.06"], meta: "夜景与美食街", googleQuery: "Dotonbori Osaka" },
  { id: "hozenji", name: "法善寺横丁", area: "osaka", category: "spot", position: [34.6676, 135.5027], dates: ["09.29", "10.06"], meta: "道顿堀旁的石板小巷", googleQuery: "Hozenji Yokocho Osaka" },
  { id: "usj", name: "USJ", area: "osaka", category: "spot", position: [34.6656, 135.4325], dates: ["09.30"], meta: "全天 · 2026 万圣节活动期", googleQuery: "Universal Studios Japan" },
  { id: "kuromon", name: "黑门市场", area: "osaka", category: "spot", position: [34.6654, 135.5064], dates: ["10.01"], meta: "10:30 左右慢慢吃早午餐", googleQuery: "Kuromon Ichiba Market Osaka" },
  { id: "shitennoji", name: "四天王寺", area: "osaka", category: "spot", position: [34.6545, 135.5165], dates: ["10.01"], meta: "大阪南区安静古寺", googleQuery: "Shitennoji Temple Osaka" },
  { id: "tennoji-park", name: "天王寺公园 · 慶泽园", area: "osaka", category: "spot", position: [34.651, 135.5107], dates: ["10.01"], meta: "USJ 后的松弛散步", googleQuery: "Keitakuen Garden Osaka" },
  { id: "shinsekai", name: "新世界 · 通天阁", area: "osaka", category: "spot", position: [34.6525, 135.5063], dates: ["10.01"], meta: "街景、炸串，可不上塔", googleQuery: "Tsutenkaku Shinsekai Osaka" },
  { id: "den-den-town", name: "日本桥电电城", area: "osaka", category: "spot", position: [34.6592, 135.5062], dates: ["10.01"], meta: "动漫、电器与模型店", googleQuery: "Nipponbashi Denden Town Osaka" },

  { id: "nunobiki", name: "布引香草园 · 缆车", area: "kobe", category: "spot", position: [34.7179, 135.1903], dates: ["10.02"], meta: "09:30 缆车 · 神户自然主线", googleQuery: "Kobe Nunobiki Herb Gardens", guide: "Google Maps 4.5 · 约 6,200 条评价", fit: "山景与花园是神户日的主要体验；遇强风停运则直接去北野。", official: "https://www.kobeherb.com/en/" },
  { id: "kitano", name: "北野异人馆街", area: "kobe", category: "spot", position: [34.7008, 135.1897], dates: ["10.02"], meta: "从山侧顺坡下行", googleQuery: "Kitano Ijinkan-Gai Kobe" },
  { id: "meriken", name: "美利坚公园", area: "kobe", category: "spot", position: [34.6826, 135.1871], dates: ["10.02"], meta: "港口散步与地标建筑", googleQuery: "Meriken Park Kobe" },
  { id: "harborland", name: "神户 Harborland", area: "kobe", category: "spot", position: [34.6796, 135.1789], dates: ["10.02"], meta: "看日落后回大阪", googleQuery: "Kobe Harborland" },

  { id: "arashiyama-bamboo", name: "岚山竹林小径", area: "kyoto", category: "spot", position: [35.017, 135.6713], dates: ["10.03"], meta: "只留 30 分钟 · 09:00 前后到", googleQuery: "Arashiyama Bamboo Forest Kyoto", guide: "Google Maps 4.4 · 约 2.4 万条评价", fit: "最常见负面反馈是拥挤且主路很短；早到、拍完即走，不把它当半日主景点。" },
  { id: "tenryuji", name: "天龙寺庭园", area: "kyoto", category: "spot", position: [35.0158, 135.6738], dates: ["10.03"], meta: "08:30 开门 · 岚山主景点", googleQuery: "Tenryu-ji Kyoto", guide: "Google Maps 4.5 · 约 1.7 万条评价", fit: "庭园体验比竹林更完整，且可从北门自然衔接竹林。", official: "https://www.tenryuji.com/en/visit/index.html" },
  { id: "togetsukyo", name: "渡月桥・桂川", area: "kyoto", category: "spot", position: [35.0135, 135.6778], dates: ["10.03"], meta: "河岸休息 · 看山景", googleQuery: "Togetsukyo Bridge Kyoto", guide: "Google Maps 4.5", fit: "与天龙寺同一核心区，作为午后低强度收尾，不追加猴子公园爬坡。" },

  { id: "philosopher", name: "哲学之道", area: "kyoto", category: "spot", position: [35.0202, 135.7958], dates: ["10.04"], meta: "不可删除 · 08:30 开始", googleQuery: "Philosopher's Path Kyoto", guide: "Google Maps 4.6", fit: "本次京都硬约束；约 2 公里，预留 60–75 分钟而不是当作景点间通道。" },
  { id: "nanzenji", name: "南禅寺 · 水路阁", area: "kyoto", category: "spot", position: [35.0114, 135.793], dates: ["10.04"], meta: "11:00 前离开", googleQuery: "Nanzenji Temple Suirokaku Kyoto", guide: "Google Maps 4.5 · 约 1.3 万条评价", fit: "直接承接哲学之道，结束后转往宇治。", official: "https://nanzenji.or.jp/about_rinzaishu/visit" },

  { id: "byodoin", name: "平等院", area: "kyoto", category: "spot", position: [34.8893, 135.8077], dates: ["10.04"], meta: "只看庭园与博物馆", googleQuery: "Byodoin Temple Uji", guide: "Google Maps 4.5 · 约 2.2 万条评价", fit: "宇治最值得保留的核心景点；烟火日不等待凤凰堂内部参观。", official: "https://www.byodoin.or.jp/en/guide/" },
  { id: "uji-river", name: "宇治川 · 朝雾桥", area: "kyoto", category: "spot", position: [34.8917, 135.8101], dates: ["10.04"], meta: "河岸散步", googleQuery: "Asagiri Bridge Uji" },
  { id: "joyo", name: "城阳秋花火", area: "kyoto", category: "spot", position: [34.8445, 135.7972], dates: ["10.04"], meta: "19:00 开始 · JR 长池站步行约 5 分钟", googleQuery: "Kizugawa Athletic Park Joyo Kyoto" },

  { id: "kifune", name: "贵船神社 本宫", area: "kyoto", category: "spot", position: [35.1219, 135.7629], dates: ["10.05"], meta: "不可删除 · 石阶灯笼", googleQuery: "Kifune Shrine Kyoto", guide: "Google Maps 4.5 · 约 1.2 万条评价", fit: "本次旅行的自然与神社硬约束；雨天也改乘巴士直达，不取消。", official: "https://kifunejinja.jp/en/info/" },
  { id: "kifune-okumiya", name: "贵船神社 奥宫", area: "kyoto", category: "spot", position: [35.1262, 135.7621], dates: ["10.05"], meta: "三社参拜 · 林间最深处", googleQuery: "Kifune Shrine Okumiya Kyoto", guide: "Google Maps 4.5 · 约 2,900 条评价", fit: "从本宫沿河缓坡前往，保留完整贵船体验。" },
  { id: "kifune-yui", name: "贵船神社 结社", area: "kyoto", category: "spot", position: [35.1241, 135.7624], dates: ["10.05"], meta: "三社参拜收尾", googleQuery: "Kifune Shrine Yui no Yashiro Kyoto", guide: "Google Maps 4.4 · 约 600 条评价", fit: "奥宫返回本宫方向时顺路停靠，不额外跨区。" },

  { id: "fushimi-inari", name: "伏见稻荷大社 · 千本鸟居", area: "kyoto", category: "spot", position: [34.9671, 135.7727], dates: ["10.06"], meta: "不可删除 · 清晨只走到奥社奉拜所", googleQuery: "Fushimi Inari Taisha Kyoto", guide: "Google Maps 4.6 · 约 8.6 万条评价", fit: "清晨避开主客流，走本殿、千本鸟居与奥社短线；不登稻荷山，之后沿 JR 奈良线去奈良。", official: "https://inari.jp/en/access/" },
  { id: "todaiji", name: "东大寺 · 大佛殿", area: "nara", category: "spot", position: [34.689, 135.8398], dates: ["10.06"], meta: "预留 90–120 分钟", googleQuery: "Todai-ji Daibutsuden Nara", guide: "Google Maps 4.7 · 约 3 万条评价", fit: "奈良不可替代的核心景点，不能压缩成拍照停留。", official: "https://www.todaiji.or.jp/en/information/haikan/" },
  { id: "nigatsudo", name: "二月堂", area: "nara", category: "spot", position: [34.6894, 135.8454], dates: ["10.06"], meta: "东大寺后顺路登高", googleQuery: "Nigatsudo Nara", guide: "Google Maps 4.6 · 约 3,300 条评价", fit: "距离东大寺近，视野与氛围回报高。" },
  { id: "kasuga", name: "春日大社", area: "nara", category: "spot", position: [34.6814, 135.8484], dates: ["10.06"], meta: "石灯笼与林间参道", googleQuery: "Kasuga Taisha Nara", guide: "Google Maps 4.5 · 约 1.5 万条评价", fit: "与奈良公园林间路线连续，结束后坐巴士回站。", official: "https://www.kasugataisha.or.jp/en/about_en/basic/" },
];

export const restaurantPoints: MapPoint[] = [
  { id: "ajinoya", name: "Ajinoya Honten", area: "osaka", category: "restaurant", position: [34.668065, 135.500976], dates: ["09.29", "10.01", "10.06"], meta: "大阪烧 · ¥1,000–2,000", googleQuery: "Namba Okonomiyaki Ajinoya Honten", guide: "Google Maps 4.2 · 3,937 条评价", fit: "道顿堀旁，适合首晚或大阪收尾；热门时段可能排队。", fitLevel: "顺路", official: "https://ajinoya-okonomiyaki.com/" },
  { id: "wanaka", name: "たこ焼道楽わなか 千日前本店", area: "osaka", category: "restaurant", position: [34.66521, 135.503402], dates: ["10.01", "10.06"], meta: "章鱼烧 · ¥1–1,000", googleQuery: "Takoyaki Wanaka Sennichimae Osaka", guide: "Google Maps 4.3 · 4,365 条评价", fit: "电电城走回难波时顺手吃，不占一顿正式正餐。", fitLevel: "顺路", official: "https://takoyaki-wanaka.com/" },
  { id: "rikimaru", name: "焼肉力丸 なんば千日前店", area: "osaka", category: "restaurant", position: [34.6669, 135.5038], dates: ["09.29", "10.01", "10.06"], meta: "烧肉 · ¥4,000–6,000", googleQuery: "Yakiniku Rikimaru Sennichimae Osaka", guide: "Google Maps 4.8 · 16,590 条评价", fit: "难波核心区、评论量大；想轻松吃烧肉时比长套餐更灵活。", fitLevel: "备选", official: "https://handafood.jp/rikimaru/" },
  { id: "mouriya", name: "モーリヤ本店 / Mouriya Honten", area: "kobe", category: "restaurant", position: [34.693119, 135.191193], dates: ["10.02"], meta: "神户牛排 · ¥10,000+", googleQuery: "Mouriya Honten Kobe", guide: "Google Maps 4.6 · 约 1,800 条评价", fit: "北野下坡到三宫后最顺路，作为本次第 2 顿可预约正餐。", fitLevel: "预订型", official: "https://www.mouriya.co.jp/en/head" },
  { id: "katsukura", name: "名代とんかつ かつくら 三条本店", area: "kyoto", category: "restaurant", position: [35.0086, 135.7675], dates: ["10.03", "10.05"], meta: "炸猪排 · ¥2,000–3,000", googleQuery: "Katsukura Tonkatsu Sanjo Main Store", guide: "Google Maps 4.5 · 2,339 条评价", fit: "岚山或贵船回城后的高评论量晚餐备选，不要求长套餐。", fitLevel: "备选", official: "https://www.katsukura.jp/" },
  { id: "maekawa", name: "料理屋まえかわ", area: "kyoto", category: "restaurant", position: [34.99826, 135.767593], dates: ["10.03"], meta: "日本料理 · ¥10,000+", googleQuery: "料理屋まえかわ 京都", guide: "Google Maps 4.7 · 50 条评价", fit: "本次正式餐首选；岚山 14:00 左右结束，入住并休息后赴约。", fitLevel: "预订型", official: "https://ryouriya-maekawa.com/" },
  { id: "nakamura-uji", name: "中村藤吉 平等院店", area: "kyoto", category: "restaurant", position: [34.891473, 135.80664], dates: ["10.04"], meta: "茶餐与甜品 · ¥1,000–2,000", googleQuery: "Nakamura Tokichi Byodoin Uji", guide: "Google Maps 4.3 · 2,352 条评价", fit: "平等院表参道上，去宇治川前休息；排队长就外带。", fitLevel: "顺路", official: "https://www.tokichi.jp/" },
  { id: "mizuya", name: "水谷茶屋", area: "nara", category: "restaurant", position: [34.683491, 135.846791], dates: ["10.06"], meta: "日式简餐 · ¥1,000–2,000", googleQuery: "Mizuya Chaya Nara", guide: "Google Maps 4.7 · 1,244 条评价", fit: "春日大社林间路线旁，景观和顺路程度都很好。", fitLevel: "顺路" },
  { id: "maguro-koya", name: "まぐろ小屋 / Maguro Koya", area: "nara", category: "restaurant", position: [34.68548, 135.828858], dates: ["10.06"], meta: "金枪鱼料理 · ¥2,000–3,000", googleQuery: "Maguro Koya Nara", guide: "Google Maps 4.5 · 1,451 条评价", fit: "靠近近铁奈良站，适合进景区前或返程前吃。", fitLevel: "备选" },
];

const allPoints = [...spots, ...restaurantPoints];
const pointById = new Map(allPoints.map((point) => [point.id, point]));

const daySegments: Record<ItineraryDate, DaySegment[]> = {
  "09.29": [{ label: "难波夜行", note: "机场进城属于跨区域交通，不在这里画箭头。", pointIds: ["shinsaibashi", "dotonbori", "hozenji"] }],
  "09.30": [{ label: "USJ 全天", note: "园内项目顺序随排队时间调整，以 USJ App 为准。", pointIds: ["usj"] }],
  "10.01": [{ label: "大阪南区慢行", note: "10:30 后再开始；任何一站觉得累都可以直接回难波。", pointIds: ["kuromon", "shitennoji", "tennoji-park", "shinsekai", "den-den-town"] }],
  "10.02": [
    { label: "神户山侧", note: "缆车上山、一路向下，不在坡道间来回折返。", pointIds: ["nunobiki", "kitano"] },
    { label: "三宫午餐", note: "Mouriya 建议预约；餐后再向海港移动。", pointIds: ["mouriya"] },
    { label: "神户港", note: "美利坚公园步行到 Harborland，看完日落回大阪。", pointIds: ["meriken", "harborland"] },
  ],
  "10.03": [{ label: "岚山核心 · 不追清单", note: "竹林只短停，天龙寺与河岸才是主体验；不追加猴子公园和小火车。", pointIds: ["arashiyama-bamboo", "tenryuji", "togetsukyo"] }],
  "10.04": [
    { label: "京都东山", note: "哲学之道留足 60–75 分钟，南禅寺结束后直接转往宇治。", pointIds: ["philosopher", "nanzenji"] },
    { label: "宇治", note: "只保留平等院、茶歇与河岸；凤凰堂内部排队过长就跳过。", pointIds: ["byodoin", "nakamura-uji", "uji-river"] },
    { label: "城阳", note: "跨城去 JR 长池不画箭头；16:00 左右抵达会场。", pointIds: ["joyo"] },
  ],
  "10.05": [{ label: "贵船神社三社", note: "贵船神社不可删除；晴雨都走本宫、奥宫、结社，鞍马翻山仅作现场加码。", pointIds: ["kifune", "kifune-okumiya", "kifune-yui"] }],
  "10.06": [
    { label: "京都南 · 伏见", note: "清晨只走到奥社奉拜所，不登稻荷山；之后沿 JR 奈良线继续南下。", pointIds: ["fushimi-inari"] },
    { label: "奈良公园 · 只留核心", note: "大件行李已寄往大阪；春日大社结束后坐巴士回近铁奈良站。", pointIds: ["todaiji", "nigatsudo", "mizuya", "kasuga"] },
  ],
  "10.07": [],
};

const dayTitles: Record<ItineraryDate, string> = {
  "09.29": "抵达大阪 · 只走难波夜线", "09.30": "USJ 全天", "10.01": "USJ 后的轻松大阪", "10.02": "神户山海一日",
  "10.03": "岚山核心与入住京都", "10.04": "哲学之道、宇治与城阳烟火", "10.05": "贵船神社三社", "10.06": "伏见稻荷与奈良后回大阪", "10.07": "难波前往关西机场",
};

const areaBounds: Record<Area, [[number, number], [number, number]]> = {
  kansai: [[34.39, 135.14], [35.16, 135.9]], osaka: [[34.62, 135.4], [34.72, 135.56]], kobe: [[34.66, 135.14], [34.74, 135.22]],
  kyoto: [[34.82, 135.64], [35.15, 135.83]], nara: [[34.67, 135.82], [34.7, 135.86]],
};

const areaLabels: Record<Area, string> = { kansai: "关西全程", osaka: "大阪", kobe: "神户", kyoto: "京都", nara: "奈良" };
const categoryLabels: Record<Category, string> = { all: "全部", spot: "景点", restaurant: "餐厅", stay: "住宿" };
const dateOptions: Array<[DateFilter, string]> = [
  ["all", "全部日期"], ["09.29", "9月29日"], ["09.30", "9月30日"], ["10.01", "10月1日"], ["10.02", "10月2日"],
  ["10.03", "10月3日"], ["10.04", "10月4日"], ["10.05", "10月5日"], ["10.06", "10月6日"], ["10.07", "10月7日"],
];

function googleSearch(query: string) { return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`; }
function googleDirections(origin: string, destination: string, waypoints: string[] = []) {
  const base = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=walking`;
  return waypoints.length ? `${base}&waypoints=${encodeURIComponent(waypoints.join("|"))}` : base;
}
function popupHtml(point: MapPoint) {
  const detail = point.guide ? `<span class="leaflet-popup-guide">${point.guide}</span>` : "";
  const fit = point.fit ? `<p>${point.fit}</p>` : "";
  return `<div class="trip-popup"><strong>${point.name}</strong><small>${point.meta}</small><span class="leaflet-popup-date">日期 ${point.dates.join(" / ")}</span>${detail}${fit}<a href="${googleSearch(point.googleQuery)}" target="_blank" rel="noreferrer">在 Google Maps 查看 ↗</a></div>`;
}
function orderForPoint(date: DateFilter, pointId: string) {
  if (date === "all") return null;
  const orderedSpotIds = daySegments[date]
    .flatMap((segment) => segment.pointIds)
    .filter((id) => pointById.get(id)?.category === "spot");
  const index = orderedSpotIds.indexOf(pointId);
  return index >= 0 ? index + 1 : null;
}

export default function TripMap() {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const markerEntries = useRef<Array<{ marker: Marker; point: MapPoint }>>([]);
  const [category, setCategory] = useState<Category>("all");
  const [area, setArea] = useState<Area>("kansai");
  const [selectedDate, setSelectedDate] = useState<DateFilter>("all");

  function buildIcon(L: typeof import("leaflet"), point: MapPoint, date: DateFilter) {
    const order = point.category === "spot" ? orderForPoint(date, point.id) : null;
    const symbol = point.category === "restaurant" ? "食" : point.category === "stay" ? "住" : order ?? "景";
    return L.divIcon({ className: "trip-marker-wrap", html: `<span class="trip-marker marker-${point.category}${order ? " marker-ordered" : ""}">${symbol}</span>`, iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -15] });
  }

  useEffect(() => {
    let disposed = false;
    async function setupMap() {
      if (!mapElement.current || mapInstance.current) return;
      const L = await import("leaflet");
      if (disposed || !mapElement.current) return;
      leafletRef.current = L;
      const map = L.map(mapElement.current, { zoomControl: true, scrollWheelZoom: true, touchZoom: true, wheelPxPerZoomLevel: 72 });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "&copy; OpenStreetMap contributors" }).addTo(map);
      markerEntries.current = allPoints.map((point) => {
        const marker = L.marker(point.position, { icon: buildIcon(L, point, "all"), title: point.name }).bindPopup(popupHtml(point), { maxWidth: 275 });
        marker.addTo(map);
        return { marker, point };
      });
      map.fitBounds(areaBounds.kansai, { padding: [24, 24] });
      mapInstance.current = map;
      window.setTimeout(() => map.invalidateSize(), 80);
    }
    setupMap();
    return () => { disposed = true; mapInstance.current?.remove(); mapInstance.current = null; leafletRef.current = null; markerEntries.current = []; };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    const L = leafletRef.current;
    if (!map || !L) return;
    const visiblePositions: [number, number][] = [];
    markerEntries.current.forEach(({ marker, point }) => {
      marker.setIcon(buildIcon(L, point, selectedDate));
      const visible = (category === "all" || point.category === category) && (selectedDate === "all" || point.dates.includes(selectedDate));
      if (visible && !map.hasLayer(marker)) marker.addTo(map);
      if (!visible && map.hasLayer(marker)) marker.removeFrom(map);
      if (visible) visiblePositions.push(point.position);
    });
    if (selectedDate !== "all" && visiblePositions.length > 0) map.fitBounds(visiblePositions, { padding: [58, 58], maxZoom: 14 });
  }, [category, selectedDate]);

  function focusArea(nextArea: Area) { setArea(nextArea); mapInstance.current?.fitBounds(areaBounds[nextArea], { padding: [24, 24] }); }
  const visiblePointCount = allPoints.filter((point) => (category === "all" || point.category === category) && (selectedDate === "all" || point.dates.includes(selectedDate))).length;
  const visibleRestaurants = selectedDate === "all" ? restaurantPoints : restaurantPoints.filter((restaurant) => restaurant.dates.includes(selectedDate));
  const selectedSegments = selectedDate === "all" ? [] : daySegments[selectedDate];

  return (
    <div className="real-map-panel">
      <div className="real-map-toolbar">
        <div className="map-control-group" aria-label="地图区域">{Object.entries(areaLabels).map(([key, label]) => <button className={area === key ? "active" : ""} type="button" key={key} onClick={() => focusArea(key as Area)}>{label}</button>)}</div>
        <div className="map-control-group category-controls" aria-label="地图标记筛选">{Object.entries(categoryLabels).map(([key, label]) => <button className={category === key ? "active" : ""} type="button" key={key} onClick={() => setCategory(key as Category)}>{label}</button>)}</div>
      </div>
      <div className="map-date-filter">
        <div className="map-date-heading"><strong>按日期</strong><span aria-live="polite">{selectedDate === "all" ? `全程 · ${visiblePointCount} 个点位` : `${selectedDate} · ${visiblePointCount} 个点位`}</span></div>
        <div className="map-date-scroller" aria-label="地图日期筛选">{dateOptions.map(([value, label]) => <button className={selectedDate === value ? "active" : ""} type="button" key={value} aria-pressed={selectedDate === value} onClick={() => setSelectedDate(value)}><small>{value === "all" ? "全程" : value}</small><span>{label}</span></button>)}</div>
      </div>
      <div className="map-legend real-legend" aria-label="地图图例"><span><i className="real-legend-dot spot-dot" />景点</span><span><i className="real-legend-dot restaurant-dot" />餐厅</span><span><i className="real-legend-dot stay-dot" />住宿</span><span>日期筛选后，景点数字就是当天顺序</span></div>
      <div className="leaflet-map" ref={mapElement} aria-label="关西景点、住宿与餐厅交互地图" />
      <p className="map-disclaimer">底图使用 OpenStreetMap；地图上不再连接节点，区域内顺序改在下方用箭头表达。双指滚动或捏合可缩放地图，点击标记可打开 Google Maps。</p>

      <section className="day-route-detail" aria-label="当天详细行程">
        {selectedDate === "all" ? <div className="day-route-empty"><strong>选择上方某一天</strong><p>即可查看区域内的详细顺序、相邻两点导航，以及当天整段路线的 Google Maps 跳转。</p></div> : (
          <>
            <div className="day-route-header"><div><span>{selectedDate}</span><h3>{dayTitles[selectedDate]}</h3></div><small>箭头本身可以点击，直接打开相邻两点 Google Maps 导航</small></div>
            {selectedSegments.length === 0 ? <p className="day-route-none">返程日不再安排景点，请直接前往关西机场。</p> : selectedSegments.map((segment) => {
              const segmentPoints = segment.pointIds.map((id) => pointById.get(id)).filter((point): point is MapPoint => Boolean(point));
              const wholeRoute = segmentPoints.length > 1 ? googleDirections(segmentPoints[0].googleQuery, segmentPoints.at(-1)!.googleQuery, segmentPoints.slice(1, -1).map((point) => point.googleQuery)) : null;
              return <article className="day-segment" key={segment.label}>
                <div className="day-segment-title"><div><strong>{segment.label}</strong><p>{segment.note}</p></div>{wholeRoute && <a href={wholeRoute} target="_blank" rel="noreferrer">整段路线 ↗</a>}</div>
                <div className="day-flow">{segmentPoints.map((point, index) => <div className="day-flow-step" key={point.id}>
                  <a className={`day-stop stop-${point.category}`} href={googleSearch(point.googleQuery)} target="_blank" rel="noreferrer"><b>{index + 1}</b><span>{point.name}</span><small>{point.meta}</small></a>
                  {index < segmentPoints.length - 1 && <a className="day-arrow" href={googleDirections(point.googleQuery, segmentPoints[index + 1].googleQuery)} target="_blank" rel="noreferrer" aria-label={`从${point.name}前往${segmentPoints[index + 1].name}`}>→<small>两点导航 ↗</small></a>}
                </div>)}</div>
              </article>;
            })}
          </>
        )}
      </section>

      <div className="restaurant-map-heading"><div><p className="eyebrow dark">DINING PINS</p><h3>Google Maps 高评价餐厅</h3></div><p>评分与评价数读取于 2026 年 9 月 2 日；会随 Google Maps 变化。餐厅已按顺路程度分配日期，营业时间和预约仍需出发前复核。</p></div>
      <div className="restaurant-pin-grid">
        {visibleRestaurants.length === 0 && <p className="restaurant-pin-empty">这一天不安排园外或正式餐厅，优先保留机动时间。</p>}
        {visibleRestaurants.map((restaurant) => {
          const fitClass = restaurant.fitLevel === "顺路" ? "best" : restaurant.fitLevel === "预订型" ? "swap" : "detour";
          return <article className="restaurant-pin-card" key={restaurant.id}><div className="restaurant-pin-top"><div className="restaurant-pin-meta"><span>{restaurant.meta}</span><b>建议 {restaurant.dates.join(" / ")}</b></div><em className={`fit-${fitClass}`}>{restaurant.fitLevel}</em></div><h4>{restaurant.name}</h4><strong>{restaurant.guide}</strong><p>{restaurant.fit}</p><div className="restaurant-pin-links"><a href={googleSearch(restaurant.googleQuery)} target="_blank" rel="noreferrer">Google Maps ↗</a>{restaurant.official && <a href={restaurant.official} target="_blank" rel="noreferrer">官方 / 预约 ↗</a>}</div></article>;
        })}
      </div>
    </div>
  );
}
