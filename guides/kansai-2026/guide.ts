import { defineTravelGuide } from "@/app/guide-core/defineGuide";
import { kansaiDayOneJournal } from "./journals/day-1";

export const kansai2026Guide = defineTravelGuide({
  schemaVersion: 1,
  id: "kansai-2026",
  slug: "kansai-2026",
  locale: "zh-CN",
  timezone: "Asia/Tokyo",
  title: "九日关西｜2026 国庆旅行攻略",
  description: "9 月 29 日至 10 月 7 日大阪、神户、京都与奈良九日路线。",
  journalDays: [kansaiDayOneJournal],
});
