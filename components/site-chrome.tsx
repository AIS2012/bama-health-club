import Link from "next/link";
import { FontToggle } from "@/components/font-toggle";
import { SiteNav } from "@/components/site-nav";
import { signOutAction } from "@/lib/actions";
import { FRAUD_WARNING, MEDICAL_DISCLAIMER } from "@/lib/constants";
import type { Profile } from "@/lib/types";

export function SiteChrome({
  user,
  demo,
  children,
}: {
  user: Profile | null;
  demo: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <a className="skip-link" href="#main">
        跳到主要內容
      </a>
      <header className="bg-[#12382c] text-[#f6f1e6]">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/" className="inline-flex min-h-12 items-center gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-[#f3d48a] text-lg font-bold text-[#12382c]">
                八馬
              </span>
              <span>
                <span className="block text-xl font-bold leading-tight">八馬健康俱樂部</span>
                <span className="block text-base text-[#f3d48a]">大臺北熟齡同好</span>
              </span>
            </Link>
            <FontToggle />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SiteNav />
            <div className="flex flex-wrap gap-2">
              {user?.role === "admin" ? (
                <Link href="/admin" className="inline-flex min-h-12 items-center rounded-lg bg-[#f3d48a] px-3 font-medium text-[#1a1200]">
                  管理後台
                </Link>
              ) : null}
              {user ? (
                <>
                  <Link href="/profile" className="inline-flex min-h-12 items-center rounded-lg px-3 text-white hover:bg-white/15">
                    {user.nickname}
                  </Link>
                  <form action={signOutAction}>
                    <button type="submit" className="inline-flex min-h-12 items-center rounded-lg border border-white/40 px-3 text-white">
                      登出
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="inline-flex min-h-12 items-center rounded-lg px-3 text-white hover:bg-white/15">
                    登入
                  </Link>
                  <Link href="/signup" className="inline-flex min-h-12 items-center rounded-lg bg-white px-3 font-medium text-[#12382c]">
                    免費加入
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className="fraud-banner" role="note">
        <p className="mx-auto max-w-5xl px-4 py-3 text-base font-medium">{FRAUD_WARNING}</p>
      </div>
      {demo ? (
        <p className="bg-[#e7f0ec] px-4 py-2 text-center text-base text-[#12382c]">
          目前是本機示範模式，尚未連接 Supabase。資料只存在這台電腦。
        </p>
      ) : null}
      <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>
      <footer className="mt-8 border-t border-[#12382c]/20 bg-white">
        <div className="mx-auto grid max-w-5xl gap-4 px-4 py-8 text-base">
          <p>{MEDICAL_DISCLAIMER}</p>
          <nav aria-label="頁尾" className="flex flex-wrap gap-4">
            <Link className="underline" href="/privacy">
              隱私權政策（草稿）
            </Link>
            <Link className="underline" href="/terms">
              使用條款（草稿）
            </Link>
            <Link className="underline" href="/activities">
              近期活動
            </Link>
          </nav>
          <p className="text-[#12382c]">八馬健康俱樂部 · 大臺北 · 目前入會免費</p>
        </div>
      </footer>
    </>
  );
}
