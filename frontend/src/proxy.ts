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
 headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
 headers.set('X-XSS-Protection', '1; mode=block');

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

  const isAllowed = allowedIps.includes(clientIp) || process.env.NODE_ENV === 'development';

  if (!isAllowed) {
   console.warn(`[SECURITY] Unauthorized access attempt to ${pathname} from IP: ${clientIp}`);
   return NextResponse.rewrite(new URL('/forbidden', request.url));
  }
 }

 return response;
}

export const config = {
 matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
