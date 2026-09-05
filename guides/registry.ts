import type { TravelGuideManifest } from "@/app/guide-core/types";

type GuideLoader = () => Promise<TravelGuideManifest>;

type GuideCatalogEntry = {
  id: string;
  slug: string;
  title: string;
  configuration?: { group: string; label: string; description: string };
};

export const guideCatalog: readonly GuideCatalogEntry[] = [
  {
    id: "kansai-2026",
    slug: "kansai-2026",
    title: "九日关西｜2026 国庆旅行攻略",
    configuration: { group: "kansai-2026", label: "配置 1 · 原行程", description: "大阪南区完整慢行，保留原有停留安排。" },
  },
  {
    id: "kansai-2026-plan-2",
    slug: "kansai-2026-plan-2",
    title: "九日关西｜配置 2 · 从容版",
    configuration: { group: "kansai-2026", label: "配置 2 · 从容版", description: "恢复日提早回店，烟火与奈良日先安排午餐。" },
  },
  {
    id: "sample-weekend",
    slug: "sample-weekend",
    title: "一日城市周末｜配置示例",
  },
] as const;

const guideLoaders: Record<string, GuideLoader> = {
  "kansai-2026-plan-2": async () => {
    const guideModule = await import("./kansai-2026/configurations/plan-2/guide");
    return guideModule.kansaiPlanTwoGuide;
  },
  "kansai-2026": async () => {
    const guideModule = await import("./kansai-2026/guide");
    return guideModule.kansai2026Guide;
  },
  "sample-weekend": async () => {
    const guideModule = await import("./sample-weekend/guide");
    return guideModule.sampleWeekendGuide;
  },
};

export async function loadGuide(guideId: string) {
  const load = guideLoaders[guideId];
  if (!load) throw new Error(`Unknown guide: ${guideId}`);
  return load();
}
