import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
    const isLoginApi = path === "/api/admin/login";
    const isAdminRoot = path === "/admin";
    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    const admin = await verifyAdminToken(token);

    if (path.startsWith("/api/admin")) {
      if (isLoginApi) return NextResponse.next();
      if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.next();
    }

    if (!isAdminRoot && !admin) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }

    if (isAdminRoot) {
      const hasCredsInUrl =
        req.nextUrl.searchParams.has("email") || req.nextUrl.searchParams.has("password");
      if (hasCredsInUrl) {
        const url = req.nextUrl.clone();
        url.search = "";
        const error = req.nextUrl.searchParams.get("error");
        if (error) url.searchParams.set("error", error);
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/account/:path*", "/admin", "/admin/:path*", "/api/admin/:path*"],
};
