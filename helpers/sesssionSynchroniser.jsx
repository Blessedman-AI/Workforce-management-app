'use client';
import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';

const SessionSynchroniser = () => {
  const { status } = useSession();

  useEffect(() => {
    // Check if cookies are actually present
    const checkCookieValidity = () => {
      const sessionCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('__Secure-next-auth.session-token'));

      if (!sessionCookie) {
        // No valid session cookie? Force logout
        signOut({ redirect: true, callbackUrl: '/login' });
      }
    };

    // Run check periodically or on status change
    checkCookieValidity();
  }, [status]);

  return null; // This component just runs side effects
};

export default SessionSynchroniser;
