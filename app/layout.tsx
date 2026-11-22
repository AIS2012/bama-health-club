import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import { cookies } from "next/headers";
import { SiteChrome } from "@/components/site-chrome";
import { isDemoMode } from "@/lib/config";
import { getRepo } from "@/lib/repo";
import "./globals.css";

const noto = Noto_Sans_TC({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto",
  preload: false,
});

const notoSerif = Noto_Serif_TC({
  weight: ["600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-serif",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "健康俱樂部",
    template: "%s｜健康俱樂部",
  },
  description: "健康俱樂部。夥伴、愛用者與一般大眾都能報名活動與挑戰。入會免費，不是醫療服務。",
  openGraph: {
    title: "健康俱樂部",
    description: "健康俱樂部。夥伴、愛用者與一般大眾都能報名活動與挑戰。入會免費，不是醫療服務。",
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
    <html lang="zh-Hant" data-font={font} className={`${noto.variable} ${notoSerif.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <SiteChrome user={user} demo={isDemoMode()}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
