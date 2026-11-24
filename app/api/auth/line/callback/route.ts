import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { safeNextPath, siteUrl } from "@/lib/config";
import { establishLineSession } from "@/lib/line-session";
import { exchangeLineCode, lineConfigured, secretsMatch } from "@/lib/line";

function fail(message: string) {
  const url = new URL("/signup", siteUrl());
  url.searchParams.set("error", message);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const jar = await cookies();
  const next = safeNextPath(jar.get("line_oauth_next")?.value, "/profile");
  const clear = (response: NextResponse) => {
    for (const name of ["line_oauth_state", "line_oauth_nonce", "line_oauth_verifier", "line_oauth_next"]) {
      response.cookies.set(name, "", { path: "/", maxAge: 0 });
    }
    return response;
  };
  if (!lineConfigured()) return clear(fail("尚未設定 LINE 頻道"));
  const error = url.searchParams.get("error");
  if (error) return clear(fail("LINE 登入已取消"));
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") ?? "";
  const expected = jar.get("line_oauth_state")?.value ?? "";
  const nonce = jar.get("line_oauth_nonce")?.value ?? "";
  const verifier = jar.get("line_oauth_verifier")?.value ?? "";
  if (!code || !expected || !nonce || !verifier || !secretsMatch(state, expected)) {
    return clear(fail("登入已逾期，請再按一次"));
  }
  try {
    const identity = await exchangeLineCode({ code, verifier, nonce });
    const session = await establishLineSession(identity);
    const destination = session.needsProfile ? `/signup/profile?next=${encodeURIComponent(next)}` : next;
    return clear(NextResponse.redirect(new URL(destination, siteUrl())));
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "LINE 登入沒有完成";
    return clear(fail(message.slice(0, 80)));
  }
}
