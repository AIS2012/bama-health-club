import Link from "next/link";
import { getRepo } from "@/lib/repo";

export const metadata = { title: "挑戰" };

export default async function ChallengesPage() {
  const repo = await getRepo();
  const challenges = await repo.listChallenges();
  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="text-4xl font-bold">小挑戰</h1>
        <p>自己打卡就好。不計步數、不上傳健檢，漏一天也可以繼續。這不是療程。</p>
      </div>
      {challenges.length === 0 ? <p>目前沒有挑戰。</p> : null}
      <div className="grid gap-4">
        {challenges.map((challenge) => {
          const ratio = Math.min(challenge.checkinCount / challenge.durationDays, 1);
          return (
            <article key={challenge.id} className="grid gap-3 rounded-xl bg-white p-5 ring-1 ring-[#88012B]/20">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#e8f3fb] px-3 py-1">{challenge.category}</span>
                {challenge.isSample ? <span className="rounded-full bg-[#fff3bf] px-3 py-1 font-medium">範例資料</span> : null}
              </div>
              <h2 className="text-2xl font-bold">
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
                  <div className="h-4 overflow-hidden rounded-full bg-[#e8f3fb]" aria-hidden>
                    <div className="h-full bg-[#88012B]" style={{ width: `${ratio * 100}%` }} />
                  </div>
                </div>
              ) : (
                <p>共 {challenge.durationDays} 天</p>
              )}
              <Link href={`/challenges/${challenge.id}`} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#88012B] px-4 text-white">
                查看挑戰
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
