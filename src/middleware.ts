import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role as string | undefined;
    const { pathname } = req.nextUrl;

    // Outreach role: only /leads and /outreach are allowed
    if (role === 'outreach') {
      const allowed = pathname.startsWith('/leads') || pathname.startsWith('/outreach');
      if (!allowed) {
        return NextResponse.redirect(new URL('/leads', req.url));
      }
    }

    return NextResponse.next();
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
  ],
};
