import Link from "next/link";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { magicLinkAction, signInAction } from "@/lib/actions";
import { isDemoMode, safeNextPath } from "@/lib/config";
import { DEMO_PASSWORD } from "@/lib/constants";

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
    <div className="mx-auto grid max-w-xl gap-8">
      <div className="grid gap-2">
        <h1 className="text-4xl font-bold">登入</h1>
        <p>
          還沒有帳號？{" "}
          <Link className="underline" href={`/signup?next=${encodeURIComponent(next)}`}>
            免費加入
          </Link>
        </p>
      </div>
      {params.error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-red-950 ring-1 ring-red-800">
          登入連結無效或已過期，請再試一次。
        </p>
      ) : null}
      <section className="grid gap-4 rounded-xl bg-white p-5 ring-1 ring-[#88012B]/20">
        <h2 className="text-2xl font-bold">信箱與密碼</h2>
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
      <section className="grid gap-4 rounded-xl bg-white p-5 ring-1 ring-[#88012B]/20">
        <h2 className="text-2xl font-bold">改用登入信</h2>
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
      <section className="grid gap-3 rounded-xl bg-white p-5 ring-1 ring-[#88012B]/20">
        <h2 className="text-2xl font-bold">Google 登入</h2>
        {demo ? (
          <p>示範模式還沒有連接 Supabase，Google 登入要等正式環境設定完成。</p>
        ) : (
          <Link href="/auth/google" className="inline-flex h-12 items-center justify-center rounded-lg border px-4">
            使用 Google 繼續
          </Link>
        )}
      </section>
      {demo ? (
        <section className="grid gap-2 rounded-xl bg-[#fff3bf] p-5">
          <h2 className="text-2xl font-bold">本機示範帳號</h2>
          <p>密碼都是 {DEMO_PASSWORD}</p>
          <p>會員：member@bama.example（陳阿姨）</p>
          <p>管理員：admin@bama.example（林志工）</p>
        </section>
      ) : null}
    </div>
  );
}
