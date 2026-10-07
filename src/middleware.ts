import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "adm_sess";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Tag URLs are lowercase: /blog/tag/React → 301 → /blog/tag/react
  if (pathname.startsWith("/blog/tag/")) {
    const lower = pathname.toLowerCase();
    if (lower === pathname) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = lower;
    return NextResponse.redirect(url, 301);
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  // If visiting the login page
  if (pathname === "/admin/login") {
    // Already authenticated → redirect to dashboard
    if (token) {
      try {
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL("/admin", request.url));
      } catch {}
    }
    return NextResponse.next();
  }

  // All other /admin/* routes require a valid session
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/blog/tag/:path*"],
};
