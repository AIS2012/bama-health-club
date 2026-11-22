import Link from "next/link";
import { difficultyLabel, formatTaipei, kindLabel, spotsLabel } from "@/lib/format";
import type { ActivityListItem } from "@/lib/types";

export function ActivityCard({ activity }: { activity: ActivityListItem }) {
  return (
    <article className="grid gap-4 rounded-[1.5rem] bg-white p-5 shadow-[0_18px_40px_-28px_rgba(14,51,40,0.7)] ring-1 ring-[#14603a]/10 sm:p-6">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-[#14603a] px-3 py-1 text-base text-white">{kindLabel(activity.kind)}</span>
        <span className="rounded-full bg-[#e3f3e6] px-3 py-1 text-base text-[#0f5132]">{activity.category}</span>
        <span className="rounded-full bg-[#eef6ea] px-3 py-1 text-base">{difficultyLabel(activity.difficulty)}</span>
        {activity.isSample ? <span className="rounded-full bg-[#fff3bf] px-3 py-1 text-base font-medium text-[#1a1200]">範例資料</span> : null}
        {activity.speaker ? <span className="rounded-full bg-white px-3 py-1 text-base ring-1 ring-[#14603a]/20">合作講師／合作單位</span> : null}
        {activity.organizerVerified ? (
          <span className="rounded-full bg-[#e3f3e6] px-3 py-1 text-base font-medium text-[#0f5132] ring-1 ring-[#0f5132]">已驗證主辦</span>
        ) : null}
      </div>
      <h2 className="text-2xl leading-snug">
        <Link href={`/activities/${activity.id}`} className="underline-offset-4 hover:underline">
          {activity.title}
        </Link>
      </h2>
      <p className="text-lg">{formatTaipei(activity.startsAt)}</p>
      <p>
        {activity.branchName ? `${activity.branchName} · ` : ""}
        {activity.city}
        {activity.district} · {activity.locationName}
      </p>
      {activity.speaker ? <p>合作講師／合作單位：{activity.speaker}</p> : null}
      <p className="font-medium">{spotsLabel(activity.goingCount, activity.capacity)}</p>
      {activity.waitlistCount > 0 ? <p>候補 {activity.waitlistCount} 人</p> : null}
      <Link
        href={`/activities/${activity.id}`}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#14603a] px-4 text-white transition-colors hover:bg-[#0f5132]"
      >
        查看與報名
      </Link>
    </article>
  );
}
