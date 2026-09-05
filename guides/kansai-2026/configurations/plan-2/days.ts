import type { GuideDay } from "@/app/guide-core/types";
import { kansaiDays } from "../../days";

export const planTwoDays: GuideDay[] = kansaiDays.map((day) => {
  if (day.id === "10.01") return {
    ...day,
    title: "大阪恢复日 · 庭园后回店",
    segments: [
      { id: "south-osaka-short", label: "大阪南区 · 只留三个停留", note: "10:30 出门；黑门早午餐、四天王寺和慶泽园后结束，取消新世界、电电城的连续晚段。", pointIds: ["osaka-stay", "kuromon", "shitennoji", "tennoji-park"], mode: "walking", drawOnMap: true },
      { id: "garden-to-hotel", label: "庭园 → 大阪住宿", note: "15:30 后搭御堂筋线回店，约 16:00 开始休息；不给恢复日追加必到点。", pointIds: ["tennoji-park", "osaka-stay"], mode: "transit" },
    ],
  };
  if (day.id === "10.04") return {
    ...day,
    segments: day.segments.map((segment) => segment.id === "uji-core"
      ? { ...segment, note: "12:45 先用餐；平等院只看庭园，茶歇不排长队，14:55 准时去 JR 站。" }
      : segment),
  };
  if (day.id === "10.06") return {
    ...day,
    title: "伏见与奈良 · 午餐前置、返程留余量",
    segments: day.segments.map((segment) => segment.id === "nara-core"
      ? { ...segment, note: "12:05 在东大寺入口周边先吃饭、坐下休息；大佛殿与二月堂后只作短茶歇，16:25 离开春日大社。" }
      : segment),
  };
  return day;
});
