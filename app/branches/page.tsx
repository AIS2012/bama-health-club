import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { BRANCHES, HOURS_NOTE, branchCounties } from "@/lib/branches";
import { photos } from "@/lib/photos";

export const metadata = { title: "上課場地" };

export default async function BranchesPage({
  searchParams,
}: {
  searchParams: Promise<{ county?: string }>;
}) {
  const params = await searchParams;
  const counties = branchCounties();
  const county = params.county && counties.includes(params.county) ? params.county : "";
  const branches = BRANCHES.filter((branch) => (county ? branch.county === county : true));
  const featured = branches[0]?.id === "daan" ? branches[0] : null;
  const rest = featured ? branches.slice(1) : branches;

  return (
    <div className="grid gap-8">
      <PageHero kicker="上課場地" title="大臺北的室內教室" image={photos.hero.src} alt={photos.hero.alt}>
        課程和講座集中在這些室內場地。以下是示範用的區域說明，方便看活動怎麼依場地整理，不是正式租約。
      </PageHero>
      <p className="rounded-[1.25rem] border border-[#9a3412] bg-[#fff7ed] px-4 py-3">{HOURS_NOTE}</p>
      <form method="get" className="grid gap-3 rounded-[1.5rem] bg-white p-4 shadow-[0_16px_40px_-28px_rgba(14,51,40,0.55)] ring-1 ring-[#14603a]/10 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="grid gap-2 text-base">
          縣市
          <select name="county" defaultValue={county} className="h-12 rounded-xl border border-[#4f7260] bg-white px-3 text-base">
            <option value="">全部</option>
            {counties.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="h-12 rounded-full bg-[#14603a] px-5 text-white hover:bg-[#0f5132]">
          篩選
        </button>
      </form>
      {featured ? (
        <article id={featured.id} className="grid overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_50px_-32px_rgba(14,51,40,0.65)] ring-1 ring-[#14603a]/10 md:grid-cols-[0.85fr_1.15fr]">
          <div className="relative min-h-52">
            <Image src={photos.hero.src} alt={photos.hero.alt} fill loading="eager" className="object-cover object-[72%_42%]" sizes="(min-width: 768px) 24rem, 100vw" />
          </div>
          <div className="grid content-center gap-2 p-6 sm:p-8">
            <p className="font-medium text-[#14603a]">大臺北 · {featured.county}</p>
            <h2 className="text-3xl">{featured.name}</h2>
            <p className="text-lg">{featured.address}</p>
            <p>
              電子郵件：<a className="underline" href={`mailto:${featured.email}`}>{featured.email}</a>
            </p>
            <p>
              <a className="inline-flex min-h-12 items-center font-medium text-[#0f5132] underline underline-offset-4" href={`/activities?branch=${featured.id}`}>
                看這個場地的活動
              </a>
            </p>
          </div>
        </article>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {rest.map((branch) => (
          <article key={branch.id} id={branch.id} className="grid gap-2 rounded-[1.5rem] bg-white p-5 shadow-[0_16px_40px_-28px_rgba(14,51,40,0.55)] ring-1 ring-[#14603a]/10">
            <p className="font-medium text-[#14603a]">{branch.county}</p>
            <h2 className="text-2xl">{branch.name}</h2>
            <p className="text-lg">{branch.address}</p>
            <p>
              電子郵件：<a className="underline" href={`mailto:${branch.email}`}>{branch.email}</a>
            </p>
            <p>
              <a className="inline-flex min-h-12 items-center font-medium text-[#0f5132] underline underline-offset-4" href={`/activities?branch=${branch.id}`}>
                看這個場地的活動
              </a>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
