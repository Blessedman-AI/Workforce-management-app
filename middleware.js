import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

const ROLES = {
  ADMIN: ['owner', 'admin'],
  EMPLOYEE: ['employee'],
};

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token && ROLES.ADMIN.includes(token?.role);
    const isEmployee = token && token?.role === 'employee';

    if (!token) {
      return NextResponse.redirect(new URL('/signup', req.url));
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

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
      return NextResponse.redirect(new URL('/user/my-overview', req.url));
    }

    // Protect employee routes
    if (req.nextUrl.pathname.startsWith('/user') && !isEmployee) {
      return NextResponse.redirect(new URL('/admin/my-overview', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token?.id,
    },
  }
);

export const config = {
  matcher: ['/', '/admin/:path*', '/user/:path*'],
};

const logDebug = (message, data) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message, data);
  }
};
