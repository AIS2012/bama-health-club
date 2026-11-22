import Link from "next/link";
import { redirect } from "next/navigation";
import { getRepo } from "@/lib/repo";

const links = [
  ["/admin", "總覽"],
  ["/admin/activities", "活動"],
  ["/admin/groups", "社團"],
  ["/admin/challenges", "挑戰"],
  ["/admin/members", "會員"],
  ["/admin/posts", "公告"],
  ["/admin/reports", "檢舉"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const repo = await getRepo();
  const user = await repo.getSessionUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin" && user.role !== "branch_manager") redirect("/");
  const visible = user.role === "branch_manager" ? [["/admin/activities", "本場地活動"]] : links;
  return (
    <div className="grid gap-6">
      <div className="grid gap-3">
        <h1 className="text-4xl font-bold">{user.role === "branch_manager" ? "場地活動管理" : "管理後台"}</h1>
        <nav aria-label="管理" className="flex flex-wrap gap-2">
          {visible.map(([href, label]) => (
            <Link key={href} href={href} className="inline-flex min-h-12 items-center rounded-lg bg-white px-3 ring-1 ring-[#14603a]/20">
              {label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
}
