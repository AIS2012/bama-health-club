import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveGroupAction } from "@/lib/actions";
import { CITIES, INTERESTS } from "@/lib/constants";
import { getRepo } from "@/lib/repo";

export const metadata = { title: "管理社團" };

export default async function AdminGroupsPage() {
  const groups = await (await getRepo()).listGroups();
  return (
    <div className="grid gap-6">
      <h2 className="text-3xl font-bold">社團</h2>
      <ul className="grid gap-2">
        {groups.map((group) => (
          <li key={group.id} className="rounded-xl bg-white p-4 ring-1 ring-[#88012B]/20">
            {group.name} · {group.memberCount} 人{group.isSample ? " · 範例" : ""}
          </li>
        ))}
      </ul>
      <h3 className="text-2xl font-bold">新增社團</h3>
      <ActionForm action={saveGroupAction} className="rounded-xl bg-white p-5 ring-1 ring-[#88012B]/20">
        <label className="grid gap-2">
          名稱
          <Input name="name" required />
        </label>
        <label className="grid gap-2">
          說明
          <Textarea name="description" required minLength={4} className="min-h-28 text-base" />
        </label>
        <label className="grid gap-2">
          興趣
          <select name="interest" className="h-12 rounded-lg border bg-card px-3">
            {INTERESTS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          縣市
          <select name="city" className="h-12 rounded-lg border bg-card px-3">
            <option value="">不限</option>
            {CITIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="flex min-h-12 items-center gap-3">
          <input type="checkbox" name="is_sample" className="size-6" />
          範例資料
        </label>
        <Button type="submit">建立社團</Button>
      </ActionForm>
    </div>
  );
}
