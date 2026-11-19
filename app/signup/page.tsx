import Link from "next/link";
import { ActionForm } from "@/components/action-form";
import { MemberFields } from "@/components/member-fields";
import { Button } from "@/components/ui/button";
import { signUpAction } from "@/lib/actions";
import { safeNextPath } from "@/lib/config";

export const metadata = { title: "加入" };

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  const next = safeNextPath(params.next, "/profile");
  return (
    <div className="mx-auto grid max-w-xl gap-6">
      <div className="grid gap-2">
        <h1 className="text-4xl font-bold">免費加入</h1>
        <p>目前不收費。我們只留聯絡與興趣，不留病歷。</p>
        <p>
          已經有帳號？{" "}
          <Link className="underline" href={`/login?next=${encodeURIComponent(next)}`}>
            登入
          </Link>
        </p>
      </div>
      <ActionForm action={signUpAction} className="rounded-xl bg-white p-5 ring-1 ring-[#88012B]/20">
        <input type="hidden" name="next" value={next} />
        <MemberFields includeAccount />
        <Button type="submit">建立免費會員</Button>
      </ActionForm>
    </div>
  );
}
