import { DIFFICULTY_LABEL, KIND_LABEL } from "@/lib/constants";
import type { Difficulty, ActivityKind } from "@/lib/types";

export function todayTaipei(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function startOfTodayTaipeiIso(now = new Date()) {
  const day = todayTaipei(now);
  return new Date(`${day}T00:00:00+08:00`).toISOString();
}

export function atTaipei(dayOffset: number, hour: number, minute: number, now = new Date()) {
  const [year, month, day] = todayTaipei(now).split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day, hour - 8, minute, 0));
  utc.setUTCDate(utc.getUTCDate() + dayOffset);
  return utc.toISOString();
}

export function addMinutes(iso: string, minutes: number) {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString();
}

export function formatTaipei(iso: string) {
  return new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Taipei",
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));
}

export function isoToTaipeiInput(iso: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  const hour = get("hour") === "24" ? "00" : get("hour");
  return `${get("year")}-${get("month")}-${get("day")}T${hour}:${get("minute")}`;
}

export function taipeiInputToIso(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const date = new Date(`${value}:00+08:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export function spotsLabel(going: number, capacity: number) {
  const left = Math.max(capacity - going, 0);
  if (left === 0) return "已額滿，可登記候補";
  return `還有 ${left} 個名額（共 ${capacity} 人）`;
}

export function difficultyLabel(value: Difficulty) {
  return DIFFICULTY_LABEL[value];
}

export function kindLabel(value: ActivityKind) {
  return KIND_LABEL[value];
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char] ?? char;
  });
}
