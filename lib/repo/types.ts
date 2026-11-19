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
  ProfileInput,
  Result,
  RsvpRow,
  SignUpInput,
} from "@/lib/types";

export type Repo = {
  mode: "demo" | "supabase";
  getSessionUser(): Promise<Profile | null>;
  signUp(input: SignUpInput): Promise<Result>;
  signIn(email: string, password: string): Promise<Result>;
  requestMagicLink(email: string): Promise<Result>;
  consumeMagicLink(token: string): Promise<Result>;
  signOut(): Promise<void>;
  updateProfile(input: ProfileInput): Promise<Result>;
  listActivities(filter?: { city?: string; category?: string; branchId?: string }): Promise<ActivityListItem[]>;
  getActivity(id: string): Promise<ActivityDetail | null>;
  rsvp(activityId: string, safetyDeclared: boolean): Promise<Result>;
  cancelRsvp(activityId: string): Promise<Result>;
  listGroups(): Promise<GroupListItem[]>;
  getGroup(id: string): Promise<GroupDetail | null>;
  joinGroup(id: string): Promise<Result>;
  leaveGroup(id: string): Promise<Result>;
  createPost(groupId: string, body: string): Promise<Result>;
  listChallenges(): Promise<ChallengeListItem[]>;
  getChallenge(id: string): Promise<ChallengeDetail | null>;
  joinChallenge(id: string): Promise<Result>;
  checkIn(id: string): Promise<Result>;
  report(input: { targetType: "post" | "user"; targetId: string; reason: string }): Promise<Result>;
  adminListActivities(): Promise<ActivityListItem[]>;
  adminSaveActivity(input: ActivityInput, id?: string): Promise<Result>;
  adminListRsvps(activityId: string): Promise<RsvpRow[] | Result>;
  adminSaveGroup(input: GroupInput, id?: string): Promise<Result>;
  adminSaveChallenge(input: ChallengeInput, id?: string): Promise<Result>;
  adminListMembers(): Promise<Profile[] | Result>;
  adminSetVerified(userId: string, verified: boolean): Promise<Result>;
  adminSetRole(userId: string, role: Profile["role"], managedBranchId: string | null): Promise<Result>;
  adminListPosts(): Promise<PostItem[] | Result>;
  adminSetPostStatus(postId: string, status: "visible" | "hidden"): Promise<Result>;
  adminListReports(): Promise<AdminReport[] | Result>;
  adminSetReportStatus(id: string, status: AdminReport["status"]): Promise<Result>;
  sendDueReminders(trusted?: boolean): Promise<{ sent: number; skipped: number; failed: number; note: string }>;
};
