'use client';

import Spinner from '@/components/Spinner';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const publicPaths = ['/login', '/signup', '/'];

export default function SessionGuard({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log('SessionGuard Effect Running');
    console.log('Current Status:', status);
    console.log('Current Session:', session);
    // console.log('Current Pathname:', pathname);

    const isPublicPath = publicPaths.includes(pathname);
    // console.log('Is Public Path:', isPublicPath);

    // Handle all navigation logic here
    if (!session?.user && !isPublicPath) {
      // console.log('No session on protected route, redirecting');
      router.replace('/login');
    }
  }, [session, status, router, pathname]);

  // Handle loading state
  if (status === 'loading') {
    // console.log('Loading state detected');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Allow public routes
  if (publicPaths.includes(pathname)) {
    // console.log('Public route detected, rendering children');
    return <>{children}</>;
  }

  // For protected routes, wait for session without calling router.replace
  if (!session?.user && !publicPaths.includes(pathname)) {
    // console.log('No session on protected route, returning null');
    return null;
  }

  // s
  return <>{children}</>;
}
