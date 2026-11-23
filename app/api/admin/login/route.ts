import { connectDb } from "@/lib/mongoose";
import { assertFormRateLimit } from "@/lib/form-rate-limit";
import { clientIp } from "@/lib/form-schema";
import { jsonError } from "@/lib/api-utils";
import { adminCredentialsConfigured, getAdminEmail, signAdminToken } from "@/lib/admin-auth";
import { ensureAdminUser, findAdminByEmail, verifyPassword } from "@/lib/auth-users";
import { setAdminCookie } from "@/lib/admin-session";
import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+$/;
/** Dummy bcrypt hash so failed logins still spend comparable time. */
const DUMMY_HASH = "$2b$12$61TXWN5ol57GQL5/kyGXhuxO8viBSiEX3K7khsH.54qTXnv3k2kgC";

function isFormPost(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  return (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  );
}

function fail(request: Request, message: string, status: number) {
  if (isFormPost(request)) {
    const url = new URL("/admin", request.url);
    const code = status === 429 ? "rate" : status === 503 ? "server" : "invalid";
    url.searchParams.set("error", code);
    return NextResponse.redirect(url, 303);
  }
  return jsonError(message, status);
}

async function readBody(request: Request) {
  if (isFormPost(request)) {
    const form = await request.formData();
    return {
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
    };
  }
  return (await request.json()) as { email?: string; password?: string };
}

export async function POST(request: Request) {
  if (!adminCredentialsConfigured()) {
    return fail(request, "Admin login is not configured.", 503);
  }

  let body: { email?: string; password?: string };
  try {
    body = await readBody(request);
  } catch {
    return fail(request, "Invalid request.", 400);
  }

  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const password = String(body.password || "");

  if (!EMAIL_RE.test(email) || !password) {
    return fail(request, "Invalid email or password.", 401);
  }

  try {
    await connectDb();
    await ensureAdminUser();
    const limited = await assertFormRateLimit("admin-login", clientIp(request));
    if (limited) {
      return fail(request, limited, 429);
    }

    const expectedEmail = getAdminEmail();
    const admin = email === expectedEmail ? await findAdminByEmail(email) : null;
    const hashToCompare = admin?.passwordHash || DUMMY_HASH;
    const passwordMatches = await verifyPassword(password, hashToCompare);

    if (!admin || !passwordMatches) {
      return fail(request, "Invalid email or password.", 401);
    }

    const token = await signAdminToken(email);
    if (isFormPost(request)) {
      const origin = new URL(request.url).origin;
      const response = NextResponse.redirect(`${origin}/admin`, 303);
      setAdminCookie(response, token);
      return response;
    }

    const response = NextResponse.json({ ok: true });
    setAdminCookie(response, token);
    return response;
  } catch (error) {
    console.error("admin login failed", error);
    return fail(request, "Could not complete admin login.", 503);
  }
}
