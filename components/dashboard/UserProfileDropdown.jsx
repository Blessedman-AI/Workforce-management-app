'use client';

import React, { useState } from 'react';
import { ChevronDown, LogOut, Settings } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { capitalizeInitials } from '@/helpers/utils';

const UserProfileDropdown = ({ user, handleSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to generate initials from name
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName?.[0]?.toUpperCase() || '';
    const secondInitial = lastName?.[0]?.toUpperCase() || '';
    return `${firstInitial}${secondInitial}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg
         hover:bg-purple-2 transition-colors"
      >
        {user?.image ? (
          <Image
            src={user?.image}
            alt={(user?.firstName, user.lastName)}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full shadow
           flex items-center justify-center text-white font-bold text-[16px]"
            style={{ backgroundColor: user?.avatarColor || '#CBD5E1' }}
          >
            {getInitials(user?.firstName, user?.lastName)}
          </div>
        )}
        <span className="font-medium text-[16px] text-purple-1">
          {capitalizeInitials(user?.firstName)}{' '}
          {capitalizeInitials(user?.lastName)}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-md 
        shadow-lg bg-white "
        >
          <div className="py-2">
            {/* User info section */}
            <div
              className="flex gap-2 items-center  bg-purple-2 rounded-lg
            m-2 px-4 py-2"
            >
              <div
                className={`w-8 h-8 rounded-full 
           flex items-center justify-center text-white font-bold text-[14px]
           `}
                style={{ backgroundColor: user?.avatarColor }}
              >
                {getInitials(user?.firstName, user?.lastName)}
              </div>
              <div>
                <p className="text-sm font-bold ">
                  {user?.firstName} {user?.lastName}
                </p>
                <div className="text-xs font-medium ">{user?.role}</div>
              </div>
            </div>

            <div className="border-t border-gray-100 my-2"></div>

            {/* Menu items */}
            <button
              onClick={() => (window.location.href = '/settings')}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-2 flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-sm text-gray-700
               hover:bg-purple-2  flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
