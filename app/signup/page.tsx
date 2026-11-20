import Image from "next/image";
import Link from "next/link";
import { ActionForm } from "@/components/action-form";
import { MemberFields } from "@/components/member-fields";
import { Button } from "@/components/ui/button";
import { signUpAction } from "@/lib/actions";
import { safeNextPath } from "@/lib/config";
import { photos } from "@/lib/photos";

export const metadata = { title: "加入" };

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  const next = safeNextPath(params.next, "/profile");
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">
      <aside className="relative hidden min-h-[40rem] overflow-hidden rounded-[1.75rem] lg:block">
        <Image src={photos.yoga.src} alt={photos.yoga.alt} fill loading="eager" className="object-cover" sizes="24rem" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e3328]/85 via-[#0e3328]/20 to-transparent" />
        <div className="absolute right-6 bottom-6 left-6 grid gap-2 text-white">
          <p className="font-serif text-4xl">迎向美好人生</p>
          <p className="text-lg">免費加入俱樂部，認識據點的活動與朋友。</p>
        </div>
      </aside>
      <div className="grid gap-6">
        <div className="relative h-48 overflow-hidden rounded-[1.5rem] lg:hidden">
          <Image src={photos.yoga.src} alt={photos.yoga.alt} fill loading="eager" className="object-cover" sizes="100vw" />
        </div>
        <div className="grid gap-2">
          <p className="text-base font-medium text-[#14603a]">會員</p>
          <h1 className="text-4xl sm:text-5xl">免費加入</h1>
          <p>目前不收費。我們只留聯絡與興趣，不留病歷。</p>
          <p>
            已經有帳號？{" "}
            <Link className="font-medium text-[#0f5132] underline underline-offset-4" href={`/login?next=${encodeURIComponent(next)}`}>
              登入
            </Link>
          </p>
        </div>
        <ActionForm action={signUpAction} className="rounded-[1.5rem] bg-white p-5 shadow-[0_16px_40px_-28px_rgba(14,51,40,0.55)] ring-1 ring-[#14603a]/10 sm:p-6">
          <input type="hidden" name="next" value={next} />
          <MemberFields includeAccount />
          <Button type="submit">建立免費會員</Button>
        </ActionForm>
      </div>
    </div>
  );
}
