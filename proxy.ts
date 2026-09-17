import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Fast optimistic protection for the console. The admin layout, API handlers,
 * and every server mutation still verify the database-backed administrator
 * role; a cookie alone is never treated as authorization.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  if (!getSessionCookie(request)) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("returnTo", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
