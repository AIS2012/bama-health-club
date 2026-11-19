export const metadata = { title: "隱私權政策草稿" };

export default function PrivacyPage() {
  return (
    <article className="grid max-w-3xl gap-5 text-lg">
      <p className="legal-draft rounded-xl px-4 py-3 font-medium">
        這是草稿，正式上線前必須由律師依實際營運審閱。以下不是法律意見。
      </p>
      <h1 className="text-4xl font-bold">隱私權政策（草稿）</h1>
      <p>八馬健康俱樂部（以下稱本俱樂部）依臺灣《個人資料保護法》說明我們怎麼處理會員資料。</p>
      <h2 className="text-2xl font-bold">蒐集哪些資料</h2>
      <ul className="list-disc pl-6">
        <li>帳號：電子信箱、密碼雜湊值。若使用 Google 登入，則是 Google 提供的識別與信箱。</li>
        <li>會員填寫：暱稱、大臺北縣市與行政區、興趣、選填電話。</li>
        <li>使用紀錄：活動報名與候補、社團加入、公告、挑戰打卡日期、檢舉內容。</li>
      </ul>
      <h2 className="text-2xl font-bold">我們不蒐集的資料</h2>
      <p>本俱樂部不蒐集病歷、健檢報告、診斷、用藥、保險理賠或其他病歷資料。請不要在公告或暱稱寫下這些內容。</p>
      <h2 className="text-2xl font-bold">使用目的</h2>
      <p>建立會員身分、安排活動名額與候補、顯示社團公告、紀錄挑戰打卡、寄送報名確認與活動提醒、處理檢舉，以及在您同意的範圍內聯絡您。</p>
      <h2 className="text-2xl font-bold">利用期間、地區、對象</h2>
      <p>資料在帳號存續期間保存於本俱樂部使用的雲端資料庫，利用地區為臺灣。除法律要求或您的請求，不出售個人資料。主辦聯絡方式只顯示給已登入會員。電子郵件由 Resend 代為寄送（若已設定）。</p>
      <h2 className="text-2xl font-bold">您的權利</h2>
      <p>
        依個資法，您可以查詢、閱覽、製給複本、更正、補充，以及請求停止蒐集、處理、利用或刪除。會員資料頁可以自己更正暱稱、地區、興趣和電話。其他請求請寫信到正式聯絡信箱（上線前替換）：club@ais2012.com。
      </p>
      <h2 className="text-2xl font-bold">安全</h2>
      <p>正式環境使用 Supabase 的資料列權限。工作人員不會向您索取密碼、銀行資料或一次性驗證碼。</p>
    </article>
  );
}
