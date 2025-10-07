import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protect /vault and subpaths
export const config = {
  matcher: ['/vault/:path*'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public assets and login page
  if (pathname === '/login' || pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }

  // Check if NextAuth session token cookie exists
  const sessionToken = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');

  if (!sessionToken) {
    // Redirect to login if unauthenticated
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow to proceed if session token exists
  return NextResponse.next();
}
