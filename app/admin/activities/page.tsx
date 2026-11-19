import Link from "next/link";
import { AdminActivityForm } from "@/components/admin-activity-form";
import { formatTaipei } from "@/lib/format";
import { getRepo } from "@/lib/repo";

export const metadata = { title: "管理活動" };

export default async function AdminActivitiesPage() {
  const activities = await (await getRepo()).adminListActivities();
  return (
    <div className="grid gap-6">
      <h2 className="text-3xl font-bold">活動</h2>
      <div className="grid gap-3">
        {activities.map((activity) => (
          <Link key={activity.id} href={`/admin/activities/${activity.id}`} className="rounded-xl bg-white p-4 ring-1 ring-[#88012B]/20">
            <span className="block text-xl font-bold">{activity.title}</span>
            <span>
              {formatTaipei(activity.startsAt)} · {activity.status === "published" ? "公開" : activity.status === "draft" ? "草稿" : "取消"} · 報名 {activity.goingCount}/{activity.capacity}
              {activity.isSample ? " · 範例" : ""}
            </span>
          </Link>
        ))}
      </div>
      <h3 className="text-2xl font-bold">新增活動</h3>
      <AdminActivityForm />
    </div>
  );
}
