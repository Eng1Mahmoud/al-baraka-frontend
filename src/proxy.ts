import { NextResponse, type NextRequest } from "next/server";

/**
 * Gate for /dashboard (Next 16 replaces the old middleware convention with proxy).
 * This only checks that a session cookie exists — the API verifies the token
 * signature and the role on every request, so a forged cookie gets past this
 * redirect but not past the server.
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard") && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
