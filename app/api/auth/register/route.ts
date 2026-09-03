import { createPasswordUser } from "@/lib/auth-users";
import { jsonError, jsonOk } from "@/lib/api-utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request.");
  }

  const name = String(body.name || "")
    .trim()
    .replace(/\s+/g, " ");
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (name.length < 2) return jsonError("Enter your full name.");
  if (!EMAIL_RE.test(email)) return jsonError("Enter a valid email address.");
  if (password.length < 8) return jsonError("Password must be at least 8 characters.");

  try {
    const result = await createPasswordUser({ name, email, password });
    if (result.error === "exists") {
      return jsonError("An account with this email already exists. Sign in instead.", 409);
    }
    if (result.error === "google") {
      return jsonError("This email is registered with Google. Continue with Google.", 409);
    }

    return jsonOk({ ok: true });
  } catch (error) {
    console.error("register failed", error);
    return jsonError("Could not reach the database. Check MongoDB Atlas access and MONGODB_URI.", 503);
  }
}
