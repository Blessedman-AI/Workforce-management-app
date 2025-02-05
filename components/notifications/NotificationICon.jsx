'use client';

import { Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import NotificationPopup from './NotificationsPopup';

import { dummyShifts } from '@/helpers/data';

const NotificationICon = () => {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const count = dummyShifts.length; // Replace with your own logic to count pending shifts

  const handleNotificationIconClick = () => {
    const isAdminPage = pathname?.startsWith('/admin');
    setIsAdmin(isAdminPage); // Set admin status first
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <>
      <button
        typeof="button"
        onClick={handleNotificationIconClick}
        className="relative z-10 "
      >
        <span
          className="cursor-pointer absolute -top-2 -right-2 flex 
          items-center justify-center h-4 w-4 rounded-full bg-purple-1
       text-white text-xs"
        >
          {count}
        </span>
        <Bell size={20} className="text-gray-500" />{' '}
        {isPopupOpen && (
          <div
            className="absolute shadow-lg w-0 h-0 top-full left-0  mt-2
               border-b-[16px] border-r-[10px] border-t-0 border-l-[10px] 
    border-transparent border-b-purple-2"
          ></div>
        )}
      </button>

      <NotificationPopup
        isAdmin={isAdmin}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      ></NotificationPopup>
    </>
  );
};

export default NotificationICon;
