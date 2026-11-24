export const AREAS = [
  { id: "taipei-daan", city: "台北市", district: "大安區", label: "台北市大安區" },
  { id: "taipei-zhongshan", city: "台北市", district: "中山區", label: "台北市中山區" },
  { id: "taipei-xinyi", city: "台北市", district: "信義區", label: "台北市信義區" },
  { id: "taipei-songshan", city: "台北市", district: "松山區", label: "台北市松山區" },
  { id: "taipei-zhongzheng", city: "台北市", district: "中正區", label: "台北市中正區" },
  { id: "taipei-datong", city: "台北市", district: "大同區", label: "台北市大同區" },
  { id: "taipei-wanhua", city: "台北市", district: "萬華區", label: "台北市萬華區" },
  { id: "taipei-wenshan", city: "台北市", district: "文山區", label: "台北市文山區" },
  { id: "taipei-neihu", city: "台北市", district: "內湖區", label: "台北市內湖區" },
  { id: "taipei-nangang", city: "台北市", district: "南港區", label: "台北市南港區" },
  { id: "taipei-shilin", city: "台北市", district: "士林區", label: "台北市士林區" },
  { id: "taipei-beitou", city: "台北市", district: "北投區", label: "台北市北投區" },
  { id: "newtaipei-banqiao", city: "新北市", district: "板橋區", label: "新北市板橋區" },
  { id: "newtaipei-zhonghe", city: "新北市", district: "中和區", label: "新北市中和區" },
  { id: "newtaipei-yonghe", city: "新北市", district: "永和區", label: "新北市永和區" },
  { id: "newtaipei-xindian", city: "新北市", district: "新店區", label: "新北市新店區" },
  { id: "newtaipei-sanchong", city: "新北市", district: "三重區", label: "新北市三重區" },
  { id: "newtaipei-xinzhuang", city: "新北市", district: "新莊區", label: "新北市新莊區" },
  { id: "newtaipei-tamsui", city: "新北市", district: "淡水區", label: "新北市淡水區" },
  { id: "newtaipei-xizhi", city: "新北市", district: "汐止區", label: "新北市汐止區" },
] as const;

export type AreaId = (typeof AREAS)[number]["id"];

export function areaById(id: string | null | undefined) {
  if (!id) return null;
  return AREAS.find((area) => area.id === id) ?? null;
}

export function areaIdFor(city: string, district: string) {
  return AREAS.find((area) => area.city === city && area.district === district)?.id ?? "";
}

export const UNSET_DISTRICT = "未填";
