import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { photos } from "@/lib/photos";
import { getRepo } from "@/lib/repo";

export const metadata = { title: "挑戰" };

export default async function ChallengesPage() {
  const repo = await getRepo();
  const challenges = await repo.listChallenges();
  return (
    <div className="grid gap-8">
      <PageHero kicker="挑戰" title="小挑戰" image={photos.yoga.src} alt={photos.yoga.alt}>
        自己打卡就好。不計步數、不上傳健檢，漏一天也可以繼續。這不是療程。
      </PageHero>
      {challenges.length === 0 ? <p>目前沒有挑戰。</p> : null}
      <div className="grid gap-4">
        {challenges.map((challenge) => {
          const ratio = Math.min(challenge.checkinCount / challenge.durationDays, 1);
          return (
            <article key={challenge.id} className="grid gap-3 rounded-[1.5rem] bg-white p-5 shadow-[0_16px_40px_-28px_rgba(14,51,40,0.55)] ring-1 ring-[#14603a]/10 sm:p-6">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#e3f3e6] px-3 py-1 text-[#0f5132]">{challenge.category}</span>
                {challenge.isSample ? <span className="rounded-full bg-[#fff3bf] px-3 py-1 font-medium text-[#1a1200]">範例資料</span> : null}
              </div>
              <h2 className="text-2xl">
                <Link href={`/challenges/${challenge.id}`} className="hover:underline">
                  {challenge.title}
                </Link>
              </h2>
              <p>{challenge.description}</p>
              {challenge.joined ? (
                <div className="grid gap-2">
                  <p>
                    已打卡 {challenge.checkinCount} / {challenge.durationDays} 天
                    {challenge.checkedInToday ? " · 今天已完成" : ""}
                  </p>
                  <div className="h-4 overflow-hidden rounded-full bg-[#e3f3e6]" aria-hidden>
                    <div className="h-full bg-[#14603a]" style={{ width: `${ratio * 100}%` }} />
                  </div>
                </div>
              ) : (
                <p>共 {challenge.durationDays} 天</p>
              )}
              <Link href={`/challenges/${challenge.id}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#14603a] px-4 text-white hover:bg-[#0f5132]">
                查看挑戰
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
