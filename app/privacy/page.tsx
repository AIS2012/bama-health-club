import { OPERATOR_NAME } from "@/lib/constants";

export const metadata = { title: "隱私權政策草稿" };

export default function PrivacyPage() {
  return (
    <article className="grid max-w-3xl gap-5 text-lg">
      <p className="legal-draft rounded-xl px-4 py-3 font-medium">
        這是草稿，正式上線前必須由律師依實際營運審閱。以下不是法律意見。
      </p>
      <h1 className="text-4xl font-bold">隱私權政策（草稿）</h1>
      <p>
        健康俱樂部由{OPERATOR_NAME}經營。本頁依臺灣《個人資料保護法》說明俱樂部怎麼處理會員與合作申請資料，正式上線前仍須律師審閱。
      </p>
      <h2 className="text-2xl font-bold">蒐集哪些資料</h2>
      <ul className="list-disc pl-6">
        <li>LINE 登入：LINE 使用者識別碼、顯示名稱。我們不向 LINE 索取電子信箱。會員不必另外註冊信箱或密碼。</li>
        <li>會員接著填寫：姓名或暱稱（可沿用 LINE 顯示名稱）、選填手機、選填常去區域，以及加入同意。</li>
        <li>工作人員帳號仍使用電子信箱與密碼。一般會員不用。</li>
        <li>合作申請：單位名稱、聯絡人、電話、行業、想開的課程或講座。</li>
        <li>使用紀錄：活動報名與候補、社團加入、公告、挑戰打卡日期、檢舉內容。</li>
      </ul>
      <h2 className="text-2xl font-bold">我們不蒐集的資料</h2>
      <p>本俱樂部不蒐集病歷、健檢報告、診斷、用藥、保險理賠或其他病歷資料，也不在挑戰裡紀錄產品使用。請不要在公告或暱稱寫下病歷。</p>
      <h2 className="text-2xl font-bold">使用目的</h2>
        <p>建立會員身分、安排活動名額與候補、顯示社團公告、紀錄挑戰打卡、處理檢舉與合作申請。之後若啟用 LINE 官方帳號，才會用它寄上課提醒；這一版還沒有寄出。工作人員帳號的信件仍可能用電子信箱。</p>
      <h2 className="text-2xl font-bold">利用期間、地區、對象</h2>
      <p>資料在帳號或申請存續期間保存於本俱樂部使用的雲端資料庫，利用地區為臺灣。除法律要求或您的請求，不出售個人資料。主辦聯絡方式只顯示給已登入會員。電子郵件由 Resend 代為寄送（若已設定）。</p>
      <h2 className="text-2xl font-bold">您的權利</h2>
      <p>
        依個資法，您可以查詢、閱覽、製給複本、更正、補充，以及請求停止蒐集、處理、利用或刪除。會員資料頁可以自己更正暱稱、地區、興趣、電話和常去的上課場地。其他請求請洽營運者{OPERATOR_NAME}。正式聯絡方式待公司與律師確認後補上。
      </p>
      <h2 className="text-2xl font-bold">安全</h2>
      <p>正式環境使用 Supabase 的資料列權限。工作人員不會向您索取密碼、銀行資料或一次性驗證碼。</p>
    </article>
  );
}
