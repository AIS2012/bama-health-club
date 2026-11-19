import { NextResponse } from "next/server";
import { siteUrl } from "@/lib/config";
import { getRepo } from "@/lib/repo";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const repo = await getRepo();
  const result = await repo.consumeMagicLink(token);
  if (!result.ok) return NextResponse.redirect(new URL("/login?error=magic", siteUrl()));
  return NextResponse.redirect(new URL("/profile", siteUrl()));
}
