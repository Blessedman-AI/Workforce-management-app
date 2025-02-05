import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === 'owner' || token?.role === 'admin';
    const isEmployee = token?.role === 'employee';

    // console.log('token✅: ', token);

    // Redirect unauthenticated users to login
    if (!token) {
      const loginUrl = new URL('/signup', req.url);
      loginUrl.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/user', req.url));
      }
    }

    // Protect employee routes
    if (req.nextUrl.pathname.startsWith('/user')) {
      if (!isEmployee) {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
    }

    // Protect API routes
    if (req.nextUrl.pathname.startsWith('/api/shifts')) {
      if (!isAdmin) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // console.log('Middleware Authorization - Token exists:', !!token);
        // console.log('Middleware Authorization - Token details:', token);
        return !!token?.id;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/user/:path*', '/api/shifts/:path*'],
};
