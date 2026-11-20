import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ActionForm } from "@/components/action-form";
import { MemberFields } from "@/components/member-fields";
import { Button } from "@/components/ui/button";
import { updateProfileAction } from "@/lib/actions";
import { MEMBER_TYPE_LABEL, ROLE_LABEL } from "@/lib/constants";
import { branchById } from "@/lib/branches";
import { photos } from "@/lib/photos";
import { getRepo } from "@/lib/repo";

export const metadata = { title: "會員資料" };

export default async function ProfilePage() {
  const repo = await getRepo();
  const user = await repo.getSessionUser();
  if (!user) redirect("/login?next=/profile");
  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <div className="relative h-44 overflow-hidden rounded-[1.75rem]">
        <Image src={photos.smile.src} alt={photos.smile.alt} fill loading="eager" className="object-cover object-[center_30%]" sizes="40rem" />
      </div>
      <div className="grid gap-2">
        <p className="text-base font-medium text-[#14603a]">會員資料</p>
        <h1 className="text-4xl sm:text-5xl">您好，{user.nickname}</h1>
        <p>
          {user.email} · {ROLE_LABEL[user.role]} · {MEMBER_TYPE_LABEL[user.memberType]} · 俱樂部免費會員
          {user.verified ? " · 已驗證主辦身分" : ""}
        </p>
        {user.partnerNumber ? <p>夥伴／會員編號 {user.partnerNumber} · 待公司驗證</p> : null}
        {user.homeBranchId ? <p>常去據點：{branchById(user.homeBranchId)?.name ?? "據點"}</p> : null}
        <p>請確認行政區，我們會用它幫您看附近的活動。電話可以留空。</p>
      </div>
      <ActionForm action={updateProfileAction} className="rounded-[1.5rem] bg-white p-5 shadow-[0_16px_40px_-28px_rgba(14,51,40,0.55)] ring-1 ring-[#14603a]/10 sm:p-6">
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
        <Link className="inline-flex min-h-12 items-center font-medium text-[#0f5132] underline underline-offset-4" href="/activities">
          去看看活動
        </Link>
      </p>
    </div>
  );
}
