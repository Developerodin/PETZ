import { compare } from "bcryptjs";
import { connectDb } from "@/lib/mongoose";
import { assertFormRateLimit } from "@/lib/form-rate-limit";
import { clientIp } from "@/lib/form-schema";
import { jsonError } from "@/lib/api-utils";
import {
  adminCredentialsConfigured,
  getAdminEmail,
  getAdminPasswordHash,
  signAdminToken,
} from "@/lib/admin-auth";
import { setAdminCookie } from "@/lib/admin-session";
import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+$/;
/** Dummy bcrypt hash so failed logins still spend comparable time. */
const DUMMY_HASH = "$2b$12$61TXWN5ol57GQL5/kyGXhuxO8viBSiEX3K7khsH.54qTXnv3k2kgC";

export async function POST(request: Request) {
  if (!adminCredentialsConfigured()) {
    return jsonError("Admin login is not configured.", 503);
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request.");
  }

  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const password = String(body.password || "");

  if (!EMAIL_RE.test(email) || !password) {
    return jsonError("Invalid email or password.", 401);
  }

  try {
    await connectDb();
    const limited = await assertFormRateLimit("admin-login", clientIp(request));
    if (limited) {
      return jsonError(limited, 429);
    }

    const expectedEmail = getAdminEmail();
    const expectedHash = getAdminPasswordHash();
    const emailMatches = email === expectedEmail;
    const hashToCompare = emailMatches ? expectedHash : DUMMY_HASH;
    const passwordMatches = await compare(password, hashToCompare);

    if (!emailMatches || !passwordMatches) {
      return jsonError("Invalid email or password.", 401);
    }

    const token = await signAdminToken(email);
    const response = NextResponse.json({ ok: true });
    setAdminCookie(response, token);
    return response;
  } catch (error) {
    console.error("admin login failed", error);
    return jsonError("Could not complete admin login.", 503);
  }
}
