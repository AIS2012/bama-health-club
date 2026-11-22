import Image from "next/image";
import Link from "next/link";
import { BookOpen, CalendarCheck, Footprints, HeartHandshake, MapPin, Trees, Users, type LucideIcon } from "lucide-react";
import { ActivityCard } from "@/components/activity-card";
import { JOIN_BUSINESS_NOTE, JOIN_BUSINESS_URL, MEDICAL_DISCLAIMER } from "@/lib/constants";
import { BRANCHES, HOURS_NOTE } from "@/lib/branches";
import { photos } from "@/lib/photos";
import { getRepo } from "@/lib/repo";

const offerings: {
  title: string;
  body: string;
  href: string;
  icon: LucideIcon;
  image?: { src: string; alt: string };
}[] = [
  {
    title: "健走",
    body: "早晨在公園慢慢走，邊走邊聊天，想休息就休息。",
    href: "/activities?category=健走",
    icon: Footprints,
    image: photos.forestCouple,
  },
  {
    title: "瑜珈",
    body: "戶外伸展，依自己的節奏來，不做勉強的動作。",
    href: "/activities?category=瑜珈",
    icon: Trees,
    image: photos.yoga,
  },
  {
    title: "太極",
    body: "在綠地一起練，動作可以放慢，跟得上就好。",
    href: "/activities?category=太極",
    icon: Trees,
    image: photos.taiChi,
  },
  {
    title: "健康講座",
    body: "聽生活與防詐這類公開資訊。不是診療，也不介紹產品效果。",
    href: "/activities?category=健康講座",
    icon: BookOpen,
  },
  {
    title: "據點聚會",
    body: "到據點見朋友，認識附近接下來的活動。",
    href: "/activities?category=據點聚會",
    icon: MapPin,
  },
  {
    title: "健康活動",
    body: "輕鬆的交流日。夥伴、愛用者和一般大眾都可以來。",
    href: `/activities?category=${encodeURIComponent("健康交流")}`,
    icon: Users,
  },
  {
    title: "21天挑戰",
    body: "自己打卡就好。不計步、不上傳健檢，也不紀錄產品使用。",
    href: "/challenges",
    icon: CalendarCheck,
  },
  {
    title: "興趣社團",
    body: "健走、瑜珈、太極同好。在公告欄留一句話就好。",
    href: "/groups",
    icon: HeartHandshake,
  },
];

const steps = [
  ["1", "用信箱加入", "填暱稱、居住縣市和興趣。夥伴編號與常去據點可以之後再補。不需要病歷。"],
  ["2", "挑一場活動", "可依縣市或據點篩選。報名前勾選安全聲明。額滿就候補。"],
  ["3", "一起打卡", "加入社團，或參加 21 天自己打卡。不紀錄產品，也不上傳健檢。"],
];

const stories = [
  {
    quote: "早晨的樹蔭一路送到公園口，走完再跟朋友坐一下，回家的路上還在笑。",
    who: "示意短句 · 健走",
    image: photos.gardenWalk,
  },
  {
    quote: "講座聽得懂，沒有人要我買東西。我是來交朋友的。",
    who: "示意短句 · 講座",
    image: photos.smile,
  },
  {
    quote: "太極打完，跟鄰居在樹下聊兩句，這就是我想要的早晨。",
    who: "示意短句 · 太極",
    image: photos.taiChi,
  },
];

const faqs = [
  {
    q: "俱樂部入會要錢嗎？",
    a: "不用。免費會員就能報名活動、加入社團、參加挑戰。這和加入事業是兩件事。",
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
  const taipei = BRANCHES[0];

  return (
    <div className="grid gap-16 sm:gap-24">
      <section className="bleed relative md:min-h-[46rem]" aria-labelledby="hero-title">
        <div className="relative h-[19rem] md:absolute md:inset-0 md:h-auto">
          <Image
            src={photos.hero.src}
            alt={photos.hero.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_42%] md:object-center"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[48%] bg-gradient-to-r from-[#f7f4ee]/88 via-[#f7f4ee]/45 to-transparent md:block" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-6 md:flex md:min-h-[46rem] md:items-center md:px-8 md:py-16">
          <div className="rise-in max-w-xl text-[#0e3328] md:max-w-lg">
            <p className="text-base font-medium text-[#14603a]">大臺北運動與講座</p>
            <h1 id="hero-title" className="mt-2 text-4xl leading-tight text-[#0e3328] md:mt-3 md:text-6xl">
              迎向美好人生
            </h1>
            <p className="mt-3 max-w-lg text-lg leading-relaxed text-[#1a2e24] md:mt-4 md:text-xl">
              健康俱樂部給夥伴、愛用者和一般大眾。一起運動，也歡迎來據點聽講座。俱樂部入會免費，用來認識據點活動，不是醫療服務，也不談產品效果。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex min-h-14 items-center rounded-full bg-[#14603a] px-6 text-lg font-bold text-white hover:bg-[#0f5132]">
                免費加入會員
              </Link>
              <Link href="/activities" className="inline-flex min-h-14 items-center rounded-full border-2 border-[#14603a] bg-white px-6 text-lg font-medium text-[#0e3328]">
                看看活動
              </Link>
            </div>
            <p className="mt-4">
              <Link href="/branches" className="inline-flex min-h-12 items-center text-lg font-medium text-[#0f5132] underline underline-offset-4">
                先找據點
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6" aria-labelledby="offer-title">
        <div className="grid max-w-2xl gap-2">
          <p className="text-base font-medium text-[#14603a]">俱樂部裡有什麼</p>
          <h2 id="offer-title" className="text-4xl sm:text-5xl">
            把日子過得清新一點
          </h2>
          <p className="text-lg">戶外的綠意、據點的朋友，還有聽得懂的講座。挑一種你今天想做的就好。</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {offerings.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[0_18px_40px_-30px_rgba(14,51,40,0.7)] ring-1 ring-[#14603a]/10 hover:ring-[#14603a]/30"
              >
                {item.image ? (
                  <span className="relative block h-44">
                    <Image src={item.image.src} alt={item.image.alt} fill loading="eager" className="object-cover" sizes="(min-width: 1280px) 18rem, (min-width: 640px) 50vw, 100vw" />
                  </span>
                ) : (
                  <span className="flex h-36 items-end bg-gradient-to-br from-[#e3f3e6] to-[#f7fbf6] p-5">
                    <Icon className="size-8 text-[#14603a]" aria-hidden="true" />
                  </span>
                )}
                <span className="grid flex-1 gap-2 p-5">
                  <span className="font-serif text-2xl text-[#0e3328]">{item.title}</span>
                  <span className="text-base leading-relaxed text-[#1a2e24]">{item.body}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5" aria-labelledby="upcoming-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="grid gap-2">
            <p className="text-base font-medium text-[#14603a]">即將舉行</p>
            <h2 id="upcoming-title" className="text-4xl">
              最近的活動
            </h2>
          </div>
          <Link href="/activities" className="inline-flex min-h-12 items-center text-lg font-medium text-[#0f5132] underline underline-offset-4">
            全部活動
          </Link>
        </div>
        <p>大臺北範例場次排在前面。標示「範例資料」的不是正式邀約。</p>
        {activities.length === 0 ? <p className="rounded-[1.25rem] bg-white p-5">目前沒有即將舉行的活動。</p> : null}
        <div className="grid gap-4">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </section>

      <section className="grid gap-5" aria-labelledby="branch-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="grid max-w-2xl gap-2">
            <p className="text-base font-medium text-[#14603a]">十六個據點</p>
            <h2 id="branch-title" className="text-4xl">
              大臺北先看，全台都能找
            </h2>
          </div>
          <Link href="/branches" className="inline-flex min-h-12 items-center text-lg font-medium text-[#0f5132] underline underline-offset-4">
            全部據點
          </Link>
        </div>
        <p>地址來自公司官網公開的營業據點頁。大臺北的活動多從台北營運中心開始。</p>
        <article className="grid overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_50px_-32px_rgba(14,51,40,0.65)] ring-1 ring-[#14603a]/10 md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-56">
            <Image
              src={photos.forestCouple.src}
              alt={photos.forestCouple.alt}
              fill
              loading="eager"
              className="object-cover"
              sizes="(min-width: 768px) 28rem, 100vw"
            />
          </div>
          <div className="grid content-center gap-3 p-6 sm:p-8">
            <p className="font-medium text-[#14603a]">大臺北 · {taipei.county}</p>
            <h3 className="text-3xl">{taipei.name}</h3>
            <p className="text-lg">{taipei.address}</p>
            <p>{HOURS_NOTE}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href={`/activities?branch=${taipei.id}`} className="inline-flex min-h-12 items-center rounded-full bg-[#14603a] px-5 text-white hover:bg-[#0f5132]">
                看這個據點的活動
              </Link>
              <Link href="/branches" className="inline-flex min-h-12 items-center rounded-full border-2 border-[#14603a] px-5 text-[#0f5132]">
                十六個據點
              </Link>
            </div>
          </div>
        </article>
        <ul className="flex flex-wrap gap-2">
          {BRANCHES.map((branch) => (
            <li key={branch.id}>
              <Link
                href={`/branches#${branch.id}`}
                className="inline-flex min-h-12 items-center rounded-full bg-white px-4 ring-1 ring-[#14603a]/15 hover:bg-[#e3f3e6]"
              >
                {branch.shortName}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-5" aria-labelledby="story-title">
        <div className="grid max-w-2xl gap-2">
          <p className="text-base font-medium text-[#14603a]">相處的樣子</p>
          <h2 id="story-title" className="text-4xl">
            想一起過的早晨
          </h2>
        </div>
        <p className="rounded-2xl bg-[#fff3bf] px-4 py-3 font-medium text-[#1a1200]">
          以下是示意短句，用來呈現希望有的相處氣氛，不是真實會員訪談，也不是使用心得。
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {stories.map((story) => (
            <figure key={story.who} className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_18px_40px_-30px_rgba(14,51,40,0.7)] ring-1 ring-[#14603a]/10">
              <div className="relative h-56">
                <Image src={story.image.src} alt={story.image.alt} fill loading="eager" className="object-cover" sizes="(min-width: 768px) 22rem, 100vw" />
                <span className="absolute top-4 left-4 rounded-full bg-[#fff3bf] px-3 py-1 text-base font-medium text-[#1a1200]">示意範例</span>
              </div>
              <blockquote className="grid gap-3 p-5">
                <p className="font-serif text-2xl leading-snug text-[#0e3328]">「{story.quote}」</p>
                <footer className="text-base text-[#3c5146]">{story.who}</footer>
              </blockquote>
            </figure>
          ))}
        </div>
      </section>

      <section className="grid gap-5" aria-labelledby="steps-title">
        <h2 id="steps-title" className="text-4xl">
          入會怎麼運作
        </h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map(([step, title, body]) => (
            <li key={step} className="grid content-start gap-3 rounded-[1.5rem] bg-white p-6 shadow-[0_16px_40px_-28px_rgba(14,51,40,0.55)] ring-1 ring-[#14603a]/10">
              <span className="grid size-12 place-items-center rounded-full bg-[#e3f3e6] font-serif text-2xl text-[#14603a]">{step}</span>
              <h3 className="text-2xl">{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
        <p className="rounded-[1.25rem] bg-white p-5 ring-1 ring-[#14603a]/10">
          目前俱樂部方案是<strong>免費會員</strong>。這一版沒有購物車，也沒有付款。
        </p>
      </section>

      <section className="grid gap-3 rounded-[1.5rem] bg-white p-6 ring-1 ring-[#14603a]/12 sm:p-8">
        <h2 className="text-3xl">想了解加入事業</h2>
        <p>{JOIN_BUSINESS_NOTE}</p>
        <p>
          <a className="inline-flex min-h-12 items-center rounded-full border-2 border-[#14603a] px-5 font-medium text-[#0f5132]" href={JOIN_BUSINESS_URL}>
            前往官網加入事業
          </a>
        </p>
      </section>

      <section className="grid gap-3" aria-labelledby="faq-title">
        <h2 id="faq-title" className="text-4xl">
          常見問題
        </h2>
        {faqs.map((item) => (
          <details key={item.q} className="rounded-[1.25rem] bg-white px-5 py-2 shadow-[0_16px_40px_-30px_rgba(14,51,40,0.55)] ring-1 ring-[#14603a]/10">
            <summary className="flex min-h-14 cursor-pointer items-center text-xl font-bold">{item.q}</summary>
            <p className="pb-4">{item.a}</p>
          </details>
        ))}
      </section>

      <section className="grid overflow-hidden rounded-[1.75rem] bg-[#14603a] text-white md:grid-cols-[1.1fr_0.9fr]" aria-labelledby="close-title">
        <div className="grid content-center gap-4 p-6 sm:p-10">
          <h2 id="close-title" className="text-4xl text-white sm:text-5xl">
            一起迎向美好人生
          </h2>
          <p className="text-xl leading-relaxed text-white">俱樂部入會免費。用來認識據點活動，不是醫療服務，也不談產品效果。</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className="inline-flex min-h-14 items-center rounded-full bg-white px-6 text-lg font-bold text-[#0e3328]">
              免費加入會員
            </Link>
            <Link href="/activities" className="inline-flex min-h-14 items-center rounded-full border-2 border-white px-6 text-lg text-white">
              看看活動
            </Link>
          </div>
        </div>
        <div className="relative min-h-64">
          <Image src={photos.yoga.src} alt={photos.yoga.alt} fill loading="eager" className="object-cover" sizes="(min-width: 768px) 32rem, 100vw" />
        </div>
      </section>

      <p className="rounded-[1.25rem] border border-[#14603a]/15 bg-white/80 px-5 py-4 text-base leading-relaxed">{MEDICAL_DISCLAIMER}</p>
    </div>
  );
}
