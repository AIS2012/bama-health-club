import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/action-form";
import { ReportButton } from "@/components/report-button";
import { cancelRsvpAction, rsvpAction } from "@/lib/actions";
import { MEDICAL_DISCLAIMER, SAFETY_NOTICE, SELF_DECLARATION } from "@/lib/constants";
import { difficultyLabel, formatTaipei, kindLabel, spotsLabel } from "@/lib/format";
import { getRepo } from "@/lib/repo";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const repo = await getRepo();
  const activity = await repo.getActivity(id);
  return { title: activity?.title ?? "活動" };
}

export default async function ActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const repo = await getRepo();
  const user = await repo.getSessionUser();
  const activity = await repo.getActivity(id);
  if (!activity) notFound();
  const started = new Date(activity.startsAt) <= new Date();

  return (
    <article className="grid gap-6">
      <p>
        <Link href="/activities" className="underline">
          回活動列表
        </Link>
      </p>
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-[#14603a] px-3 py-1 text-white">{kindLabel(activity.kind)}</span>
        <span className="rounded-full bg-[#e3f3e6] px-3 py-1">{activity.category}</span>
        <span className="rounded-full bg-[#f6f1e6] px-3 py-1">{difficultyLabel(activity.difficulty)}</span>
        {activity.isSample ? <span className="rounded-full bg-[#fff3bf] px-3 py-1 font-medium">範例資料</span> : null}
        {activity.status === "cancelled" ? <span className="rounded-full bg-red-100 px-3 py-1">已取消</span> : null}
        {activity.organizerVerified ? (
          <span className="rounded-full bg-[#e3f3e6] px-3 py-1 font-medium text-[#0f5132] ring-1 ring-[#0f5132]">已驗證主辦</span>
        ) : (
          <span className="rounded-full bg-white px-3 py-1 ring-1">主辦尚未驗證</span>
        )}
      </div>
      <h1 className="text-4xl font-bold leading-tight">{activity.title}</h1>
      <p className="text-xl">{formatTaipei(activity.startsAt)} 到 {formatTaipei(activity.endsAt)}</p>
      <p className="text-lg">
        {activity.branchName ? <>上課場地：{activity.branchName}<br /></> : null}
        {activity.locationName}
        <br />
        {activity.address}
      </p>
      {activity.speaker ? <p>合作講師／合作單位：{activity.speaker}。名稱只供辨識，不代表療效或品牌背書。</p> : null}
      <p className="text-lg font-medium">{spotsLabel(activity.goingCount, activity.capacity)}</p>
      {activity.waitlistCount > 0 ? <p>目前候補 {activity.waitlistCount} 人</p> : null}
      <p className="whitespace-pre-wrap text-lg leading-relaxed">{activity.description}</p>

      <section className="grid gap-3 rounded-xl border-2 border-[#9a3412] bg-[#fff7ed] p-5">
        <h2 className="text-2xl font-bold">運動安全須知</h2>
        <p>{SAFETY_NOTICE}</p>
        <p>{MEDICAL_DISCLAIMER}</p>
      </section>

      <section className="grid gap-3 rounded-xl bg-white p-5 shadow-[0_16px_40px_-28px_rgba(14,51,40,0.55)] ring-1 ring-[#14603a]/12">
        <h2 className="text-2xl font-bold">報名</h2>
        {!user ? (
          <p>
            請先{" "}
            <Link className="underline" href={`/login?next=/activities/${activity.id}`}>
              登入
            </Link>{" "}
            再報名。
          </p>
        ) : null}
        {user && activity.myStatus ? (
          <ActionForm action={cancelRsvpAction}>
            <input type="hidden" name="activity_id" value={activity.id} />
            <p className="text-lg font-medium">{activity.myStatus === "going" ? "您已報名這場活動。" : "您目前在候補名單。"}</p>
            <Button type="submit" variant="outline">
              取消報名
            </Button>
          </ActionForm>
        ) : null}
        {user && !activity.myStatus ? (
          <ActionForm action={rsvpAction}>
            <input type="hidden" name="activity_id" value={activity.id} />
            <label className="flex min-h-12 items-start gap-3">
              <input type="checkbox" name="safety" className="mt-1 size-6 accent-[#14603a]" required />
              <span>{SELF_DECLARATION}</span>
            </label>
            <Button type="submit" disabled={started || activity.status !== "published"}>
              {activity.goingCount >= activity.capacity ? "登記候補" : "確認報名"}
            </Button>
            {started || activity.status !== "published" ? <p>這場活動目前不能報名。</p> : null}
          </ActionForm>
        ) : null}
      </section>

      <section className="grid gap-3 rounded-xl bg-white p-5 shadow-[0_16px_40px_-28px_rgba(14,51,40,0.55)] ring-1 ring-[#14603a]/12">
        <h2 className="text-2xl font-bold">主辦</h2>
        <p className="text-lg">
          {activity.organizerName} {activity.organizerVerified ? "（已驗證）" : ""}
        </p>
        {user && activity.organizerContact ? <p>聯絡方式：{activity.organizerContact}</p> : <p>聯絡方式只顯示給已登入的會員。</p>}
        {activity.organizerId ? <ReportButton targetType="user" targetId={activity.organizerId} label="檢舉這位主辦" /> : null}
      </section>
    </article>
  );
}
