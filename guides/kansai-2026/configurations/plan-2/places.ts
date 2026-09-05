import type { Place } from "@/app/guide-core/types";
import { kansaiPlaces } from "../../places";

const removed = new Set(["shinsekai", "den-den-town"]);
const adjustments: Record<string, Partial<Place>> = {
  "tennoji-park": { meta: "14:20–15:30 · 庭园休息后回酒店" },
  wanaka: { dates: ["10.06"], fit: "最后一晚难波附近的顺路小吃，不另算一顿正餐。" },
  ichimatsu: { fit: "10.01 18:30 候选；从容版约 16:00 已回酒店，休息后再出门，需确认 3 人余位。" },
  byodoin: { meta: "10.04 13:20–14:10 · 午餐后只看庭园" },
  "nakamura-uji": { fit: "14:15 短茶歇；排队超 10 分钟就外带或换补给，不影响烟火入场。" },
  todaiji: { meta: "12:05 先午餐 · 12:40–14:05 古寺核心" },
  nigatsudo: { meta: "14:20–14:45 · 眺望与休息" },
  mizuya: { meta: "15:05–15:30 · 短茶歇，营业以现场为准", fit: "正餐已在东大寺前吃完；这里只休息补水，闭店或满座时不等待。" },
  kasuga: { meta: "15:45–16:25 · 一般参拜", fit: "特别参拜 16:00 结束，默认走一般参拜与石灯笼参道；16:25 去车站。" },
  "numata-sou": { fit: "10.06 19:30 后的最后一晚候选；约 18:15–18:35 入住，须按实际席位与酒店地址判断。" },
};

export const planTwoPlaces: Place[] = kansaiPlaces
  .filter((place) => !removed.has(place.id))
  .map((place) => ({ ...place, ...adjustments[place.id] }));
