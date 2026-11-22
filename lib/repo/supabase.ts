import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { reminderMessage, rsvpMessage, sendEmail } from "@/lib/email";
import { branchById } from "@/lib/branches";
import { startOfTodayTaipeiIso, todayTaipei } from "@/lib/format";
import type { Repo } from "@/lib/repo/types";
import type {
  ActivityDetail,
  ActivityKind,
  ActivityListItem,
  ActivityStatus,
  AdminReport,
  ChallengeDetail,
  ChallengeListItem,
  Difficulty,
  GroupDetail,
  GroupListItem,
  PostItem,
  Profile,
  ReportStatus,
  Result,
  Role,
  RsvpRow,
  RsvpStatus,
} from "@/lib/types";
import { parseActivity, parseChallenge, parseGroup, parseProfile, parseSignUp } from "@/lib/validation";
import { siteUrl } from "@/lib/config";

const ACTIVITY_COLUMNS =
  "id, title, kind, category, description, starts_at, ends_at, location_name, address, city, district, capacity, difficulty, organizer_id, organizer_name, organizer_verified, is_sample, status, branch_id, speaker";

type ActivityRow = {
  id: string;
  title: string;
  kind: ActivityKind;
  category: string;
  description: string;
  starts_at: string;
  ends_at: string;
  location_name: string;
  address: string;
  city: string;
  district: string;
  capacity: number;
  difficulty: Difficulty;
  organizer_id: string | null;
  organizer_name: string;
  organizer_verified: boolean;
  is_sample: boolean;
  status: ActivityStatus;
  branch_id: string | null;
  speaker: string | null;
};

function fail(error: { message: string } | null, fallback = "暫時無法完成，請稍後再試"): Result {
  return { ok: false, error: error?.message || fallback };
}

function asProfile(value: unknown): Profile | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.id !== "string") return null;
  const role: Role = row.role === "admin" || row.role === "organizer" ? row.role : "member";
  return {
    id: row.id,
    email: String(row.email ?? ""),
    nickname: String(row.nickname ?? "會員"),
    phone: typeof row.phone === "string" && row.phone ? row.phone : null,
    city: String(row.city ?? "台北市"),
    district: String(row.district ?? "大安區"),
    interests: Array.isArray(row.interests) ? row.interests.map(String) : [],
    role,
    verified: Boolean(row.verified),
    planId: String(row.plan_id ?? row.planId ?? "free"),
    createdAt: String(row.created_at ?? row.createdAt ?? new Date().toISOString()),
    memberType: row.member_type === "partner" || row.member_type === "enthusiast" ? row.member_type : "public",
    partnerNumber: typeof row.partner_number === "string" && row.partner_number ? row.partner_number : null,
    homeBranchId: typeof row.home_branch_id === "string" ? row.home_branch_id : null,
    managedBranchId: typeof row.managed_branch_id === "string" ? row.managed_branch_id : null,
  };
}

function listItem(row: ActivityRow, going: number, waiting: number): ActivityListItem {
  return {
    id: row.id,
    title: row.title,
    kind: row.kind,
    category: row.category,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    locationName: row.location_name,
    city: row.city,
    district: row.district,
    capacity: row.capacity,
    goingCount: going,
    waitlistCount: waiting,
    difficulty: row.difficulty,
    isSample: row.is_sample,
    status: row.status,
    organizerName: row.organizer_name,
    organizerVerified: row.organizer_verified,
    branchId: row.branch_id,
    branchName: branchById(row.branch_id)?.name ?? null,
    speaker: row.speaker,
  };
}

function byBranchThenTime(a: ActivityListItem, b: ActivityListItem) {
  const rank = (city: string) => (city === "台北市" || city === "新北市" ? 0 : 1);
  return rank(a.city) - rank(b.city) || a.startsAt.localeCompare(b.startsAt);
}

async function counts() {
  const supabase = await createClient();
  const { data } = await supabase.from("activity_rsvp_counts").select("activity_id, going_count, waitlist_count");
  const map = new Map<string, { going: number; waiting: number }>();
  for (const row of data ?? []) {
    map.set(row.activity_id as string, {
      going: Number(row.going_count ?? 0),
      waiting: Number(row.waitlist_count ?? 0),
    });
  }
  return map;
}

async function currentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const id = data?.claims?.sub;
  if (!id) return null;
  const { data: profile } = await supabase.rpc("current_profile");
  return asProfile(profile);
}

async function requireAdmin() {
  const user = await currentUser();
  if (!user) return { ok: false as const, error: "請先登入" };
  if (user.role !== "admin") return { ok: false as const, error: "需要管理員權限" };
  return { ok: true as const, user };
}

async function notifyRsvp(user: Profile, activityId: string, status: "going" | "waitlist", title: string, startsAt: string, locationName: string) {
  const message = rsvpMessage({
    nickname: user.nickname,
    title,
    startsAt,
    locationName,
    status,
    activityPath: `/activities/${activityId}`,
  });
  const sent = await sendEmail({
    to: user.email,
    subject: message.subject,
    html: message.html,
    text: message.text,
    idempotencyKey: `rsvp/${activityId}/${user.id}/${status}`,
  });
  const supabase = await createClient();
  await supabase.from("notification_log").insert({
    user_id: user.id,
    dedupe_key: `rsvp:${activityId}:${user.id}:${status}:${sent.provider}`,
    to_email: user.email,
    subject: message.subject,
    provider: sent.provider,
  });
}

async function flushOutbox() {
  const admin = createAdminClient();
  if (!admin) return;
  const { data } = await admin.from("email_outbox").select("id, to_email, payload, kind").eq("status", "pending").limit(30);
  for (const row of data ?? []) {
    const payload = (row.payload ?? {}) as Record<string, string>;
    if (row.kind !== "rsvp") continue;
    const message = rsvpMessage({
      nickname: payload.nickname ?? "會員",
      title: payload.title ?? "活動",
      startsAt: payload.startsAt,
      locationName: payload.locationName ?? "",
      status: payload.status === "waitlist" ? "waitlist" : "going",
      activityPath: `/activities/${payload.activityId}`,
    });
    const sent = await sendEmail({
      to: row.to_email as string,
      subject: message.subject,
      html: message.html,
      text: message.text,
      idempotencyKey: `outbox/${row.id}`,
    });
    await admin
      .from("email_outbox")
      .update({ status: sent.provider === "resend" ? "sent" : sent.provider === "error" ? "error" : "skipped" })
      .eq("id", row.id);
  }
}

export const supabaseRepo: Repo = {
  mode: "supabase",
  getSessionUser: currentUser,
  async signUp(input) {
    const parsed = parseSignUp(input);
    if (!parsed.ok) return parsed;
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${siteUrl()}/auth/callback`,
        data: {
          nickname: parsed.data.nickname,
          phone: parsed.data.phone ?? "",
          city: parsed.data.city,
          district: parsed.data.district,
          interests: parsed.data.interests,
          member_type: parsed.data.memberType,
          partner_number: parsed.data.partnerNumber ?? "",
          home_branch_id: parsed.data.homeBranchId ?? "",
        },
      },
    });
    if (error) return fail(error);
    if (!data.session) return { ok: true, needsEmailConfirm: true, message: "請到信箱點確認信，完成後即可登入。" };
    return { ok: true, message: "歡迎加入樂齡健康俱樂部" };
  },
  async signIn(email, password) {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error) return { ok: false, error: "信箱或密碼不正確" };
    return { ok: true, message: "登入成功" };
  },
  async requestMagicLink(email) {
    const supabase = await createClient();
    await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: `${siteUrl()}/auth/callback`, shouldCreateUser: false },
    });
    return { ok: true, message: "若此信箱已註冊，您將收到登入信。" };
  },
  async consumeMagicLink() {
    return { ok: false, error: "請使用信箱裡的登入連結" };
  },
  async signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
  },
  async updateProfile(input) {
    const parsed = parseProfile(input);
    if (!parsed.ok) return parsed;
    const user = await currentUser();
    if (!user) return { ok: false, error: "請先登入" };
    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        nickname: parsed.data.nickname,
        phone: parsed.data.phone,
        city: parsed.data.city,
        district: parsed.data.district,
        interests: parsed.data.interests,
        member_type: parsed.data.memberType,
        partner_number: parsed.data.partnerNumber,
        home_branch_id: parsed.data.homeBranchId,
      })
      .eq("id", user.id);
    if (error) return fail(error);
    return { ok: true, message: "資料已更新" };
  },
  async listActivities(filter) {
    const supabase = await createClient();
    let query = supabase
      .from("activities")
      .select(ACTIVITY_COLUMNS)
      .eq("status", "published")
      .gte("ends_at", startOfTodayTaipeiIso())
      .order("starts_at");
    if (filter?.city) query = query.eq("city", filter.city);
    if (filter?.category) query = query.eq("category", filter.category);
    if (filter?.branchId) query = query.eq("branch_id", filter.branchId);
    const [{ data, error }, tally] = await Promise.all([query, counts()]);
    if (error) throw new Error(error.message);
    return ((data ?? []) as ActivityRow[])
      .map((row) => listItem(row, tally.get(row.id)?.going ?? 0, tally.get(row.id)?.waiting ?? 0))
      .sort(byBranchThenTime);
  },
  async getActivity(id) {
    const supabase = await createClient();
    const user = await currentUser();
    const { data, error } = await supabase.from("activities").select(ACTIVITY_COLUMNS).eq("id", id).maybeSingle();
    if (error || !data) return null;
    const row = data as ActivityRow;
    const managesDraft = user?.role === "admin" || (user?.role === "branch_manager" && user.managedBranchId === row.branch_id);
    if (row.status === "draft" && !managesDraft) return null;
    const tally = await counts();
    let myStatus: RsvpStatus | null = null;
    if (user) {
      const { data: mine } = await supabase
        .from("rsvps")
        .select("status")
        .eq("activity_id", id)
        .eq("user_id", user.id)
        .neq("status", "cancelled")
        .maybeSingle();
      myStatus = (mine?.status as RsvpStatus | undefined) ?? null;
    }
    let organizerContact: string | null = null;
    if (user) {
      const { data: contact } = await supabase.rpc("organizer_contact", { p_activity_id: id });
      organizerContact = typeof contact === "string" ? contact : null;
    }
    const detail: ActivityDetail = {
      ...listItem(row, tally.get(row.id)?.going ?? 0, tally.get(row.id)?.waiting ?? 0),
      description: row.description,
      address: row.address,
      organizerId: row.organizer_id,
      organizerContact,
      myStatus,
    };
    return detail;
  },
  async rsvp(activityId, safetyDeclared) {
    const user = await currentUser();
    if (!user) return { ok: false, error: "請先登入" };
    const supabase = await createClient();
    const { data: before } = await supabase.from("rsvps").select("status").eq("activity_id", activityId).eq("user_id", user.id).maybeSingle();
    const { data, error } = await supabase.rpc("rsvp_activity", { p_activity_id: activityId, p_declared: safetyDeclared });
    if (error) return fail(error);
    const status = data === "waitlist" ? "waitlist" : "going";
    if (before?.status === status) {
      return { ok: true, status, already: true, message: status === "going" ? "您已經報名這場活動" : "您已在候補名單" };
    }
    const { data: activity } = await supabase.from("activities").select("title, starts_at, location_name").eq("id", activityId).maybeSingle();
    if (activity) {
      await notifyRsvp(user, activityId, status, activity.title as string, activity.starts_at as string, activity.location_name as string);
    }
    return { ok: true, status, message: status === "going" ? "報名成功，期待見到您" : "名額已滿，已為您登記候補" };
  },
  async cancelRsvp(activityId) {
    const user = await currentUser();
    if (!user) return { ok: false, error: "請先登入" };
    const supabase = await createClient();
    const { error } = await supabase.rpc("cancel_rsvp", { p_activity_id: activityId });
    if (error) return fail(error);
    await flushOutbox();
    return { ok: true, message: "已取消報名" };
  },
  async listGroups() {
    const supabase = await createClient();
    const user = await currentUser();
    const [{ data: groups, error }, { data: tally }, mine] = await Promise.all([
      supabase.from("groups").select("id, name, description, interest, city, is_sample").order("name"),
      supabase.from("group_member_counts").select("group_id, member_count"),
      user ? supabase.from("group_members").select("group_id").eq("user_id", user.id) : Promise.resolve({ data: [] }),
    ]);
    if (error) throw new Error(error.message);
    const countsMap = new Map((tally ?? []).map((row) => [row.group_id as string, Number(row.member_count ?? 0)]));
    const joined = new Set((mine.data ?? []).map((row) => row.group_id as string));
    return (groups ?? []).map((group) => ({
      id: group.id as string,
      name: group.name as string,
      description: group.description as string,
      interest: group.interest as string,
      city: (group.city as string | null) ?? null,
      isSample: Boolean(group.is_sample),
      memberCount: countsMap.get(group.id as string) ?? 0,
      joined: joined.has(group.id as string),
    })) satisfies GroupListItem[];
  },
  async getGroup(id) {
    const groups = await supabaseRepo.listGroups();
    const group = groups.find((item) => item.id === id);
    if (!group) return null;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("id, group_id, author_id, author_name, body, status, created_at")
      .eq("group_id", id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const authorIds = [...new Set((data ?? []).map((post) => post.author_id).filter(Boolean))] as string[];
    const { data: authors } = authorIds.length
      ? await supabase.from("profiles").select("id, verified").in("id", authorIds)
      : { data: [] };
    const verified = new Map((authors ?? []).map((author) => [author.id as string, Boolean(author.verified)]));
    const posts: PostItem[] = (data ?? []).map((post) => ({
      id: post.id as string,
      groupId: post.group_id as string,
      authorId: (post.author_id as string | null) ?? null,
      authorName: post.author_name as string,
      authorVerified: verified.get(post.author_id as string) ?? false,
      body: post.body as string,
      status: post.status as PostItem["status"],
      createdAt: post.created_at as string,
    }));
    const detail: GroupDetail = { ...group, posts };
    return detail;
  },
  async joinGroup(id) {
    const user = await currentUser();
    if (!user) return { ok: false, error: "請先登入" };
    const supabase = await createClient();
    const { error } = await supabase.from("group_members").insert({ group_id: id, user_id: user.id });
    if (error && !error.message.includes("duplicate")) return fail(error);
    return { ok: true, message: "已加入社團" };
  },
  async leaveGroup(id) {
    const user = await currentUser();
    if (!user) return { ok: false, error: "請先登入" };
    const supabase = await createClient();
    const { error } = await supabase.from("group_members").delete().eq("group_id", id).eq("user_id", user.id);
    if (error) return fail(error);
    return { ok: true, message: "已退出社團" };
  },
  async createPost(groupId, body) {
    const user = await currentUser();
    if (!user) return { ok: false, error: "請先登入" };
    const text = body.trim();
    if (text.length < 2) return { ok: false, error: "公告至少要寫兩個字" };
    if (text.length > 1000) return { ok: false, error: "公告最多 1000 個字" };
    const supabase = await createClient();
    const { error } = await supabase.from("posts").insert({
      group_id: groupId,
      author_id: user.id,
      author_name: user.nickname,
      body: text,
      status: "visible",
    });
    if (error) return fail(error);
    return { ok: true, message: "公告已發布" };
  },
  async listChallenges() {
    const supabase = await createClient();
    const user = await currentUser();
    const { data, error } = await supabase.from("challenges").select("id, title, description, duration_days, category, is_sample").order("title");
    if (error) throw new Error(error.message);
    const memberships = user
      ? (await supabase.from("challenge_members").select("challenge_id").eq("user_id", user.id)).data ?? []
      : [];
    const checkins = user
      ? (await supabase.from("checkins").select("challenge_id, checkin_date").eq("user_id", user.id)).data ?? []
      : [];
    const joined = new Set(memberships.map((item) => item.challenge_id as string));
    const today = todayTaipei();
    return (data ?? []).map((challenge) => {
      const dates = checkins.filter((item) => item.challenge_id === challenge.id).map((item) => String(item.checkin_date));
      const item: ChallengeListItem = {
        id: challenge.id as string,
        title: challenge.title as string,
        description: challenge.description as string,
        durationDays: Number(challenge.duration_days),
        category: challenge.category as string,
        isSample: Boolean(challenge.is_sample),
        joined: joined.has(challenge.id as string),
        checkinCount: dates.length,
        checkedInToday: dates.includes(today),
      };
      return item;
    });
  },
  async getChallenge(id) {
    const list = await supabaseRepo.listChallenges();
    const challenge = list.find((item) => item.id === id);
    if (!challenge) return null;
    const user = await currentUser();
    if (!user) return { ...challenge, checkinDates: [] } satisfies ChallengeDetail;
    const supabase = await createClient();
    const { data } = await supabase.from("checkins").select("checkin_date").eq("challenge_id", id).eq("user_id", user.id);
    const detail: ChallengeDetail = {
      ...challenge,
      checkinDates: (data ?? []).map((item) => String(item.checkin_date)).sort(),
    };
    return detail;
  },
  async joinChallenge(id) {
    const user = await currentUser();
    if (!user) return { ok: false, error: "請先登入" };
    const supabase = await createClient();
    const { error } = await supabase.from("challenge_members").insert({ challenge_id: id, user_id: user.id });
    if (error && !error.message.includes("duplicate")) return fail(error);
    return { ok: true, message: "已加入挑戰，今天就可以打卡" };
  },
  async checkIn(id) {
    const user = await currentUser();
    if (!user) return { ok: false, error: "請先登入" };
    const supabase = await createClient();
    const { error } = await supabase.from("checkins").insert({
      challenge_id: id,
      user_id: user.id,
      checkin_date: todayTaipei(),
    });
    if (error?.message.includes("duplicate") || error?.code === "23505") return { ok: true, already: true, message: "今天已經打卡了" };
    if (error) return fail(error);
    return { ok: true, message: "今天的打卡完成了" };
  },
  async report(input) {
    const user = await currentUser();
    if (!user) return { ok: false, error: "請先登入" };
    const reason = input.reason.trim();
    if (reason.length < 4) return { ok: false, error: "請用一句話說明原因" };
    const supabase = await createClient();
    const { error } = await supabase.from("reports").insert({
      reporter_id: user.id,
      target_type: input.targetType,
      target_id: input.targetId,
      reason,
    });
    if (error) return fail(error);
    return { ok: true, message: "已收到檢舉，管理員會查看" };
  },
  async adminListActivities() {
    const user = await currentUser();
    if (!user || (user.role !== "admin" && user.role !== "branch_manager")) return [];
    const supabase = await createClient();
    let query = supabase.from("activities").select(ACTIVITY_COLUMNS).order("starts_at");
    if (user.role === "branch_manager") query = query.eq("branch_id", user.managedBranchId ?? "");
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    const tally = await counts();
    return ((data ?? []) as ActivityRow[])
      .map((row) => listItem(row, tally.get(row.id)?.going ?? 0, tally.get(row.id)?.waiting ?? 0))
      .sort(byBranchThenTime);
  },
  async adminSaveActivity(input, id) {
    const user = await currentUser();
    if (!user || (user.role !== "admin" && user.role !== "branch_manager")) return { ok: false, error: "需要管理員權限" };
    const scoped = user.role === "branch_manager" ? { ...input, branchId: user.managedBranchId ?? "" } : input;
    const parsed = parseActivity(scoped);
    if (!parsed.ok) return parsed;
    const supabase = await createClient();
    const payload = {
      title: parsed.data.title,
      kind: parsed.data.kind,
      category: parsed.data.category,
      description: parsed.data.description,
      starts_at: parsed.data.startsAt,
      ends_at: parsed.data.endsAt,
      location_name: parsed.data.locationName,
      address: parsed.data.address,
      city: parsed.data.city,
      district: parsed.data.district,
      capacity: parsed.data.capacity,
      difficulty: parsed.data.difficulty,
      organizer_name: parsed.data.organizerName,
      organizer_contact: parsed.data.organizerContact,
      organizer_verified: parsed.data.organizerVerified,
      is_sample: parsed.data.isSample,
      status: parsed.data.status,
      organizer_id: user.id,
      branch_id: parsed.data.branchId,
      speaker: parsed.data.speaker,
    };
    if (id) {
      const { error } = await supabase.from("activities").update(payload).eq("id", id);
      if (error) return fail(error);
      return { ok: true, id, message: "活動已更新" };
    }
    const { data, error } = await supabase.from("activities").insert(payload).select("id").single();
    if (error) return fail(error);
    return { ok: true, id: data.id as string, message: "活動已建立" };
  },
  async adminListRsvps(activityId) {
    const user = await currentUser();
    if (!user || (user.role !== "admin" && user.role !== "branch_manager")) return { ok: false, error: "需要管理員權限" };
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("admin_list_rsvps", { p_activity_id: activityId });
    if (error) return fail(error);
    const rows = Array.isArray(data) ? data : [];
    return rows.map((row) => {
      const item = row as Record<string, unknown>;
      const mapped: RsvpRow = {
        id: String(item.id),
        userId: String(item.user_id),
        nickname: String(item.nickname ?? ""),
        email: String(item.email ?? ""),
        phone: item.phone ? String(item.phone) : null,
        status: item.status as RsvpRow["status"],
        safetyDeclared: Boolean(item.safety_declared),
        createdAt: String(item.created_at),
      };
      return mapped;
    });
  },
  async adminSaveGroup(input, id) {
    const gate = await requireAdmin();
    if (!gate.ok) return gate;
    const parsed = parseGroup(input);
    if (!parsed.ok) return parsed;
    const supabase = await createClient();
    const payload = {
      name: parsed.data.name,
      description: parsed.data.description,
      interest: parsed.data.interest,
      city: parsed.data.city,
      is_sample: parsed.data.isSample,
      created_by: gate.user.id,
    };
    if (id) {
      const { error } = await supabase.from("groups").update(payload).eq("id", id);
      if (error) return fail(error);
      return { ok: true, id, message: "社團已更新" };
    }
    const { data, error } = await supabase.from("groups").insert(payload).select("id").single();
    if (error) return fail(error);
    return { ok: true, id: data.id as string, message: "社團已建立" };
  },
  async adminSaveChallenge(input, id) {
    const gate = await requireAdmin();
    if (!gate.ok) return gate;
    const parsed = parseChallenge(input);
    if (!parsed.ok) return parsed;
    const supabase = await createClient();
    const payload = {
      title: parsed.data.title,
      description: parsed.data.description,
      duration_days: parsed.data.durationDays,
      category: parsed.data.category,
      is_sample: parsed.data.isSample,
    };
    if (id) {
      const { error } = await supabase.from("challenges").update(payload).eq("id", id);
      if (error) return fail(error);
      return { ok: true, id, message: "挑戰已更新" };
    }
    const { data, error } = await supabase.from("challenges").insert(payload).select("id").single();
    if (error) return fail(error);
    return { ok: true, id: data.id as string, message: "挑戰已建立" };
  },
  async adminListMembers() {
    const gate = await requireAdmin();
    if (!gate.ok) return gate;
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("admin_list_members");
    if (error) return fail(error);
    return (Array.isArray(data) ? data : []).map((row) => asProfile(row)).filter((row): row is Profile => Boolean(row));
  },
  async adminSetVerified(userId, verified) {
    const gate = await requireAdmin();
    if (!gate.ok) return gate;
    const supabase = await createClient();
    const { error } = await supabase.from("profiles").update({ verified }).eq("id", userId);
    if (error) return fail(error);
    return { ok: true, message: verified ? "已標記為已驗證" : "已取消驗證" };
  },
  async adminSetRole(userId, role, managedBranchId) {
    const gate = await requireAdmin();
    if (!gate.ok) return gate;
    if (role === "branch_manager" && !branchById(managedBranchId)) return { ok: false, error: "請指定這位據點管理員負責的據點" };
    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ role, managed_branch_id: role === "branch_manager" ? managedBranchId : null })
      .eq("id", userId);
    if (error) return fail(error);
    return { ok: true, message: "角色已更新" };
  },
  async adminListPosts() {
    const gate = await requireAdmin();
    if (!gate.ok) return gate;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("id, group_id, author_id, author_name, body, status, created_at")
      .order("created_at", { ascending: false });
    if (error) return fail(error);
    return (data ?? []).map((post) => ({
      id: post.id as string,
      groupId: post.group_id as string,
      authorId: (post.author_id as string | null) ?? null,
      authorName: post.author_name as string,
      authorVerified: false,
      body: post.body as string,
      status: post.status as PostItem["status"],
      createdAt: post.created_at as string,
    }));
  },
  async adminSetPostStatus(postId, status) {
    const gate = await requireAdmin();
    if (!gate.ok) return gate;
    const supabase = await createClient();
    const { error } = await supabase.from("posts").update({ status }).eq("id", postId);
    if (error) return fail(error);
    return { ok: true, message: status === "hidden" ? "公告已隱藏" : "公告已恢復" };
  },
  async adminListReports() {
    const gate = await requireAdmin();
    if (!gate.ok) return gate;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reports")
      .select("id, reporter_id, target_type, target_id, reason, status, created_at")
      .order("created_at", { ascending: false });
    if (error) return fail(error);
    const ids = [...new Set((data ?? []).map((row) => row.reporter_id as string))];
    const { data: people } = ids.length ? await supabase.from("profiles").select("id, nickname").in("id", ids) : { data: [] };
    const names = new Map((people ?? []).map((person) => [person.id as string, person.nickname as string]));
    return (data ?? []).map((row) => {
      const item: AdminReport = {
        id: row.id as string,
        reporterId: row.reporter_id as string,
        reporterNickname: names.get(row.reporter_id as string) ?? "會員",
        targetType: row.target_type as AdminReport["targetType"],
        targetId: row.target_id as string,
        reason: row.reason as string,
        status: row.status as ReportStatus,
        createdAt: row.created_at as string,
      };
      return item;
    });
  },
  async adminSetReportStatus(id, status) {
    const gate = await requireAdmin();
    if (!gate.ok) return gate;
    const supabase = await createClient();
    const { error } = await supabase.from("reports").update({ status }).eq("id", id);
    if (error) return fail(error);
    return { ok: true, message: "檢舉狀態已更新" };
  },
  async sendDueReminders(trusted = false) {
    if (!trusted) {
      const gate = await requireAdmin();
      if (!gate.ok) return { sent: 0, skipped: 0, failed: 0, note: gate.error };
    }
    const client = trusted ? createAdminClient() : await createClient();
    if (!client) return { sent: 0, skipped: 0, failed: 0, note: "排程寄信需要 SUPABASE_SERVICE_ROLE_KEY" };
    const { data, error } = await client.rpc("due_reminder_recipients");
    if (error) return { sent: 0, skipped: 0, failed: 0, note: error.message };
    const people = Array.isArray(data) ? data : [];
    let sent = 0;
    let skipped = 0;
    let failed = 0;
    for (const person of people) {
      const row = person as Record<string, string>;
      const message = reminderMessage({
        nickname: row.nickname,
        title: row.title,
        startsAt: row.startsAt,
        locationName: row.locationName,
        activityPath: `/activities/${row.activityId}`,
      });
      const result = await sendEmail({
        to: row.email,
        subject: message.subject,
        html: message.html,
        text: message.text,
        idempotencyKey: row.dedupeKey,
      });
      if (result.provider === "resend") {
        sent += 1;
        await client.from("notification_log").insert({
          user_id: row.userId,
          dedupe_key: row.dedupeKey,
          to_email: row.email,
          subject: message.subject,
          provider: "resend",
        });
      } else if (result.provider === "skipped") skipped += 1;
      else failed += 1;
    }
    await flushOutbox();
    const note = people.length === 0 ? "未來 30 小時內沒有需要提醒的報名。" : "提醒已處理。";
    return { sent, skipped, failed, note };
  },
};
