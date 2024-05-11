import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicPaths = ["/login", "/signup"];
  const token = request.cookies.get("token")?.value || "";

  // Check if the current path is public
  const isPublicPath = publicPaths.includes(path);

  // Redirect logic based on authentication status and path
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // If the path is /usertask and there's no token, redirect to login
  if (path === "/usertask" && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Allow access to other paths
  return null;
}

export const config = {
  matcher: ["/", "/login", "/signup", "/usertask"],
};
