import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { siteUrl } from "@/lib/config";

export const LINE_PLACEHOLDER_DOMAIN = "members.club.invalid";

export function lineConfigured() {
  return Boolean(process.env.LINE_CHANNEL_ID?.trim() && process.env.LINE_CHANNEL_SECRET?.trim());
}

export function lineChannelId() {
  const id = process.env.LINE_CHANNEL_ID?.trim();
  if (!id) throw new Error("缺少 LINE_CHANNEL_ID");
  return id;
}

export function lineChannelSecret() {
  const secret = process.env.LINE_CHANNEL_SECRET?.trim();
  if (!secret) throw new Error("缺少 LINE_CHANNEL_SECRET");
  return secret;
}

export function lineCallbackUrl() {
  return `${siteUrl()}/api/auth/line/callback`;
}

export function placeholderLineEmail(lineUserId: string) {
  const safe = lineUserId.replace(/[^A-Za-z0-9]/g, "").slice(0, 64) || "member";
  return `line.${safe}@${LINE_PLACEHOLDER_DOMAIN}`;
}

export function isPlaceholderEmail(email: string) {
  return email.toLowerCase().endsWith(`@${LINE_PLACEHOLDER_DOMAIN}`);
}

export function needsLineProfile(user: { lineUserId?: string | null; lineConsent?: boolean } | null) {
  return Boolean(user?.lineUserId) && !user?.lineConsent;
}

export function createPkce() {
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

export function randomSecret() {
  return randomBytes(24).toString("base64url");
}

export function secretsMatch(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function lineAuthorizeUrl(input: { state: string; nonce: string; challenge: string }) {
  const url = new URL("https://access.line.me/oauth2/v2.1/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", lineChannelId());
  url.searchParams.set("redirect_uri", lineCallbackUrl());
  url.searchParams.set("state", input.state);
  url.searchParams.set("scope", "profile openid");
  url.searchParams.set("nonce", input.nonce);
  url.searchParams.set("code_challenge", input.challenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

export type LineIdentity = {
  lineUserId: string;
  displayName: string;
};

export async function exchangeLineCode(input: { code: string; verifier: string; nonce: string }): Promise<LineIdentity> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: input.code,
    redirect_uri: lineCallbackUrl(),
    client_id: lineChannelId(),
    client_secret: lineChannelSecret(),
    code_verifier: input.verifier,
  });
  const tokenResponse = await fetch("https://api.line.me/oauth2/v2.1/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const token = (await tokenResponse.json()) as { id_token?: string; error?: string; error_description?: string };
  if (!tokenResponse.ok || !token.id_token) {
    throw new Error(token.error_description || "LINE 沒有核發登入憑證");
  }

  const verifyBody = new URLSearchParams({
    id_token: token.id_token,
    client_id: lineChannelId(),
    nonce: input.nonce,
  });
  const verifyResponse = await fetch("https://api.line.me/oauth2/v2.1/verify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: verifyBody,
  });
  const claims = (await verifyResponse.json()) as { sub?: string; name?: string; error?: string; error_description?: string };
  if (!verifyResponse.ok || !claims.sub) {
    throw new Error(claims.error_description || "LINE 身分驗證沒有通過");
  }
  const displayName = (claims.name || "LINE 會員").trim().slice(0, 20) || "LINE 會員";
  return { lineUserId: claims.sub, displayName };
}
