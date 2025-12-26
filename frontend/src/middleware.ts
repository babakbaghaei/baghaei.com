import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
 const url = request.nextUrl.clone();
 const hostname = request.headers.get('host') || '';
 const { pathname } = request.nextUrl;

 // 1. Subdomain Routing (tools.baghaei.com)
 if (hostname.startsWith('tools.')) {
  // Prevent infinite loops if already on /tools
  if (!pathname.startsWith('/tools')) {
   url.pathname = `/tools${pathname}`;
   return NextResponse.rewrite(url);
  }
 }

 // 2. Admin Protection
 if (pathname.startsWith('/admin')) {
  // List of allowed IPs
  const allowedIps = ['46.249.99.158', '127.0.0.1'];
  
  // Get client IP from headers (behind proxy like Nginx)
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
           request.headers.get('x-real-ip') || 
           'unknown';

  // Allow local development and specific IP
  const isAllowed = allowedIps.includes(clientIp) || process.env.NODE_ENV === 'development';

  if (!isAllowed) {
   console.warn(`Unauthorized access attempt to ${pathname} from IP: ${clientIp}`);
   return NextResponse.rewrite(new URL('/forbidden', request.url));
  }
 }

 return NextResponse.next();
}

export const config = {
 matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
