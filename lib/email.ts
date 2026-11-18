/**
 * Minimal email helper built on Resend's REST API (no SDK dependency).
 *
 * Config comes from two env vars that must never be committed:
 *   - RESEND_API_KEY  (Resend API key)
 *   - EMAIL_FROM      (verified sender, e.g. "PETZ <no-reply@petz.love>")
 *
 * Verifying the petz.love domain + DNS in Resend is an ops step, not code.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export class EmailNotConfiguredError extends Error {
  constructor() {
    super("Email is not configured.");
    this.name = "EmailNotConfiguredError";
  }
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

/** Throws EmailNotConfiguredError when env is missing; never pretends to send. */
export async function sendEmail({ to, subject, html, text }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    throw new EmailNotConfiguredError();
  }

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html, text }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend send failed (${res.status}): ${detail}`);
  }
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const subject = "Reset your PETZ password";
  const text =
    "We received a request to reset your PETZ password.\n\n" +
    `Choose a new password using this link (valid for 30 minutes):\n${resetUrl}\n\n` +
    "If you didn't request this, you can safely ignore this email.";
  const html = `
    <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:480px;margin:0 auto;color:#111">
      <p style="font-weight:700;letter-spacing:0.08em">PETZ</p>
      <h1 style="font-size:20px">Reset your password</h1>
      <p>We received a request to reset your PETZ password. This link is valid for 30 minutes.</p>
      <p>
        <a href="${resetUrl}" style="display:inline-block;background:#111;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">
          Choose a new password
        </a>
      </p>
      <p style="font-size:13px;color:#555">If the button doesn't work, paste this URL into your browser:<br/>${resetUrl}</p>
      <p style="font-size:13px;color:#555">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  await sendEmail({ to, subject, html, text });
}

export async function sendNewsletterConfirmEmail(to: string, confirmUrl: string) {
  const subject = "Confirm your PETZ newsletter subscription";
  const text =
    "Confirm your PETZ newsletter subscription.\n\n" +
    `Open this link to finish signing up (valid for 48 hours):\n${confirmUrl}\n\n` +
    "If you didn't request this, you can ignore this email.";
  const html = `
    <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:480px;margin:0 auto;color:#111">
      <p style="font-weight:700;letter-spacing:0.08em">PETZ</p>
      <h1 style="font-size:20px">Confirm your subscription</h1>
      <p>One more step — confirm your email to join the PETZ newsletter.</p>
      <p>
        <a href="${confirmUrl}" style="display:inline-block;background:#111;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">
          Confirm subscription
        </a>
      </p>
      <p style="font-size:13px;color:#555">If the button doesn't work, paste this URL into your browser:<br/>${confirmUrl}</p>
    </div>
  `;

  await sendEmail({ to, subject, html, text });
}
