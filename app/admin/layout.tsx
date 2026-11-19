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
  if (user.role !== "admin") redirect("/");
  return (
    <div className="grid gap-6">
      <div className="grid gap-3">
        <h1 className="text-4xl font-bold">管理後台</h1>
        <nav aria-label="管理" className="flex flex-wrap gap-2">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="inline-flex min-h-12 items-center rounded-lg bg-white px-3 ring-1 ring-[#12382c]/30">
              {label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
}
