import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE = "petz_admin";
export const ADMIN_TTL_SECONDS = 12 * 60 * 60;

export type AdminTokenPayload = {
  role: "admin";
  email: string;
};

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }
  return new TextEncoder().encode(secret);
}

export function getAdminEmail() {
  return String(process.env.ADMIN_EMAIL || "")
    .trim()
    .toLowerCase();
}

export function getAdminPassword() {
  const raw = String(process.env.ADMIN_PASSWORD || "").trim();
  if (
    (raw.startsWith("'") && raw.endsWith("'")) ||
    (raw.startsWith('"') && raw.endsWith('"'))
  ) {
    return raw.slice(1, -1);
  }
  return raw;
}

export function adminCredentialsConfigured() {
  return Boolean(getAdminEmail() && getAdminPassword());
}

export async function signAdminToken(email: string) {
  return new SignJWT({ role: "admin", email } satisfies AdminTokenPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyAdminToken(token: string | undefined | null): Promise<AdminTokenPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    if (payload.role !== "admin") return null;
    const email = String(payload.email || "")
      .trim()
      .toLowerCase();
    const expected = getAdminEmail();
    if (!email || !expected || email !== expected) return null;
    return { role: "admin", email };
  } catch {
    return null;
  }
}

export function adminCookieOptions(maxAge = ADMIN_TTL_SECONDS) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}
