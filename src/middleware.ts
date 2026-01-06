import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Define public paths that don't require authentication
  const publicPaths = ["/login", "/signup"];

  // Check if the current path is a public path
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // If there is no token and the path is not public, redirect to login
  if (!token && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    // loginUrl.searchParams.set("from", pathname); // Optional: preserve redirect
    return NextResponse.redirect(loginUrl);
  }

  // If there is a token and the user tries to access login/signup, redirect to home
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
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
