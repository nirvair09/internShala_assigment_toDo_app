import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Extracting url paths
  const path = request.nextUrl.pathname;

  // Define paths that are considered public
  const publicPaths = ["/login", "/signup"];

  // Check if the current path is a public path
  const isPublicPath = publicPaths.includes(path);

  // Extract the token from user cookies
  const token = request.cookies.get("token")?.value || "";

  // Redirect logic based on authentication status and path
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Allow access to /usertask if token is present
  if (path === "/usertask" && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/login", "/signup", "/usertask"],
};
