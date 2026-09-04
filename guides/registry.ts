import type { TravelGuideManifest } from "@/app/guide-core/types";

type GuideLoader = () => Promise<TravelGuideManifest>;

export const guideCatalog = [
  {
    id: "kansai-2026",
    slug: "kansai-2026",
    title: "九日关西｜2026 国庆旅行攻略",
  },
] as const;

const guideLoaders: Record<string, GuideLoader> = {
  "kansai-2026": async () => {
    const guideModule = await import("./kansai-2026/guide");
    return guideModule.kansai2026Guide;
  },
};

export async function loadGuide(guideId: string) {
  const load = guideLoaders[guideId];
  if (!load) throw new Error(`Unknown guide: ${guideId}`);
  return load();
}
