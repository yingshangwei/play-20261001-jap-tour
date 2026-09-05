import { defineDayJournal } from "@/app/guide-core/defineGuide";
import { googleMapsSearch } from "@/app/guide-core/links";
import type { DayJournalSource, DayJournalTimelineItem } from "@/app/guide-core/types";
import plan from "./day-1.plan.geo.json";

type LegacyTimelineItem = {
  t: string;
  what: string;
  kind: DayJournalTimelineItem["kind"];
  note?: string;
  price?: string;
  tag?: string;
  verify?: "verified" | "est";
  link?: string;
};

const legacyDay = plan.days[0] as Omit<(typeof plan.days)[number], "timeline"> & {
  timeline: LegacyTimelineItem[];
};

const timeline: DayJournalTimelineItem[] = legacyDay.timeline.map((item) => ({
  time: item.t,
  title: item.what,
  kind: item.kind,
  note: item.note,
  price: item.price,
  hasAlternative: item.tag?.startsWith("swap"),
  timingStatus: item.verify === "est" ? "estimated" : item.verify === "verified" ? "verified" : undefined,
  href: item.link,
}));

const sources: DayJournalSource[] = plan.sources.map((source) => ({
  title: source.title,
  href: source.url,
  checkedAt: source.as_of,
}));

export const kansaiDayOneJournal = defineDayJournal({
  schemaVersion: 1,
  id: "2026-09-29",
  guideId: "kansai-2026",
  date: "2026-09-29",
  dayNumber: 1,
  weekday: "TUE",
  metadata: {
    title: "第一夜，大阪｜关西 2026 Day 1",
    description: "2026 年 9 月 29 日关西机场抵达、难波入住、心斋桥、道顿堀与法善寺横丁的小时级手账行程。",
  },
  navigation: {
    ariaLabel: "第一天页面导航",
    backLabel: "返回九日总行程",
    badge: "DAY 01 · 2026.09.29 · TUE",
  },
  labels: {
    statsAriaLabel: "当天关键数据",
    estimatedTiming: "时间为估算",
    partiallyVerifiedTiming: "部分核实",
    hasAlternative: "有备选",
    recommendationSource: "资料 / 官方",
    recommendationMap: "地图",
  },
  presentation: {
    template: "hand-journal",
  },
  hero: {
    kicker: "KIX → NAMBA → DOTONBORI",
    titleLines: ["第一夜，", "大阪。"],
    lead: "不追一班必须赶上的车，也不把大阪第一印象塞进队伍里。落地、放下行李，沿着心斋桥的屋顶慢慢走到霓虹和石板路。",
    stats: [
      { value: "14:00", label: "落地" },
      { value: "21:05", label: "收工" },
      { value: "≈3.4 km", label: "步行" },
      { value: "0", label: "预约项目" },
    ],
    footnote: legacyDay.sun,
  },
  route: {
    label: "今日路线",
    summary: plan.meta.route,
  },
  primaryRule: {
    ariaLabel: "最重要的到达日规则",
    eyebrow: "ARRIVAL RULE",
    title: "南海电铁不要预先锁死班次。",
    body: "出关后比较下一班 Rapi:t 与空港急行：前者最快约 34 分钟，后者约 45 分钟。谁先走、衔接舒服就坐谁。",
    href: "https://www.nankai.co.jp/en_railway/access-timetable",
    linkLabel: "打开南海官方时刻表",
  },
  sections: [
    {
      kind: "timeline",
      id: "schedule",
      eyebrow: "HOUR BY HOUR",
      titleLines: ["落地以后，", "把节奏放慢。"],
      aside: { label: "晚点 > 1 小时", body: legacyDay.late_cut },
      items: timeline,
    },
    {
      kind: "recommendations",
      id: "food",
      eyebrow: "SEARCHED FOR THIS NIGHT",
      titleLines: ["不建偏好库，", "只给今晚能用的选择。"],
      note: "联网资料核对于 2026-09-02；营业时间出发前两天复查。",
      items: [
        {
          label: "首选 · 飞行后友好",
          name: "道顿堀 今井 本店",
          order: "狐狸乌冬 / 亲子丼",
          reason: "热汤、坐下来吃、离道顿堀主线近。当前公示周二营业，价格约 ¥1,000–1,999。",
          caution: "若现场排队超过 30 分钟就切换，不把第一晚耗在队伍里。",
          sourceHref: "https://tabelog.com/en/osaka/A2701/A270202/27001289/",
          mapHref: googleMapsSearch("Dotonbori Imai Honten Osaka"),
        },
        {
          label: "备选 · 快速大阪味",
          name: "たこ焼道楽 わなか 千日前本店",
          order: "おおいり / 经典章鱼烧",
          reason: "从南海难波步行约 4 分钟，不接受预约，适合看队伍临场决定。",
          caution: "营业时间会调整；当前资料显示多以现金结算，出发前再看官网。",
          sourceHref: "https://takoyaki-wanaka.com/",
          mapHref: googleMapsSearch("Takoyaki Wanaka Sennichimae Osaka"),
        },
        {
          label: "想吃大阪烧才选",
          name: "味乃家 本店",
          order: "味乃家 MIX / 炒面",
          reason: "1965 年创店，Tabelog 大阪烧百名店；周二当前公示 11:00–22:00。",
          caution: "常见长队。只有等候不超过 30 分钟、体力仍好时再选。",
          sourceHref: "https://ajinoya-okonomiyaki.com/en/",
          mapHref: googleMapsSearch("Ajinoya Honten Osaka"),
        },
      ],
    },
    {
      kind: "notes",
      id: "contingency",
      eyebrow: "PLAN B",
      titleLines: ["天气和航班，", "都留了后路。"],
      items: [
        { label: "雨天", body: legacyDay.rain_alt },
        { label: "航班晚点", body: legacyDay.late_cut },
        { label: "酒店未定", body: "当前按难波 / 心斋桥住宿区估算。订房后，更新攻略配置的酒店坐标并重新生成地图链接。" },
      ],
    },
    {
      kind: "links",
      id: "map",
      eyebrow: "POCKET MAP",
      titleLines: ["路上只点链接，", "不用重新搜地名。"],
      note: "KML 可导入 Organic Maps；Google Maps 离线区域不支持离线公交换乘。",
      items: [
        { label: "01 · 关西机场", href: googleMapsSearch("Kansai International Airport") },
        { label: "02 · 南海难波", href: googleMapsSearch("Nankai Namba Station") },
        { label: "03 · 心斋桥筋", href: googleMapsSearch("Shinsaibashi-suji Shopping Street") },
        { label: "04 · 道顿堀", href: googleMapsSearch("Dotonbori Osaka") },
        { label: "05 · 法善寺横丁", href: googleMapsSearch("Hozenji Yokocho Osaka") },
        { label: "下载 Day 1 离线 KML", href: "/downloads/day-1-osaka.kml", download: true },
      ],
    },
    {
      kind: "sources",
      id: "sources",
      title: "核对记录与直接来源",
      summary: "9 月 29 日不是日本法定节假日。路线没有售票景点；法善寺横丁店铺营业日各异，街巷本身无需预约。所有列车分钟数都按范围表达，精确班次以落地出关后的官方信息为准。",
      items: sources,
    },
  ],
  footer: {
    badge: "DAY 01 / 09.29",
    message: "回房补水，整理 USJ 随身包。大阪的第一晚，到这里就够了。",
    backLabel: "回到九日总行程",
  },
});
