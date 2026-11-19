import Link from "next/link";
import { FontToggle } from "@/components/font-toggle";
import { SiteNav } from "@/components/site-nav";
import { signOutAction } from "@/lib/actions";
import { FRAUD_WARNING, GSC_PHONE, JOIN_BUSINESS_NOTE, JOIN_BUSINESS_URL, MEDICAL_DISCLAIMER, MEMBER_PORTAL_URL, OFFICIAL_SITE_URL } from "@/lib/constants";
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
      <header className="bg-[#88012B] text-[#f6f1e6]">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/" className="inline-flex min-h-12 items-center gap-3">
              <span
                data-logo-slot="official"
                className="grid h-14 w-16 place-items-center rounded-lg border-2 border-dashed border-[#FAC423] px-1 text-center text-xs leading-tight font-medium text-[#FAC423]"
                title="官方標誌位置，待公司核准後替換，請勿外連官網圖檔"
              >
                官方
                <br />
                標誌
              </span>
              <span>
                <span className="block text-sm font-bold tracking-wide text-[#FAC423]">Total Swiss</span>
                <span className="block text-xl font-bold leading-tight">八馬健康俱樂部</span>
              </span>
            </Link>
            <FontToggle />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SiteNav />
            <div className="flex flex-wrap gap-2">
              {user?.role === "admin" || user?.role === "branch_manager" ? (
                <Link href="/admin" className="inline-flex min-h-12 items-center rounded-lg bg-[#FAC423] px-3 font-medium text-[#222]">
                  {user.role === "branch_manager" ? "據點活動" : "管理後台"}
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
                  <Link href="/signup" className="inline-flex min-h-12 items-center rounded-lg bg-[#FAC423] px-3 font-medium text-[#222]">
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
        <p className="bg-[#e8f3fb] px-4 py-2 text-center text-base text-[#0058A5]">
          目前是本機示範模式，尚未連接 Supabase。資料只存在這台電腦。
        </p>
      ) : null}
      <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>
      <footer className="mt-8 border-t border-[#88012B]/20 bg-white">
        <div className="mx-auto grid max-w-5xl gap-4 px-4 py-8 text-base">
          <p>{MEDICAL_DISCLAIMER}</p>
          <nav aria-label="頁尾" className="flex flex-wrap gap-4">
            <a className="underline" href={OFFICIAL_SITE_URL}>
              官網
            </a>
            <a className="underline" href={MEMBER_PORTAL_URL}>
              會員專區
            </a>
            <Link className="underline" href="/branches">
              據點
            </Link>
            <Link className="underline" href="/privacy">
              隱私權政策（草稿）
            </Link>
            <Link className="underline" href="/terms">
              使用條款（草稿）
            </Link>
          </nav>
          <p>
            GSC 全球客服中心 {GSC_PHONE}
            <br />
            八馬健康俱樂部是 Total Swiss 八馬國際事業的活動平台。俱樂部入會免費，與加入事業分開。
          </p>
          <p className="text-base">{JOIN_BUSINESS_NOTE}</p>
          <p>
            <a className="font-medium text-[#0058A5] underline" href={JOIN_BUSINESS_URL}>
              加入事業
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
