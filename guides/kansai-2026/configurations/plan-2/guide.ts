import { defineTravelGuide } from "@/app/guide-core/defineGuide";
import { kansaiMap } from "../../places";
import { kansaiJourney } from "../../journey";
import { planTwoDays } from "./days";
import { planTwoHome } from "./home";
import { planTwoJournals } from "./journals";
import { planTwoPlaces } from "./places";
import { planTwoTransit } from "./transit";

export const kansaiPlanTwoGuide = defineTravelGuide({
  schemaVersion: 1, id: "kansai-2026-plan-2", slug: "kansai-2026-plan-2", locale: "zh-CN", timezone: "Asia/Tokyo",
  title: planTwoHome.metadata.title, description: planTwoHome.metadata.description,
  map: { ...kansaiMap, transitAuditNote: "配置 2 于 2026-09-05 复核路线、休息与用餐；沿用原方案车次，新增近铁返程按现行平日时刻核对。酒店地址、步行、巴士候车和换乘仍为估算；混合交通段标为部分核实，出发前再次核对。" },
  places: planTwoPlaces, days: planTwoDays, transitLegs: planTwoTransit,
  journey: kansaiJourney, home: planTwoHome, journalDays: planTwoJournals,
});
