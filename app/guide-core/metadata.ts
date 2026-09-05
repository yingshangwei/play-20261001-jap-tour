import type { Metadata } from "next";
import type { HomePageConfig } from "./types";

export function getHomeMetadata(metadata: HomePageConfig["metadata"]): Metadata {
  const repository = process.env.GITHUB_REPOSITORY?.split("/");
  const siteUrl = process.env.GITHUB_ACTIONS === "true" && repository?.length === 2
    ? `https://${repository[0]}.github.io/${repository[1]}`
    : "https://kansai-autumn-2026-guide.yingshangwei.chatgpt.site";
  const imageUrl = `${siteUrl}${metadata.image.src}`;
  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: "website",
      images: [{ url: imageUrl, width: metadata.image.width, height: metadata.image.height, alt: metadata.image.alt }],
    },
    twitter: { card: "summary_large_image", title: metadata.title, description: metadata.description, images: [imageUrl] },
  };
}
