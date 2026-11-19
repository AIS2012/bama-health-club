import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminActivityForm } from "@/components/admin-activity-form";
import { getRepo } from "@/lib/repo";

export const metadata = { title: "編輯活動" };

const statusLabel = { going: "正取", waitlist: "候補", cancelled: "已取消" };

export default async function AdminActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const repo = await getRepo();
  const activity = await repo.getActivity(id);
  const rsvps = await repo.adminListRsvps(id);
  if (!activity || !Array.isArray(rsvps)) notFound();
  return (
    <div className="grid gap-6">
      <p>
        <Link href="/admin/activities" className="underline">
          回活動管理
        </Link>
      </p>
      <h2 className="text-3xl font-bold">{activity.title}</h2>
      <section className="overflow-x-auto rounded-xl bg-white ring-1 ring-[#12382c]/20">
        <table className="w-full min-w-[40rem] text-left text-base">
          <caption className="px-4 py-3 text-left text-xl font-bold">報名名單</caption>
          <thead className="bg-[#12382c] text-white">
            <tr>
              <th className="px-3 py-3">暱稱</th>
              <th className="px-3 py-3">信箱</th>
              <th className="px-3 py-3">電話</th>
              <th className="px-3 py-3">狀態</th>
              <th className="px-3 py-3">安全聲明</th>
            </tr>
          </thead>
          <tbody>
            {rsvps.length === 0 ? (
              <tr>
                <td className="px-3 py-3" colSpan={5}>
                  還沒有人報名。
                </td>
              </tr>
            ) : null}
            {rsvps.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-3 py-3">{row.nickname}</td>
                <td className="px-3 py-3">{row.email}</td>
                <td className="px-3 py-3">{row.phone ?? "未留"}</td>
                <td className="px-3 py-3">{statusLabel[row.status]}</td>
                <td className="px-3 py-3">{row.safetyDeclared ? "已勾選" : "未勾選"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <h3 className="text-2xl font-bold">編輯</h3>
      <AdminActivityForm activity={activity} />
    </div>
  );
}
