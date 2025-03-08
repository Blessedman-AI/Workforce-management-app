import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === 'owner' || token?.role === 'admin';
    const isEmployee = token?.role === 'employee';

    console.log('Middleware Debug:', {
      hasToken: !!token,
      tokenRole: token?.role,
      pathname: req.nextUrl.pathname,
      isAdmin,
      isEmployee,
    });

    console.log('token✅: ', token);

    if (!token && !session) {
      console.log('No token or session🩸');
      const signupUrl = new URL('/signup', req.url);
      return NextResponse.redirect(signupUrl);
    }

    // Check if token exists but is invalid
    if (token && !token.id) {
      console.log('Invalid token detected');
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Handle root path redirect
    if (req.nextUrl.pathname === '/') {
      if (isAdmin) {
        return NextResponse.redirect(new URL('/admin/my-overview', req.url));
      }
      if (isEmployee) {
        return NextResponse.redirect(new URL('/user/my-overview', req.url));
      }
    }

    // Redirect unauthenticated users to login
    if (!token) {
      // console.log('No token detected');
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/user/my-overview', req.url));
      }
    }

    // Protect employee routes
    if (req.nextUrl.pathname.startsWith('/user')) {
      if (!isEmployee) {
        return NextResponse.redirect(new URL('/admin/my-overview', req.url));
      }
    }

    // Protect API routes
    // if (req.nextUrl.pathname.startsWith('/api/shifts')) {
    //   if (!isAdmin) {
    //     return NextResponse.json(
    //       { error: 'Insufficient permissions' },
    //       { status: 403 }
    //     );
    //   }
    // }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log('Middleware Authorization - Token exists:', !!token);
        console.log('Middleware Authorization - Token details:', token);
        return !!token?.id;
      },
    },
  }
);

export const config = {
  matcher: ['/', '/admin/:path*', '/user/:path*'],
};
