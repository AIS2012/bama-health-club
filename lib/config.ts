export function isDemoMode() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )?.trim();
  return !url || !key;
}

export function supabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) throw new Error("缺少 NEXT_PUBLIC_SUPABASE_URL");
  return url;
}

export function supabaseAnonKey() {
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )?.trim();
  if (!key) throw new Error("缺少 NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return key;
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:43123").replace(/\/$/, "");
}

export function safeNextPath(value: unknown, fallback = "/profile") {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("://")) return fallback;
  return value;
}
