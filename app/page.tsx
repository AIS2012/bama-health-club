import Link from "next/link";
import { ActivityCard } from "@/components/activity-card";
import { MEDICAL_DISCLAIMER } from "@/lib/constants";
import { getRepo } from "@/lib/repo";

const faqs = [
  {
    q: "入會要錢嗎？",
    a: "現在不用。免費會員就能報名活動、加入社團、參加挑戰。以後如果有付費方案，會先在網站寫清楚，不會用電話或簡訊叫您轉帳。",
  },
  {
    q: "這是醫院或復健嗎？",
    a: "不是。這裡是同好俱樂部。內容不是診斷、治療或療效承諾，也不能取代醫師。",
  },
  {
    q: "工作人員會請我操作 ATM 嗎？",
    a: "不會。任何人這樣說，都不是本俱樂部的人。請拒絕，並用檢舉按鈕或告訴在場志工。",
  },
  {
    q: "活動額滿了怎麼辦？",
    a: "可以登記候補。有人取消時，依登記順序遞補，並盡量寄信通知。",
  },
  {
    q: "我只想聽講座、不想運動？",
    a: "可以。報名時會看到這是運動聚會還是講座，挑自己想參加的即可。",
  },
];

export default async function HomePage() {
  const repo = await getRepo();
  const activities = (await repo.listActivities()).slice(0, 3);
  return (
    <div className="grid gap-12">
      <section className="grid gap-6 rounded-2xl bg-[#12382c] px-6 py-10 text-[#f6f1e6] sm:px-10">
        <p className="text-base tracking-widest text-[#f3d48a]">大臺北 · 熟齡與退休朋友</p>
        <h1 className="max-w-3xl text-4xl leading-tight font-bold sm:text-5xl">一起走路、伸展、聽一場清楚的講座。</h1>
        <p className="max-w-3xl text-xl leading-relaxed">
          八馬健康俱樂部是給熟齡朋友的會員平台。先從大臺北開始：健走、瑜珈、太極和健康講座，都由真人在固定時間、固定地點碰面。
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/signup" className="inline-flex min-h-14 items-center rounded-lg bg-[#f3d48a] px-5 text-lg font-bold text-[#1a1200]">
            免費加入
          </Link>
          <Link href="/activities" className="inline-flex min-h-14 items-center rounded-lg border border-white px-5 text-lg text-white">
            先看活動
          </Link>
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="text-3xl font-bold">入會怎麼運作</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {[
            ["1", "用信箱加入", "填暱稱、大臺北的行政區和興趣。電話可以不留。不需要病歷。"],
            ["2", "挑一場活動", "看時間、地點、名額和難度。報名前勾選安全聲明。額滿就候補。"],
            ["3", "社團與小挑戰", "加入公開社團看公告，或參加 21 天健走這類自己打卡的小挑戰。"],
          ].map(([step, title, body]) => (
            <li key={step} className="grid gap-2 rounded-xl bg-white p-5 ring-1 ring-[#12382c]/20">
              <span className="text-lg font-bold text-[#12382c]">第 {step} 步</span>
              <h3 className="text-2xl font-bold">{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
        <p className="rounded-xl bg-white p-5 ring-1 ring-[#12382c]/20">
          目前方案是<strong>免費會員</strong>。資料庫已預留方案名稱與價格欄位，這一版沒有付款、沒有信用卡。
        </p>
      </section>

      <section className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-3xl font-bold">即將舉行</h2>
          <Link href="/activities" className="text-lg underline">
            全部活動
          </Link>
        </div>
        {activities.length === 0 ? <p>目前沒有即將舉行的活動。</p> : null}
        <div className="grid gap-4">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="text-3xl font-bold">常見問題</h2>
        {faqs.map((item) => (
          <details key={item.q} className="rounded-xl bg-white p-4 ring-1 ring-[#12382c]/20">
            <summary className="cursor-pointer min-h-12 text-xl font-bold">{item.q}</summary>
            <p className="pt-3">{item.a}</p>
          </details>
        ))}
      </section>

      <p className="text-base">{MEDICAL_DISCLAIMER}</p>
    </div>
  );
}
