import { createPasswordResetToken } from "@/lib/auth-users";
import { isEmailConfigured, sendPasswordResetEmail } from "@/lib/email";
import { jsonError, jsonOk } from "@/lib/api-utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Identical for every caller — never reveals whether an account exists.
const SAME_RESPONSE = "If an account exists for that email, we've sent a link to reset your password.";

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request.");
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return jsonError("Enter a valid email address.");
  }

  // Env missing: return a clear config error. This does NOT enumerate accounts
  // (it's the same for everyone) and avoids pretending an email was sent.
  if (!isEmailConfigured()) {
    return jsonError("Password reset email is not configured yet. Please contact support.", 503);
  }

  try {
    const result = await createPasswordResetToken(email);
    if (result) {
      const base = (process.env.AUTH_URL || new URL(request.url).origin).replace(/\/$/, "");
      const resetUrl = `${base}/login/reset?token=${result.token}`;
      await sendPasswordResetEmail(email, resetUrl);
    }
  } catch (error) {
    // Swallow all internal errors (unknown account, Google-only, send failure)
    // so the public response can stay identical and non-enumerating.
    console.error("forgot-password failed", error);
  }

  return jsonOk({ ok: true, message: SAME_RESPONSE });
}
