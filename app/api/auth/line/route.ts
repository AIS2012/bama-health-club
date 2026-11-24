import { NextResponse } from "next/server";
import { safeNextPath, siteUrl } from "@/lib/config";
import { createPkce, lineAuthorizeUrl, lineConfigured, randomSecret } from "@/lib/line";

const base = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 10,
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = safeNextPath(url.searchParams.get("next"), "/profile");
  if (!lineConfigured()) {
    return NextResponse.redirect(new URL(`/signup/demo?next=${encodeURIComponent(next)}`, siteUrl()));
  }
  const { verifier, challenge } = createPkce();
  const state = randomSecret();
  const nonce = randomSecret();
  const response = NextResponse.redirect(lineAuthorizeUrl({ state, nonce, challenge }));
  response.cookies.set("line_oauth_state", state, base);
  response.cookies.set("line_oauth_nonce", nonce, base);
  response.cookies.set("line_oauth_verifier", verifier, base);
  response.cookies.set("line_oauth_next", next, base);
  return response;
}
