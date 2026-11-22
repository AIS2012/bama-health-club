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

export const INTERESTS = ["健走", "瑜珈", "太極", "講座", "伸展", "舞蹈", "養生操"] as const;

export const CATEGORIES = ["健走", "瑜珈", "太極", "健康講座", "講座", "據點聚會", "樂齡／博覽會", "21日挑戰", "伸展", "舞蹈"] as const;

export const DIFFICULTY_LABEL = {
  easy: "輕鬆",
  moderate: "適中",
  challenging: "具挑戰",
} as const;

export const KIND_LABEL = {
  exercise: "一起運動",
  talk: "健康講座",
  meetup: "據點聚會",
  expo: "樂齡／博覽會",
  challenge: "21日挑戰",
} as const;

export const ROLE_LABEL = {
  member: "會員",
  organizer: "主辦",
  admin: "管理員",
  branch_manager: "據點管理員",
} as const;

export const MEMBER_TYPE_LABEL = {
  partner: "夥伴",
  enthusiast: "愛用者",
  public: "一般大眾",
} as const;

export const JOIN_BUSINESS_URL = "https://www.totalswiss.com.tw/join";
export const OFFICIAL_SITE_URL = "https://www.totalswiss.com.tw/";
export const MEMBER_PORTAL_URL = "https://mbst.totalswiss.com/mblogin.php";
export const GSC_PHONE = "(02)7733-0800";
export const JOIN_BUSINESS_NOTE =
  "「加入事業」是 Total Swiss 八馬國際事業的多層次傳銷事業機會，不是求職或雇用。加入需要推薦人，並經公司審核同意。俱樂部入會本身免費，與加入事業是兩件事。";

export const SAFETY_NOTICE =
  "參加運動前，請確認自己今日身體狀況適合活動。若感到頭暈、胸悶、疼痛或不適，請立即停止並尋求專業協助。樂齡健康俱樂部不提供醫療服務，活動內容不是診斷、治療或復健課程。";

export const SELF_DECLARATION =
  "我已閱讀安全須知，確認今日身體狀況可以參加，並會自行留意安全。我了解這不是醫療評估。";

export const MEDICAL_DISCLAIMER =
  "本站活動、公告與挑戰僅供熟齡朋友互相邀約與生活資訊交流，不是醫療建議，不能取代醫師、物理治療師或其他醫事人員的診療，也不做任何診斷、療效或治療承諾。";

export const FRAUD_WARNING =
  "防詐提醒：樂齡健康俱樂部的工作人員絕不會要求您轉帳、操作 ATM、提供銀行密碼或一次性驗證碼。若有人這麼說，請直接拒絕並通知我們。";

export const DEMO_PASSWORD = "Demo1234!";
