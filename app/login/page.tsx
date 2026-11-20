import Image from "next/image";
import Link from "next/link";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { magicLinkAction, signInAction } from "@/lib/actions";
import { isDemoMode, safeNextPath } from "@/lib/config";
import { DEMO_PASSWORD } from "@/lib/constants";
import { photos } from "@/lib/photos";

export const metadata = { title: "登入" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = safeNextPath(params.next, "/profile");
  const demo = isDemoMode();
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">
      <aside className="relative hidden min-h-[36rem] overflow-hidden rounded-[1.75rem] lg:block">
        <Image src={photos.gardenWalk.src} alt={photos.gardenWalk.alt} fill loading="eager" className="object-cover" sizes="24rem" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e3328]/85 via-[#0e3328]/15 to-transparent" />
        <p className="absolute right-6 bottom-6 left-6 font-serif text-4xl text-white">迎向美好人生</p>
      </aside>
      <div className="grid gap-8">
        <div className="relative h-48 overflow-hidden rounded-[1.5rem] lg:hidden">
          <Image src={photos.gardenWalk.src} alt={photos.gardenWalk.alt} fill loading="eager" className="object-cover" sizes="100vw" />
        </div>
        <div className="grid gap-2">
          <p className="text-base font-medium text-[#14603a]">會員</p>
          <h1 className="text-4xl sm:text-5xl">登入</h1>
          <p>
            還沒有帳號？{" "}
            <Link className="font-medium text-[#0f5132] underline underline-offset-4" href={`/signup?next=${encodeURIComponent(next)}`}>
              免費加入
            </Link>
          </p>
        </div>
        {params.error ? (
          <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-red-950 ring-1 ring-red-800">
            登入連結無效或已過期，請再試一次。
          </p>
        ) : null}
        <section className="grid gap-4 rounded-[1.5rem] bg-white p-5 shadow-[0_16px_40px_-28px_rgba(14,51,40,0.55)] ring-1 ring-[#14603a]/10 sm:p-6">
          <h2 className="text-2xl">信箱與密碼</h2>
          <ActionForm action={signInAction}>
            <input type="hidden" name="next" value={next} />
            <div className="grid gap-2">
              <Label htmlFor="email">電子信箱</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">密碼</Label>
              <Input id="password" name="password" type="password" autoComplete="current-password" required />
            </div>
            <Button type="submit">登入</Button>
          </ActionForm>
        </section>
        <section className="grid gap-4 rounded-[1.5rem] bg-white p-5 shadow-[0_16px_40px_-28px_rgba(14,51,40,0.55)] ring-1 ring-[#14603a]/10 sm:p-6">
          <h2 className="text-2xl">改用登入信</h2>
          <p>我們寄一封只能用一次的連結，30 分鐘內有效。不會用這封信向您要密碼或轉帳。</p>
          <ActionForm action={magicLinkAction}>
            <div className="grid gap-2">
              <Label htmlFor="magic-email">電子信箱</Label>
              <Input id="magic-email" name="email" type="email" autoComplete="email" required />
            </div>
            <Button type="submit" variant="outline">
              寄登入信
            </Button>
          </ActionForm>
        </section>
        <section className="grid gap-3 rounded-[1.5rem] bg-white p-5 shadow-[0_16px_40px_-28px_rgba(14,51,40,0.55)] ring-1 ring-[#14603a]/10 sm:p-6">
          <h2 className="text-2xl">Google 登入</h2>
          {demo ? (
            <p>示範模式還沒有連接 Supabase，Google 登入要等正式環境設定完成。</p>
          ) : (
            <Link href="/auth/google" className="inline-flex h-12 items-center justify-center rounded-full border border-[#4f7260] px-4">
              使用 Google 繼續
            </Link>
          )}
        </section>
        {demo ? (
          <section className="grid gap-2 rounded-[1.5rem] bg-[#fff3bf] p-5 text-[#1a1200]">
            <h2 className="text-2xl">本機示範帳號</h2>
            <p>密碼都是 {DEMO_PASSWORD}</p>
            <p>會員：member@bama.example（陳阿姨）</p>
            <p>管理員：admin@bama.example（林志工）</p>
          </section>
        ) : null}
      </div>
    </div>
  );
}
