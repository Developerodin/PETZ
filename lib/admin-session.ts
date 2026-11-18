import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  verifyAdminToken,
  type AdminTokenPayload,
} from "@/lib/admin-auth";

export async function getAdminSession(): Promise<AdminTokenPayload | null> {
  const jar = await cookies();
  return verifyAdminToken(jar.get(ADMIN_COOKIE)?.value);
}

export async function requireAdminSession() {
  return getAdminSession();
}

export function setAdminCookie(response: NextResponse, token: string) {
  response.cookies.set(ADMIN_COOKIE, token, adminCookieOptions());
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE, "", adminCookieOptions(0));
}
