import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AREAS, UNSET_DISTRICT, areaIdFor } from "@/lib/areas";
import { completeLineProfileAction } from "@/lib/actions";
import type { Profile } from "@/lib/types";

export function LineProfileForm({ user, next }: { user: Profile; next: string }) {
  const area = user.district === UNSET_DISTRICT ? "" : areaIdFor(user.city, user.district);
  return (
    <ActionForm action={completeLineProfileAction} className="rounded-[1.5rem] bg-white p-5 shadow-[0_16px_40px_-28px_rgba(14,51,40,0.55)] ring-1 ring-[#14603a]/10 sm:p-6">
      <input type="hidden" name="next" value={next} />
      <div className="grid gap-2">
        <Label htmlFor="nickname">姓名或暱稱</Label>
        <Input id="nickname" name="nickname" defaultValue={user.nickname} maxLength={20} required autoComplete="nickname" className="h-14 text-lg" />
        <p className="text-lg text-[#3c5146]">已用 LINE 顯示名稱帶入，可以改成您想被稱呼的名字。</p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">手機（可不填）</Label>
        <Input id="phone" name="phone" type="tel" defaultValue={user.phone ?? ""} autoComplete="tel" placeholder="可不填" className="h-14 text-lg" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="area_id">常去區域（可不填）</Label>
        <select id="area_id" name="area_id" defaultValue={area} className="h-14 rounded-lg border border-input bg-card px-3 text-lg">
          <option value="">先不填</option>
          {AREAS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <label className="flex min-h-14 items-start gap-3 text-lg">
        <input type="checkbox" name="consent" required defaultChecked={user.lineConsent} className="mt-1 size-7 accent-[#06C755]" />
        <span>我同意健康俱樂部使用 LINE 顯示名稱建立免費會員，並已看過隱私權政策草稿。</span>
      </label>
      <Button type="submit" className="min-h-16 text-xl">
        完成加入
      </Button>
    </ActionForm>
  );
}
