import Link from "next/link";
import { ActivityCard } from "@/components/activity-card";
import { JOIN_BUSINESS_NOTE, JOIN_BUSINESS_URL, MEDICAL_DISCLAIMER } from "@/lib/constants";
import { getRepo } from "@/lib/repo";

const faqs = [
  {
    q: "俱樂部入會要錢嗎？",
    a: "不用。免費會員就能報名活動、加入社團、參加挑戰。這和加入 Total Swiss 事業是兩件事。",
  },
  {
    q: "加入事業是什麼？",
    a: "那是多層次傳銷事業機會，不是求職。需要推薦人，並經公司審核同意。請從官網的加入事業頁了解，本站不辦理入會事業。",
  },
  {
    q: "這是醫院或復健嗎？",
    a: "不是。這裡是一起運動、聽講座的俱樂部。內容不是診斷、治療或療效承諾。",
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
      <section className="grid gap-6 rounded-2xl bg-[#88012B] px-6 py-10 text-white sm:px-10">
        <p className="text-base font-bold tracking-wide text-[#FAC423]">Total Swiss 八馬國際事業</p>
        <h1 className="max-w-3xl text-4xl leading-tight font-bold sm:text-5xl">一起運動，也歡迎來據點聽講座。</h1>
        <p className="max-w-3xl text-xl leading-relaxed">
          八馬健康俱樂部給夥伴、愛用者和一般大眾。可以報名健走、瑜珈、太極、健康講座、據點聚會和 21 日挑戰。俱樂部入會免費，用來認識據點活動，不是醫療服務，也不談產品效果。
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/signup" className="inline-flex min-h-14 items-center rounded-lg bg-[#FAC423] px-5 text-lg font-bold text-[#222]">
            免費加入俱樂部
          </Link>
          <Link href="/activities" className="inline-flex min-h-14 items-center rounded-lg border border-white px-5 text-lg text-white">
            先看活動
          </Link>
          <Link href="/branches" className="inline-flex min-h-14 items-center rounded-lg border border-[#008fd5] px-5 text-lg text-white">
            找據點
          </Link>
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="text-3xl font-bold">入會怎麼運作</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {[
            ["1", "用信箱加入", "填暱稱、居住縣市和興趣。夥伴編號與常去據點可以之後再補。不需要病歷。"],
            ["2", "挑一場活動", "可依縣市或據點篩選。報名前勾選安全聲明。額滿就候補。"],
            ["3", "一起打卡", "加入社團，或參加 21 天自己打卡。不紀錄產品，也不上傳健檢。"],
          ].map(([step, title, body]) => (
            <li key={step} className="grid gap-2 rounded-xl bg-white p-5 ring-1 ring-[#88012B]/20">
              <span className="text-lg font-bold text-[#88012B]">第 {step} 步</span>
              <h3 className="text-2xl font-bold">{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
        <p className="rounded-xl bg-white p-5 ring-1 ring-[#88012B]/20">
          目前俱樂部方案是<strong>免費會員</strong>。這一版沒有購物車，也沒有付款。
        </p>
      </section>

      <section className="grid gap-3 rounded-xl border-2 border-[#0058A5] bg-white p-5">
        <h2 className="text-3xl font-bold">想了解加入事業</h2>
        <p>{JOIN_BUSINESS_NOTE}</p>
        <p>
          <a className="inline-flex min-h-12 items-center rounded-lg bg-[#0058A5] px-4 text-white" href={JOIN_BUSINESS_URL}>
            前往官網加入事業
          </a>
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
          <details key={item.q} className="rounded-xl bg-white p-4 ring-1 ring-[#88012B]/20">
            <summary className="cursor-pointer min-h-12 text-xl font-bold">{item.q}</summary>
            <p className="pt-3">{item.a}</p>
          </details>
        ))}
      </section>

      <p className="text-base">{MEDICAL_DISCLAIMER}</p>
    </div>
  );
}
