import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveChallengeAction } from "@/lib/actions";
import { CATEGORIES } from "@/lib/constants";
import { getRepo } from "@/lib/repo";

export const metadata = { title: "管理挑戰" };

export default async function AdminChallengesPage() {
  const challenges = await (await getRepo()).listChallenges();
  return (
    <div className="grid gap-6">
      <h2 className="text-3xl font-bold">挑戰</h2>
      <ul className="grid gap-2">
        {challenges.map((challenge) => (
          <li key={challenge.id} className="rounded-xl bg-white p-4 ring-1 ring-[#12382c]/20">
            {challenge.title} · {challenge.durationDays} 天{challenge.isSample ? " · 範例" : ""}
          </li>
        ))}
      </ul>
      <ActionForm action={saveChallengeAction} className="rounded-xl bg-white p-5 ring-1 ring-[#12382c]/20">
        <label className="grid gap-2">
          名稱
          <Input name="title" required />
        </label>
        <label className="grid gap-2">
          說明
          <Textarea name="description" required className="min-h-28 text-base" />
        </label>
        <label className="grid gap-2">
          天數
          <Input name="duration_days" type="number" min={3} max={90} defaultValue={21} required />
        </label>
        <label className="grid gap-2">
          類型
          <select name="category" className="h-12 rounded-lg border bg-card px-3">
            {CATEGORIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="flex min-h-12 items-center gap-3">
          <input type="checkbox" name="is_sample" className="size-6" />
          範例資料
        </label>
        <Button type="submit">建立挑戰</Button>
      </ActionForm>
    </div>
  );
}
