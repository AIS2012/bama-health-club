import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC } from "next/font/google";
import { cookies } from "next/headers";
import { SiteChrome } from "@/components/site-chrome";
import { isDemoMode } from "@/lib/config";
import { getRepo } from "@/lib/repo";
import "./globals.css";

const noto = Noto_Sans_TC({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "八馬健康俱樂部",
    template: "%s｜八馬健康俱樂部",
  },
  description: "給大臺北熟齡與退休朋友的運動聚會、健康講座、社團與小挑戰。目前入會免費，不是醫療服務。",
};

export const viewport: Viewport = {
  themeColor: "#12382c",
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
    <html lang="zh-Hant" data-font={font} className={noto.variable}>
      <body className="flex min-h-screen flex-col antialiased">
        <SiteChrome user={user} demo={isDemoMode()}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
