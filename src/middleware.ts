import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
};

function applySecurityHeaders(res: NextResponse) {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, value);
  }
  return res;
}

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role as string | undefined;
    const { pathname } = req.nextUrl;

    // Block the setup route entirely — account creation is disabled
    if (pathname.startsWith('/setup') || pathname.startsWith('/api/setup')) {
      const res = NextResponse.redirect(new URL('/login', req.url));
      return applySecurityHeaders(res);
    }

    // Outreach role: only /leads and /outreach are allowed
    if (role === 'outreach') {
      const allowed = pathname.startsWith('/leads') || pathname.startsWith('/outreach');
      if (!allowed) {
        const res = NextResponse.redirect(new URL('/leads', req.url));
        return applySecurityHeaders(res);
      }
    }

    const res = NextResponse.next();
    return applySecurityHeaders(res);
  },
  {
    pages: { signIn: '/login' },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/leads/:path*',
    '/customers/:path*',
    '/projects/:path*',
    '/outreach/:path*',
    '/kpis/:path*',
    '/sops/:path*',
    '/blueprint/:path*',
    '/launchplan/:path*',
    '/admin/:path*',
    '/setup/:path*',
    '/setup',
  ],
};
