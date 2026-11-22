import { cookies } from "next/headers";
import { isDemoMode } from "@/lib/config";
import { createSession, loginWithLine } from "@/lib/demo/logic";
import { updateDb } from "@/lib/demo/store";
import { placeholderLineEmail, type LineIdentity } from "@/lib/line";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const SESSION = "bama_session";

export async function establishLineSession(identity: LineIdentity) {
  if (isDemoMode()) {
    const result = await updateDb((db) => loginWithLine(db, identity));
    const token = await updateDb((db) => createSession(db, result.user.id));
    (await cookies()).set(SESSION, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return { needsProfile: result.needsProfile };
  }

  const admin = createAdminClient();
  if (!admin) throw new Error("已設定 LINE，但缺少 SUPABASE_SERVICE_ROLE_KEY，無法建立會員");
  const email = placeholderLineEmail(identity.lineUserId);
  const { data: existing } = await admin.from("profiles").select("id, line_consent_at").eq("line_user_id", identity.lineUserId).maybeSingle();
  if (!existing) {
    const created = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { nickname: identity.displayName, city: "台北市", district: "未填" },
    });
    if (created.error && !/already|registered|exists/i.test(created.error.message)) {
      throw new Error(created.error.message);
    }
    const userId = created.data.user?.id;
    if (userId) {
      await admin.from("profiles").update({ line_user_id: identity.lineUserId, nickname: identity.displayName }).eq("id", userId);
    }
  }

  const link = await admin.auth.admin.generateLink({ type: "magiclink", email });
  const tokenHash = link.data.properties?.hashed_token;
  if (link.error || !tokenHash) throw new Error(link.error?.message || "無法建立登入階段");
  const supabase = await createClient();
  const verified = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "magiclink" });
  if (verified.error) throw new Error(verified.error.message);
  return { needsProfile: !existing?.line_consent_at };
}
