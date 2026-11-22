import { ActivityCard } from "@/components/activity-card";
import { PageHero } from "@/components/page-hero";
import { BRANCHES, branchCounties } from "@/lib/branches";
import { CATEGORIES } from "@/lib/constants";
import { photos } from "@/lib/photos";
import { getRepo } from "@/lib/repo";

export const metadata = { title: "活動" };

const field = "h-12 rounded-xl border border-[#4f7260] bg-white px-3 text-base";

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
    <div className="grid gap-8">
      <PageHero kicker="活動" title="近期活動" image={photos.gardenWalk.src} alt={photos.gardenWalk.alt}>
        健走、瑜珈、太極、健康講座、據點聚會、健康交流與 21 日挑戰。大臺北範例場次排在前面。標示「範例資料」的不是正式邀約。
      </PageHero>
      <form method="get" className="grid gap-3 rounded-[1.5rem] bg-white p-4 shadow-[0_16px_40px_-28px_rgba(14,51,40,0.55)] ring-1 ring-[#14603a]/10 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <label className="grid gap-2 text-base">
          縣市
          <select name="city" defaultValue={city} className={field}>
            <option value="">全部</option>
            <option>新北市</option>
            {counties.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-base">
          據點
          <select name="branch" defaultValue={branch} className={field}>
            <option value="">全部</option>
            {BRANCHES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.shortName}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-base">
          類型
          <select name="category" defaultValue={category} className={field}>
            <option value="">全部</option>
            {CATEGORIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="h-12 rounded-full bg-[#14603a] px-4 text-white hover:bg-[#0f5132]">
          篩選
        </button>
      </form>
      {activities.length === 0 ? <p className="rounded-[1.25rem] bg-white p-5">目前沒有符合的活動。可以清掉篩選再看一次。</p> : null}
      <div className="grid gap-4">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}
