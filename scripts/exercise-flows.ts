import { DEMO_PASSWORD } from "../lib/constants";
import {
  adminSaveActivity,
  cancelRsvp,
  checkIn,
  createPost,
  createSeedDb,
  getActivity,
  joinChallenge,
  joinGroup,
  listActivities,
  login,
  rsvp,
  signup,
} from "../lib/demo/logic";

function assert(condition: unknown, message: string) {
  if (!condition) {
    console.error("失敗：", message);
    process.exit(1);
  }
  console.log("通過：", message);
}

const db = createSeedDb(new Date("2026-11-19T02:00:00.000Z"));
const listed = listActivities(db, undefined, new Date("2026-11-19T02:00:00.000Z"));
assert(listed.some((item) => item.isSample && item.title.includes("大安")), "活動列表含大安範例活動");
assert(listed.every((item) => item.isSample), "目前種子活動都標成範例");

const guestView = getActivity(db, "act-daan", null);
assert(guestView?.organizerContact === null, "未登入看不到主辦聯絡方式");

const signed = signup(db, {
  email: "new@example.com",
  password: "secret-pass",
  nickname: "新會員",
  phone: null,
  city: "新北市",
  district: "淡水區",
  interests: ["健康料理"],
  memberType: "public",
  partnerNumber: null,
  homeBranchId: null,
});
assert(signed.ok && signed.user, "可以註冊新會員");
const member = signed.user!;

const logged = login(db, "member@bama.example", DEMO_PASSWORD);
assert(logged.ok && logged.user?.nickname === "陳阿姨", "示範會員可以登入");

const joined = rsvp(db, member, "act-daan", true, new Date("2026-11-19T02:00:00.000Z"));
assert(joined.ok && joined.status === "going", "未額滿活動報名成功");
const seen = getActivity(db, "act-daan", member);
assert(Boolean(seen?.organizerContact?.includes("範例")), "報名會員看得到主辦聯絡方式");

const cancelled = cancelRsvp(db, member, "act-daan", new Date("2026-11-19T02:00:00.000Z"));
assert(cancelled.ok, "可以取消報名");
const afterCancel = getActivity(db, "act-daan", member);
assert(afterCancel?.myStatus === null, "取消後不再顯示已報名");

const waiting = rsvp(db, member, "act-songshan", true, new Date("2026-11-19T02:00:00.000Z"));
assert(waiting.ok && waiting.status === "waitlist", "額滿活動進入候補");
const refused = rsvp(db, member, "act-neihu", false, new Date("2026-11-19T02:00:00.000Z"));
assert(!refused.ok, "未勾選安全聲明不能報名");

const group = joinGroup(db, member, "grp-taiji");
assert(group.ok, "可以加入社團");
const post = createPost(db, member, "grp-taiji", "這是測試公告，沒有醫療內容。");
assert(post.ok, "社員可以張貼公告");

const challenge = joinChallenge(db, member, "ch-walk");
assert(challenge.ok, "可以加入挑戰");
const first = checkIn(db, member, "ch-walk", new Date("2026-11-19T02:00:00.000Z"));
const second = checkIn(db, member, "ch-walk", new Date("2026-11-19T06:00:00.000Z"));
assert(first.ok && !first.already, "可以每日打卡");
assert(second.ok && second.already, "同一天不能重複打卡");

const admin = login(db, "admin@bama.example", DEMO_PASSWORD).user!;
const created = adminSaveActivity(
  db,
  admin,
  {
    title: "北投教室肩頸伸展",
    kind: "exercise",
    category: "職場伸展",
    description: "管理員建立的測試活動，用來確認後台可以新增場次。",
    startsAt: "2026-12-01T01:00:00.000Z",
    endsAt: "2026-12-01T02:00:00.000Z",
    locationName: "大安健康教室",
    address: "台北市大安區（範例場地）",
    city: "台北市",
    district: "大安區",
    branchId: "daan",
    speaker: null,
    capacity: 12,
    difficulty: "easy",
    organizerName: "林志工",
    organizerContact: "02-0000-0000",
    organizerVerified: true,
    isSample: false,
    status: "published",
  },
);
assert(created.ok && created.id, "管理員可以建立活動");
const blocked = adminSaveActivity(db, member, {
  title: "不該成功",
  kind: "talk",
  category: "講座",
  description: "一般會員不應該建立活動成功才對。",
  startsAt: "2026-12-02T01:00:00.000Z",
  endsAt: "2026-12-02T02:00:00.000Z",
  locationName: "測試",
  address: "台北市中正區測試路 1 號",
  city: "台北市",
  district: "中正區",
  branchId: "daan",
  speaker: null,
  capacity: 5,
  difficulty: "easy",
  organizerName: "會員",
  organizerContact: "0900000000",
  organizerVerified: false,
  isSample: false,
  status: "published",
});
assert(!blocked.ok, "一般會員不能建立活動");

console.log("核心流程全部通過。");
