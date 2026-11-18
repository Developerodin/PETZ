import { resetPasswordWithToken } from "@/lib/auth-users";
import { jsonError, jsonOk } from "@/lib/api-utils";

const INVALID_MESSAGE = "This reset link is invalid or has expired. Request a new one.";

export async function POST(request: Request) {
  let body: { token?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request.");
  }

  const token = String(body.token || "");
  const password = String(body.password || "");

  if (!token) return jsonError(INVALID_MESSAGE);
  if (password.length < 8) return jsonError("Password must be at least 8 characters.");

  try {
    const result = await resetPasswordWithToken(token, password);
    if ("error" in result) {
      return jsonError(INVALID_MESSAGE);
    }
    return jsonOk({ ok: true });
  } catch (error) {
    console.error("reset-password failed", error);
    return jsonError("Could not reach the database. Try again.", 503);
  }
}
