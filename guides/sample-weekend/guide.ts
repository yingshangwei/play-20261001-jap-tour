import { defineDayJournal, defineTravelGuide, transitKey } from "@/app/guide-core/defineGuide";
import type { HomePageConfig, JourneyConfig, TransitLeg } from "@/app/guide-core/types";

const sampleTransit: TransitLeg = {
  id: transitKey("day-1", "central-station", "city-garden"),
  dayId: "day-1",
  fromPlaceId: "central-station",
  toPlaceId: "city-garden",
  kind: "步行",
  suggestedTime: "10:00",
  duration: "约 20 分钟",
  route: "从车站沿主街步行到城市庭园。",
  fallback: "下雨时改乘一站公共交通。",
  departurePlan: "城市中央站｜10:00 出发",
  arrivalPlan: "城市庭园｜约 10:20 到达",
  stayPlan: "散步约 90 分钟",
  timingStatus: "预计时间",
};

const sampleJourney: JourneyConfig = {
  presentation: {
    eyebrow: "PLAY THE WEEKEND",
    titleLines: ["一日示例，", "验证同一套旅程播放器。"],
    description: "这是一份最小攻略配置，用来确认通用组件不会依赖关西专有数据。",
    phaseUnit: "个阶段",
    phaseSuffix: "按日播放",
    map: { center: [35.695, 139.765], zoom: 12, ariaLabel: "示例旅程地图", note: "路线仅用于配置能力演示" },
    labels: {
      allDaysCode: "ALL", allDays: "一日全程", daySelectorAriaLabel: "选择日期", progress: "全程进度",
      stepSelectorAriaLabel: "选择动画阶段", day: "DAY", step: "STEP", departure: "从哪里 / 何时出发",
      arrival: "预计几点到", stay: "到达后停留", route: "怎么走", navigation: "打开地图导航 ↗",
      controlsAriaLabel: "动画播放控制", previousAriaLabel: "上一步", nextAriaLabel: "下一步", play: "播放",
      pause: "暂停", replay: "重新播放", speedAriaLabel: "播放速度", nearbyStepsAriaLabel: "当前阶段前后步骤", unknownTime: "待定",
    },
  },
  supplementalPlaces: [],
  beforeSteps: [],
  afterSteps: [],
  placeholderLabels: { byPlaceId: {}, byCategory: {} },
  transitIcons: { 步行: "→", 铁路: "▤", "铁路＋巴士": "▣", "缆车＋步行": "↟" },
};

const sampleHome: HomePageConfig = {
  metadata: {
    title: "一日城市周末｜配置示例",
    description: "用于验证多攻略路由、通用首页、旅程播放器和第二种手账模板的最小示例攻略。",
    image: { src: "/og.png", width: 1731, height: 909, alt: "一日城市周末配置示例" },
  },
  navigation: {
    ariaLabel: "页面导航", brandMark: "例", brand: "SAMPLE WEEKEND", homeAriaLabel: "返回顶部",
    links: [{ label: "旅程动画", href: "#journey" }, { label: "线路地图", href: "#map" }, { label: "逐日路线", href: "#route" }],
  },
  hero: {
    eyebrow: "CONFIGURATION SAMPLE", titleLines: ["一日城市周末，", "同一框架的第二份攻略。"],
    description: "不改通用组件，只替换攻略清单、点位、交通、首页和手账配置。",
    cta: { label: "查看路线", href: "#route" }, dateRange: "11.01", sunLabel: "例",
  },
  overview: {
    ariaLabel: "行程概览",
    items: [{ label: "住宿节奏", value: "一日往返" }, { label: "路线基调", value: "城市散步" }, { label: "固定锚点", value: "车站 · 庭园" }],
  },
  luggage: {
    eyebrow: "LIGHT PACK", note: "无需换宿", titleLines: ["只带随身包，", "把示例走轻。"],
    description: "示例攻略不涉及大件行李转运。",
    items: [{ date: "11.01", label: "一日往返", title: "行李留在出发地", body: "仅携带当日用品。", href: "#route", cta: "查看路线" }],
  },
  mapSection: { eyebrow: "ROUTE MAP", note: "由相同地图模型渲染", titleLines: ["两个点位，", "一段清晰路线。"] },
  itinerary: {
    eyebrow: "THE ROUTE", note: "示例日期", titleLines: ["从中央站，", "步行到城市庭园。"],
    items: [{
      date: "day-1", day: "周日", city: "示例城市", stay: "—", title: "用一条路线验证通用框架",
      route: "城市中央站 → 城市庭园", rhythm: "常规作息 · 10:00 出发", schedule: "10:00 出发 · 10:20 到达",
      note: "路线内容刻意保持最小，只用于验证第二份攻略无需修改通用组件。", transit: "全程步行约 20 分钟", tone: "city",
    }],
    journalPaths: { "day-1": "/guides/sample-weekend/days/day-1" },
    labels: { stay: "住", luggage: "行李", rhythm: "作息", schedule: "建议时间", transit: "交通摘要", journal: "打开第 {dayNumber} 天手账" },
  },
  reference: {
    id: "reference", eyebrow: "CONFIG CHECK", note: "第二份攻略", titleLines: ["不是关西副本，", "而是最小能力验证。"],
    description: "点位、路线、动画和页面内容全部来自独立配置。", items: [],
  },
  feature: {
    id: "feature", eyebrow: "ONE ANCHOR", titleLines: ["城市庭园，", "是这份示例的锚点。"],
    description: "单一专题也能使用相同首页结构。", date: "day-1", stats: [{ value: "1", label: "日" }, { value: "2", label: "个点位" }],
    link: { label: "返回路线", href: "#route" },
  },
  booking: {
    id: "book", eyebrow: "BOOK FIRST", note: "无需预订", titleLines: ["先确认天气，", "再轻装出发。"],
    items: [{ number: "01", urgency: "出发前", title: "查看天气", body: "示例不包含真实预订动作。", meta: "按当天情况调整", href: "#route", cta: "查看路线" }],
  },
  dining: {
    id: "eat", eyebrow: "DINING", titleLines: ["餐厅留空，", "验证可选章节数据。"], description: "最小示例没有餐厅候选。",
    summaryAriaLabel: "餐厅摘要", summary: [{ value: "0", label: "家候选" }],
    labels: { when: "适合哪天", price: "价格预算", rating: "评分评价", party: "同行人数", reservation: "预约要求", feature: "特色", caution: "怎么判断", map: "地图", michelin: "指南", review: "评价", booking: "预约" },
    items: [],
  },
  detours: { eyebrow: "DETOURS", titleLines: ["不加绕路。"], description: "最小路线保持直接。", items: [] },
  practical: { eyebrow: "GOOD TO KNOW", titleLines: ["只记一件事。"], items: [{ title: "节奏", body: "用短路线验证框架，不把示例写成真实攻略。" }] },
  sources: { eyebrow: "LINKS", titleLines: ["示例无需外部来源。"], links: [] },
  footer: { brandMark: "例", brand: "SAMPLE WEEKEND", message: "同一套框架，第二份配置。", backToTop: { label: "回到顶部 ↑", href: "#top" } },
};

const sampleJournal = defineDayJournal({
  schemaVersion: 1,
  id: "day-1",
  guideId: "sample-weekend",
  date: "2026-11-01",
  dayNumber: 1,
  weekday: "周日",
  metadata: { title: "一日城市周末手账｜配置示例", description: "第二种紧凑手账模板的最小示例。" },
  navigation: { ariaLabel: "手账导航", backLabel: "返回示例攻略", badge: "COMPACT TEMPLATE" },
  labels: { statsAriaLabel: "行程摘要", estimatedTiming: "预计时间", partiallyVerifiedTiming: "部分核实", hasAlternative: "有备选", recommendationSource: "查看来源", recommendationMap: "打开地图" },
  presentation: { template: "compact-journal" },
  hero: { kicker: "DAY 01 · SAMPLE", titleLines: ["一日城市周末", "紧凑手账"], lead: "同一份领域模型可以切换到更简洁的模板。", stats: [{ value: "1", label: "段路线" }, { value: "20", label: "分钟步行" }] },
  route: { label: "ROUTE", summary: "城市中央站 → 城市庭园" },
  sections: [{ kind: "notes", id: "notes", eyebrow: "NOTES", titleLines: ["模板验证说明"], items: [{ label: "目的", body: "确认新增攻略与模板时不需要修改既有攻略组件。" }] }],
  footer: { badge: "SAMPLE", message: "紧凑模板验证完成。", backLabel: "返回示例攻略" },
});

export const sampleWeekendGuide = defineTravelGuide({
  schemaVersion: 1,
  id: "sample-weekend",
  slug: "sample-weekend",
  locale: "zh-CN",
  timezone: "Asia/Tokyo",
  title: "一日城市周末｜配置示例",
  description: "用于验证通用旅行攻略框架的最小示例。",
  map: {
    defaultAreaId: "sample-city",
    ariaLabel: "示例地图区域",
    transitAuditNote: "示例交通只用于架构校验。",
    diningNote: "本示例没有餐厅候选。",
    areas: [{ id: "sample-city", label: "示例城市", bounds: [[35.66, 139.73], [35.73, 139.8]] }],
  },
  places: [
    { id: "central-station", name: "城市中央站", area: "sample-city", category: "spot", position: [35.6812, 139.7671], dates: ["day-1"], meta: "出发点", googleQuery: "Tokyo Station" },
    { id: "city-garden", name: "城市庭园", area: "sample-city", category: "spot", position: [35.7148, 139.7731], dates: ["day-1"], meta: "散步终点", googleQuery: "Ueno Park" },
  ],
  days: [{
    id: "day-1", date: "2026-11-01", dayNumber: 1, shortLabel: "11.01", filterLabel: "11月1日", weekday: "周日", areaLabel: "城市散步", title: "中央站到城市庭园",
    segments: [{ id: "sample-walk", label: "城市散步", note: "最小示例路线。", pointIds: ["central-station", "city-garden"], mode: "walking", drawOnMap: true }],
  }],
  transitLegs: [sampleTransit],
  journey: sampleJourney,
  home: sampleHome,
  journalDays: [sampleJournal],
});
