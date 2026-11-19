import Link from "next/link";
import { redirect } from "next/navigation";
import { ActionForm } from "@/components/action-form";
import { MemberFields } from "@/components/member-fields";
import { Button } from "@/components/ui/button";
import { updateProfileAction } from "@/lib/actions";
import { MEMBER_TYPE_LABEL, ROLE_LABEL } from "@/lib/constants";
import { branchById } from "@/lib/branches";
import { getRepo } from "@/lib/repo";

export const metadata = { title: "會員資料" };

export default async function ProfilePage() {
  const repo = await getRepo();
  const user = await repo.getSessionUser();
  if (!user) redirect("/login?next=/profile");
  return (
    <div className="mx-auto grid max-w-xl gap-6">
      <div className="grid gap-2">
        <h1 className="text-4xl font-bold">會員資料</h1>
        <p>
          {user.email} · {ROLE_LABEL[user.role]} · {MEMBER_TYPE_LABEL[user.memberType]} · 俱樂部免費會員
          {user.verified ? " · 已驗證主辦身分" : ""}
        </p>
        {user.partnerNumber ? <p>夥伴／會員編號 {user.partnerNumber} · 待公司驗證</p> : null}
        {user.homeBranchId ? <p>常去據點：{branchById(user.homeBranchId)?.name ?? "據點"}</p> : null}
        <p>請確認行政區，我們會用它幫您看附近的活動。電話可以留空。</p>
      </div>
      <ActionForm action={updateProfileAction} className="rounded-xl bg-white p-5 ring-1 ring-[#88012B]/20">
        <MemberFields
          nickname={user.nickname}
          phone={user.phone ?? ""}
          city={user.city}
          district={user.district}
          interests={user.interests}
          memberType={user.memberType}
          partnerNumber={user.partnerNumber ?? ""}
          homeBranchId={user.homeBranchId ?? ""}
        />
        <Button type="submit">儲存</Button>
      </ActionForm>
      <p>
        <Link className="underline" href="/activities">
          去看看活動
        </Link>
      </p>
    </div>
  );
}
