import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === 'owner' || token?.role === 'admin';
    const isEmployee = token?.role === 'employee';
    const path = req.nextUrl.pathname;

    // console.log('token✅: ', token);  // If authenticated user hits the root path, redirect based on role

    // Don't redirect on auth-related paths
    if (path.startsWith('/api/auth') || path === '/logout') {
      return NextResponse.next();
    }

    // If authenticated user hits the root path, redirect based on role
    if (path === '/') {
      if (isEmployee) {
        return NextResponse.redirect(new URL('/user/my-overview', req.url));
      }
      if (isAdmin) {
        return NextResponse.redirect(new URL('/admin/my-overview', req.url));
      }
    }

    // For /signup and /login paths, redirect authenticated users to their appropriate dashboard
    if (path === '/signup' || path === '/login') {
      if (token) {
        if (isEmployee) {
          return NextResponse.redirect(new URL('/user/my-overview', req.url));
        }
        if (isAdmin) {
          return NextResponse.redirect(new URL('/admin/my-overview', req.url));
        }
      }
    }

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

// export const config = {
//   matcher: ['/admin/:path*', '/user/:path*', '/api/shifts/:path*'],
// };
export const config = {
  matcher: [
    '/',
    '/signup',
    '/login',
    '/logout',
    '/admin/:path*',
    '/user/:path*',
    '/api/shifts/:path*',
  ],
};
