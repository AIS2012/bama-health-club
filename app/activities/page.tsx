import { ActivityCard } from "@/components/activity-card";
import { CATEGORIES, CITIES } from "@/lib/constants";
import { getRepo } from "@/lib/repo";

export const metadata = { title: "活動" };

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; category?: string }>;
}) {
  const params = await searchParams;
  const city = params.city && CITIES.includes(params.city as (typeof CITIES)[number]) ? params.city : "";
  const category = params.category && CATEGORIES.includes(params.category as (typeof CATEGORIES)[number]) ? params.category : "";
  const repo = await getRepo();
  const activities = await repo.listActivities({
    city: city || undefined,
    category: category || undefined,
  });

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="text-4xl font-bold">活動</h1>
        <p>健走、瑜珈、太極與講座。標示「範例資料」的場次是示範，不是正式邀約。</p>
      </div>
      <form method="get" className="grid gap-3 rounded-xl bg-white p-4 ring-1 ring-[#12382c]/20 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="grid gap-2">
          縣市
          <select name="city" defaultValue={city} className="h-12 rounded-lg border bg-card px-3">
            <option value="">全部</option>
            {CITIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          類型
          <select name="category" defaultValue={category} className="h-12 rounded-lg border bg-card px-3">
            <option value="">全部</option>
            {CATEGORIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="h-12 rounded-lg bg-[#12382c] px-4 text-white">
          篩選
        </button>
      </form>
      {activities.length === 0 ? <p className="rounded-xl bg-white p-5">目前沒有符合的活動。可以清掉篩選再看一次。</p> : null}
      <div className="grid gap-4">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}
