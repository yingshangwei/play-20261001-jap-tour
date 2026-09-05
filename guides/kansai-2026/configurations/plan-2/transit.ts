import { transitKey } from "@/app/guide-core/defineGuide";
import type { TransitLeg } from "@/app/guide-core/types";
import { kansaiTransitLegs } from "../../transit";
import { planTwoDays } from "./days";

const adjustments: Record<string, Partial<TransitLeg>> = {
  "10.01:osaka-stay>kuromon": { stayPlan: "10:45–12:00 早午餐与慢逛；至少留 30 分钟坐下吃饭" },
  "10.01:shitennoji>tennoji-park": { stayPlan: "14:20–15:30 庭园慢走与坐下休息；之后直接回住宿" },
  "10.02:mouriya>meriken": { stayPlan: "16:00–17:45 港区慢走，至少安排 30 分钟坐下休息；不再追加收费场馆" },
  "10.03:tenryuji>togetsukyo": { stayPlan: "13:15–14:00 先坐下吃午饭；河岸散步至 14:35，随后去 JR 站" },
  "10.04:nanzenji>byodoin": {
    arrivalPlan: "JR 宇治约 12:35｜平等院入口周边约 12:45",
    stayPlan: "12:45–13:20 先坐下用餐；13:20–14:10 只看庭园，凤凰堂内部与博物馆不作必到项",
    fallback: "地铁／JR 延误时优先压缩宇治茶店和庭园停留，保留哲学之道与 16:00 烟火入场。",
  },
  "10.04:byodoin>nakamura-uji": {
    suggestedTime: "14:10", departurePlan: "平等院｜14:10 离开", arrivalPlan: "中村藤吉平等院店约 14:15",
    stayPlan: "茶歇或外带至 14:35；超过 10 分钟排队就换便利补给，不能挤占去站时间",
  },
  "10.06:fushimi-inari>todaiji": {
    stayPlan: "12:05–12:40 在入口周边先午餐；12:40–14:05 游览南大门与大佛殿，保留 85 分钟核心体验",
  },
  "10.06:todaiji>nigatsudo": {
    suggestedTime: "14:05", departurePlan: "东大寺大佛殿｜14:05 出发", arrivalPlan: "二月堂约 14:20",
    stayPlan: "眺望与休息 25 分钟；14:45 离开，膝盖不适可取消坡道",
  },
  "10.06:nigatsudo>mizuya": {
    suggestedTime: "14:45", departurePlan: "二月堂｜14:45 出发", arrivalPlan: "水谷茶屋约 15:05",
    stayPlan: "15:05–15:30 短茶歇，不再把正餐拖到这里；满座或临休就原地补水休息",
    fallback: "茶屋满座或临休时不排队，在开放休息区补水；保留去春日大社与返回车站的时间。",
  },
  "10.06:mizuya>kasuga": {
    suggestedTime: "15:30", departurePlan: "水谷茶屋｜15:30 出发", arrivalPlan: "春日大社约 15:45",
    stayPlan: "15:45–16:25 参道与一般参拜；特别参拜 16:00 结束，不把付费内院作为当天必到项",
    sources: [{ label: "春日大社参拜时间 · 2026-09-05 核对", href: "https://www.kasugataisha.or.jp/en/about_en/basic/" }],
  },
  "10.06:kasuga>osaka-stay": {
    suggestedTime: "16:25 离开神社；目标近铁奈良 17:21",
    duration: "约 1 小时 50 分钟至 2 小时 10 分钟，含候车与酒店步行",
    route: "奈良交通巴士从春日大社本殿／表参道往近铁奈良，必要时打车；近铁急行 17:21 → 大阪难波 18:02，再步行到酒店。",
    departurePlan: "春日大社｜16:25；目标近铁奈良 17:21 急行",
    arrivalPlan: "大阪难波 18:02｜大阪酒店约 18:15–18:35",
    stayPlan: "入住、取回前送行李；晚餐只选 19:30 以后可从容抵达的席位，否则难波简单吃",
    serviceBoundary: { label: "班次参考", detail: "现行平日急行 17:21→18:02 已核；提前到站可乘 17:05→17:46。两班均非末班，出发前复查改点与巴士站台。" },
    fallback: "巴士久候时打车到近铁奈良；错过目标车就选后续大阪方向列车并放弃赶正式晚餐。近铁中断时改 JR 奈良→天王寺／JR 难波。",
    sources: [
      { label: "近铁平日 17:21 急行 · 2026-09-05 核对", href: "https://eki.kintetsu.co.jp/english/T7?dw=0&sf=5212&time=1720&tx=1-123" },
      { label: "近铁平日 17:05 急行", href: "https://eki.kintetsu.co.jp/english/T7?dw=0&sf=5212&time=1700&tx=1-122" },
      { label: "奈良交通市内巴士", href: "https://www.narakotsu.co.jp/language/en/local/nara_city.html" },
    ],
    timingStatus: "部分核实",
  },
};

const gardenReturn: TransitLeg = {
  id: "10.01:tennoji-park>osaka-stay", dayId: "10.01", fromPlaceId: "tennoji-park", toPlaceId: "osaka-stay",
  kind: "铁路", suggestedTime: "15:30", duration: "约 30–45 分钟，含园区和酒店步行",
  route: "步行到天王寺站，搭大阪 Metro 御堂筋线往梅田方向，在难波／心斋桥下车回酒店。",
  departurePlan: "慶泽园｜15:30 离开", arrivalPlan: "大阪酒店约 16:00–16:15",
  stayPlan: "休息至少 90 分钟；新世界、电电城不再列入当天必到路线，正式晚餐至多选一顿",
  fallback: "疲劳或大雨时从公园出口直接打车回酒店；御堂筋线中断也用出租车。",
  timingStatus: "预计时间",
};

// Only retain legs that the selected route actually uses.
const required = new Set(planTwoDays.flatMap((day) => day.segments.flatMap((segment) =>
  segment.pointIds.slice(0, -1).map((from, index) => transitKey(day.id, from, segment.pointIds[index + 1])),
)));
export const planTwoTransit: TransitLeg[] = [...kansaiTransitLegs, gardenReturn]
  .filter((leg) => required.has(leg.id))
  .map((leg) => ({ ...leg, ...adjustments[leg.id] }));
