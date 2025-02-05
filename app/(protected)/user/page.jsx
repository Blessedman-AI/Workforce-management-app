import Overview from '@/components/dashboard/employee/Overview';
import { redirect } from 'next/navigation';

export default function UserHome() {
  return (
    <div className="flex  flex-col px-4">
      <Overview />
    </div>
  );
}
