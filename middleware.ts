import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "ders-oncesi-guvenli-jwt-anahtari-2026-super-secret-key-32-chars-long"
);

const COOKIE_NAME = "dersoncesi_session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;

  let session: { userId: string; role: "TEACHER" | "STUDENT" } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      session = payload as unknown as { userId: string; role: "TEACHER" | "STUDENT" };
    } catch {
      session = null;
    }
  }

  // Teacher protected routes
  if (pathname.startsWith("/teacher")) {
    if (!session) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== "TEACHER") {
      return NextResponse.redirect(new URL("/student/dashboard", req.url));
    }
  }

  // Student protected routes
  if (pathname.startsWith("/student")) {
    if (!session) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/teacher/dashboard", req.url));
    }
  }

  // Auth pages (login/register) redirect if already logged in
  if (pathname === "/auth/login" || pathname === "/auth/register") {
    if (session) {
      if (session.role === "TEACHER") {
        return NextResponse.redirect(new URL("/teacher/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/student/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/teacher/:path*",
    "/student/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
