import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Section subdomains → apex route prefixes. Each entry rewrites (not redirects)
// so the URL keeps the subdomain while Next renders the apex route underneath.
// Because every page's canonical tag is absolute (metadataBase=baghaei.com),
// search engines dedupe the rewritten subdomain back to the apex path — so we
// get pretty subdomains without duplicate-content penalties or per-subdomain
// canonical wiring. `projects.baghaei.com/ravro` → `/projects/ravro`.
const SUBDOMAIN_PREFIXES: Record<string, string> = {
 'tools.': '/tools',
 'blog.': '/blog',
 'projects.': '/projects',
 'jobs.': '/careers',
 'login.': '/admin',
 'status.': '/status',
};

export function proxy(request: NextRequest) {
 const response = NextResponse.next();
 const hostname = (request.headers.get('host') || '').toLowerCase();
 // Strip any :port so localhost:3000 / host:80 match the bare-subdomain checks.
 const host = hostname.split(':')[0];
 const { pathname, search } = request.nextUrl;

 // Add Global Security Headers
 const headers = response.headers;
 headers.set('X-Frame-Options', 'DENY');
 headers.set('X-Content-Type-Options', 'nosniff');
 headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
 headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
 headers.set('X-XSS-Protection', '1; mode=block');
 headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
 headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.googletagmanager.com http://127.0.0.1:8000 http://localhost:8000;");

 // 1a. Canonical-host redirects (301). `www` and the singular `project.` host
 //     are not destinations — fold them into the apex / plural `projects.`.
 if (host.startsWith('www.')) {
  const apex = host.slice(4);
  return NextResponse.redirect(`https://${apex}${pathname}${search}`, 301);
 }
 if (host.startsWith('project.')) {
  // project.baghaei.com/<x> → projects.baghaei.com/<x> (decision B: plural canonical)
  const root = host.slice('project.'.length); // baghaei.com
  return NextResponse.redirect(`https://projects.${root}${pathname}${search}`, 301);
 }

 // 1b. Section-subdomain rewrites. If the request is already under the target
 //     prefix we leave it alone (so static assets and nested paths still work);
 //     otherwise we mount the whole path under the section prefix.
 for (const [sub, prefix] of Object.entries(SUBDOMAIN_PREFIXES)) {
  if (host.startsWith(sub)) {
   if (!pathname.startsWith(prefix)) {
    return NextResponse.rewrite(new URL(`${prefix}${pathname === '/' ? '' : pathname}`, request.url));
   }
   break;
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
