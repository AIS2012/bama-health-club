import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { setRoleAction, setVerifiedAction } from "@/lib/actions";
import { BRANCHES } from "@/lib/branches";
import { ROLE_LABEL } from "@/lib/constants";
import { getRepo } from "@/lib/repo";

export const metadata = { title: "管理會員" };

export default async function AdminMembersPage() {
  const members = await (await getRepo()).adminListMembers();
  if (!Array.isArray(members)) return <p>{members.ok ? "無法讀取會員" : members.error}</p>;
  return (
    <div className="grid gap-4">
      <h2 className="text-3xl font-bold">會員</h2>
      {members.map((member) => (
        <article key={member.id} className="grid gap-3 rounded-xl bg-white p-5 shadow-[0_16px_40px_-28px_rgba(14,51,40,0.55)] ring-1 ring-[#14603a]/12">
          <h3 className="text-2xl font-bold">
            {member.nickname} {member.verified ? "· 已驗證" : "· 未驗證"}
          </h3>
          <p>
            {member.email}
            <br />
            {member.city}
            {member.district} · {ROLE_LABEL[member.role]} · {member.phone ?? "未留電話"}
          </p>
          <div className="flex flex-wrap gap-3">
            <ActionForm action={setVerifiedAction}>
              <input type="hidden" name="user_id" value={member.id} />
              <input type="hidden" name="verified" value={member.verified ? "false" : "true"} />
              <Button type="submit" variant="outline">
                {member.verified ? "取消驗證" : "標記已驗證"}
              </Button>
            </ActionForm>
            <ActionForm action={setRoleAction} className="sm:grid-cols-[12rem_auto] sm:items-center">
              <input type="hidden" name="user_id" value={member.id} />
              <select name="role" defaultValue={member.role} className="h-12 rounded-lg border bg-card px-3">
                <option value="member">會員</option>
                <option value="organizer">主辦</option>
                <option value="branch_manager">場地管理員</option>
                <option value="admin">管理員</option>
              </select>
              <select name="managed_branch_id" defaultValue={member.managedBranchId ?? ""} className="h-12 rounded-lg border bg-card px-3">
                <option value="">上課場地（場地管理員必填）</option>
                {BRANCHES.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.shortName}
                  </option>
                ))}
              </select>
              <Button type="submit">更新角色</Button>
            </ActionForm>
          </div>
        </article>
      ))}
    </div>
  );
}
