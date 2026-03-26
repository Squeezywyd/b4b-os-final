import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: { signIn: '/login' },
});

export const config = {
  matcher: ['/dashboard/:path*', '/leads/:path*', '/customers/:path*', '/projects/:path*', '/outreach/:path*', '/kpis/:path*', '/sops/:path*', '/blueprint/:path*', '/launchplan/:path*'],
};
