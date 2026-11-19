import { ActivityCard } from "@/components/activity-card";
import { BRANCHES, branchCounties } from "@/lib/branches";
import { CATEGORIES } from "@/lib/constants";
import { getRepo } from "@/lib/repo";

export const metadata = { title: "活動" };

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; category?: string; branch?: string }>;
}) {
  const params = await searchParams;
  const counties = branchCounties();
  const city = params.city && (counties.includes(params.city) || params.city === "新北市") ? params.city : "";
  const category = params.category && CATEGORIES.includes(params.category as (typeof CATEGORIES)[number]) ? params.category : "";
  const branch = params.branch && BRANCHES.some((item) => item.id === params.branch) ? params.branch : "";
  const repo = await getRepo();
  const activities = await repo.listActivities({
    city: city || undefined,
    category: category || undefined,
    branchId: branch || undefined,
  });

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="text-4xl font-bold">活動</h1>
        <p>健走、瑜珈、太極、健康講座、據點聚會、樂齡／博覽會與 21 日挑戰。大臺北範例場次排在前面。標示「範例資料」的不是正式邀約。</p>
      </div>
      <form method="get" className="grid gap-3 rounded-xl bg-white p-4 ring-1 ring-[#88012B]/20 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <label className="grid gap-2">
          縣市
          <select name="city" defaultValue={city} className="h-12 rounded-lg border bg-card px-3">
            <option value="">全部</option>
            <option>新北市</option>
            {counties.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          據點
          <select name="branch" defaultValue={branch} className="h-12 rounded-lg border bg-card px-3">
            <option value="">全部</option>
            {BRANCHES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.shortName}
              </option>
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
        <button type="submit" className="h-12 rounded-lg bg-[#88012B] px-4 text-white">
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
