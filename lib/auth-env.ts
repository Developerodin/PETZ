/**
 * Auth.js uses AUTH_URL for OAuth callback URLs. If Vercel still has
 * AUTH_URL=http://localhost:3000, Google sign-in finishes then fails with
 * "There is a problem with the server configuration."
 */
export function applyAuthUrl() {
  if (!process.env.VERCEL) return;

  const current = process.env.AUTH_URL || "";
  if (current && !/localhost|127\.0\.0\.1/i.test(current)) return;

  const raw =
    process.env.VERCEL_ENV === "production"
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
      : process.env.VERCEL_URL;

  if (!raw) return;

  process.env.AUTH_URL = `https://${raw.replace(/^https?:\/\//, "")}`;
  process.env.AUTH_TRUST_HOST = "true";
}

applyAuthUrl();
