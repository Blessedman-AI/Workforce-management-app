'use client';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import Greeting from '@/components/Greeting';
import QuickActions from '@/components/dashboard/QuickActions';
import Overview from '@/components/dashboard/admin/ScheduledShifts';
import BadgeButton from '@/components/dashboard/buttons/BadgeButton';
import { getInitialRequests } from '@/helpers/data';
import { getUser } from '@/helpers/fetchers';
import ErrorBoundary from '@/components/ErrorBoundary';
import ScheduledShifts from '@/components/dashboard/admin/ScheduledShifts';

export default function MyOverview() {
  const [requests, setRequests] = useState(getInitialRequests());
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userName, setUserName] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(session, status);

  useEffect(() => {
    const fetchUserName = async () => {
      if (status === 'authenticated') {
        try {
          const firstName = await getUser({ firstName: true }); // Add await here
          setUserName(firstName.charAt(0).toUpperCase() + firstName.slice(1));
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        } finally {
          setLoading(false); // Ensure loading is set to false in both success and error cases
        }
      } else {
        router.push('/signin');
      }
    };

    fetchUserName();
  }, [status, router]);

  // console.log('😒😉', userName);

  const handleConfirm = (request) => {
    console.log('Confirmed request:', request);
  };

  const handleDecline = (request) => {
    console.log('Declined request:', request);
  };

  return (
    <div className="mt-6  pr-6">
      <div className="flex items-center my-6 justify-between">
        <div className="shrink-0">
          {' '}
          {userName && <Greeting name={userName || ''} />}
        </div>
        <div>
          <BadgeButton
            count={requests.length}
            requests={requests}
            onConfirm={handleConfirm}
            onDecline={handleDecline}
          >
            Requests
          </BadgeButton>
        </div>
      </div>

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
