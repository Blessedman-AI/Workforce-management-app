import { getServerSession } from 'next-auth/next';

import SessionGuard from '@/helpers/sessionGuard';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';

export default async function ProtectedLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    console.log('Valid token but no session - user might have been deleted');
    redirect('/login');
  }
  return <div>{children}</div>;
  // return <SessionGuard>{children}</SessionGuard>;
}
