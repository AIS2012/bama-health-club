import Link from "next/link";
import { FontToggle } from "@/components/font-toggle";
import { SiteNav } from "@/components/site-nav";
import { signOutAction } from "@/lib/actions";
import { FRAUD_WARNING, GSC_PHONE, JOIN_BUSINESS_NOTE, JOIN_BUSINESS_URL, MEDICAL_DISCLAIMER, MEMBER_PORTAL_URL, OFFICIAL_SITE_URL } from "@/lib/constants";
import type { Profile } from "@/lib/types";

const footerLink = "inline-flex min-h-12 items-center underline decoration-white/40 underline-offset-4 hover:decoration-white";

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
      <header className="sticky top-0 z-40 border-b border-[#14603a]/10 bg-[#f4f7f1]/92 backdrop-blur-md">
        <div className="mx-auto grid max-w-6xl gap-3 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/" className="inline-flex min-h-12 items-center gap-3">
              <span
                data-logo-slot="official"
                title="官方標誌位置，待公司核准後替換，請勿外連官網圖檔"
                aria-hidden="true"
                className="grid size-12 shrink-0 place-items-center rounded-full bg-[#14603a] font-serif text-2xl leading-none text-white"
              >
                八
              </span>
              <span>
                <span className="block font-serif text-2xl leading-none text-[#0e3328]">八馬健康俱樂部</span>
                <span className="mt-1 block text-base text-[#3c5146]">Total Swiss 八馬國際事業</span>
              </span>
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              {user?.role === "admin" || user?.role === "branch_manager" ? (
                <Link href="/admin" className="inline-flex min-h-12 items-center rounded-full bg-[#e3f3e6] px-4 font-medium text-[#0e3328]">
                  {user.role === "branch_manager" ? "據點活動" : "管理後台"}
                </Link>
              ) : null}
              {user ? (
                <>
                  <Link href="/profile" className="inline-flex min-h-12 items-center rounded-full px-3 font-medium text-[#0e3328] hover:bg-[#e3f3e6]">
                    {user.nickname}
                  </Link>
                  <form action={signOutAction}>
                    <button type="submit" className="inline-flex min-h-12 items-center rounded-full border border-[#14603a]/30 bg-white px-4 text-[#0e3328]">
                      登出
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="inline-flex min-h-12 items-center rounded-full px-3 font-medium text-[#0e3328] hover:bg-[#e3f3e6]">
                    登入
                  </Link>
                  <Link href="/signup" className="inline-flex min-h-12 items-center rounded-full bg-[#14603a] px-4 font-medium text-white hover:bg-[#0f5132]">
                    免費加入
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SiteNav />
            <FontToggle />
          </div>
        </div>
      </header>
      <div className="fraud-banner" role="note">
        <p className="mx-auto max-w-6xl px-4 py-3 text-base font-medium sm:px-6">{FRAUD_WARNING}</p>
      </div>
      {demo ? (
        <p className="bg-[#e3f3e6] px-4 py-2 text-center text-base text-[#0f5132]">
          目前是本機示範模式，尚未連接 Supabase。資料只存在這台電腦。
        </p>
      ) : null}
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </main>
      <footer className="mt-8 bg-[#0e3328] text-[#f6f4ee]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div className="grid content-start gap-3">
            <p className="font-serif text-3xl text-white">八馬健康俱樂部</p>
            <p className="text-[#d7eadc]">Total Swiss 八馬國際事業的活動平台。俱樂部入會免費，與加入事業分開。</p>
            <p>GSC 全球客服中心 {GSC_PHONE}</p>
          </div>
          <nav aria-label="頁尾俱樂部" className="grid content-start">
            <p className="font-serif text-2xl text-white">俱樂部</p>
            <Link className={footerLink} href="/activities">
              活動
            </Link>
            <Link className={footerLink} href="/branches">
              據點
            </Link>
            <Link className={footerLink} href="/groups">
              社團
            </Link>
            <Link className={footerLink} href="/challenges">
              挑戰
            </Link>
          </nav>
          <nav aria-label="頁尾" className="grid content-start">
            <p className="font-serif text-2xl text-white">說明</p>
            <a className={footerLink} href={OFFICIAL_SITE_URL}>
              官網
            </a>
            <a className={footerLink} href={MEMBER_PORTAL_URL}>
              會員專區
            </a>
            <Link className={footerLink} href="/privacy">
              隱私權政策（草稿）
            </Link>
            <Link className={footerLink} href="/terms">
              使用條款（草稿）
            </Link>
          </nav>
        </div>
        <div className="border-t border-white/15">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 text-base leading-relaxed sm:px-6">
            <p>{MEDICAL_DISCLAIMER}</p>
            <p>{JOIN_BUSINESS_NOTE}</p>
            <p>
              <a className="font-medium text-white underline underline-offset-4" href={JOIN_BUSINESS_URL}>
                加入事業
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
