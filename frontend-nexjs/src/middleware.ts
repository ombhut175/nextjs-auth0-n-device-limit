import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth/auth0";

const DEVICE_COOKIE_NAME = 'device_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

function generateUUID(): string {
  return crypto.randomUUID();
}

export async function middleware(request: NextRequest) {
  // Check if device_id cookie exists
  const deviceId = request.cookies.get(DEVICE_COOKIE_NAME);
  
  // Run Auth0 middleware
  const response = await auth0.middleware(request);
  
  // Set device_id cookie if it doesn't exist
  if (!deviceId) {
    const newDeviceId = generateUUID();
    response.cookies.set(DEVICE_COOKIE_NAME, newDeviceId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
