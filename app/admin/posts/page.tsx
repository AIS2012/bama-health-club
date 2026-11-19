import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { setPostStatusAction } from "@/lib/actions";
import { getRepo } from "@/lib/repo";

export const metadata = { title: "管理公告" };

export default async function AdminPostsPage() {
  const posts = await (await getRepo()).adminListPosts();
  if (!Array.isArray(posts)) return <p>{posts.ok ? "無法讀取公告" : posts.error}</p>;
  return (
    <div className="grid gap-4">
      <h2 className="text-3xl font-bold">公告</h2>
      {posts.length === 0 ? <p>還沒有公告。</p> : null}
      {posts.map((post) => (
        <article key={post.id} className="grid gap-3 rounded-xl bg-white p-5 ring-1 ring-[#12382c]/20">
          <p className="font-medium">{post.status === "hidden" ? "已隱藏" : "顯示中"} · {post.authorName}</p>
          <p className="whitespace-pre-wrap">{post.body}</p>
          <ActionForm action={setPostStatusAction}>
            <input type="hidden" name="post_id" value={post.id} />
            <input type="hidden" name="status" value={post.status === "hidden" ? "visible" : "hidden"} />
            <Button type="submit" variant="outline">
              {post.status === "hidden" ? "恢復顯示" : "隱藏"}
            </Button>
          </ActionForm>
        </article>
      ))}
    </div>
  );
}
