import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/profile", "/orders"];

// Routes that should redirect to dashboard if already logged in
const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Verify token if it exists
  let isValidToken = false;
  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      isValidToken = true;
    } catch (error) {
      // Token is invalid or expired
      isValidToken = false;
    }
  }

  // Redirect logic for protected routes
  if (isProtectedRoute && !isValidToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logic for auth routes (login/signup)
  if (isAuthRoute && isValidToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
