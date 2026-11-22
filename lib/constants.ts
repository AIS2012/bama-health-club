export const CITIES = [
  "台北市",
  "新北市",
  "桃園市",
  "新竹縣",
  "苗栗縣",
  "台中市",
  "彰化縣",
  "南投縣",
  "嘉義市",
  "台南市",
  "高雄市",
  "屏東縣",
  "台東縣",
  "花蓮縣",
  "宜蘭縣",
  "金門縣",
] as const;

export const DISTRICTS: Partial<Record<(typeof CITIES)[number], string[]>> = {
  台北市: [
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

export const INTERESTS = ["健康料理", "職場伸展", "睡眠與紓壓", "手機攝影", "數位生活", "芳療手作", "飲食營養", "講座"] as const;

export const CATEGORIES = ["健康料理", "職場伸展", "睡眠與紓壓", "手機攝影", "數位生活", "芳療手作", "飲食營養", "講座", "課程交流", "21日挑戰"] as const;

export const PARTNER_INDUSTRIES = ["料理教室", "健身／瑜伽工作室", "營養諮詢", "診所衛教", "保健品牌", "保險", "場地方", "其他"] as const;

export const DIFFICULTY_LABEL = {
  easy: "輕鬆",
  moderate: "適中",
  challenging: "具挑戰",
} as const;

export const KIND_LABEL = {
  exercise: "課程",
  talk: "講座",
  meetup: "課程交流",
  expo: "體驗課",
  challenge: "21日挑戰",
} as const;

export const ROLE_LABEL = {
  member: "會員",
  organizer: "主辦",
  admin: "管理員",
  branch_manager: "場地管理員",
} as const;

export const OPERATOR_NAME = "海連科技有限公司";

export const PARTNER_RULES = [
  "活動現場不硬性推銷，不要求參加者購買商品、課程包或保單。",
  "不宣稱醫療效果、療效、治療或診斷，也不取代醫事人員。",
  "不蒐集病歷、健檢或用藥資料。",
  "課程或講座內容先給俱樂部看過，再對會員公開。",
] as const;

export const SAFETY_NOTICE =
  "參加課程前，請確認自己今日身體狀況適合活動。若感到頭暈、胸悶、疼痛或不適，請立即停止並尋求專業協助。健康俱樂部不提供醫療服務，活動內容不是診斷、治療或復健課程。";

export const SELF_DECLARATION =
  "我已閱讀安全須知，確認今日身體狀況可以參加，並會自行留意安全。我了解這不是醫療評估。";

export const MEDICAL_DISCLAIMER =
  "本站課程、講座、公告與挑戰只供生活資訊交流，不是醫療建議，不能取代醫師、物理治療師或其他醫事人員的診療，也不做任何診斷、療效或治療承諾。";

export const FRAUD_WARNING =
  "防詐提醒：健康俱樂部的工作人員絕不會要求您轉帳、操作 ATM、提供銀行密碼或一次性驗證碼。若有人這麼說，請直接拒絕並通知我們。";

export const DEMO_PASSWORD = "Demo1234!";
