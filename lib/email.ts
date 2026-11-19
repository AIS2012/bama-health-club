import { Resend } from "resend";
import { escapeHtml, formatTaipei } from "@/lib/format";
import { siteUrl } from "@/lib/config";

type SendInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
};

export type SendResult =
  | { provider: "skipped"; id: null }
  | { provider: "resend"; id: string | null }
  | { provider: "error"; id: null; error: string };

export async function sendEmail(input: SendInput): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return { provider: "skipped", id: null };

  const resend = new Resend(key);
  const from = process.env.RESEND_FROM?.trim() || "八馬健康俱樂部 <onboarding@resend.dev>";
  const { data, error } = await resend.emails.send(
    {
      from,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    },
    { idempotencyKey: input.idempotencyKey },
  );

  if (error) {
    console.error("Resend 寄信失敗:", error.message);
    return { provider: "error", id: null, error: error.message };
  }
  return { provider: "resend", id: data?.id ?? null };
}

function layout(title: string, body: string) {
  return `<div style="font-family:'Noto Sans TC',sans-serif;font-size:18px;line-height:1.6;color:#1a1a1a;background:#fbf7f1;padding:24px">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:2px solid #88012B;border-radius:12px;padding:24px">
      <p style="margin:0 0 8px;font-size:14px;letter-spacing:0.08em;color:#88012B">八馬健康俱樂部</p>
      <h1 style="font-size:24px;margin:0 0 16px">${escapeHtml(title)}</h1>
      ${body}
      <p style="margin-top:24px;font-size:16px;color:#3f3f3f">這封信不是醫療建議。工作人員不會要求您轉帳或操作 ATM。</p>
    </div>
  </div>`;
}

export function rsvpMessage(input: {
  nickname: string;
  title: string;
  startsAt: string;
  locationName: string;
  status: "going" | "waitlist";
  activityPath: string;
}) {
  const when = formatTaipei(input.startsAt);
  const state = input.status === "going" ? "報名成功" : "已列入候補";
  const subject = `${state}：${input.title}`;
  const link = `${siteUrl()}${input.activityPath}`;
  const text = `${input.nickname} 您好，您的「${input.title}」${state}。時間：${when}。地點：${input.locationName}。詳情：${link}`;
  const html = layout(
    state,
    `<p>${escapeHtml(input.nickname)} 您好，</p>
     <p>您的活動「<strong>${escapeHtml(input.title)}</strong>」${state}。</p>
     <p>時間：${escapeHtml(when)}<br>地點：${escapeHtml(input.locationName)}</p>
     <p><a href="${escapeHtml(link)}">查看活動</a></p>`,
  );
  return { subject, text, html };
}

export function reminderMessage(input: {
  nickname: string;
  title: string;
  startsAt: string;
  locationName: string;
  activityPath: string;
}) {
  const when = formatTaipei(input.startsAt);
  const subject = `活動提醒：${input.title}`;
  const link = `${siteUrl()}${input.activityPath}`;
  const text = `${input.nickname} 您好，提醒您即將參加「${input.title}」。時間：${when}。地點：${input.locationName}。若身體不適請不要勉強。詳情：${link}`;
  const html = layout(
    "活動提醒",
    `<p>${escapeHtml(input.nickname)} 您好，</p>
     <p>提醒您即將參加「<strong>${escapeHtml(input.title)}</strong>」。</p>
     <p>時間：${escapeHtml(when)}<br>地點：${escapeHtml(input.locationName)}</p>
     <p>若當天身體不適，請不要勉強出席。</p>
     <p><a href="${escapeHtml(link)}">查看活動</a></p>`,
  );
  return { subject, text, html };
}

export function magicLinkMessage(link: string) {
  const subject = "八馬健康俱樂部登入連結";
  const text = `請在 30 分鐘內開啟這個連結登入：${link}。如果不是您本人申請，請忽略這封信。`;
  const html = layout(
    "登入連結",
    `<p>請在 30 分鐘內點下面的按鈕登入。連結只可使用一次。</p>
     <p><a href="${escapeHtml(link)}">登入八馬健康俱樂部</a></p>
     <p>如果不是您本人申請，請忽略這封信。</p>`,
  );
  return { subject, text, html };
}
