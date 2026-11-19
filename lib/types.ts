export type Role = "member" | "organizer" | "admin" | "branch_manager";
export type MemberType = "partner" | "enthusiast" | "public";
export type ActivityKind = "exercise" | "talk" | "meetup" | "expo" | "challenge";
export type Difficulty = "easy" | "moderate" | "challenging";
export type ActivityStatus = "draft" | "published" | "cancelled";
export type RsvpStatus = "going" | "waitlist" | "cancelled";
export type PostStatus = "visible" | "hidden";
export type ReportStatus = "open" | "reviewed" | "dismissed";
export type ReportTarget = "post" | "user";

export type Profile = {
  id: string;
  email: string;
  nickname: string;
  phone: string | null;
  city: string;
  district: string;
  interests: string[];
  role: Role;
  verified: boolean;
  planId: string;
  createdAt: string;
  memberType: MemberType;
  partnerNumber: string | null;
  homeBranchId: string | null;
  managedBranchId: string | null;
};

export type ActivityListItem = {
  id: string;
  title: string;
  kind: ActivityKind;
  category: string;
  startsAt: string;
  endsAt: string;
  locationName: string;
  city: string;
  district: string;
  capacity: number;
  goingCount: number;
  waitlistCount: number;
  difficulty: Difficulty;
  isSample: boolean;
  status: ActivityStatus;
  organizerName: string;
  organizerVerified: boolean;
  branchId: string | null;
  branchName: string | null;
  speaker: string | null;
};

export type ActivityDetail = ActivityListItem & {
  description: string;
  address: string;
  organizerId: string | null;
  organizerContact: string | null;
  myStatus: RsvpStatus | null;
};

export type ActivityInput = {
  title: string;
  kind: ActivityKind;
  category: string;
  description: string;
  startsAt: string;
  endsAt: string;
  locationName: string;
  address: string;
  city: string;
  district: string;
  capacity: number;
  difficulty: Difficulty;
  organizerName: string;
  organizerContact: string;
  organizerVerified: boolean;
  isSample: boolean;
  status: ActivityStatus;
  branchId: string;
  speaker: string | null;
};

export type GroupListItem = {
  id: string;
  name: string;
  description: string;
  interest: string;
  city: string | null;
  isSample: boolean;
  memberCount: number;
  joined: boolean;
};

export type PostItem = {
  id: string;
  groupId: string;
  authorId: string | null;
  authorName: string;
  authorVerified: boolean;
  body: string;
  status: PostStatus;
  createdAt: string;
};

export type GroupDetail = GroupListItem & {
  posts: PostItem[];
};

export type GroupInput = {
  name: string;
  description: string;
  interest: string;
  city: string | null;
  isSample: boolean;
};

export type ChallengeListItem = {
  id: string;
  title: string;
  description: string;
  durationDays: number;
  category: string;
  isSample: boolean;
  joined: boolean;
  checkinCount: number;
  checkedInToday: boolean;
};

export type ChallengeDetail = ChallengeListItem & {
  checkinDates: string[];
};

export type ChallengeInput = {
  title: string;
  description: string;
  durationDays: number;
  category: string;
  isSample: boolean;
};

export type RsvpRow = {
  id: string;
  userId: string;
  nickname: string;
  email: string;
  phone: string | null;
  status: RsvpStatus;
  safetyDeclared: boolean;
  createdAt: string;
};

export type AdminMember = Profile;

export type AdminReport = {
  id: string;
  reporterId: string;
  reporterNickname: string;
  targetType: ReportTarget;
  targetId: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
};

export type Result = {
  ok: true;
  message?: string;
  devLink?: string;
  status?: "going" | "waitlist";
  id?: string;
  already?: boolean;
  needsEmailConfirm?: boolean;
} | {
  ok: false;
  error: string;
};

export type SignUpInput = {
  email: string;
  password: string;
  nickname: string;
  phone: string | null;
  city: string;
  district: string;
  interests: string[];
  memberType: MemberType;
  partnerNumber: string | null;
  homeBranchId: string | null;
};

export type ProfileInput = {
  nickname: string;
  phone: string | null;
  city: string;
  district: string;
  interests: string[];
  memberType: MemberType;
  partnerNumber: string | null;
  homeBranchId: string | null;
};

export type ReminderRecipient = {
  activityId: string;
  title: string;
  startsAt: string;
  locationName: string;
  userId: string;
  email: string;
  nickname: string;
  dedupeKey: string;
};
