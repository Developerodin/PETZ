import { createHash, randomBytes } from "crypto";
import { jsonError, jsonOk, withDb } from "@/lib/api-utils";
import { isEmailConfigured, sendNewsletterConfirmEmail } from "@/lib/email";
import { assertFormRateLimit } from "@/lib/form-rate-limit";
import { clientIp, honeypotFilled, normalizeEmail, validateEmail } from "@/lib/form-schema";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";

type NewsletterBody = {
  email?: string;
  consent?: boolean;
  company?: string;
};

const CONFIRM_TTL_MS = 48 * 60 * 60 * 1000;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  let body: NewsletterBody;
  try {
    body = (await request.json()) as NewsletterBody;
  } catch {
    return jsonError("Invalid JSON body.");
  }

  if (honeypotFilled(body.company)) {
    return jsonOk({ ok: true }, 200);
  }

  if (!body.consent) {
    return jsonError("Please agree to the privacy notice to subscribe.");
  }

  const email = normalizeEmail(body.email);
  const emailErr = validateEmail(email);
  if (emailErr) return jsonError(emailErr);

  if (!isEmailConfigured()) {
    return jsonError("Newsletter email is not configured yet. Please try again later.", 503);
  }

  return withDb(async () => {
    const limited = await assertFormRateLimit("newsletter", clientIp(request));
    if (limited) return jsonError(limited, 429);

    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing?.status === "subscribed") {
      return jsonOk({ ok: true, message: "You are already subscribed." }, 200);
    }

    const token = randomBytes(32).toString("hex");
    const confirmTokenHash = hashToken(token);
    const confirmTokenExpiresAt = new Date(Date.now() + CONFIRM_TTL_MS);

    await NewsletterSubscriber.findOneAndUpdate(
      { email },
      {
        email,
        status: "pending",
        confirmTokenHash,
        confirmTokenExpiresAt,
        consentedAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const base = (process.env.AUTH_URL || new URL(request.url).origin).replace(/\/$/, "");
    const confirmUrl = `${base}/api/newsletter/confirm?token=${token}`;

    try {
      await sendNewsletterConfirmEmail(email, confirmUrl);
    } catch (error) {
      console.error("newsletter confirm send failed", error);
      return jsonError("Could not send the confirmation email. Please try again later.", 503);
    }

    return jsonOk({ ok: true, message: "Check your email to confirm your subscription." }, 200);
  });
}
