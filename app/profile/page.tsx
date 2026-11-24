import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LineProfileForm } from "@/components/line-profile-form";
import { UNSET_DISTRICT } from "@/lib/areas";
import { ROLE_LABEL } from "@/lib/constants";
import { needsLineProfile } from "@/lib/line";
import { photos } from "@/lib/photos";
import { getRepo } from "@/lib/repo";

export const metadata = { title: "會員資料" };

export default async function ProfilePage() {
  const repo = await getRepo();
  const user = await repo.getSessionUser();
  if (!user) redirect("/signup?next=/profile");
  if (needsLineProfile(user)) redirect("/signup/profile?next=/profile");
  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <div className="relative h-44 overflow-hidden rounded-[1.75rem]">
        <Image src={photos.smile.src} alt={photos.smile.alt} fill loading="eager" className="object-cover object-[center_30%]" sizes="40rem" />
      </div>
      <div className="grid gap-2">
        <p className="text-base font-medium text-[#14603a]">會員資料</p>
        <h1 className="text-4xl sm:text-5xl">您好，{user.nickname}</h1>
        <p>
          {user.lineUserId ? "LINE 會員" : user.email} · {ROLE_LABEL[user.role]} · 俱樂部免費會員
          {user.verified ? " · 已驗證主辦身分" : ""}
        </p>
        <p>{user.district === UNSET_DISTRICT ? "常去區域還沒填。" : `常去區域：${user.city}${user.district}`} 電話可以留空。</p>
      </div>
      <LineProfileForm user={user} next="/profile" />
      <p>
        <Link className="inline-flex min-h-12 items-center font-medium text-[#0f5132] underline underline-offset-4" href="/activities">
          去看看活動
        </Link>
      </p>
    </div>
  );
}
