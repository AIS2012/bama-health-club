import Link from "next/link";
import { ActionForm } from "@/components/action-form";
import { LineLoginButton } from "@/components/line-login-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction } from "@/lib/actions";
import { isDemoMode, safeNextPath } from "@/lib/config";
import { DEMO_PASSWORD } from "@/lib/constants";
import { lineConfigured } from "@/lib/line";

export const metadata = { title: "登入" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = safeNextPath(params.next, "/profile");
  const demo = !lineConfigured();
  const href = demo ? `/signup/demo?next=${encodeURIComponent(next)}` : `/api/auth/line?next=${encodeURIComponent(next)}`;
  return (
    <div className="mx-auto grid max-w-xl gap-8">
      <div className="grid gap-2">
        <p className="text-lg font-medium text-[#14603a]">會員</p>
        <h1 className="text-4xl sm:text-5xl">登入</h1>
        <p className="text-xl">會員用 LINE。不用電子信箱。</p>
      </div>
      {params.error ? (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-lg text-red-950 ring-1 ring-red-800">
          登入沒有完成，請再按一次綠色按鈕。
        </p>
      ) : null}
      <LineLoginButton href={href} demo={demo} />
      <p className="text-lg">
        第一次來？{" "}
        <Link className="font-medium text-[#0f5132] underline underline-offset-4" href={`/signup?next=${encodeURIComponent(next)}`}>
          看加入步驟
        </Link>
      </p>
      <section className="grid gap-4 rounded-[1.5rem] bg-white p-5 ring-1 ring-[#14603a]/10 sm:p-6">
        <h2 className="text-2xl">工作人員登入</h2>
        <p>管理員和場地人員用信箱。一般會員不用填這裡。</p>
        <ActionForm action={signInAction}>
          <input type="hidden" name="next" value={next} />
          <div className="grid gap-2">
            <Label htmlFor="email">電子信箱</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required className="h-14 text-lg" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">密碼</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" required className="h-14 text-lg" />
          </div>
          <Button type="submit" variant="outline" className="min-h-14 text-lg">
            工作人員登入
          </Button>
        </ActionForm>
        {isDemoMode() ? (
          <div className="grid gap-1 rounded-2xl bg-[#fff3bf] p-4 text-[#1a1200]">
            <p>示範密碼都是 {DEMO_PASSWORD}</p>
            <p>管理員：admin@bama.example</p>
            <p>場地人員：branch@bama.example</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
