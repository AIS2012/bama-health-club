import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteNotice } from "@/components/site-notice";
import { FRAUD_WARNING, MEDICAL_DISCLAIMER, OPERATOR_NAME } from "@/lib/constants";
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
      <SiteHeader user={user ? { nickname: user.nickname, role: user.role } : null} />
      <SiteNotice demo={demo} />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 pt-3 pb-8 md:px-6 md:py-12">
        {children}
      </main>
      <footer className="mt-8 bg-[#0e3328] text-[#f6f4ee]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div className="grid content-start gap-3">
            <p className="font-serif text-3xl text-white">健康俱樂部</p>
            <p className="text-[#d7eadc]">大臺北健康課程與講座。由{OPERATOR_NAME}經營，入會免費，開放一般大眾。</p>
          </div>
          <nav aria-label="頁尾俱樂部" className="grid content-start">
            <p className="font-serif text-2xl text-white">俱樂部</p>
            <Link className={footerLink} href="/activities">
              活動
            </Link>
            <Link className={footerLink} href="/branches">
              上課場地
            </Link>
            <Link className={footerLink} href="/partners">
              合作夥伴
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
            <Link className={footerLink} href="/signup">
              免費加入
            </Link>
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
            <p>{FRAUD_WARNING}</p>
            <p>{MEDICAL_DISCLAIMER}</p>
            <p>營運者：{OPERATOR_NAME}。使用條款與隱私權政策仍是草稿，正式上線前須律師審閱。</p>
          </div>
        </div>
      </footer>
    </>
  );
}
