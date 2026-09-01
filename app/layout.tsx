import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "九日关西｜2026 国庆旅行攻略";
const description =
  "9 月 29 日至 10 月 7 日大阪、神户、京都与奈良九日路线：USJ、贵船神社与城阳秋花火。";

const repository = process.env.GITHUB_REPOSITORY?.split("/");
const siteUrl =
  process.env.GITHUB_ACTIONS === "true" && repository?.length === 2
    ? `https://${repository[0]}.github.io/${repository[1]}`
    : "https://kansai-autumn-2026-guide.yingshangwei.chatgpt.site";
const imageUrl = `${siteUrl}/og.png`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: [
      {
        url: imageUrl,
        width: 1731,
        height: 909,
        alt: "九日关西 2026 国庆旅行攻略",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [imageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
