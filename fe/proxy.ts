import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "accessToken";

const publicRoutes = new Set(["/auth/login", "/auth/register", "/admin/login"]);

function isPublicRoute(pathname: string) {
  return publicRoutes.has(pathname);
}

function buildLoginUrl(request: NextRequest) {
  const loginUrl = new URL("/auth/login", request.url);
  const redirectTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  loginUrl.searchParams.set("redirect", redirectTo);
  return loginUrl;
}

function isSafeRedirectPath(value: string | null): value is string {
  return Boolean(value && value.startsWith("/") && !value.startsWith("//"));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token && !isPublicRoute(pathname)) {
    return NextResponse.redirect(buildLoginUrl(request));
  }

  if (token && isPublicRoute(pathname)) {
    const redirectTo = request.nextUrl.searchParams.get("redirect");
    const target = isSafeRedirectPath(redirectTo) ? redirectTo : "/";
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
