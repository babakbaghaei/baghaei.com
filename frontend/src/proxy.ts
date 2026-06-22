import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
 const response = NextResponse.next();
 const hostname = request.headers.get('host') || '';
 const { pathname } = request.nextUrl;

 // Add Global Security Headers
 const headers = response.headers;
 headers.set('X-Frame-Options', 'DENY');
 headers.set('X-Content-Type-Options', 'nosniff');
 headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
 headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
 headers.set('X-XSS-Protection', '1; mode=block');
 headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
 headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.googletagmanager.com http://127.0.0.1:8000 http://localhost:8000;");

 // 1. Subdomain Routing (tools.baghaei.com)
 if (hostname.startsWith('tools.')) {
  if (!pathname.startsWith('/tools')) {
   const toolUrl = new URL(`/tools${pathname}`, request.url);
   return NextResponse.rewrite(toolUrl);
  }
 }

 // 2. Admin Protection — edge presence-guard: bounce unauthenticated direct
 //    hits to the login page. The backend still validates the JWT (Bearer) on
 //    every API call, so this is defense-in-depth, not the sole gate. The
 //    `admin_token` cookie is set by the login page alongside localStorage so
 //    the middleware can see it (localStorage is invisible to the edge).
 if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
  const hasToken = !!request.cookies.get('admin_token')?.value;
  if (!hasToken) {
   return NextResponse.redirect(new URL('/admin/login', request.url));
  }
 }

 // 3. Maintenance Mode
 const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
 if (maintenanceMode && !pathname.startsWith('/maintenance') && !pathname.startsWith('/admin')) {
   return NextResponse.rewrite(new URL('/maintenance', request.url));
 }

 return response;
}

export const config = {
 matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.svg).*)'],
};
