import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { checkInAction, joinChallengeAction } from "@/lib/actions";
import { MEDICAL_DISCLAIMER } from "@/lib/constants";
import { getRepo } from "@/lib/repo";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const challenge = await (await getRepo()).getChallenge(id);
  return { title: challenge?.title ?? "挑戰" };
}

export default async function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const repo = await getRepo();
  const user = await repo.getSessionUser();
  const challenge = await repo.getChallenge(id);
  if (!challenge) notFound();
  const ratio = Math.min(challenge.checkinCount / challenge.durationDays, 1);

  return (
    <div className="grid gap-6">
      <p>
        <Link href="/challenges" className="underline">
          回挑戰列表
        </Link>
      </p>
      {challenge.isSample ? <p className="rounded-lg bg-[#fff3bf] px-3 py-2 font-medium">範例資料</p> : null}
      <h1 className="text-4xl font-bold">{challenge.title}</h1>
      <p className="text-lg">{challenge.description}</p>
      <p>{MEDICAL_DISCLAIMER}</p>
      {challenge.joined ? (
        <section className="grid gap-3 rounded-xl bg-white p-5 ring-1 ring-[#88012B]/20">
          <h2 className="text-2xl font-bold">我的進度</h2>
          <p className="text-xl">
            {challenge.checkinCount} / {challenge.durationDays} 天
          </p>
          <div
            className="h-5 overflow-hidden rounded-full bg-[#e8f3fb]"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={challenge.durationDays}
            aria-valuenow={challenge.checkinCount}
            aria-label="打卡進度"
          >
            <div className="h-full bg-[#88012B]" style={{ width: `${ratio * 100}%` }} />
          </div>
          <ActionForm action={checkInAction}>
            <input type="hidden" name="challenge_id" value={challenge.id} />
            <Button type="submit" disabled={challenge.checkedInToday}>
              {challenge.checkedInToday ? "今天已打卡" : "今天打卡"}
            </Button>
          </ActionForm>
          {challenge.checkinDates.length > 0 ? (
            <p>已打卡日期：{challenge.checkinDates.join("、")}</p>
          ) : (
            <p>還沒有打卡紀錄。</p>
          )}
        </section>
      ) : null}
      {user && !challenge.joined ? (
        <ActionForm action={joinChallengeAction}>
          <input type="hidden" name="challenge_id" value={challenge.id} />
          <Button type="submit">加入這個挑戰</Button>
        </ActionForm>
      ) : null}
      {!user ? (
        <p>
          <Link className="underline" href={`/login?next=/challenges/${challenge.id}`}>
            登入
          </Link>
          後可以加入並打卡。
        </p>
      ) : null}
    </div>
  );
}
