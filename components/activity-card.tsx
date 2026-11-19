import Link from "next/link";
import { difficultyLabel, formatTaipei, kindLabel, spotsLabel } from "@/lib/format";
import type { ActivityListItem } from "@/lib/types";

export function ActivityCard({ activity }: { activity: ActivityListItem }) {
  return (
    <article className="grid gap-3 rounded-xl bg-white p-5 ring-1 ring-[#12382c]/20">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-[#12382c] px-3 py-1 text-base text-white">{kindLabel(activity.kind)}</span>
        <span className="rounded-full bg-[#e7f0ec] px-3 py-1 text-base text-[#12382c]">{activity.category}</span>
        <span className="rounded-full bg-[#f6f1e6] px-3 py-1 text-base">{difficultyLabel(activity.difficulty)}</span>
        {activity.isSample ? <span className="rounded-full bg-[#fff3bf] px-3 py-1 text-base font-medium">範例資料</span> : null}
        {activity.organizerVerified ? (
          <span className="rounded-full bg-[#e5f4ec] px-3 py-1 text-base font-medium text-[#0d3b2e] ring-1 ring-[#0d3b2e]">已驗證主辦</span>
        ) : null}
      </div>
      <h2 className="text-2xl font-bold leading-snug">
        <Link href={`/activities/${activity.id}`} className="underline-offset-4 hover:underline">
          {activity.title}
        </Link>
      </h2>
      <p className="text-lg">{formatTaipei(activity.startsAt)}</p>
      <p>
        {activity.city}
        {activity.district} · {activity.locationName}
      </p>
      <p className="font-medium">{spotsLabel(activity.goingCount, activity.capacity)}</p>
      {activity.waitlistCount > 0 ? <p>候補 {activity.waitlistCount} 人</p> : null}
      <Link href={`/activities/${activity.id}`} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#12382c] px-4 text-white">
        查看與報名
      </Link>
    </article>
  );
}
