"use client";

import { useEffect, useRef, useState } from "react";
import type { LayerGroup, Map as LeafletMap, Marker } from "leaflet";
import { getTransitLeg } from "./transitData";

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

type TransportMode = "walking" | "transit";
type DaySegment = { label: string; note: string; pointIds: string[]; mode: TransportMode; drawOnMap?: boolean };

const ROUTE_ARROW_MIN_ZOOM = 12;

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
  "09.29": [
    { label: "机场进城", note: "抵达日从关西机场前往大阪住宿；这是跨区域交通，不在地图上画箭头。", pointIds: ["kix", "osaka-stay"], mode: "transit" },
    { label: "难波夜行 · 回到住宿", note: "住宿点目前是难波／心斋桥区域中心，实际酒店确定后再校准首尾步行距离。", pointIds: ["osaka-stay", "shinsaibashi", "dotonbori", "hozenji", "osaka-stay"], mode: "walking", drawOnMap: true },
  ],
  "09.30": [{ label: "住宿往返 USJ", note: "从大阪住宿出发，闭园后回到同一住宿；园内项目顺序随排队时间调整，以 USJ App 为准。", pointIds: ["osaka-stay", "usj", "osaka-stay"], mode: "transit" }],
  "10.01": [{ label: "大阪南区慢行 · 住宿闭环", note: "10:30 后再开始；わなか作为回难波途中的顺路小吃，任何一站觉得累都可以提前回住宿。", pointIds: ["osaka-stay", "kuromon", "shitennoji", "tennoji-park", "shinsekai", "den-den-town", "wanaka", "osaka-stay"], mode: "walking", drawOnMap: true }],
  "10.02": [
    { label: "大阪前往神户", note: "从大阪住宿出发前往布引；跨城段只提供公共交通导航，不画地图箭头。", pointIds: ["osaka-stay", "nunobiki"], mode: "transit" },
    { label: "神户山海顺行", note: "缆车上山后一路向下，经北野与 Mouriya 午餐走向港区，不在坡道间来回折返。", pointIds: ["nunobiki", "kitano", "mouriya", "meriken", "harborland"], mode: "walking", drawOnMap: true },
    { label: "神户返回大阪", note: "看完日落后返回大阪住宿，形成完整住宿往返。", pointIds: ["harborland", "osaka-stay"], mode: "transit" },
  ],
  "10.03": [
    { label: "大阪退房 → 岚山", note: "移动日从大阪住宿退房后前往岚山，大件行李已提前寄往京都。", pointIds: ["osaka-stay", "arashiyama-bamboo"], mode: "transit" },
    { label: "岚山核心 · 不追清单", note: "竹林只短停，天龙寺与河岸才是主体验；不追加猴子公园和小火车。", pointIds: ["arashiyama-bamboo", "tenryuji", "togetsukyo"], mode: "walking", drawOnMap: true },
    { label: "岚山 → 京都住宿", note: "游览结束后先入住京都站附近住宿并休息。", pointIds: ["togetsukyo", "kyoto-stay"], mode: "transit" },
    { label: "京都晚餐后回住宿", note: "料理屋まえかわ是正式晚餐首选；酒店地址未定，暂不在地图上画住宿连线。", pointIds: ["kyoto-stay", "maekawa", "kyoto-stay"], mode: "transit" },
  ],
  "10.04": [
    { label: "住宿 → 京都东山", note: "从京都住宿前往哲学之道；酒店只是区域中心点，因此只提供公共交通导航。", pointIds: ["kyoto-stay", "philosopher"], mode: "transit" },
    { label: "京都东山", note: "哲学之道留足 60–75 分钟，南禅寺结束后直接转往宇治。", pointIds: ["philosopher", "nanzenji"], mode: "walking", drawOnMap: true },
    { label: "东山 → 宇治", note: "跨片区转往宇治，不在地图上用长线连接。", pointIds: ["nanzenji", "byodoin"], mode: "transit" },
    { label: "宇治", note: "只保留平等院、茶歇与河岸；凤凰堂内部排队过长就跳过。", pointIds: ["byodoin", "nakamura-uji", "uji-river"], mode: "walking", drawOnMap: true },
    { label: "城阳烟火 → 返回住宿", note: "从宇治前往 JR 长池，16:00 左右抵达会场；烟火散场后回京都住宿。", pointIds: ["uji-river", "joyo", "kyoto-stay"], mode: "transit" },
  ],
  "10.05": [
    { label: "住宿 → 贵船", note: "从京都住宿搭铁路与巴士前往贵船；跨区域段不画地图箭头。", pointIds: ["kyoto-stay", "kifune"], mode: "transit" },
    { label: "贵船神社三社", note: "贵船神社不可删除；晴雨都走本宫、奥宫、结社，鞍马翻山仅作现场加码。", pointIds: ["kifune", "kifune-okumiya", "kifune-yui"], mode: "walking", drawOnMap: true },
    { label: "贵船 → 返回住宿", note: "午餐和河畔休息后原路返回京都住宿。", pointIds: ["kifune-yui", "kyoto-stay"], mode: "transit" },
  ],
  "10.06": [
    { label: "京都退房 → 伏见", note: "从京都住宿退房后清晨前往伏见稻荷；大件行李已提前寄往大阪。", pointIds: ["kyoto-stay", "fushimi-inari"], mode: "transit" },
    { label: "伏见 → 奈良", note: "伏见只走到奥社奉拜所、不登稻荷山，随后沿 JR 奈良线继续南下。", pointIds: ["fushimi-inari", "todaiji"], mode: "transit" },
    { label: "奈良公园 · 只留核心", note: "东大寺、二月堂、林间午餐和春日大社连续步行；结束后坐巴士回近铁奈良站。", pointIds: ["todaiji", "nigatsudo", "mizuya", "kasuga"], mode: "walking", drawOnMap: true },
    { label: "奈良 → 大阪住宿", note: "傍晚返回大阪并入住，移动日从京都住宿开始、以大阪住宿结束。", pointIds: ["kasuga", "osaka-stay"], mode: "transit" },
  ],
  "10.07": [{ label: "住宿 → 关西机场", note: "从大阪住宿出发，约 09:00 抵达关西机场。", pointIds: ["osaka-stay", "kix"], mode: "transit" }],
};

const missingTransitLegs = Object.entries(daySegments).flatMap(([date, segments]) => segments.flatMap((segment) => segment.pointIds.slice(0, -1).flatMap((fromId, index) => {
  const toId = segment.pointIds[index + 1];
  return getTransitLeg(date, fromId, toId) ? [] : [`${date}:${fromId}>${toId}`];
})));
if (missingTransitLegs.length > 0) throw new Error(`Missing transit details: ${missingTransitLegs.join(", ")}`);

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
function googleDirections(origin: string, destination: string, waypoints: string[] = [], mode: TransportMode = "walking") {
  const base = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${mode}`;
  return waypoints.length ? `${base}&waypoints=${encodeURIComponent(waypoints.join("|"))}` : base;
}
function popupHtml(point: MapPoint) {
  const detail = point.guide ? `<span class="leaflet-popup-guide">${point.guide}</span>` : "";
  const fit = point.fit ? `<p>${point.fit}</p>` : "";
  return `<div class="trip-popup"><strong>${point.name}</strong><small>${point.meta}</small><span class="leaflet-popup-date">日期 ${point.dates.join(" / ")}</span>${detail}${fit}<a href="${googleSearch(point.googleQuery)}" target="_blank" rel="noreferrer">在 Google Maps 查看 ↗</a></div>`;
}
function orderForPoint(date: DateFilter, pointId: string) {
  if (date === "all") return null;
  const orderedPointIds = daySegments[date]
    .flatMap((segment) => segment.pointIds)
    .filter((id, index, ids) => pointById.get(id)?.category !== "stay" && ids.indexOf(id) === index);
  const index = orderedPointIds.indexOf(pointId);
  return index >= 0 ? index + 1 : null;
}

export default function TripMap() {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const markerEntries = useRef<Array<{ marker: Marker; point: MapPoint }>>([]);
  const arrowLayer = useRef<LayerGroup | null>(null);
  const [category, setCategory] = useState<Category>("all");
  const [area, setArea] = useState<Area>("kansai");
  const [selectedDate, setSelectedDate] = useState<DateFilter>("all");
  const [arrowState, setArrowState] = useState<"idle" | "zoom" | "visible">("idle");

  function buildIcon(L: typeof import("leaflet"), point: MapPoint, date: DateFilter) {
    const order = point.category === "stay" ? null : orderForPoint(date, point.id);
    const symbol = point.category === "stay" ? "住" : order ?? (point.category === "restaurant" ? "食" : "景");
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
      const routeArrowPane = map.createPane("routeArrowPane");
      routeArrowPane.style.zIndex = "590";
      routeArrowPane.style.pointerEvents = "none";
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "&copy; OpenStreetMap contributors" }).addTo(map);
      arrowLayer.current = L.layerGroup().addTo(map);
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
    return () => { disposed = true; mapInstance.current?.remove(); mapInstance.current = null; leafletRef.current = null; markerEntries.current = []; arrowLayer.current = null; };
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

  useEffect(() => {
    const map = mapInstance.current;
    const L = leafletRef.current;
    const layer = arrowLayer.current;
    if (!map || !L || !layer) return;

    function redrawRouteArrows() {
      layer.clearLayers();
      if (selectedDate === "all") {
        setArrowState("idle");
        return;
      }
      if (map.getZoom() < ROUTE_ARROW_MIN_ZOOM) {
        setArrowState("zoom");
        return;
      }

      let arrowCount = 0;
      const viewport = map.getBounds().pad(0.18);
      daySegments[selectedDate].filter((segment) => segment.drawOnMap).forEach((segment, segmentIndex) => {
        const segmentPoints = segment.pointIds.map((id) => pointById.get(id)).filter((point): point is MapPoint => Boolean(point));
        segmentPoints.slice(0, -1).forEach((point, pointIndex) => {
          const nextPoint = segmentPoints[pointIndex + 1];
          const categoryMatches = (candidate: MapPoint) => category === "all" || candidate.category === category;
          if (!categoryMatches(point) || !categoryMatches(nextPoint)) return;
          if (!viewport.contains(point.position) || !viewport.contains(nextPoint.position)) return;

          const start = map.latLngToContainerPoint(point.position);
          const end = map.latLngToContainerPoint(nextPoint.position);
          const distance = start.distanceTo(end);
          if (distance < 34) return;

          const width = Math.min(Math.max(distance + 50, 84), 1100);
          const height = 76;
          const centerPoint = L.point((start.x + end.x) / 2, (start.y + end.y) / 2);
          const center = map.containerPointToLatLng(centerPoint);
          const rotation = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
          const bend = (segmentIndex + pointIndex) % 2 === 0 ? 15 : -15;
          const markerId = `route-arrow-${selectedDate.replace(".", "-")}-${segmentIndex}-${pointIndex}`;
          const path = `M 23 38 Q ${Math.round(width / 2)} ${38 + bend} ${width - 27} 38`;
          const html = `<svg class="trip-route-arrow" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="transform:rotate(${rotation}deg)" aria-hidden="true"><defs><marker id="${markerId}" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="9" markerHeight="9" orient="auto"><path d="M 0 0 L 12 6 L 0 12 Z" /></marker></defs><path class="trip-route-arrow-halo" d="${path}"/><path class="trip-route-arrow-stroke" d="${path}" marker-end="url(#${markerId})"/></svg>`;
          const icon = L.divIcon({ className: "trip-route-arrow-wrap", html, iconSize: [width, height], iconAnchor: [width / 2, height / 2] });
          L.marker(center, { icon, interactive: false, keyboard: false, pane: "routeArrowPane" }).addTo(layer);
          arrowCount += 1;
        });
      });
      setArrowState(arrowCount > 0 ? "visible" : "zoom");
    }

    redrawRouteArrows();
    map.on("zoomend moveend resize", redrawRouteArrows);
    return () => { map.off("zoomend moveend resize", redrawRouteArrows); layer.clearLayers(); };
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
      <div className="map-legend real-legend" aria-label="地图图例"><span><i className="real-legend-dot spot-dot" />景点</span><span><i className="real-legend-dot restaurant-dot" />餐厅</span><span><i className="real-legend-dot stay-dot" />住宿</span><span>日期筛选后，行程内景点和餐厅按顺序编号</span><span className={`map-arrow-state state-${arrowState}`}>{arrowState === "idle" ? "选中某天后显示片区箭头" : arrowState === "visible" ? "片区箭头已显示" : "继续放大到片区查看箭头"}</span></div>
      <div className="leaflet-map" ref={mapElement} aria-label="关西景点、住宿与餐厅交互地图" />
      <p className="map-disclaimer">底图使用 OpenStreetMap；选中某天并放大到片区后，粗黑弧形箭头表示当天区域内的游览顺序。跨城交通不画长线，住宿首尾和每一段真实导航都在下方列出。双指滚动或捏合可缩放地图，点击标记可打开 Google Maps。</p>

      <section className="day-route-detail" aria-label="当天详细行程">
        {selectedDate === "all" ? <div className="day-route-empty"><strong>选择上方某一天</strong><p>即可查看当天每一次地点更换的推荐方式、线路、建议时间、首末班约束与无法乘坐时的备用方案。</p></div> : (
          <>
            <div className="day-route-header"><div><span>{selectedDate}</span><h3>{dayTitles[selectedDate]}</h3></div><small>每一段都可打开 Google Maps；公共交通卡另附运营方时刻入口</small></div>
            <div className="transit-audit-note">
              <strong>班次核对说明</strong>
              <p>时刻资料核对于 2026-09-02。酒店地址尚未锁定，住宿相关步行与接驳时间均为区域估算；临时停运、活动加开车与 10 月换季时刻仍需在出发前两周及当天复查。</p>
            </div>
            {selectedSegments.map((segment) => {
              const segmentPoints = segment.pointIds.map((id) => pointById.get(id)).filter((point): point is MapPoint => Boolean(point));
              const segmentLegs = segmentPoints.slice(0, -1).map((from, index) => ({
                from,
                to: segmentPoints[index + 1],
                detail: getTransitLeg(selectedDate, from.id, segmentPoints[index + 1].id),
              }));
              const isClosedTransitLoop = segment.mode === "transit" && segmentPoints[0]?.id === segmentPoints.at(-1)?.id;
              const wholeRoute = segmentPoints.length > 1 && !isClosedTransitLoop ? googleDirections(segmentPoints[0].googleQuery, segmentPoints.at(-1)!.googleQuery, segmentPoints.slice(1, -1).map((point) => point.googleQuery), segment.mode) : null;
              return <article className="day-segment" key={segment.label}>
                <div className="day-segment-title"><div><strong>{segment.label}</strong><p>{segment.note}</p></div><div className="day-segment-actions"><span>{segmentLegs.length} 段交通</span>{wholeRoute && <a href={wholeRoute} target="_blank" rel="noreferrer">整段路线 ↗</a>}</div></div>
                <div className="day-flow">{segmentPoints.map((point, index) => <div className="day-flow-step" key={point.id}>
                  <a className={`day-stop stop-${point.category}`} href={googleSearch(point.googleQuery)} target="_blank" rel="noreferrer"><b>{point.category === "stay" ? "住" : orderForPoint(selectedDate, point.id) ?? index + 1}</b><span>{point.name}</span><small>{point.meta}</small></a>
                  {index < segmentPoints.length - 1 && <a className={`day-arrow mode-${segment.mode}`} href={googleDirections(point.googleQuery, segmentPoints[index + 1].googleQuery, [], segment.mode)} target="_blank" rel="noreferrer" aria-label={`从${point.name}前往${segmentPoints[index + 1].name}`}>→<small>{segment.mode === "walking" ? "步行导航" : "公共交通"} ↗</small></a>}
                </div>)}</div>
                <div className="day-leg-grid">
                  {segmentLegs.map(({ from, to, detail }, index) => {
                    const directionsMode = detail?.kind === "步行" ? "walking" : "transit";
                    return <div className={`day-leg-card ${detail?.kind === "步行" ? "leg-walk" : "leg-transit"}`} key={`${from.id}-${to.id}`}>
                      <div className="day-leg-heading">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <strong>{from.name} <i>→</i> {to.name}</strong>
                        <em>{detail?.kind ?? "待补"}</em>
                      </div>
                      {detail ? <>
                        <div className="day-leg-facts"><span><b>建议</b>{detail.suggestedTime}</span><span><b>耗时</b>{detail.duration}</span></div>
                        <p className="day-leg-route"><b>怎么走</b>{detail.route}</p>
                        {detail.serviceBoundary && <p className={`day-leg-boundary boundary-${detail.serviceBoundary.label === "最晚班次" ? "last" : detail.serviceBoundary.label === "最早班次" ? "first" : "reference"}`}><b>{detail.serviceBoundary.label}</b>{detail.serviceBoundary.detail}</p>}
                        <p className="day-leg-fallback"><b>无法乘坐 / 行走</b>{detail.fallback}</p>
                        <div className="day-leg-links">
                          <a href={googleDirections(from.googleQuery, to.googleQuery, [], directionsMode)} target="_blank" rel="noreferrer">Google Maps 导航 ↗</a>
                          {detail.sources?.map((source) => <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.label} ↗</a>)}
                        </div>
                      </> : <p className="day-leg-missing">这段交通资料缺失，请暂时使用 Google Maps 导航并在出发前核对。</p>}
                    </div>;
                  })}
                </div>
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
