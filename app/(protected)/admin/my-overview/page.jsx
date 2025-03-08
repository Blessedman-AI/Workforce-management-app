'use client';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import Greeting from '@/components/Greeting';
import QuickActions from '@/components/dashboard/QuickActions';
import Overview from '@/components/dashboard/admin/ScheduledShifts';
import { getUser } from '@/helpers/fetchers';
import ErrorBoundary from '@/components/ErrorBoundary';
import ScheduledShifts from '@/components/dashboard/admin/ScheduledShifts';

export default function MyOverview() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userName, setUserName] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('session is🪗💴', session, status);

  const handleConfirm = (request) => {
    console.log('Confirmed request:', request);
  };

  const handleDecline = (request) => {
    console.log('Declined request:', request);
  };

  return (
    <div className="mt-6  pr-6">
      {/* Quick Actions */}
      <ErrorBoundary>
        <QuickActions />
      </ErrorBoundary>

      {/* Overview */}
      <ErrorBoundary>
        <ScheduledShifts />
      </ErrorBoundary>
    </div>
  );
}
