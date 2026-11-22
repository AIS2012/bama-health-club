export type Branch = {
  id: string;
  name: string;
  shortName: string;
  county: string;
  address: string;
  email: string;
  sortOrder: number;
};

/** Sample indoor classrooms in greater Taipei. Addresses are placeholders, not leases. */
export const BRANCHES: Branch[] = [
  { id: "daan", name: "大安健康教室", shortName: "大安", county: "台北市", address: "台北市大安區（範例場地，非正式地址）", email: "daan@example.com", sortOrder: 1 },
  { id: "zhongshan", name: "中山課程空間", shortName: "中山", county: "台北市", address: "台北市中山區（範例場地，非正式地址）", email: "zhongshan@example.com", sortOrder: 2 },
  { id: "xinyi", name: "信義講座廳", shortName: "信義", county: "台北市", address: "台北市信義區（範例場地，非正式地址）", email: "xinyi@example.com", sortOrder: 3 },
  { id: "songshan", name: "松山料理教室", shortName: "松山", county: "台北市", address: "台北市松山區（範例場地，非正式地址）", email: "songshan@example.com", sortOrder: 4 },
  { id: "neihu", name: "內湖手作教室", shortName: "內湖", county: "台北市", address: "台北市內湖區（範例場地，非正式地址）", email: "neihu@example.com", sortOrder: 5 },
  { id: "banqiao", name: "板橋室內教室", shortName: "板橋", county: "新北市", address: "新北市板橋區（範例場地，非正式地址）", email: "banqiao@example.com", sortOrder: 6 },
];

export const HOURS_NOTE = "上課時間以各場活動頁為準。這裡的地址是示範用的區域說明，不是正式租約。";

export function branchById(id: string | null | undefined) {
  if (!id) return null;
  return BRANCHES.find((branch) => branch.id === id) ?? null;
}

export function branchCounties() {
  return [...new Set(BRANCHES.map((branch) => branch.county))];
}
