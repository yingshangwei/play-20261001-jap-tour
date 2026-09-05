import type { Metadata } from "next";
import GuideHome from "@/app/guide-ui/GuideHome";
import { getHomeMetadata } from "@/app/guide-core/metadata";
import { guideCatalog, loadGuide } from "@/guides/registry";

export const dynamic = "force-static";
export const dynamicParams = false;

type GuidePageProps = { params: Promise<{ guideId: string }> };

export function generateStaticParams() {
  return guideCatalog.map(({ id }) => ({ guideId: id }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { guideId } = await params;
  return getHomeMetadata((await loadGuide(guideId)).home.metadata);
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { guideId } = await params;
  return <GuideHome guideId={guideId} />;
}
