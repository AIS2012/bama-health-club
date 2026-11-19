export type Branch = {
  id: string;
  name: string;
  shortName: string;
  county: string;
  address: string;
  email: string;
  sortOrder: number;
};

/** Addresses copied from https://www.totalswiss.com.tw/locations. Hours are not published there. */
export const BRANCHES: Branch[] = [
  { id: "taipei", name: "台北營運中心", shortName: "台北", county: "台北市", address: "10044 台北市中正區重慶南路一段10號2樓", email: "tp@tsmail.com.tw", sortOrder: 1 },
  { id: "taoyuan", name: "桃園分公司", shortName: "桃園", county: "桃園市", address: "330 桃園市桃園區成功路一段37號1樓", email: "ty@tsmail.com.tw", sortOrder: 2 },
  { id: "zhongli", name: "中壢分公司", shortName: "中壢", county: "桃園市", address: "桃園市中壢區慈惠三街99號", email: "cl@tsmail.com.tw", sortOrder: 3 },
  { id: "hsinchu", name: "新竹營運中心", shortName: "新竹", county: "新竹縣", address: "30251 新竹縣竹北市縣政九路169號2樓", email: "hc@tsmail.com.tw", sortOrder: 4 },
  { id: "miaoli", name: "苗栗營運中心", shortName: "苗栗", county: "苗栗縣", address: "36043 苗栗市中山路331號2F", email: "ml@tsmail.com.tw", sortOrder: 5 },
  { id: "taichung", name: "台中中清營運中心", shortName: "台中", county: "台中市", address: "404 台中市北區中清路一段581號", email: "tc@tsmail.com.tw", sortOrder: 6 },
  { id: "yuanlin", name: "員林營運中心", shortName: "員林", county: "彰化縣", address: "51055 彰化縣員林市中山路二段480號", email: "ch@tsmail.com.tw", sortOrder: 7 },
  { id: "caotun", name: "草屯營運中心", shortName: "草屯", county: "南投縣", address: "54263 南投縣草屯鎮太平路二段70號1樓", email: "ct@tsmail.com.tw", sortOrder: 8 },
  { id: "chiayi", name: "嘉義營運中心", shortName: "嘉義", county: "嘉義市", address: "60090 嘉義市西區友忠路301號", email: "cy@tsmail.com.tw", sortOrder: 9 },
  { id: "tainan", name: "台南營運中心", shortName: "台南", county: "台南市", address: "701 台南市東區崇明路708號1樓", email: "tn@tsmail.com.tw", sortOrder: 10 },
  { id: "kaohsiung", name: "高雄營運中心", shortName: "高雄", county: "高雄市", address: "803009 高雄市前金區五福三路21號3樓", email: "ks@tsmail.com.tw", sortOrder: 11 },
  { id: "pingtung", name: "屏東營運中心", shortName: "屏東", county: "屏東縣", address: "90011 屏東市公勇路79-2號2樓", email: "pd@tsmail.com.tw", sortOrder: 12 },
  { id: "taitung", name: "台東營運中心", shortName: "台東", county: "台東縣", address: "95052 台東縣台東市長安街258號", email: "tt@tsmail.com.tw", sortOrder: 13 },
  { id: "hualien", name: "花蓮營運中心", shortName: "花蓮", county: "花蓮縣", address: "97055 花蓮市國聯一路171號1樓", email: "hl@tsmail.com.tw", sortOrder: 14 },
  { id: "yilan", name: "宜蘭營運中心", shortName: "宜蘭", county: "宜蘭縣", address: "26041 宜蘭市宜興路一段285號1樓", email: "yl@tsmail.com.tw", sortOrder: 15 },
  { id: "kinmen", name: "金門營運中心", shortName: "金門", county: "金門縣", address: "89347 金門縣金城鎮民族路286號", email: "km@tsmail.com.tw", sortOrder: 16 },
];

export const HOURS_NOTE = "營業時間官網尚未載明，請先電詢 GSC 全球客服中心 (02)7733-0800，由公司確認。";

export function branchById(id: string | null | undefined) {
  if (!id) return null;
  return BRANCHES.find((branch) => branch.id === id) ?? null;
}

export function branchCounties() {
  return [...new Set(BRANCHES.map((branch) => branch.county))];
}
