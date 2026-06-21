import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function middleware(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;

  // No password set → allow all (dev convenience)
  if (!password) {
    return NextResponse.next();
  }

  // Check query param login
  const pw = request.nextUrl.searchParams.get("pw");
  if (pw === password) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("pw");
    const response = NextResponse.redirect(url);
    response.cookies.set(COOKIE_NAME, password, {
      httpOnly: true,
      secure: true,
      maxAge: COOKIE_MAX_AGE,
      path: "/admin",
      sameSite: "lax",
    });
    return response;
  }

  // Check cookie
  const cookie = request.cookies.get(COOKIE_NAME);
  if (cookie?.value === password) {
    return NextResponse.next();
  }

  // Unauthorized
  return new NextResponse("401 Unauthorized", { status: 401 });
}

export const config = {
  matcher: "/admin/:path*",
};
