// middleware.ts
//
// Protects the /admin/* routes — redirects unauthenticated visitors to /login.
// All public routes (/, /posts/*, /about, /archive) are unaffected.

import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

// Only apply middleware to /admin/* paths
export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
