import Image from "next/image";
import { LineLoginButton } from "@/components/line-login-button";
import { lineConfigured } from "@/lib/line";
import { safeNextPath } from "@/lib/config";
import { photos } from "@/lib/photos";

export const metadata = { title: "用 LINE 加入" };

const steps = [
  ["1", "按下綠色按鈕"],
  ["2", "在 LINE 按同意"],
  ["3", "確認暱稱，就可以報名"],
];

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const params = await searchParams;
  const next = safeNextPath(params.next, "/profile");
  const demo = !lineConfigured();
  const href = demo ? `/signup/demo?next=${encodeURIComponent(next)}` : `/api/auth/line?next=${encodeURIComponent(next)}`;
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">
      <aside className="relative hidden min-h-[36rem] overflow-hidden rounded-[1.75rem] lg:block">
        <Image src={photos.hero.src} alt={photos.hero.alt} fill loading="eager" className="object-cover object-[72%_42%]" sizes="24rem" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e3328]/85 via-[#0e3328]/20 to-transparent" />
        <div className="absolute right-6 bottom-6 left-6 grid gap-2 text-white">
          <p className="font-serif text-4xl">迎向美好人生</p>
          <p className="text-lg">用 LINE 免費加入，不用電子信箱。</p>
        </div>
      </aside>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <p className="text-lg font-medium text-[#14603a]">會員</p>
          <h1 className="text-4xl sm:text-5xl">用 LINE 加入</h1>
          <p className="text-xl leading-relaxed">免費。不用電子信箱，也不用記密碼。許多長輩都有 LINE，按一下綠色按鈕就好。</p>
        </div>
        {params.error ? (
          <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-lg text-red-950 ring-1 ring-red-800">
            {params.error}
          </p>
        ) : null}
        <ol className="grid gap-3">
          {steps.map(([step, label]) => (
            <li key={step} className="flex min-h-16 items-center gap-4 rounded-2xl bg-white px-4 text-xl ring-1 ring-[#14603a]/10">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#e3f3e6] font-serif text-2xl text-[#14603a]">{step}</span>
              {label}
            </li>
          ))}
        </ol>
        <LineLoginButton href={href} demo={demo} />
        <p className="text-lg">
          已經加入過？再按一次綠色按鈕即可。工作人員請到{" "}
          <a className="font-medium text-[#0f5132] underline underline-offset-4" href="/login">
            工作人員登入
          </a>
          。
        </p>
      </div>
    </div>
  );
}
