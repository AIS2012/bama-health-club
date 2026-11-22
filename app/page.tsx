import Image from "next/image";
import Link from "next/link";
import { BookOpen, CalendarCheck, CookingPot, HeartHandshake, MapPin, Users, type LucideIcon } from "lucide-react";
import { ActivityCard } from "@/components/activity-card";
import { MEDICAL_DISCLAIMER } from "@/lib/constants";
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
    title: "健康料理",
    body: "在教室一起備料。不談食療，也不推銷食材。",
    href: "/activities?category=健康料理",
    icon: CookingPot,
    image: photos.hero,
  },
  {
    title: "職場伸展",
    body: "坐著或站著活動肩頸。這不是復健，疼痛就停。",
    href: "/activities?category=職場伸展",
    icon: Users,
  },
  {
    title: "講座",
    body: "睡眠、飲食常識與數位生活。不是診療，也不介紹產品效果。",
    href: "/activities?category=講座",
    icon: BookOpen,
    image: photos.smile,
  },
  {
    title: "手作課",
    body: "例如芳療手作。帶一份成品回家，不保證舒緩效果。",
    href: "/activities?category=芳療手作",
    icon: MapPin,
  },
  {
    title: "21天挑戰",
    body: "自己打卡就好。不計步、不上傳健檢，也不紀錄產品使用。",
    href: "/challenges",
    icon: CalendarCheck,
  },
  {
    title: "興趣社團",
    body: "料理、伸展、講座的同好。在公告欄留一句話就好。",
    href: "/groups",
    icon: HeartHandshake,
  },
];

const steps = [
  ["1", "用 LINE 加入", "按綠色按鈕即可。不用電子信箱。接著確認暱稱，手機和常去區域可以不填。"],
  ["2", "挑一堂課", "可依縣市或上課場地篩選。報名前勾選安全聲明。額滿就候補。"],
  ["3", "一起打卡", "加入社團，或參加 21 天自己打卡。不紀錄產品，也不上傳健檢。"],
];

const stories = [
  {
    quote: "一起備料、一起吃，比一個人在家有趣。",
    who: "示意短句 · 料理教室",
    image: photos.hero,
  },
  {
    quote: "講座聽得懂，沒有人要我買東西。我是來交朋友的。",
    who: "示意短句 · 講座",
    image: photos.smile,
  },
  {
    quote: "下課後在教室門口多聊兩句，這就是我想要的午後。",
    who: "示意短句 · 課程",
    image: photos.gardenWalk,
  },
];

const faqs = [
  {
    q: "俱樂部入會要錢嗎？",
    a: "不用。免費會員就能報名課程與講座、加入社團、參加挑戰。",
  },
  {
    q: "誰可以參加？",
    a: "開放給大臺北的一般大眾。不需要特定公司的身分。",
  },
  {
    q: "這是醫院或復健嗎？",
    a: "不是。這裡是室內課程和講座。內容不是診斷、治療或療效承諾。",
  },
  {
    q: "現場會推銷嗎？",
    a: "不會。合作單位約定不硬性推銷，也不宣稱療效。若有人要求購買或轉帳，請拒絕並檢舉。",
  },
  {
    q: "工作人員會請我操作 ATM 嗎？",
    a: "不會。任何人這樣說，都不是本俱樂部的人。請拒絕，並用檢舉按鈕或告訴在場工作人員。",
  },
  {
    q: "活動額滿了怎麼辦？",
    a: "可以登記候補。有人取消時，依登記順序遞補，並盡量寄信通知。",
  },
];

export default async function HomePage() {
  const repo = await getRepo();
  const activities = (await repo.listActivities()).slice(0, 3);
  const taipei = BRANCHES[0];

  return (
    <div className="grid gap-16 sm:gap-24">
      <section className="bleed relative md:min-h-[46rem]" aria-labelledby="hero-title">
        <div className="relative h-[17.5rem] md:absolute md:inset-0 md:h-auto">
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
            <p className="text-base font-medium text-[#14603a]">大臺北健康課程與講座</p>
            <h1 id="hero-title" className="mt-2 text-4xl leading-tight text-[#0e3328] md:mt-3 md:text-6xl">
              迎向美好人生
            </h1>
            <p className="mt-3 max-w-lg text-lg leading-relaxed text-[#1a2e24] md:mt-4 md:text-xl">
              健康俱樂部開放給大臺北的一般大眾。到室內場地上課、聽講座。入會免費，不是醫療服務，現場也不賣東西。
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
                找上課場地
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
          <p className="text-lg">室內教室的料理、伸展、手作，還有聽得懂的講座。挑一種你今天想做的就好。</p>
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
            <p className="text-base font-medium text-[#14603a]">上課場地</p>
            <h2 id="branch-title" className="text-4xl">
              大臺北的室內教室
            </h2>
          </div>
          <Link href="/branches" className="inline-flex min-h-12 items-center text-lg font-medium text-[#0f5132] underline underline-offset-4">
            全部場地
          </Link>
        </div>
        <p>課程和講座集中在這些室內場地。地址是示範用的區域說明，不是正式租約。</p>
        <article className="grid overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_50px_-32px_rgba(14,51,40,0.65)] ring-1 ring-[#14603a]/10 md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-56">
            <Image
              src={photos.smile.src}
              alt={photos.smile.alt}
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
                看這個場地的活動
              </Link>
              <Link href="/branches" className="inline-flex min-h-12 items-center rounded-full border-2 border-[#14603a] px-5 text-[#0f5132]">
                全部場地
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
          <p className="text-xl leading-relaxed text-white">入會免費。來上課、聽講座、認識朋友。不是醫療服務，現場也不賣東西。</p>
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
          <Image src={photos.smile.src} alt={photos.smile.alt} fill loading="eager" className="object-cover object-[center_30%]" sizes="(min-width: 768px) 32rem, 100vw" />
        </div>
      </section>

      <p className="rounded-[1.25rem] border border-[#14603a]/15 bg-white/80 px-5 py-4 text-base leading-relaxed">{MEDICAL_DISCLAIMER}</p>
    </div>
  );
}
