import { BRANCHES, HOURS_NOTE, branchCounties } from "@/lib/branches";
import { GSC_PHONE } from "@/lib/constants";

export const metadata = { title: "據點" };

export default async function BranchesPage({
  searchParams,
}: {
  searchParams: Promise<{ county?: string }>;
}) {
  const params = await searchParams;
  const counties = branchCounties();
  const county = params.county && counties.includes(params.county) ? params.county : "";
  const branches = BRANCHES.filter((branch) => (county ? branch.county === county : true));

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="text-4xl font-bold">台灣據點</h1>
        <p>
          以下 16 處地址來自 Total Swiss 官網公開的營業據點頁，供找活動與講座使用。本頁只列台灣據點。
        </p>
        <p className="rounded-xl bg-[#fff7ed] px-4 py-3">{HOURS_NOTE}</p>
      </div>
      <form method="get" className="grid gap-3 rounded-xl bg-white p-4 ring-1 ring-[#88012B]/20 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="grid gap-2">
          縣市
          <select name="county" defaultValue={county} className="h-12 rounded-lg border bg-card px-3">
            <option value="">全部</option>
            {counties.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="h-12 rounded-lg bg-[#88012B] px-4 text-white">
          篩選
        </button>
      </form>
      <div className="grid gap-4">
        {branches.map((branch) => (
          <article key={branch.id} className="grid gap-2 rounded-xl bg-white p-5 ring-1 ring-[#88012B]/20">
            <p className="font-medium text-[#0058A5]">{branch.county}</p>
            <h2 className="text-2xl font-bold">{branch.name}</h2>
            <p className="text-lg">{branch.address}</p>
            <p>
              電子郵件：<a className="underline" href={`mailto:${branch.email}`}>{branch.email}</a>
            </p>
            <p>客服電話：GSC 全球客服中心 {GSC_PHONE}</p>
            <p>
              <a className="underline" href={`/activities?branch=${branch.id}`}>
                看這個據點的活動
              </a>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
