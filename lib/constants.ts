export const CITIES = ["臺北市", "新北市"] as const;

export const DISTRICTS: Record<(typeof CITIES)[number], string[]> = {
  臺北市: [
    "中正區",
    "大同區",
    "中山區",
    "松山區",
    "大安區",
    "萬華區",
    "信義區",
    "士林區",
    "北投區",
    "內湖區",
    "南港區",
    "文山區",
  ],
  新北市: [
    "板橋區",
    "三重區",
    "中和區",
    "永和區",
    "新莊區",
    "新店區",
    "樹林區",
    "鶯歌區",
    "三峽區",
    "淡水區",
    "汐止區",
    "瑞芳區",
    "土城區",
    "蘆洲區",
    "五股區",
    "泰山區",
    "林口區",
    "深坑區",
    "石碇區",
    "坪林區",
    "三芝區",
    "石門區",
    "八里區",
    "平溪區",
    "雙溪區",
    "貢寮區",
    "金山區",
    "萬里區",
    "烏來區",
  ],
};

export const INTERESTS = ["健走", "瑜珈", "太極", "講座", "伸展", "舞蹈", "養生操"] as const;

export const CATEGORIES = ["健走", "瑜珈", "太極", "講座", "伸展", "舞蹈"] as const;

export const DIFFICULTY_LABEL = {
  easy: "輕鬆",
  moderate: "適中",
  challenging: "具挑戰",
} as const;

export const KIND_LABEL = {
  exercise: "運動聚會",
  talk: "健康講座",
} as const;

export const ROLE_LABEL = {
  member: "會員",
  organizer: "主辦",
  admin: "管理員",
} as const;

export const SAFETY_NOTICE =
  "參加運動前，請確認自己今日身體狀況適合活動。若感到頭暈、胸悶、疼痛或不適，請立即停止並尋求專業協助。八馬健康俱樂部不提供醫療服務，活動內容不是診斷、治療或復健課程。";

export const SELF_DECLARATION =
  "我已閱讀安全須知，確認今日身體狀況可以參加，並會自行留意安全。我了解這不是醫療評估。";

export const MEDICAL_DISCLAIMER =
  "本站活動、公告與挑戰僅供熟齡朋友互相邀約與生活資訊交流，不是醫療建議，不能取代醫師、物理治療師或其他醫事人員的診療，也不做任何診斷、療效或治療承諾。";

export const FRAUD_WARNING =
  "防詐提醒：八馬健康俱樂部的工作人員絕不會要求您轉帳、操作 ATM、提供銀行密碼或一次性驗證碼。若有人這麼說，請直接拒絕並通知我們。";

export const DEMO_PASSWORD = "Demo1234!";
