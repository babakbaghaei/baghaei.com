import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
 const response = NextResponse.next();
 const url = request.nextUrl.clone();
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
 headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com;");

 // 1. Subdomain Routing (tools.baghaei.com)
 if (hostname.startsWith('tools.')) {
  if (!pathname.startsWith('/tools')) {
   const toolUrl = new URL(`/tools${pathname}`, request.url);
   return NextResponse.rewrite(toolUrl);
  }
 }

 // 2. Admin Protection
 if (pathname.startsWith('/admin')) {
  const allowedIps = ['46.249.99.158', '127.0.0.1'];
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
           request.headers.get('x-real-ip') || 
           'unknown';

  // Allow localhost, specific static IP, OR Docker internal networks (172.x, 192.168.x) for local testing
  const isLocalOrDocker = clientIp === '::1' || clientIp.startsWith('172.') || clientIp.startsWith('192.168.') || clientIp.startsWith('10.');
  
  // TEMPORARY: Allow all for debugging/testing purposes
  const isAllowed = true; // allowedIps.includes(clientIp) || isLocalOrDocker || process.env.NODE_ENV === 'development';

  if (!isAllowed) {
   console.warn(`[SECURITY] BLOCKED Access to ${pathname} | IP: ${clientIp} | ENV: ${process.env.NODE_ENV}`);
   return NextResponse.rewrite(new URL('/forbidden', request.url));
  } else {
    console.log(`[SECURITY] ALLOWED Access to ${pathname} | IP: ${clientIp}`);
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
