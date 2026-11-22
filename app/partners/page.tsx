import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { partnerApplicationAction } from "@/lib/actions";
import { OPERATOR_NAME, PARTNER_INDUSTRIES, PARTNER_RULES } from "@/lib/constants";

export const metadata = { title: "合作夥伴" };

const benefits = [
  ["接觸會員", "課程與講座會出現在俱樂部活動列表，大臺北的免費會員可以報名。"],
  ["場地與活動協助", "可使用俱樂部的室內上課場地，並一起安排時間與名額。"],
  ["報名管理", "出席、額滿與候補由網站處理，不必另外收報名表。"],
];

export default function PartnersPage() {
  return (
    <div className="grid gap-10">
      <header className="grid max-w-3xl gap-3">
        <p className="text-base font-medium text-[#14603a]">合作夥伴</p>
        <h1 className="text-4xl sm:text-5xl">一起在場地開課、辦講座</h1>
        <p className="text-lg leading-relaxed">
          健康俱樂部由{OPERATOR_NAME}經營，不綁定單一廠商。料理教室、健身與瑜伽工作室、營養諮詢、診所衛教、保健品牌、保險與場地方，都可以申請來上課或辦講座。
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3" aria-labelledby="partner-benefits">
        <h2 id="partner-benefits" className="sr-only">
          合作方式
        </h2>
        {benefits.map(([title, body]) => (
          <article key={title} className="grid gap-2 rounded-[1.5rem] bg-white p-5 shadow-[0_16px_40px_-28px_rgba(14,51,40,0.55)] ring-1 ring-[#14603a]/10">
            <h3 className="text-2xl">{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-3 rounded-[1.5rem] border border-[#9a3412] bg-[#fff7ed] p-5 sm:p-6" aria-labelledby="partner-rules">
        <h2 id="partner-rules" className="text-3xl">
          合作約定
        </h2>
        <ul className="grid list-disc gap-2 pl-6 text-lg">
          {PARTNER_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4" aria-labelledby="partner-form">
        <div className="grid max-w-2xl gap-2">
          <h2 id="partner-form" className="text-3xl">
            提出合作
          </h2>
          <p>留下單位與想開的課程。示範模式只存在這台電腦，不會真的寄出。</p>
        </div>
        <ActionForm action={partnerApplicationAction} className="max-w-2xl rounded-[1.5rem] bg-white p-5 shadow-[0_16px_40px_-28px_rgba(14,51,40,0.55)] ring-1 ring-[#14603a]/10 sm:p-6">
          <div className="grid gap-2">
            <Label htmlFor="company">單位名稱</Label>
            <Input id="company" name="company" required maxLength={80} autoComplete="organization" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="contact_name">聯絡人</Label>
              <Input id="contact_name" name="contact_name" required maxLength={40} autoComplete="name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">電話</Label>
              <Input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="02-0000-0000" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="industry">行業</Label>
            <select id="industry" name="industry" required className="h-12 rounded-lg border border-input bg-card px-3" defaultValue="">
              <option value="" disabled>
                請選擇
              </option>
              {PARTNER_INDUSTRIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="course">想開的課程或講座</Label>
            <Textarea id="course" name="course" required minLength={10} maxLength={500} className="min-h-32 text-base" placeholder="例如：兩小時的早餐備料課，不談食療效果。" />
          </div>
          <Button type="submit">送出申請</Button>
        </ActionForm>
      </section>
    </div>
  );
}
