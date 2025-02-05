'use client';
import AddUsers from '@/components/dashboard/admin/AddUsers';
import UsersTable from '@/components/dashboard/admin/Users';
import ErrorBoundary from '@/components/ErrorBoundary';
import React, { useState } from 'react';

const Users = () => {
  return (
    <div className="flex items-center justify-center bg-purple-2  h-full">
      <ErrorBoundary>
        <UsersTable />
      </ErrorBoundary>
    </div>
  );
};

export default Users;
