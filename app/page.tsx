import type { Metadata } from "next";
import GuideHome from "@/app/guide-ui/GuideHome";
import { getHomeMetadata } from "@/app/guide-core/metadata";
import { loadGuide } from "@/guides/registry";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return getHomeMetadata((await loadGuide("kansai-2026")).home.metadata);
}

export default function Home() {
  return <GuideHome guideId="kansai-2026" />;
}
