import Link from "next/link";
import { getRepo } from "@/lib/repo";

export const metadata = { title: "社團" };

export default async function GroupsPage() {
  const repo = await getRepo();
  const groups = await repo.listGroups();
  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="text-4xl font-bold">社團</h1>
        <p>公開社團，會員都可以加入，並在公告欄留言。請不要張貼轉帳帳號或醫療廣告。</p>
      </div>
      {groups.length === 0 ? <p>還沒有社團。</p> : null}
      <div className="grid gap-4">
        {groups.map((group) => (
          <article key={group.id} className="grid gap-3 rounded-xl bg-white p-5 ring-1 ring-[#88012B]/20">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#e8f3fb] px-3 py-1">{group.interest}</span>
              {group.city ? <span className="rounded-full bg-[#f6f1e6] px-3 py-1">{group.city}</span> : null}
              {group.isSample ? <span className="rounded-full bg-[#fff3bf] px-3 py-1 font-medium">範例資料</span> : null}
            </div>
            <h2 className="text-2xl font-bold">
              <Link href={`/groups/${group.id}`} className="hover:underline">
                {group.name}
              </Link>
            </h2>
            <p>{group.description}</p>
            <p>
              {group.memberCount} 人{group.joined ? " · 您已加入" : ""}
            </p>
            <Link href={`/groups/${group.id}`} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#88012B] px-4 text-white">
              進入社團
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
