import { cookies } from "next/headers";
import { siteUrl } from "@/lib/config";
import {
  adminListActivities,
  adminListMembers,
  adminListPosts,
  adminListReports,
  adminListRsvps,
  adminSaveActivity,
  adminSaveChallenge,
  adminSaveGroup,
  adminSetPostStatus,
  adminSetReportStatus,
  adminSetRole,
  adminSetVerified,
  cancelRsvp,
  checkIn,
  consumeMagicLink,
  createMagicLink,
  createPost,
  completeLineProfile,
  createSession,
  destroySession,
  dueReminders,
  findUser,
  getActivity,
  getChallenge,
  getGroup,
  joinChallenge,
  joinGroup,
  leaveGroup,
  listActivities,
  listChallenges,
  listGroups,
  login,
  recordNotification,
  report,
  rsvp,
  sessionUser,
  signup,
  submitPartnerApplication,
  updateProfile,
} from "@/lib/demo/logic";
import { updateDb } from "@/lib/demo/store";
import { magicLinkMessage, reminderMessage, rsvpMessage, sendEmail } from "@/lib/email";
import { isPlaceholderEmail } from "@/lib/line";
import type { Repo } from "@/lib/repo/types";
import type { Profile, ProfileInput, SignUpInput } from "@/lib/types";

const COOKIE = "bama_session";

async function readToken() {
  return (await cookies()).get(COOKIE)?.value;
}

async function writeToken(token: string) {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

async function clearToken() {
  (await cookies()).set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

async function actor() {
  const token = await readToken();
  return updateDb((db) => sessionUser(db, token));
}

async function notifyRsvp(user: Profile, activityId: string, status: "going" | "waitlist") {
  const activity = await updateDb((db) => db.activities.find((item) => item.id === activityId) ?? null);
  if (!activity) return;
  if (isPlaceholderEmail(user.email)) return;
  const message = rsvpMessage({
    nickname: user.nickname,
    title: activity.title,
    startsAt: activity.startsAt,
    locationName: activity.locationName,
    status,
    activityPath: `/activities/${activity.id}`,
  });
  const sent = await sendEmail({
    to: user.email,
    subject: message.subject,
    html: message.html,
    text: message.text,
    idempotencyKey: `rsvp/${activity.id}/${user.id}/${status}`,
  });
  await updateDb((db) => {
    recordNotification(db, {
      userId: user.id,
      dedupeKey: `rsvp:${activity.id}:${user.id}:${status}`,
      toEmail: user.email,
      subject: message.subject,
      provider: sent.provider,
    });
  });
}

export const demoRepo: Repo = {
  mode: "demo",
  async getSessionUser() {
    return actor();
  },
  async signUp(input: SignUpInput) {
    const result = await updateDb((db) => signup(db, input));
    if (!result.ok || !result.user) return result.ok ? { ok: false, error: "註冊失敗" } : result;
    const token = await updateDb((db) => createSession(db, result.user!.id));
    await writeToken(token);
    return { ok: true, message: "歡迎加入健康俱樂部" };
  },
  async signIn(email, password) {
    const result = await updateDb((db) => login(db, email, password));
    if (!result.ok || !result.user) return result.ok ? { ok: false, error: "登入失敗" } : result;
    const token = await updateDb((db) => createSession(db, result.user!.id));
    await writeToken(token);
    return { ok: true, message: "登入成功" };
  },
  async requestMagicLink(email) {
    const created = await updateDb((db) => createMagicLink(db, email));
    if (!created.token) {
      return { ok: true, message: "若此信箱已註冊，您將收到登入信。" };
    }
    const devLink = `${siteUrl()}/auth/magic?token=${created.token}`;
    const message = magicLinkMessage(devLink);
    const sent = await sendEmail({
      to: created.user?.email ?? email,
      subject: message.subject,
      html: message.html,
      text: message.text,
      idempotencyKey: `magic/${created.token}`,
    });
    if (created.user) {
      await updateDb((db) => {
        recordNotification(db, {
          userId: created.user!.id,
          dedupeKey: `magic:${created.token}`,
          toEmail: created.user!.email,
          subject: message.subject,
          provider: sent.provider,
        });
      });
    }
    return {
      ok: true,
      message: sent.provider === "resend" ? "登入信已寄出。示範模式也提供下方連結。" : "尚未設定寄信，請使用下方示範連結登入。",
      devLink,
    };
  },
  async consumeMagicLink(token) {
    const result = await updateDb((db) => consumeMagicLink(db, token));
    if (!result.ok || !result.user) return result.ok ? { ok: false, error: "登入失敗" } : result;
    const session = await updateDb((db) => createSession(db, result.user!.id));
    await writeToken(session);
    return { ok: true };
  },
  async signOut() {
    const token = await readToken();
    await updateDb((db) => destroySession(db, token));
    await clearToken();
  },
  async updateProfile(input: ProfileInput) {
    const current = await actor();
    return updateDb((db) => updateProfile(db, current, input));
  },
  async completeLineProfile(input) {
    const current = await actor();
    return updateDb((db) => completeLineProfile(db, current, input));
  },
  async submitPartnerApplication(input) {
    return updateDb((db) => submitPartnerApplication(db, input));
  },
  async listActivities(filter) {
    return updateDb((db) => listActivities(db, filter));
  },
  async getActivity(id) {
    const current = await actor();
    return updateDb((db) => getActivity(db, id, current));
  },
  async rsvp(activityId, safetyDeclared) {
    const current = await actor();
    const result = await updateDb((db) => rsvp(db, current, activityId, safetyDeclared));
    if (result.ok && result.status && !result.already && current) await notifyRsvp(current, activityId, result.status);
    return result;
  },
  async cancelRsvp(activityId) {
    const current = await actor();
    const result = await updateDb((db) => cancelRsvp(db, current, activityId));
    if (result.ok && result.promotedUserId) {
      const promoted = await updateDb((db) => findUser(db, result.promotedUserId!));
      if (promoted) await notifyRsvp(promoted, activityId, "going");
    }
    return result;
  },
  async listGroups() {
    const current = await actor();
    return updateDb((db) => listGroups(db, current));
  },
  async getGroup(id) {
    const current = await actor();
    return updateDb((db) => getGroup(db, id, current));
  },
  async joinGroup(id) {
    const current = await actor();
    return updateDb((db) => joinGroup(db, current, id));
  },
  async leaveGroup(id) {
    const current = await actor();
    return updateDb((db) => leaveGroup(db, current, id));
  },
  async createPost(groupId, body) {
    const current = await actor();
    return updateDb((db) => createPost(db, current, groupId, body));
  },
  async listChallenges() {
    const current = await actor();
    return updateDb((db) => listChallenges(db, current));
  },
  async getChallenge(id) {
    const current = await actor();
    return updateDb((db) => getChallenge(db, id, current));
  },
  async joinChallenge(id) {
    const current = await actor();
    return updateDb((db) => joinChallenge(db, current, id));
  },
  async checkIn(id) {
    const current = await actor();
    return updateDb((db) => checkIn(db, current, id));
  },
  async report(input) {
    const current = await actor();
    return updateDb((db) => report(db, current, input));
  },
  async adminListActivities() {
    const current = await actor();
    return updateDb((db) => adminListActivities(db, current));
  },
  async adminSaveActivity(input, id) {
    const current = await actor();
    return updateDb((db) => adminSaveActivity(db, current, input, id));
  },
  async adminListRsvps(activityId) {
    const current = await actor();
    return updateDb((db) => adminListRsvps(db, current, activityId));
  },
  async adminSaveGroup(input, id) {
    const current = await actor();
    return updateDb((db) => adminSaveGroup(db, current, input, id));
  },
  async adminSaveChallenge(input, id) {
    const current = await actor();
    return updateDb((db) => adminSaveChallenge(db, current, input, id));
  },
  async adminListMembers() {
    const current = await actor();
    return updateDb((db) => adminListMembers(db, current));
  },
  async adminSetVerified(userId, verified) {
    const current = await actor();
    return updateDb((db) => adminSetVerified(db, current, userId, verified));
  },
  async adminSetRole(userId, role, managedBranchId) {
    const current = await actor();
    return updateDb((db) => adminSetRole(db, current, userId, role, managedBranchId));
  },
  async adminListPosts() {
    const current = await actor();
    return updateDb((db) => adminListPosts(db, current));
  },
  async adminSetPostStatus(postId, status) {
    const current = await actor();
    return updateDb((db) => adminSetPostStatus(db, current, postId, status));
  },
  async adminListReports() {
    const current = await actor();
    return updateDb((db) => adminListReports(db, current));
  },
  async adminSetReportStatus(id, status) {
    const current = await actor();
    return updateDb((db) => adminSetReportStatus(db, current, id, status));
  },
  async sendDueReminders(trusted = false) {
    const current = await actor();
    if (!trusted && current?.role !== "admin") return { sent: 0, skipped: 0, failed: 0, note: "需要管理員權限" };
    const recipients = await updateDb((db) => dueReminders(db));
    let sent = 0;
    let skipped = 0;
    let failed = 0;
    for (const person of recipients) {
      const message = reminderMessage({
        nickname: person.nickname,
        title: person.title,
        startsAt: person.startsAt,
        locationName: person.locationName,
        activityPath: `/activities/${person.activityId}`,
      });
      const result = await sendEmail({
        to: person.email,
        subject: message.subject,
        html: message.html,
        text: message.text,
        idempotencyKey: person.dedupeKey,
      });
      if (result.provider === "resend") {
        sent += 1;
        await updateDb((db) => {
          recordNotification(db, {
            userId: person.userId,
            dedupeKey: person.dedupeKey,
            toEmail: person.email,
            subject: message.subject,
            provider: result.provider,
          });
        });
      } else if (result.provider === "skipped") skipped += 1;
      else failed += 1;
    }
    const note = sent + skipped + failed === 0 ? "未來 30 小時內沒有需要提醒的報名。" : "提醒已處理。沒有 API 金鑰時只會記錄、不會真正寄出。";
    return { sent, skipped, failed, note };
  },
};
