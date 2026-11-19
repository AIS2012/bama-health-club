import { NextResponse } from "next/server";
import { isDemoMode, siteUrl } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  if (isDemoMode()) return NextResponse.redirect(new URL("/login?error=google", siteUrl()));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${siteUrl()}/auth/callback` },
  });
  if (error || !data.url) return NextResponse.redirect(new URL("/login?error=google", siteUrl()));
  return NextResponse.redirect(data.url);
}
