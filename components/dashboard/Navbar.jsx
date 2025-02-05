'use client';

import { ChevronDown, Radius } from 'lucide-react';
import Image from 'next/image';
import NotificationICon from '../notifications/NotificationICon';

import { dummyShifts } from '@/helpers/data';
import UserProfileDropdown from './UserProfileDropdown';
import ErrorBoundary from '../ErrorBoundary';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();
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
          <NotificationICon />
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
