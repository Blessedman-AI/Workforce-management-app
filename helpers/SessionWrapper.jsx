'use client';

import { SessionProvider } from 'next-auth/react';

export default function SessionWrapper({ children, session }) {
  // console.log('SessionProvider received session:', session);

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
