import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { SiteChrome } from "@/components/site-chrome";
import { isDemoMode } from "@/lib/config";
import { getRepo } from "@/lib/repo";
import "./globals.css";

const fontStylesheet =
  "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@600;700&display=swap";

export const metadata: Metadata = {
  title: {
    default: "健康俱樂部",
    template: "%s｜健康俱樂部",
  },
  description: "健康俱樂部。大臺北的室內課程與講座，開放一般大眾免費加入。不是醫療服務。",
  openGraph: {
    title: "健康俱樂部",
    description: "健康俱樂部。大臺北的室內課程與講座，開放一般大眾免費加入。不是醫療服務。",
    locale: "zh_TW",
  },
};

export const viewport: Viewport = {
  themeColor: "#14603a",
  width: "device-width",
  initialScale: 1,
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const repo = await getRepo();
  const user = await repo.getSessionUser();
  const scale = (await cookies()).get("font-scale")?.value;
  const font = scale === "lg" || scale === "xl" ? scale : undefined;

  return (
    <html lang="zh-Hant" data-font={font}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontStylesheet} rel="stylesheet" />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <SiteChrome user={user} demo={isDemoMode()}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
