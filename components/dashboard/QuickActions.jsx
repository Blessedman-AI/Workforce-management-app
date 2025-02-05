'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserPlus, Crown, CheckSquare, Mail } from 'lucide-react';

import AddUsers from './admin/AddUsers';

const QuickActionButton = ({ icon: Icon, text, color, onClick, href }) => {
  const buttonContent = (
    <>
      <Icon className="w-6 h-6 mb-2" style={{ color }} />
      <span className="text-sm text-gray-700">{text}</span>
    </>
  );

  const className =
    'flex flex-col items-center justify-center p-4 bg-purple-2 rounded-3xl hover:bg-grey-2 shadow-[0_4px_6px_rgba(0,0,0,0.02),0_-4px_6px_rgba(0,0,0,0.02),4px_0_6px_rgba(0,0,0,0.02),-4px_0_6px_rgba(0,0,0,0.02)]';

  if (href) {
    return (
      <Link href={href} className={className}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {buttonContent}
    </button>
  );
};

const QuickActions = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const openAddUsersModal = () => {
    setIsUserModalOpen(true);
  };

  const closeAddUserModal = () => {
    setIsUserModalOpen(false);
  };

  const openAddAdminModal = () => {
    setIsAdminModalOpen(true);
  };

  const closeAddAdminModal = () => {
    setIsAdminModalOpen(false);
  };

  return (
    <div className="mb-6 w-full p-6 bg-purple-2 rounded-lg ">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 ">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <QuickActionButton
          onClick={openAddUsersModal}
          icon={UserPlus}
          text="Add staff"
          color="#38c173"
        />
        <QuickActionButton
          onClick={openAddAdminModal}
          icon={Crown}
          text="Add admins"
          color="#ff9500"
        />
        <QuickActionButton icon={Crown} text="Add managers" color="#ff9500" />
        <QuickActionButton
          icon={CheckSquare}
          text="Create Shift"
          color="#2998ff"
          href="/admin/schedule-task"
        />
      </div>
      <AddUsers isOpen={isUserModalOpen} onClose={closeAddUserModal} />
      <AddUsers
        isOpen={isAdminModalOpen}
        onClose={closeAddAdminModal}
        heading="Add more admins"
        description="Only admins can login to the Launch pad using desktop or laptop"
        showTitleSelect={true}
        selectOptions={[
          { value: 'Manager', label: 'Manager' },
          { value: 'Supervisor', label: 'Supervisor' },
        ]}
        userType="Admin"
      />
    </div>
  );
};

export default QuickActions;
