"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { safeNextPath } from "@/lib/config";
import { taipeiInputToIso } from "@/lib/format";
import { getRepo } from "@/lib/repo";
import type { ActivityInput, ActivityStatus, ChallengeInput, Difficulty, GroupInput, Result, Role } from "@/lib/types";
import { stringsFromForm, textFromForm } from "@/lib/validation";

function refresh(paths: string[]) {
  for (const path of paths) revalidatePath(path);
}

export async function signUpAction(_prev: Result | null, formData: FormData): Promise<Result> {
  const repo = await getRepo();
  const result = await repo.signUp({
    email: textFromForm(formData, "email"),
    password: textFromForm(formData, "password"),
    nickname: textFromForm(formData, "nickname"),
    phone: textFromForm(formData, "phone"),
    city: textFromForm(formData, "city"),
    district: textFromForm(formData, "district"),
    interests: stringsFromForm(formData, "interests"),
  });
  if (!result.ok || result.needsEmailConfirm) return result;
  redirect(safeNextPath(formData.get("next"), "/profile"));
}

export async function signInAction(_prev: Result | null, formData: FormData): Promise<Result> {
  const repo = await getRepo();
  const result = await repo.signIn(textFromForm(formData, "email"), textFromForm(formData, "password"));
  if (!result.ok) return result;
  redirect(safeNextPath(formData.get("next"), "/profile"));
}

export async function magicLinkAction(_prev: Result | null, formData: FormData): Promise<Result> {
  const repo = await getRepo();
  return repo.requestMagicLink(textFromForm(formData, "email"));
}

export async function signOutAction() {
  const repo = await getRepo();
  await repo.signOut();
  redirect("/");
}

export async function updateProfileAction(_prev: Result | null, formData: FormData): Promise<Result> {
  const repo = await getRepo();
  const result = await repo.updateProfile({
    nickname: textFromForm(formData, "nickname"),
    phone: textFromForm(formData, "phone"),
    city: textFromForm(formData, "city"),
    district: textFromForm(formData, "district"),
    interests: stringsFromForm(formData, "interests"),
  });
  if (result.ok) refresh(["/profile"]);
  return result;
}

export async function rsvpAction(_prev: Result | null, formData: FormData): Promise<Result> {
  const id = textFromForm(formData, "activity_id");
  const repo = await getRepo();
  const result = await repo.rsvp(id, formData.get("safety") === "on");
  if (result.ok) refresh([`/activities/${id}`, "/activities", "/"]);
  return result;
}

export async function cancelRsvpAction(_prev: Result | null, formData: FormData): Promise<Result> {
  const id = textFromForm(formData, "activity_id");
  const repo = await getRepo();
  const result = await repo.cancelRsvp(id);
  if (result.ok) refresh([`/activities/${id}`, "/activities", "/"]);
  return result;
}

export async function joinGroupAction(_prev: Result | null, formData: FormData): Promise<Result> {
  const id = textFromForm(formData, "group_id");
  const repo = await getRepo();
  const result = await repo.joinGroup(id);
  if (result.ok) refresh([`/groups/${id}`, "/groups"]);
  return result;
}

export async function leaveGroupAction(_prev: Result | null, formData: FormData): Promise<Result> {
  const id = textFromForm(formData, "group_id");
  const repo = await getRepo();
  const result = await repo.leaveGroup(id);
  if (result.ok) refresh([`/groups/${id}`, "/groups"]);
  return result;
}

export async function createPostAction(_prev: Result | null, formData: FormData): Promise<Result> {
  const id = textFromForm(formData, "group_id");
  const repo = await getRepo();
  const result = await repo.createPost(id, textFromForm(formData, "body"));
  if (result.ok) refresh([`/groups/${id}`, "/admin/posts"]);
  return result;
}

export async function joinChallengeAction(_prev: Result | null, formData: FormData): Promise<Result> {
  const id = textFromForm(formData, "challenge_id");
  const repo = await getRepo();
  const result = await repo.joinChallenge(id);
  if (result.ok) refresh([`/challenges/${id}`, "/challenges"]);
  return result;
}

export async function checkInAction(_prev: Result | null, formData: FormData): Promise<Result> {
  const id = textFromForm(formData, "challenge_id");
  const repo = await getRepo();
  const result = await repo.checkIn(id);
  if (result.ok) refresh([`/challenges/${id}`, "/challenges"]);
  return result;
}

export async function reportAction(_prev: Result | null, formData: FormData): Promise<Result> {
  const targetType = textFromForm(formData, "target_type") === "user" ? "user" : "post";
  const repo = await getRepo();
  const result = await repo.report({
    targetType,
    targetId: textFromForm(formData, "target_id"),
    reason: textFromForm(formData, "reason"),
  });
  if (result.ok) refresh(["/admin/reports"]);
  return result;
}

function activityInput(formData: FormData): ActivityInput {
  const statusValue = textFromForm(formData, "status");
  const status: ActivityStatus = statusValue === "draft" || statusValue === "cancelled" ? statusValue : "published";
  const difficultyValue = textFromForm(formData, "difficulty");
  const difficulty: Difficulty =
    difficultyValue === "moderate" || difficultyValue === "challenging" ? difficultyValue : "easy";
  return {
    title: textFromForm(formData, "title"),
    kind: textFromForm(formData, "kind") === "talk" ? "talk" : "exercise",
    category: textFromForm(formData, "category"),
    description: textFromForm(formData, "description"),
    startsAt: taipeiInputToIso(textFromForm(formData, "starts_at")) ?? "invalid",
    endsAt: taipeiInputToIso(textFromForm(formData, "ends_at")) ?? "invalid",
    locationName: textFromForm(formData, "location_name"),
    address: textFromForm(formData, "address"),
    city: textFromForm(formData, "city"),
    district: textFromForm(formData, "district"),
    capacity: Number(textFromForm(formData, "capacity")),
    difficulty,
    organizerName: textFromForm(formData, "organizer_name"),
    organizerContact: textFromForm(formData, "organizer_contact"),
    organizerVerified: formData.get("organizer_verified") === "on",
    isSample: formData.get("is_sample") === "on",
    status,
  };
}

export async function saveActivityAction(_prev: Result | null, formData: FormData): Promise<Result> {
  const repo = await getRepo();
  const id = textFromForm(formData, "id") || undefined;
  const result = await repo.adminSaveActivity(activityInput(formData), id);
  if (result.ok) {
    refresh(["/admin", "/admin/activities", "/activities", "/"]);
    redirect(`/admin/activities/${result.id ?? id}`);
  }
  return result;
}

export async function saveGroupAction(_prev: Result | null, formData: FormData): Promise<Result> {
  const repo = await getRepo();
  const city = textFromForm(formData, "city");
  const input: GroupInput = {
    name: textFromForm(formData, "name"),
    description: textFromForm(formData, "description"),
    interest: textFromForm(formData, "interest"),
    city: city === "臺北市" || city === "新北市" ? city : null,
    isSample: formData.get("is_sample") === "on",
  };
  const result = await repo.adminSaveGroup(input, textFromForm(formData, "id") || undefined);
  if (result.ok) refresh(["/admin/groups", "/groups"]);
  return result;
}

export async function saveChallengeAction(_prev: Result | null, formData: FormData): Promise<Result> {
  const repo = await getRepo();
  const input: ChallengeInput = {
    title: textFromForm(formData, "title"),
    description: textFromForm(formData, "description"),
    durationDays: Number(textFromForm(formData, "duration_days")),
    category: textFromForm(formData, "category"),
    isSample: formData.get("is_sample") === "on",
  };
  const result = await repo.adminSaveChallenge(input, textFromForm(formData, "id") || undefined);
  if (result.ok) refresh(["/admin/challenges", "/challenges"]);
  return result;
}

export async function setVerifiedAction(_prev: Result | null, formData: FormData): Promise<Result> {
  const repo = await getRepo();
  const result = await repo.adminSetVerified(textFromForm(formData, "user_id"), formData.get("verified") === "true");
  if (result.ok) refresh(["/admin/members"]);
  return result;
}

export async function setRoleAction(_prev: Result | null, formData: FormData): Promise<Result> {
  const repo = await getRepo();
  const roleValue = textFromForm(formData, "role");
  const role: Role = roleValue === "admin" || roleValue === "organizer" ? roleValue : "member";
  const result = await repo.adminSetRole(textFromForm(formData, "user_id"), role);
  if (result.ok) refresh(["/admin/members"]);
  return result;
}

export async function setPostStatusAction(_prev: Result | null, formData: FormData): Promise<Result> {
  const repo = await getRepo();
  const status = textFromForm(formData, "status") === "hidden" ? "hidden" : "visible";
  const result = await repo.adminSetPostStatus(textFromForm(formData, "post_id"), status);
  if (result.ok) refresh(["/admin/posts", "/groups"]);
  return result;
}

export async function setReportStatusAction(_prev: Result | null, formData: FormData): Promise<Result> {
  const repo = await getRepo();
  const raw = textFromForm(formData, "status");
  const status = raw === "reviewed" || raw === "dismissed" ? raw : "open";
  const result = await repo.adminSetReportStatus(textFromForm(formData, "report_id"), status);
  if (result.ok) refresh(["/admin/reports"]);
  return result;
}

export async function sendRemindersAction(): Promise<Result> {
  const repo = await getRepo();
  const result = await repo.sendDueReminders(false);
  return { ok: true, message: `${result.note} 已寄出 ${result.sent} 封，略過 ${result.skipped} 封，失敗 ${result.failed} 封。` };
}
