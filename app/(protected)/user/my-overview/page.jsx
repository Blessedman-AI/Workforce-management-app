'use client';

import Greeting from '@/components/Greeting';
import BadgeButton from '@/components/dashboard/buttons/BadgeButton';
import Overview from '@/components/dashboard/employee/Overview';
import UserSchedule from '@/components/dashboard/employee/Schedule';
import { useSession } from 'next-auth/react';

export default function MyOverview() {
  // const { data: session, status } = useSession();
  // console.log(session, status);
  return (
    <div className="flex  flex-col px-4">
      <Overview />
    </div>
  );
}
