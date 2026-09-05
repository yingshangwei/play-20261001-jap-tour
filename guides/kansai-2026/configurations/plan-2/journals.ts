import { defineDayJournal, transitKey } from "@/app/guide-core/defineGuide";
import { googleMapsDirections } from "@/app/guide-core/links";
import type { DayJournalConfig } from "@/app/guide-core/types";
import { kansaiDayOneJournal } from "../../journals/day-1";
import { kansaiDayTwoJournal } from "../../journals/day-2";
import { planTwoDays } from "./days";
import { planTwoHome } from "./home";
import { planTwoPlaces } from "./places";
import { planTwoTransit } from "./transit";

const guideId = "kansai-2026-plan-2";
const placeById = new Map(planTwoPlaces.map((place) => [place.id, place]));
const legById = new Map(planTwoTransit.map((leg) => [leg.id, leg]));

// Derive the compact journals from the same route and timing data used by the map.
export const planTwoJournals: DayJournalConfig[] = planTwoDays.map((day, index) => {
  const detailed = index === 0 ? kansaiDayOneJournal : index === 1 ? kansaiDayTwoJournal : undefined;
  if (detailed) return defineDayJournal({ ...detailed, guideId, navigation: { ...detailed.navigation, backLabel: "返回配置 2 总行程" } });

  const summary = planTwoHome.itinerary.items[index];
  const legs = day.segments.flatMap((segment) => segment.pointIds.slice(0, -1).map((from, pointIndex) => {
    const leg = legById.get(transitKey(day.id, from, segment.pointIds[pointIndex + 1]));
    if (!leg) throw new Error(`Missing journal transit on ${day.id}`);
    const origin = placeById.get(leg.fromPlaceId);
    const destination = placeById.get(leg.toPlaceId);
    if (!origin || !destination) throw new Error(`Missing journal place on ${day.id}`);
    return {
      ...leg, from: origin.name, to: destination.name,
      href: googleMapsDirections(origin.position.join(","), destination.position.join(","), leg.kind === "步行" ? "walking" : "transit"),
    };
  }));
  const sources = [...new Map(legs.flatMap((leg) => leg.sources ?? []).map((source) => [source.href, source])).values()];
  const status = (value: string) => value === "已核班次" ? "verified" as const : value === "部分核实" ? "partial" as const : "estimated" as const;
  return defineDayJournal({
    schemaVersion: 1, id: day.date, guideId, date: day.date, dayNumber: day.dayNumber, weekday: day.weekday,
    metadata: { title: `${summary.title}｜配置 2 · Day ${day.dayNumber}`, description: summary.note },
    navigation: { ariaLabel: "每日手账导航", backLabel: "返回配置 2 总行程", badge: "KANSAI 2026 · PLAN 02" },
    labels: { statsAriaLabel: "当天摘要", estimatedTiming: "预计时间", partiallyVerifiedTiming: "部分核实", hasAlternative: "可调整", recommendationSource: "查看来源", recommendationMap: "地图导航" },
    presentation: { template: "compact-journal" },
    hero: { kicker: `${day.date} · ${day.weekday} · DAY ${day.dayNumber}`, titleLines: [summary.title], lead: summary.note,
      stats: [{ value: summary.rhythm, label: "作息" }, { value: summary.stay, label: "住宿" }], footnote: "日本当地时间；酒店位置、步行与换乘仍为估算，具体班次出发前复查。" },
    route: { label: "当天路线", summary: summary.route },
    primaryRule: { ariaLabel: "当天执行重点", eyebrow: summary.luggage ? "LUGGAGE FIRST" : "PACE FIRST", title: summary.luggage ? "先处理行李" : "留好吃饭与休息的时间", body: summary.luggage ?? summary.note },
    sections: [
      { kind: "timeline", id: "schedule", eyebrow: "DAY FLOW", titleLines: ["从出门到回店"], items: legs.map((leg) => ({
        time: leg.departurePlan.match(/\d{2}:\d{2}/)?.[0] ?? "当天", title: `${leg.from} → ${leg.to}`, kind: "hop" as const,
        note: `${leg.departurePlan}；${leg.arrivalPlan}。${leg.stayPlan}`, timingStatus: status(leg.timingStatus), href: leg.href,
      })) },
      { kind: "transport", id: "transport", eyebrow: "TRANSPORT", titleLines: ["每一段怎么走"], note: "线路和导航覆盖每对相邻地点；导航示意不能替代运营方临时公告。", items: legs.map((leg) => ({
        from: leg.from, to: leg.to, depart: leg.departurePlan, arrive: leg.arrivalPlan, duration: leg.duration, mode: leg.kind,
        route: leg.route, timingStatus: status(leg.timingStatus), serviceBoundary: leg.serviceBoundary?.detail ?? "按建议时段出发；步行和酒店接驳时间为估算。", fallback: leg.fallback, href: leg.href,
      })) },
      { kind: "notes", id: "stop-rule", eyebrow: "IF PLANS CHANGE", titleLines: ["当天取舍"], items: [{ label: "执行重点", body: summary.note }, { label: "时间窗口", body: summary.schedule }] },
      { kind: "sources", id: "sources", title: "出发前复查", summary: "沿用原方案的运营方来源；本轮新增核验详见配置 2 复盘。临时改点与酒店地址仍需出发前确认。", items: sources.map((source) => ({ title: source.label, href: source.href, checkedAt: source.label.includes("2026-09-05") ? "2026-09-05" : "沿用原方案，出发前复查" })) },
    ],
    footer: { badge: "PLAN 02", message: "累了就按交通卡里的替代方案收尾。", backLabel: "返回配置 2 总行程" },
  });
});
