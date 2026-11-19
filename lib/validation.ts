import { z } from "zod";
import { CATEGORIES, CITIES, DISTRICTS, INTERESTS } from "@/lib/constants";
import type {
  ActivityInput,
  ChallengeInput,
  GroupInput,
  ProfileInput,
  SignUpInput,
} from "@/lib/types";

const citySchema = z.enum(CITIES);
const interestSchema = z.enum(INTERESTS);
const categorySchema = z.enum(CATEGORIES);

function phoneSchema() {
  return z
    .union([z.string(), z.null()])
    .transform((value) => (value ?? "").trim())
    .refine((value) => value.length <= 20 && (value === "" || /^[0-9+\-() ]{8,20}$/.test(value)), "電話格式不正確")
    .transform((value) => (value === "" ? null : value));
}

export function parseSignUp(input: {
  email: string;
  password: string;
  nickname: string;
  phone: string | null;
  city: string;
  district: string;
  interests: string[];
}): { ok: true; data: SignUpInput } | { ok: false; error: string } {
  const schema = z
    .object({
      email: z.email("請輸入有效的電子信箱").transform((value) => value.toLowerCase()),
      password: z.string().min(8, "密碼至少 8 個字元").max(72),
      nickname: z.string().trim().min(1, "請填暱稱").max(20, "暱稱最多 20 個字"),
      phone: phoneSchema(),
      city: citySchema,
      district: z.string().trim().min(1),
      interests: z.array(interestSchema).max(7),
    })
    .refine((value) => DISTRICTS[value.city].includes(value.district), {
      message: "請選擇這個縣市裡的行政區",
      path: ["district"],
    });
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "資料不完整" };
  return { ok: true, data: parsed.data };
}

export function parseProfile(input: {
  nickname: string;
  phone: string | null;
  city: string;
  district: string;
  interests: string[];
}): { ok: true; data: ProfileInput } | { ok: false; error: string } {
  const schema = z
    .object({
      nickname: z.string().trim().min(1, "請填暱稱").max(20),
      phone: phoneSchema(),
      city: citySchema,
      district: z.string().trim().min(1),
      interests: z.array(interestSchema).max(7),
    })
    .refine((value) => DISTRICTS[value.city].includes(value.district), {
      message: "請選擇這個縣市裡的行政區",
    });
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "資料不完整" };
  return { ok: true, data: parsed.data };
}

export function parseActivity(input: ActivityInput): { ok: true; data: ActivityInput } | { ok: false; error: string } {
  const schema = z
    .object({
      title: z.string().trim().min(2, "請填活動名稱").max(80),
      kind: z.enum(["exercise", "talk"]),
      category: categorySchema,
      description: z.string().trim().min(10, "請用幾句話說明活動").max(2000),
      startsAt: z.string().datetime(),
      endsAt: z.string().datetime(),
      locationName: z.string().trim().min(2).max(80),
      address: z.string().trim().min(4).max(160),
      city: citySchema,
      district: z.string().trim().min(1),
      capacity: z.number().int().min(1).max(500),
      difficulty: z.enum(["easy", "moderate", "challenging"]),
      organizerName: z.string().trim().min(1).max(40),
      organizerContact: z.string().trim().min(3).max(80),
      organizerVerified: z.boolean(),
      isSample: z.boolean(),
      status: z.enum(["draft", "published", "cancelled"]),
    })
    .refine((value) => new Date(value.endsAt) > new Date(value.startsAt), { message: "結束時間要晚於開始時間" })
    .refine((value) => DISTRICTS[value.city].includes(value.district), { message: "請選擇正確的行政區" });
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "活動資料不完整" };
  return { ok: true, data: parsed.data };
}

export function parseGroup(input: GroupInput): { ok: true; data: GroupInput } | { ok: false; error: string } {
  const schema = z.object({
    name: z.string().trim().min(2).max(40),
    description: z.string().trim().min(4).max(1000),
    interest: interestSchema,
    city: z.union([citySchema, z.null()]),
    isSample: z.boolean(),
  });
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "社團資料不完整" };
  return { ok: true, data: parsed.data };
}

export function parseChallenge(input: ChallengeInput): { ok: true; data: ChallengeInput } | { ok: false; error: string } {
  const schema = z.object({
    title: z.string().trim().min(2).max(40),
    description: z.string().trim().min(4).max(1000),
    durationDays: z.number().int().min(3).max(90),
    category: categorySchema,
    isSample: z.boolean(),
  });
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "挑戰資料不完整" };
  return { ok: true, data: parsed.data };
}

export function stringsFromForm(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function textFromForm(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}
