import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveActivityAction } from "@/lib/actions";
import { CATEGORIES, CITIES, DISTRICTS } from "@/lib/constants";
import { isoToTaipeiInput } from "@/lib/format";
import type { ActivityDetail } from "@/lib/types";

export function AdminActivityForm({ activity }: { activity?: ActivityDetail }) {
  const city = activity?.city ?? "臺北市";
  const districts = DISTRICTS[city as keyof typeof DISTRICTS] ?? DISTRICTS["臺北市"];
  return (
    <ActionForm action={saveActivityAction} className="rounded-xl bg-white p-5 ring-1 ring-[#12382c]/20">
      <input type="hidden" name="id" value={activity?.id ?? ""} />
      <label className="grid gap-2">
        名稱
        <Input name="title" required defaultValue={activity?.title ?? ""} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2">
          種類
          <select name="kind" defaultValue={activity?.kind ?? "exercise"} className="h-12 rounded-lg border bg-card px-3">
            <option value="exercise">運動聚會</option>
            <option value="talk">健康講座</option>
          </select>
        </label>
        <label className="grid gap-2">
          類型
          <select name="category" defaultValue={activity?.category ?? "健走"} className="h-12 rounded-lg border bg-card px-3">
            {CATEGORIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="grid gap-2">
        說明
        <Textarea name="description" required minLength={10} defaultValue={activity?.description ?? ""} className="min-h-32 text-base" />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2">
          開始（臺北時間）
          <Input name="starts_at" type="datetime-local" required defaultValue={activity ? isoToTaipeiInput(activity.startsAt) : ""} />
        </label>
        <label className="grid gap-2">
          結束（臺北時間）
          <Input name="ends_at" type="datetime-local" required defaultValue={activity ? isoToTaipeiInput(activity.endsAt) : ""} />
        </label>
      </div>
      <label className="grid gap-2">
        地點名稱
        <Input name="location_name" required defaultValue={activity?.locationName ?? ""} />
      </label>
      <label className="grid gap-2">
        地址
        <Input name="address" required defaultValue={activity?.address ?? ""} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2">
          縣市
          <select name="city" defaultValue={city} className="h-12 rounded-lg border bg-card px-3">
            {CITIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          行政區
          <select name="district" defaultValue={activity?.district ?? districts[0]} className="h-12 rounded-lg border bg-card px-3">
            {[...DISTRICTS["臺北市"], ...DISTRICTS["新北市"]].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2">
          名額
          <Input name="capacity" type="number" min={1} required defaultValue={activity?.capacity ?? 20} />
        </label>
        <label className="grid gap-2">
          難度
          <select name="difficulty" defaultValue={activity?.difficulty ?? "easy"} className="h-12 rounded-lg border bg-card px-3">
            <option value="easy">輕鬆</option>
            <option value="moderate">適中</option>
            <option value="challenging">具挑戰</option>
          </select>
        </label>
      </div>
      <label className="grid gap-2">
        主辦顯示名稱
        <Input name="organizer_name" required defaultValue={activity?.organizerName ?? ""} />
      </label>
      <label className="grid gap-2">
        主辦聯絡方式（只給已登入會員看）
        <Input name="organizer_contact" required defaultValue={activity?.organizerContact ?? ""} />
      </label>
      <label className="flex min-h-12 items-center gap-3">
        <input type="checkbox" name="organizer_verified" defaultChecked={activity?.organizerVerified ?? false} className="size-6" />
        顯示已驗證主辦徽章
      </label>
      <label className="flex min-h-12 items-center gap-3">
        <input type="checkbox" name="is_sample" defaultChecked={activity?.isSample ?? false} className="size-6" />
        這是範例資料
      </label>
      <label className="grid gap-2">
        狀態
        <select name="status" defaultValue={activity?.status ?? "published"} className="h-12 rounded-lg border bg-card px-3">
          <option value="published">公開</option>
          <option value="draft">草稿</option>
          <option value="cancelled">取消</option>
        </select>
      </label>
      <Button type="submit">{activity ? "儲存活動" : "建立活動"}</Button>
    </ActionForm>
  );
}
