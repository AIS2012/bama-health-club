export const metadata = { title: "使用條款草稿" };

export default function TermsPage() {
  return (
    <article className="grid max-w-3xl gap-5 text-lg">
      <p className="legal-draft rounded-xl px-4 py-3 font-medium">
        這是草稿，正式上線前必須由律師審閱。以下不是法律意見。
      </p>
      <h1 className="text-4xl font-bold">使用條款（草稿）</h1>
      <p>使用健康俱樂部，表示您了解以下約定。準據法為中華民國法律。本俱樂部由 Total Swiss 八馬國際事業提供活動資訊。公司從事多層次傳銷，應依《多層次傳銷管理法》對參加人揭露法定事項；那些法定文件以公司正式文件為準，本草稿不能代替。</p>
      <h2 className="text-2xl font-bold">服務是什麼</h2>
      <p>本俱樂部提供台灣據點的活動報名、社團公告與習慣挑戰，夥伴、愛用者與一般大眾都可以參加。俱樂部會員免費。加入事業是另一件事：它是多層次傳銷事業機會，不是求職，需要推薦人並經公司審核同意，請改走官網加入事業頁。</p>
      <h2 className="text-2xl font-bold">不是醫療服務</h2>
      <p>活動、公告與挑戰不是診斷、治療、復健或療效保證，不能取代醫事人員。參加運動前請自行確認身體狀況。感到不適應停止並尋求專業協助。報名時的自我聲明是您自己的確認，不是本俱樂部做的健康評估。</p>
      <h2 className="text-2xl font-bold">會員的責任</h2>
      <ul className="list-disc pl-6">
        <li>不要張貼詐騙、轉帳帳號、來路不明連結、醫療廣告或他人的病歷。</li>
        <li>不要冒充工作人員或已驗證主辦。</li>
        <li>出席時尊重其他參加者，依現場指示注意安全。</li>
      </ul>
      <h2 className="text-2xl font-bold">已驗證主辦</h2>
      <p>「已驗證」只表示本俱樂部核對過這位主辦的身分聯絡方式，不代表背書任何療效、商品或投資。</p>
      <h2 className="text-2xl font-bold">範例資料</h2>
      <p>標成範例的活動、社團、公告與挑戰只用來說明介面，不是正式邀約。</p>
      <h2 className="text-2xl font-bold">停止使用</h2>
      <p>若內容違反這些條款或法律，管理員可以隱藏公告、取消報名或停用帳號。</p>
    </article>
  );
}
