import { branchById } from "@/lib/branches";
import { DEMO_PASSWORD } from "@/lib/constants";
import { addMinutes, atTaipei, startOfTodayTaipeiIso, todayTaipei } from "@/lib/format";
import { hashPassword, randomToken, verifyPassword } from "@/lib/password";
import type {
  ActivityDetail,
  ActivityInput,
  ActivityListItem,
  AdminReport,
  ChallengeDetail,
  ChallengeInput,
  ChallengeListItem,
  GroupDetail,
  GroupInput,
  GroupListItem,
  PostItem,
  Profile,
  ReminderRecipient,
  Result,
  RsvpRow,
  RsvpStatus,
  PartnerApplicationInput,
  SignUpInput,
  ProfileInput,
} from "@/lib/types";
import { parseActivity, parseChallenge, parseGroup, parsePartnerApplication, parseProfile, parseSignUp } from "@/lib/validation";

type UserRecord = Profile & { passwordHash: string };

type RsvpRecord = {
  id: string;
  activityId: string;
  userId: string;
  status: RsvpStatus;
  safetyDeclared: boolean;
  createdAt: string;
  updatedAt: string;
};

type PostRecord = PostItem;

export type DemoDb = {
  users: UserRecord[];
  sessions: { token: string; userId: string; expiresAt: string }[];
  magicLinks: { token: string; email: string; expiresAt: string }[];
  activities: ActivityDetail[];
  rsvps: RsvpRecord[];
  groups: Omit<GroupListItem, "memberCount" | "joined">[];
  groupMembers: { groupId: string; userId: string; joinedAt: string }[];
  posts: PostRecord[];
  challenges: Omit<ChallengeListItem, "joined" | "checkinCount" | "checkedInToday">[];
  challengeMembers: { challengeId: string; userId: string; joinedAt: string }[];
  checkins: { id: string; challengeId: string; userId: string; checkinDate: string; createdAt: string }[];
  partnerApplications: {
    id: string;
    company: string;
    contactName: string;
    phone: string;
    industry: string;
    course: string;
    createdAt: string;
  }[];
  reports: {
    id: string;
    reporterId: string;
    targetType: "post" | "user";
    targetId: string;
    reason: string;
    status: "open" | "reviewed" | "dismissed";
    createdAt: string;
  }[];
  notifications: {
    id: string;
    userId: string;
    dedupeKey: string;
    toEmail: string;
    subject: string;
    provider: string;
    createdAt: string;
  }[];
};

const SAMPLE_CONTACT = "02-0000-0000（範例電話，請改聯絡現場主辦）";

function publicUser(user: UserRecord): Profile {
  const { passwordHash, ...profile } = user;
  void passwordHash;
  return profile;
}

function goingCount(db: DemoDb, activityId: string) {
  return db.rsvps.filter((item) => item.activityId === activityId && item.status === "going").length;
}

function waitlistCount(db: DemoDb, activityId: string) {
  return db.rsvps.filter((item) => item.activityId === activityId && item.status === "waitlist").length;
}

function toListItem(db: DemoDb, activity: ActivityDetail): ActivityListItem {
  return {
    id: activity.id,
    title: activity.title,
    kind: activity.kind,
    category: activity.category,
    startsAt: activity.startsAt,
    endsAt: activity.endsAt,
    locationName: activity.locationName,
    city: activity.city,
    district: activity.district,
    capacity: activity.capacity,
    goingCount: goingCount(db, activity.id),
    waitlistCount: waitlistCount(db, activity.id),
    difficulty: activity.difficulty,
    isSample: activity.isSample,
    status: activity.status,
    organizerName: activity.organizerName,
    organizerVerified: activity.organizerVerified,
    branchId: activity.branchId,
    branchName: branchById(activity.branchId)?.name ?? null,
    speaker: activity.speaker,
  };
}

function requireUser(actor: Profile | null): Result | Profile {
  if (!actor) return { ok: false, error: "請先登入" };
  return actor;
}

function isProfile(value: Result | Profile): value is Profile {
  return "id" in value;
}

export function createSeedDb(now = new Date()): DemoDb {
  const passwordHash = hashPassword(DEMO_PASSWORD);
  const createdAt = now.toISOString();
  const users: UserRecord[] = [
    {
      id: "user-admin",
      email: "admin@bama.example",
      nickname: "林志工",
      phone: null,
      city: "台北市",
      district: "中正區",
      interests: ["講座", "健康料理"],
      role: "admin",
      verified: true,
      planId: "free",
      memberType: "public",
      partnerNumber: null,
      homeBranchId: "daan",
      managedBranchId: null,
      createdAt,
      passwordHash,
    },
    {
      id: "user-member",
      email: "member@bama.example",
      nickname: "陳阿姨",
      phone: null,
      city: "台北市",
      district: "大安區",
      interests: ["健康料理", "職場伸展"],
      role: "member",
      verified: false,
      planId: "free",
      memberType: "public",
      partnerNumber: null,
      homeBranchId: "daan",
      managedBranchId: null,
      createdAt,
      passwordHash,
    },
    {
      id: "user-sample",
      email: "sample@bama.example",
      nickname: "王伯伯",
      phone: null,
      city: "台北市",
      district: "信義區",
      interests: ["職場伸展"],
      role: "member",
      verified: true,
      planId: "free",
      memberType: "public",
      partnerNumber: null,
      homeBranchId: null,
      managedBranchId: null,
      createdAt,
      passwordHash,
    },
    {
      id: "user-branch",
      email: "branch@bama.example",
      nickname: "林場地",
      phone: null,
      city: "台北市",
      district: "大安區",
      interests: ["講座"],
      role: "branch_manager",
      verified: true,
      planId: "free",
      memberType: "public",
      partnerNumber: null,
      homeBranchId: "daan",
      managedBranchId: "daan",
      createdAt,
      passwordHash,
    },
  ];

  const makeActivity = (
    partial: Omit<ActivityDetail, "goingCount" | "waitlistCount" | "myStatus" | "organizerContact" | "endsAt" | "branchName" | "branchId" | "speaker"> & {
      minutes: number;
      contact?: string;
      branchId?: string;
      speaker?: string | null;
    },
  ): ActivityDetail => {
    const branchId = partial.branchId ?? "daan";
    return {
      ...partial,
      branchId,
      branchName: branchById(branchId)?.name ?? null,
      speaker: partial.speaker ?? null,
      city: partial.city.replaceAll("臺", "台"),
      endsAt: addMinutes(partial.startsAt, partial.minutes),
      organizerContact: partial.contact ?? SAMPLE_CONTACT,
      goingCount: 0,
      waitlistCount: 0,
      myStatus: null,
    };
  };

  const activities: ActivityDetail[] = [
    makeActivity({
      id: "act-daan",
      title: "大安健康料理教室",
      kind: "exercise",
      category: "健康料理",
      speaker: "示範料理教室（虛構） · 林講師",
      description: "【範例活動】在室內教室一起備料、組裝一份簡單早餐。可聊天，步調由自己決定。不談食療效果，也不推銷食材。",
      startsAt: atTaipei(2, 10, 0, now),
      minutes: 90,
      locationName: "大安健康教室",
      address: "台北市大安區（範例場地）",
      city: "台北市",
      district: "大安區",
      capacity: 16,
      difficulty: "easy",
      organizerId: "user-admin",
      organizerName: "林志工",
      organizerVerified: true,
      isSample: true,
      status: "published",
    }),
    makeActivity({
      id: "act-banqiao",
      title: "板橋職場伸展與體態",
      kind: "exercise",
      category: "職場伸展",
      branchId: "banqiao",
      speaker: "示範健身工作室（虛構） · 陳教練",
      description: "【範例活動】坐著或站著做肩頸與腰背的一般伸展，穿著寬鬆衣服即可。這不是復健或治療，疼痛就停下來。",
      startsAt: atTaipei(3, 19, 0, now),
      minutes: 60,
      locationName: "板橋室內教室",
      address: "新北市板橋區（範例場地）",
      city: "新北市",
      district: "板橋區",
      capacity: 18,
      difficulty: "easy",
      organizerId: "user-admin",
      organizerName: "林志工",
      organizerVerified: true,
      isSample: true,
      status: "published",
    }),
    makeActivity({
      id: "act-neihu",
      title: "內湖芳療手作",
      kind: "meetup",
      category: "芳療手作",
      branchId: "neihu",
      speaker: "示範手作教室（虛構） · 王老師",
      description: "【範例活動】用手邊材料做一份香味小物，帶回家即可。這是手作體驗，不是治療，也不保證舒緩效果。",
      startsAt: atTaipei(4, 14, 0, now),
      minutes: 90,
      locationName: "內湖手作教室",
      address: "台北市內湖區（範例場地）",
      city: "台北市",
      district: "內湖區",
      capacity: 12,
      difficulty: "easy",
      organizerId: "user-admin",
      organizerName: "林志工",
      organizerVerified: true,
      isSample: true,
      status: "published",
    }),
    makeActivity({
      id: "act-zhongzheng",
      title: "睡眠與紓壓講座",
      kind: "talk",
      category: "睡眠與紓壓",
      branchId: "zhongshan",
      speaker: "示範衛教講師（虛構） · 周講師",
      description: "【範例活動】聊聊一般的作息與放鬆習慣。不診斷睡眠問題，不開立處置，也不介紹產品效果。",
      startsAt: atTaipei(5, 14, 0, now),
      minutes: 90,
      locationName: "中山課程空間",
      address: "台北市中山區（範例場地）",
      city: "台北市",
      district: "中山區",
      capacity: 40,
      difficulty: "easy",
      organizerId: "user-admin",
      organizerName: "林志工",
      organizerVerified: true,
      isSample: true,
      status: "published",
    }),
    makeActivity({
      id: "act-tamsui",
      title: "信義飲食營養常識講座",
      kind: "talk",
      category: "飲食營養",
      branchId: "xinyi",
      speaker: "示範營養諮詢（虛構） · 吳講師",
      description: "【範例活動】用日常例子談均衡飲食的常識。不是個人營養處方，不評估體態，也不推銷食品。",
      startsAt: atTaipei(6, 15, 0, now),
      minutes: 90,
      locationName: "信義講座廳",
      address: "台北市信義區（範例場地）",
      city: "台北市",
      district: "信義區",
      capacity: 36,
      difficulty: "easy",
      organizerId: "user-admin",
      organizerName: "林志工",
      organizerVerified: true,
      isSample: true,
      status: "published",
    }),
    makeActivity({
      id: "act-songshan",
      title: "松山手機攝影課（範例額滿）",
      kind: "exercise",
      category: "手機攝影",
      branchId: "songshan",
      speaker: "示範數位教室（虛構） · 張老師",
      description: "【範例活動】用自己的手機練習構圖。名額刻意設為 1，用來示範額滿後的候補。非正式場次。",
      startsAt: atTaipei(1, 13, 30, now),
      minutes: 75,
      locationName: "松山料理教室",
      address: "台北市松山區（範例場地）",
      city: "台北市",
      district: "松山區",
      capacity: 1,
      difficulty: "easy",
      organizerId: "user-admin",
      organizerName: "林志工",
      organizerVerified: true,
      isSample: true,
      status: "published",
    }),
    makeActivity({
      id: "act-taichung",
      title: "中山數位生活課",
      kind: "exercise",
      category: "數位生活",
      branchId: "zhongshan",
      speaker: "示範數位教室（虛構） · 張老師",
      description: "【範例活動】練習手機裡常用的設定，例如字級、相簿和防詐提醒。不代辦金融操作，也不要求安裝來路不明的程式。",
      startsAt: atTaipei(7, 10, 0, now),
      minutes: 90,
      locationName: "中山課程空間",
      address: "台北市中山區（範例場地）",
      city: "台北市",
      district: "中山區",
      capacity: 20,
      difficulty: "easy",
      organizerId: "user-admin",
      organizerName: "林志工",
      organizerVerified: true,
      isSample: true,
      status: "published",
    }),
    makeActivity({
      id: "act-kaohsiung",
      title: "板橋課程交流",
      kind: "meetup",
      category: "課程交流",
      branchId: "banqiao",
      description: "【範例活動】會員互相認識接下來的課程與講座。沒有商品展示，也不做療效說明。",
      startsAt: atTaipei(8, 13, 30, now),
      minutes: 90,
      locationName: "板橋室內教室",
      address: "新北市板橋區（範例場地）",
      city: "新北市",
      district: "板橋區",
      capacity: 24,
      difficulty: "easy",
      organizerId: "user-admin",
      organizerName: "林志工",
      organizerVerified: true,
      isSample: true,
      status: "published",
    }),
    makeActivity({
      id: "act-taoyuan-21",
      title: "大安 21 日生活節奏說明",
      kind: "challenge",
      category: "21日挑戰",
      description: "【範例活動】說明怎麼參加 21 天自己打卡。不紀錄飲食或產品使用，也不上傳健檢。",
      startsAt: atTaipei(4, 15, 0, now),
      minutes: 60,
      locationName: "大安健康教室",
      address: "台北市大安區（範例場地）",
      city: "台北市",
      district: "大安區",
      capacity: 25,
      difficulty: "easy",
      organizerId: "user-admin",
      organizerName: "林志工",
      organizerVerified: true,
      isSample: true,
      status: "published",
    }),
  ];

  return {
    users,
    sessions: [],
    magicLinks: [],
    activities,
    rsvps: [
      {
        id: "rsvp-sample-songshan",
        activityId: "act-songshan",
        userId: "user-sample",
        status: "going",
        safetyDeclared: true,
        createdAt,
        updatedAt: createdAt,
      },
    ],
    groups: [
      {
        id: "grp-walk",
        name: "大安料理同好",
        description: "【範例社團】住在大安附近，想約人一起上課做菜的朋友。公告只用來約時間。",
        interest: "健康料理",
        city: "臺北市",
        isSample: true,
      },
      {
        id: "grp-taiji",
        name: "板橋伸展同好",
        description: "【範例社團】新北板橋的職場伸展同好。改期會寫在公告。這不是復健班。",
        interest: "職場伸展",
        city: "新北市",
        isSample: true,
      },
      {
        id: "grp-talk",
        name: "講座交流",
        description: "【範例社團】分享公開講座與防詐資訊。請不要張貼轉帳帳號或來路不明連結。",
        interest: "講座",
        city: null,
        isSample: true,
      },
    ],
    groupMembers: [
      { groupId: "grp-walk", userId: "user-admin", joinedAt: createdAt },
      { groupId: "grp-walk", userId: "user-member", joinedAt: createdAt },
      { groupId: "grp-taiji", userId: "user-sample", joinedAt: createdAt },
    ],
    posts: [
      {
        id: "post-walk-1",
        groupId: "grp-walk",
        authorId: "user-admin",
        authorName: "林志工",
        authorVerified: true,
        body: "【範例公告】本週料理課仍在大安健康教室，請穿方便活動的衣服。若臨時不適，不用勉強到場。",
        status: "visible",
        createdAt,
      },
      {
        id: "post-taiji-1",
        groupId: "grp-taiji",
        authorId: "user-sample",
        authorName: "王伯伯",
        authorVerified: true,
        body: "【範例公告】下雨的話改到活動中心走廊，請不要轉帳給任何自稱代訂場地的人。",
        status: "visible",
        createdAt,
      },
    ],
    challenges: [
      {
        id: "ch-walk",
        title: "21 天生活節奏",
        description: "【範例挑戰】連續 21 天，每天為自己做一件很小的生活安排即可打卡。不計步、不上傳健檢，漏一天也可以繼續。",
        durationDays: 21,
        category: "21日挑戰",
        isSample: true,
      },
      {
        id: "ch-stretch",
        title: "14 天肩頸放鬆",
        description: "【範例挑戰】每天做 10 分鐘自己覺得舒服的肩頸活動。這不是復健處方，疼痛就停下來。",
        durationDays: 14,
        category: "職場伸展",
        isSample: true,
      },
    ],
    challengeMembers: [],
    checkins: [],
    reports: [],
    notifications: [],
    partnerApplications: [],
  };
}

export function submitPartnerApplication(db: DemoDb, input: PartnerApplicationInput): Result {
  const parsed = parsePartnerApplication(input);
  if (!parsed.ok) return parsed;
  if (!db.partnerApplications) db.partnerApplications = [];
  db.partnerApplications.push({
    id: randomToken().slice(0, 16),
    ...parsed.data,
    createdAt: new Date().toISOString(),
  });
  return { ok: true, message: "已收到合作申請。示範模式只存在這台電腦，不會真的寄出。" };
}

export function userByEmail(db: DemoDb, email: string) {
  return db.users.find((user) => user.email === email.toLowerCase()) ?? null;
}

export function sessionUser(db: DemoDb, token: string | undefined, now = new Date()) {
  if (!token) return null;
  const session = db.sessions.find((item) => item.token === token && new Date(item.expiresAt) > now);
  if (!session) return null;
  const user = db.users.find((item) => item.id === session.userId);
  return user ? publicUser(user) : null;
}

export function createSession(db: DemoDb, userId: string, now = new Date()) {
  const token = randomToken();
  db.sessions.push({
    token,
    userId,
    expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });
  return token;
}

export function destroySession(db: DemoDb, token: string | undefined) {
  if (!token) return;
  db.sessions = db.sessions.filter((item) => item.token !== token);
}

export function signup(db: DemoDb, raw: SignUpInput, now = new Date()): Result & { user?: Profile } {
  const parsed = parseSignUp(raw);
  if (!parsed.ok) return parsed;
  if (userByEmail(db, parsed.data.email)) return { ok: false, error: "這個信箱已經註冊，請直接登入" };
  const user: UserRecord = {
    id: randomToken().slice(0, 16),
    email: parsed.data.email,
    nickname: parsed.data.nickname,
    phone: parsed.data.phone,
    city: parsed.data.city,
    district: parsed.data.district,
    interests: parsed.data.interests,
    role: "member",
    verified: false,
    planId: "free",
    memberType: parsed.data.memberType,
    partnerNumber: parsed.data.partnerNumber,
    homeBranchId: parsed.data.homeBranchId,
    managedBranchId: null,
    createdAt: now.toISOString(),
    passwordHash: hashPassword(parsed.data.password),
  };
  db.users.push(user);
  return { ok: true, message: "歡迎加入", user: publicUser(user) };
}

export function login(db: DemoDb, email: string, password: string): Result & { user?: Profile } {
  const user = userByEmail(db, email);
  const hash = user?.passwordHash ?? hashPassword("not-the-password");
  const valid = verifyPassword(password, hash);
  if (!user || !valid) return { ok: false, error: "信箱或密碼不正確" };
  return { ok: true, user: publicUser(user) };
}

export function createMagicLink(db: DemoDb, email: string, now = new Date()) {
  const user = userByEmail(db, email);
  if (!user) return { token: null as string | null };
  const token = randomToken();
  db.magicLinks.push({
    token,
    email: user.email,
    expiresAt: new Date(now.getTime() + 30 * 60 * 1000).toISOString(),
  });
  return { token, user: publicUser(user) };
}

export function consumeMagicLink(db: DemoDb, token: string, now = new Date()): Result & { user?: Profile } {
  const link = db.magicLinks.find((item) => item.token === token);
  if (!link || new Date(link.expiresAt) < now) return { ok: false, error: "連結已失效，請重新索取" };
  const user = userByEmail(db, link.email);
  db.magicLinks = db.magicLinks.filter((item) => item.token !== token);
  if (!user) return { ok: false, error: "找不到會員" };
  return { ok: true, user: publicUser(user) };
}

export function updateProfile(db: DemoDb, actor: Profile | null, raw: ProfileInput): Result {
  const user = requireUser(actor);
  if (!isProfile(user)) return user;
  const parsed = parseProfile(raw);
  if (!parsed.ok) return parsed;
  const record = db.users.find((item) => item.id === user.id);
  if (!record) return { ok: false, error: "找不到會員" };
  record.nickname = parsed.data.nickname;
  record.phone = parsed.data.phone;
  record.city = parsed.data.city;
  record.district = parsed.data.district;
  record.interests = parsed.data.interests;
  record.memberType = parsed.data.memberType;
  record.partnerNumber = parsed.data.partnerNumber;
  record.homeBranchId = parsed.data.homeBranchId;
  db.posts.forEach((post) => {
    if (post.authorId === record.id) {
      post.authorName = record.nickname;
      post.authorVerified = record.verified;
    }
  });
  return { ok: true, message: "資料已更新" };
}

function activityOrder(a: { city: string; startsAt: string }, b: { city: string; startsAt: string }) {
  const rank = (city: string) => (city === "台北市" || city === "新北市" ? 0 : 1);
  return rank(a.city) - rank(b.city) || a.startsAt.localeCompare(b.startsAt);
}

export function listActivities(db: DemoDb, filter?: { city?: string; category?: string; branchId?: string }, now = new Date()) {
  const start = startOfTodayTaipeiIso(now);
  return db.activities
    .filter((activity) => activity.status === "published" && activity.endsAt >= start)
    .filter((activity) => (filter?.city ? activity.city === filter.city : true))
    .filter((activity) => (filter?.category ? activity.category === filter.category : true))
    .filter((activity) => (filter?.branchId ? activity.branchId === filter.branchId : true))
    .map((activity) => toListItem(db, activity))
    .sort(activityOrder);
}

export function getActivity(db: DemoDb, id: string, actor: Profile | null): ActivityDetail | null {
  const activity = db.activities.find((item) => item.id === id);
  if (!activity) return null;
  const managesDraft = actor?.role === "admin" || (actor?.role === "branch_manager" && actor.managedBranchId === activity.branchId);
  if (activity.status === "draft" && !managesDraft) return null;
  const mine = actor
    ? db.rsvps.find((item) => item.activityId === id && item.userId === actor.id && item.status !== "cancelled")
    : undefined;
  return {
    ...toListItem(db, activity),
    description: activity.description,
    address: activity.address,
    organizerId: activity.organizerId,
    organizerContact: actor ? activity.organizerContact : null,
    myStatus: mine?.status ?? null,
  };
}

export function rsvp(db: DemoDb, actor: Profile | null, activityId: string, safetyDeclared: boolean, now = new Date()): Result {
  const user = requireUser(actor);
  if (!isProfile(user)) return user;
  if (!safetyDeclared) return { ok: false, error: "請先勾選參加者自我聲明" };
  const activity = db.activities.find((item) => item.id === activityId);
  if (!activity || activity.status !== "published") return { ok: false, error: "此活動目前不開放報名" };
  if (new Date(activity.startsAt) <= now) return { ok: false, error: "活動已開始或結束，無法報名" };
  const existing = db.rsvps.find((item) => item.activityId === activityId && item.userId === user.id);
  if (existing?.status === "going") return { ok: true, status: "going", already: true, message: "您已經報名這場活動" };
  if (existing?.status === "waitlist") return { ok: true, status: "waitlist", already: true, message: "您已在候補名單" };
  const status: "going" | "waitlist" = goingCount(db, activityId) < activity.capacity ? "going" : "waitlist";
  if (existing) {
    existing.status = status;
    existing.safetyDeclared = true;
    existing.updatedAt = now.toISOString();
  } else {
    db.rsvps.push({
      id: randomToken().slice(0, 16),
      activityId,
      userId: user.id,
      status,
      safetyDeclared: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
  }
  return {
    ok: true,
    status,
    message: status === "going" ? "報名成功，期待見到您" : "名額已滿，已為您登記候補",
  };
}

export function cancelRsvp(db: DemoDb, actor: Profile | null, activityId: string, now = new Date()): Result & { promotedUserId?: string } {
  const user = requireUser(actor);
  if (!isProfile(user)) return user;
  const existing = db.rsvps.find((item) => item.activityId === activityId && item.userId === user.id && item.status !== "cancelled");
  if (!existing) return { ok: false, error: "您目前沒有這場活動的報名" };
  const wasGoing = existing.status === "going";
  existing.status = "cancelled";
  existing.updatedAt = now.toISOString();
  let promotedUserId: string | undefined;
  if (wasGoing) {
    const next = db.rsvps
      .filter((item) => item.activityId === activityId && item.status === "waitlist")
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0];
    if (next) {
      next.status = "going";
      next.updatedAt = now.toISOString();
      promotedUserId = next.userId;
    }
  }
  return { ok: true, message: "已取消報名", promotedUserId };
}

function groupItem(db: DemoDb, group: DemoDb["groups"][number], actor: Profile | null): GroupListItem {
  return {
    ...group,
    memberCount: db.groupMembers.filter((item) => item.groupId === group.id).length,
    joined: actor ? db.groupMembers.some((item) => item.groupId === group.id && item.userId === actor.id) : false,
  };
}

export function listGroups(db: DemoDb, actor: Profile | null) {
  return db.groups.map((group) => groupItem(db, group, actor));
}

export function getGroup(db: DemoDb, id: string, actor: Profile | null): GroupDetail | null {
  const group = db.groups.find((item) => item.id === id);
  if (!group) return null;
  const posts = db.posts
    .filter((post) => post.groupId === id)
    .filter((post) => post.status === "visible" || actor?.role === "admin" || post.authorId === actor?.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { ...groupItem(db, group, actor), posts };
}

export function joinGroup(db: DemoDb, actor: Profile | null, groupId: string, now = new Date()): Result {
  const user = requireUser(actor);
  if (!isProfile(user)) return user;
  if (!db.groups.some((item) => item.id === groupId)) return { ok: false, error: "找不到社團" };
  if (db.groupMembers.some((item) => item.groupId === groupId && item.userId === user.id)) {
    return { ok: true, already: true, message: "您已經是社員" };
  }
  db.groupMembers.push({ groupId, userId: user.id, joinedAt: now.toISOString() });
  return { ok: true, message: "已加入社團" };
}

export function leaveGroup(db: DemoDb, actor: Profile | null, groupId: string): Result {
  const user = requireUser(actor);
  if (!isProfile(user)) return user;
  db.groupMembers = db.groupMembers.filter((item) => !(item.groupId === groupId && item.userId === user.id));
  return { ok: true, message: "已退出社團" };
}

export function createPost(db: DemoDb, actor: Profile | null, groupId: string, body: string, now = new Date()): Result {
  const user = requireUser(actor);
  if (!isProfile(user)) return user;
  const text = body.trim();
  if (text.length < 2) return { ok: false, error: "公告至少要寫兩個字" };
  if (text.length > 1000) return { ok: false, error: "公告最多 1000 個字" };
  if (!db.groupMembers.some((item) => item.groupId === groupId && item.userId === user.id)) {
    return { ok: false, error: "加入社團後才能張貼公告" };
  }
  db.posts.push({
    id: randomToken().slice(0, 16),
    groupId,
    authorId: user.id,
    authorName: user.nickname,
    authorVerified: user.verified,
    body: text,
    status: "visible",
    createdAt: now.toISOString(),
  });
  return { ok: true, message: "公告已發布" };
}

function challengeItem(db: DemoDb, challenge: DemoDb["challenges"][number], actor: Profile | null, now = new Date()): ChallengeListItem {
  const dates = actor
    ? db.checkins.filter((item) => item.challengeId === challenge.id && item.userId === actor.id).map((item) => item.checkinDate)
    : [];
  const today = todayTaipei(now);
  return {
    ...challenge,
    joined: actor ? db.challengeMembers.some((item) => item.challengeId === challenge.id && item.userId === actor.id) : false,
    checkinCount: dates.length,
    checkedInToday: dates.includes(today),
  };
}

export function listChallenges(db: DemoDb, actor: Profile | null, now = new Date()) {
  return db.challenges.map((challenge) => challengeItem(db, challenge, actor, now));
}

export function getChallenge(db: DemoDb, id: string, actor: Profile | null, now = new Date()): ChallengeDetail | null {
  const challenge = db.challenges.find((item) => item.id === id);
  if (!challenge) return null;
  const dates = actor
    ? db.checkins
        .filter((item) => item.challengeId === id && item.userId === actor.id)
        .map((item) => item.checkinDate)
        .sort()
    : [];
  return { ...challengeItem(db, challenge, actor, now), checkinDates: dates };
}

export function joinChallenge(db: DemoDb, actor: Profile | null, challengeId: string, now = new Date()): Result {
  const user = requireUser(actor);
  if (!isProfile(user)) return user;
  if (!db.challenges.some((item) => item.id === challengeId)) return { ok: false, error: "找不到挑戰" };
  if (db.challengeMembers.some((item) => item.challengeId === challengeId && item.userId === user.id)) {
    return { ok: true, already: true, message: "您已經參加這個挑戰" };
  }
  db.challengeMembers.push({ challengeId, userId: user.id, joinedAt: now.toISOString() });
  return { ok: true, message: "已加入挑戰，今天就可以打卡" };
}

export function checkIn(db: DemoDb, actor: Profile | null, challengeId: string, now = new Date()): Result {
  const user = requireUser(actor);
  if (!isProfile(user)) return user;
  if (!db.challengeMembers.some((item) => item.challengeId === challengeId && item.userId === user.id)) {
    return { ok: false, error: "請先加入挑戰" };
  }
  const day = todayTaipei(now);
  if (db.checkins.some((item) => item.challengeId === challengeId && item.userId === user.id && item.checkinDate === day)) {
    return { ok: true, already: true, message: "今天已經打卡了" };
  }
  db.checkins.push({
    id: randomToken().slice(0, 16),
    challengeId,
    userId: user.id,
    checkinDate: day,
    createdAt: now.toISOString(),
  });
  return { ok: true, message: "今天的打卡完成了" };
}

export function report(
  db: DemoDb,
  actor: Profile | null,
  input: { targetType: "post" | "user"; targetId: string; reason: string },
  now = new Date(),
): Result {
  const user = requireUser(actor);
  if (!isProfile(user)) return user;
  const reason = input.reason.trim();
  if (reason.length < 4) return { ok: false, error: "請用一句話說明原因" };
  if (reason.length > 500) return { ok: false, error: "原因最多 500 個字" };
  if (input.targetType === "post" && !db.posts.some((post) => post.id === input.targetId)) {
    return { ok: false, error: "找不到這則公告" };
  }
  if (input.targetType === "user" && !db.users.some((item) => item.id === input.targetId)) {
    return { ok: false, error: "找不到這位會員" };
  }
  db.reports.push({
    id: randomToken().slice(0, 16),
    reporterId: user.id,
    targetType: input.targetType,
    targetId: input.targetId,
    reason,
    status: "open",
    createdAt: now.toISOString(),
  });
  return { ok: true, message: "已收到檢舉，管理員會查看" };
}

function requireAdmin(actor: Profile | null): Result | Profile {
  const user = requireUser(actor);
  if (!isProfile(user)) return user;
  if (user.role !== "admin") return { ok: false, error: "需要管理員權限" };
  return user;
}

function canManageBranch(actor: Profile, branchId: string | null) {
  if (actor.role === "admin") return true;
  return actor.role === "branch_manager" && Boolean(branchId) && actor.managedBranchId === branchId;
}

export function adminListActivities(db: DemoDb, actor: Profile | null) {
  if (!actor || (actor.role !== "admin" && actor.role !== "branch_manager")) return [];
  return db.activities
    .filter((activity) => canManageBranch(actor, activity.branchId))
    .map((activity) => toListItem(db, activity))
    .sort(activityOrder);
}

export function adminSaveActivity(db: DemoDb, actor: Profile | null, input: ActivityInput, id?: string): Result {
  const user = requireUser(actor);
  if (!isProfile(user)) return user;
  if (user.role !== "admin" && user.role !== "branch_manager") return { ok: false, error: "需要管理員權限" };
  const scoped = user.role === "branch_manager" ? { ...input, branchId: user.managedBranchId ?? "" } : input;
  if (user.role === "branch_manager" && id) {
    const existing = db.activities.find((item) => item.id === id);
    if (!existing || existing.branchId !== user.managedBranchId) return { ok: false, error: "只能管理自己場地的活動" };
  }
  const parsed = parseActivity(scoped);
  if (!parsed.ok) return parsed;
  if (!canManageBranch(user, parsed.data.branchId)) return { ok: false, error: "只能管理自己場地的活動" };
  if (id) {
    const activity = db.activities.find((item) => item.id === id);
    if (!activity) return { ok: false, error: "找不到活動" };
    Object.assign(activity, parsed.data, { organizerId: activity.organizerId ?? user.id, branchName: branchById(parsed.data.branchId)?.name ?? null });
    return { ok: true, id, message: "活動已更新" };
  }
  const newId = randomToken().slice(0, 16);
  db.activities.push({
    ...parsed.data,
    id: newId,
    organizerId: user.id,
    branchName: branchById(parsed.data.branchId)?.name ?? null,
    goingCount: 0,
    waitlistCount: 0,
    myStatus: null,
  });
  return { ok: true, id: newId, message: "活動已建立" };
}

export function adminListRsvps(db: DemoDb, actor: Profile | null, activityId: string): RsvpRow[] | Result {
  const user = requireUser(actor);
  if (!isProfile(user)) return user;
  const activity = db.activities.find((item) => item.id === activityId);
  if (!activity || !canManageBranch(user, activity.branchId)) return { ok: false, error: "只能查看自己場地的報名" };
  return db.rsvps
    .filter((item) => item.activityId === activityId)
    .map((item) => {
      const user = db.users.find((entry) => entry.id === item.userId);
      return {
        id: item.id,
        userId: item.userId,
        nickname: user?.nickname ?? "已刪除會員",
        email: user?.email ?? "",
        phone: user?.phone ?? null,
        status: item.status,
        safetyDeclared: item.safetyDeclared,
        createdAt: item.createdAt,
      };
    })
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function adminSaveGroup(db: DemoDb, actor: Profile | null, input: GroupInput, id?: string): Result {
  const admin = requireAdmin(actor);
  if (!isProfile(admin)) return admin;
  const parsed = parseGroup(input);
  if (!parsed.ok) return parsed;
  if (id) {
    const group = db.groups.find((item) => item.id === id);
    if (!group) return { ok: false, error: "找不到社團" };
    Object.assign(group, parsed.data);
    return { ok: true, id, message: "社團已更新" };
  }
  const newId = randomToken().slice(0, 16);
  db.groups.push({ id: newId, ...parsed.data });
  return { ok: true, id: newId, message: "社團已建立" };
}

export function adminSaveChallenge(db: DemoDb, actor: Profile | null, input: ChallengeInput, id?: string): Result {
  const admin = requireAdmin(actor);
  if (!isProfile(admin)) return admin;
  const parsed = parseChallenge(input);
  if (!parsed.ok) return parsed;
  if (id) {
    const challenge = db.challenges.find((item) => item.id === id);
    if (!challenge) return { ok: false, error: "找不到挑戰" };
    Object.assign(challenge, parsed.data);
    return { ok: true, id, message: "挑戰已更新" };
  }
  const newId = randomToken().slice(0, 16);
  db.challenges.push({ id: newId, ...parsed.data });
  return { ok: true, id: newId, message: "挑戰已建立" };
}

export function adminListMembers(db: DemoDb, actor: Profile | null): Profile[] | Result {
  const admin = requireAdmin(actor);
  if (!isProfile(admin)) return admin;
  return db.users.map(publicUser).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function adminSetVerified(db: DemoDb, actor: Profile | null, userId: string, verified: boolean): Result {
  const admin = requireAdmin(actor);
  if (!isProfile(admin)) return admin;
  const user = db.users.find((item) => item.id === userId);
  if (!user) return { ok: false, error: "找不到會員" };
  user.verified = verified;
  db.posts.forEach((post) => {
    if (post.authorId === user.id) post.authorVerified = verified;
  });
  if (user.id === admin.id) {
    db.activities.forEach((activity) => {
      if (activity.organizerId === user.id) activity.organizerVerified = verified;
    });
  }
  return { ok: true, message: verified ? "已標記為已驗證" : "已取消驗證" };
}

export function adminSetRole(
  db: DemoDb,
  actor: Profile | null,
  userId: string,
  role: Profile["role"],
  managedBranchId: string | null,
): Result {
  const admin = requireAdmin(actor);
  if (!isProfile(admin)) return admin;
  const user = db.users.find((item) => item.id === userId);
  if (!user) return { ok: false, error: "找不到會員" };
  if (user.role === "admin" && role !== "admin") {
    const otherAdmins = db.users.filter((item) => item.role === "admin" && item.id !== user.id).length;
    if (otherAdmins === 0) return { ok: false, error: "至少需要一位管理員" };
  }
  if (role === "branch_manager" && !branchById(managedBranchId)) return { ok: false, error: "請指定這位場地管理員負責的上課場地" };
  user.role = role;
  user.managedBranchId = role === "branch_manager" ? managedBranchId : null;
  return { ok: true, message: "角色已更新" };
}

export function adminListPosts(db: DemoDb, actor: Profile | null): PostItem[] | Result {
  const admin = requireAdmin(actor);
  if (!isProfile(admin)) return admin;
  return [...db.posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function adminSetPostStatus(db: DemoDb, actor: Profile | null, postId: string, status: "visible" | "hidden"): Result {
  const admin = requireAdmin(actor);
  if (!isProfile(admin)) return admin;
  const post = db.posts.find((item) => item.id === postId);
  if (!post) return { ok: false, error: "找不到公告" };
  post.status = status;
  return { ok: true, message: status === "hidden" ? "公告已隱藏" : "公告已恢復" };
}

export function adminListReports(db: DemoDb, actor: Profile | null): AdminReport[] | Result {
  const admin = requireAdmin(actor);
  if (!isProfile(admin)) return admin;
  return db.reports
    .map((report) => ({
      ...report,
      reporterNickname: db.users.find((user) => user.id === report.reporterId)?.nickname ?? "會員",
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function adminSetReportStatus(db: DemoDb, actor: Profile | null, id: string, status: AdminReport["status"]): Result {
  const admin = requireAdmin(actor);
  if (!isProfile(admin)) return admin;
  const report = db.reports.find((item) => item.id === id);
  if (!report) return { ok: false, error: "找不到檢舉" };
  report.status = status;
  return { ok: true, message: "檢舉狀態已更新" };
}

export function dueReminders(db: DemoDb, now = new Date()): ReminderRecipient[] {
  const until = now.getTime() + 30 * 60 * 60 * 1000;
  const recipients: ReminderRecipient[] = [];
  for (const activity of db.activities) {
    const start = new Date(activity.startsAt).getTime();
    if (activity.status !== "published" || start < now.getTime() || start > until) continue;
    for (const rsvp of db.rsvps.filter((item) => item.activityId === activity.id && item.status === "going")) {
      const user = db.users.find((item) => item.id === rsvp.userId);
      if (!user) continue;
      const dedupeKey = `reminder:${activity.id}:${user.id}`;
      const sent = db.notifications.some((item) => item.dedupeKey === dedupeKey && item.provider === "resend");
      if (sent) continue;
      recipients.push({
        activityId: activity.id,
        title: activity.title,
        startsAt: activity.startsAt,
        locationName: activity.locationName,
        userId: user.id,
        email: user.email,
        nickname: user.nickname,
        dedupeKey,
      });
    }
  }
  return recipients;
}

export function recordNotification(
  db: DemoDb,
  input: { userId: string; dedupeKey: string; toEmail: string; subject: string; provider: string },
  now = new Date(),
) {
  db.notifications.push({
    id: randomToken().slice(0, 16),
    createdAt: now.toISOString(),
    ...input,
  });
}

export function findUser(db: DemoDb, id: string) {
  const user = db.users.find((item) => item.id === id);
  return user ? publicUser(user) : null;
}
