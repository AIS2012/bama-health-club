import { redirect } from "next/navigation";
import { LineProfileForm } from "@/components/line-profile-form";
import { safeNextPath } from "@/lib/config";
import { getRepo } from "@/lib/repo";

export const metadata = { title: "確認會員資料" };

export default async function LineProfilePage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  const next = safeNextPath(params.next, "/activities");
  const repo = await getRepo();
  const user = await repo.getSessionUser();
  if (!user) redirect(`/signup?next=${encodeURIComponent(next)}`);
  return (
    <div className="mx-auto grid max-w-xl gap-6">
      <div className="grid gap-2">
        <p className="text-lg font-medium text-[#14603a]">差一步</p>
        <h1 className="text-4xl sm:text-5xl">確認您的名字</h1>
        <p className="text-xl leading-relaxed">只要暱稱。手機和常去區域可以不填。不用電子信箱。</p>
      </div>
      <LineProfileForm user={user} next={next} />
    </div>
  );
}
