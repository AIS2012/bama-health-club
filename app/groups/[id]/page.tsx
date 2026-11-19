import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/action-form";
import { ReportButton } from "@/components/report-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createPostAction, joinGroupAction, leaveGroupAction } from "@/lib/actions";
import { formatTaipei } from "@/lib/format";
import { getRepo } from "@/lib/repo";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const group = await (await getRepo()).getGroup(id);
  return { title: group?.name ?? "社團" };
}

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const repo = await getRepo();
  const user = await repo.getSessionUser();
  const group = await repo.getGroup(id);
  if (!group) notFound();

  return (
    <div className="grid gap-6">
      <p>
        <Link href="/groups" className="underline">
          回社團列表
        </Link>
      </p>
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-[#e7f0ec] px-3 py-1">{group.interest}</span>
        {group.isSample ? <span className="rounded-full bg-[#fff3bf] px-3 py-1 font-medium">範例資料</span> : null}
      </div>
      <h1 className="text-4xl font-bold">{group.name}</h1>
      <p className="text-lg">{group.description}</p>
      <p>{group.memberCount} 位社員</p>
      {user && group.joined ? (
        <ActionForm action={leaveGroupAction}>
          <input type="hidden" name="group_id" value={group.id} />
          <Button type="submit" variant="outline">
            退出社團
          </Button>
        </ActionForm>
      ) : null}
      {user && !group.joined ? (
        <ActionForm action={joinGroupAction}>
          <input type="hidden" name="group_id" value={group.id} />
          <Button type="submit">加入社團</Button>
        </ActionForm>
      ) : null}
      {!user ? (
        <p>
          <Link className="underline" href={`/login?next=/groups/${group.id}`}>
            登入
          </Link>
          後可以加入並留言。
        </p>
      ) : null}

      <section className="grid gap-4">
        <h2 className="text-3xl font-bold">公告欄</h2>
        {group.posts.length === 0 ? <p className="rounded-xl bg-white p-5">還沒有公告。</p> : null}
        {group.posts.map((post) => (
          <article key={post.id} className="grid gap-3 rounded-xl bg-white p-5 ring-1 ring-[#12382c]/20">
            {post.status === "hidden" ? <p className="font-medium text-red-900">這則公告已隱藏，只有管理員和作者看得到。</p> : null}
            <p className="whitespace-pre-wrap text-lg">{post.body}</p>
            <p>
              {post.authorName}
              {post.authorVerified ? " · 已驗證" : ""} · {formatTaipei(post.createdAt)}
            </p>
            <div className="flex flex-wrap gap-2">
              <ReportButton targetType="post" targetId={post.id} label="檢舉這則公告" />
              {post.authorId ? <ReportButton targetType="user" targetId={post.authorId} label="檢舉作者" /> : null}
            </div>
          </article>
        ))}
      </section>

      {user && group.joined ? (
        <section className="grid gap-3 rounded-xl bg-white p-5 ring-1 ring-[#12382c]/20">
          <h2 className="text-2xl font-bold">寫一則公告</h2>
          <ActionForm action={createPostAction}>
            <input type="hidden" name="group_id" value={group.id} />
            <Textarea name="body" required minLength={2} maxLength={1000} className="min-h-32 text-base" placeholder="約時間、改地點或分享公開資訊。不要留轉帳帳號。" />
            <Button type="submit">發布</Button>
          </ActionForm>
        </section>
      ) : null}
    </div>
  );
}
