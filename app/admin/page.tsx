import Link from "next/link";
import { redirect } from "next/navigation";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { sendRemindersAction } from "@/lib/actions";
import { getRepo } from "@/lib/repo";

export const metadata = { title: "管理總覽" };

export default async function AdminHomePage() {
  const repo = await getRepo();
  const user = await repo.getSessionUser();
  if (user?.role === "branch_manager") redirect("/admin/activities");
  const [activities, groups, challenges, members, reports] = await Promise.all([
    repo.adminListActivities(),
    repo.listGroups(),
    repo.listChallenges(),
    repo.adminListMembers(),
    repo.adminListReports(),
  ]);
  const memberCount = Array.isArray(members) ? members.length : 0;
  const openReports = Array.isArray(reports) ? reports.filter((item) => item.status === "open").length : 0;
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ["活動", activities.length, "/admin/activities"],
          ["社團", groups.length, "/admin/groups"],
          ["挑戰", challenges.length, "/admin/challenges"],
          ["會員", memberCount, "/admin/members"],
          ["未處理檢舉", openReports, "/admin/reports"],
        ].map(([label, count, href]) => (
          <Link key={String(label)} href={String(href)} className="rounded-xl bg-white p-5 shadow-[0_16px_40px_-28px_rgba(14,51,40,0.55)] ring-1 ring-[#14603a]/12">
            <span className="block text-lg">{label}</span>
            <span className="text-4xl font-bold">{count}</span>
          </Link>
        ))}
      </div>
      <section className="grid gap-3 rounded-xl bg-white p-5 shadow-[0_16px_40px_-28px_rgba(14,51,40,0.55)] ring-1 ring-[#14603a]/12">
        <h2 className="text-2xl font-bold">活動提醒信</h2>
        <p>寄給未來 30 小時內已報名的會員。沒有 RESEND_API_KEY 時不會真的寄出。</p>
        <ActionForm action={sendRemindersAction}>
          <Button type="submit">寄出即將開始的提醒</Button>
        </ActionForm>
      </section>
    </div>
  );
}
