'use client';

import { usePathname } from 'next/navigation'; // Add this import
import { useRouter } from 'next/navigation';
import { ChevronDown, Radius } from 'lucide-react';
import Image from 'next/image';

import UserProfileDropdown from './UserProfileDropdown';
import ErrorBoundary from '../ErrorBoundary';
import { useSession, signOut } from 'next-auth/react';
import NotificationsBell from '../notifications/NotificationsBell';
import { useNotifications } from '@/hooks/useNotifications';
import { useEffect } from 'react';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname(); // Add this
  const { data: session } = useSession();
  const notificationsState = useNotifications();

  useEffect(() => {
    notificationsState.triggerRefetch();
  }, [pathname]);

  // console.log('Session is 😒', session);
  return (
    // <header className="z-[1] flex  items-center justify-between py-2 px-4  shadow-md">
    <header
      className="z-[10] flex items-center justify-between 
    py-2 px-4 shadow-md  fixed top-0 left-0 w-full bg-white"
    >
      <div className="flex items-center">
        <Image src="/images/logo1.png" alt="logo" width={44} height={44} />
      </div>

      <div className=" flex items-center gap-6">
        <ErrorBoundary>
          <NotificationsBell {...notificationsState} />

          <UserProfileDropdown
            user={{
              firstName: session?.user?.firstName,
              lastName: session?.user?.lastName,
              role: session?.user?.role,
              avatarColor: session?.user?.avatarColor,
            }}
            handleSignOut={() =>
              signOut({
                redirect: true,
                callbackUrl: '/', // Explicitly set to signup
              })
            }
          />
        </ErrorBoundary>
      </div>
    </header>
  );
};

export default Navbar;
