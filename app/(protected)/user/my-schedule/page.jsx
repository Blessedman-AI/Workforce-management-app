import Greeting from '@/components/Greeting';
import BadgeButton from '@/components/dashboard/buttons/BadgeButton';
import Overview from '@/components/dashboard/employee/Overview';
import Schedule from '@/components/dashboard/employee/Schedule';
import SetUnavailability from '@/components/dashboard/employee/setUnavailability/SetUnavailability';

export default function MySchedule() {
  return (
    <div className="flex flex-col overflow-x-hidden-hidden px-4">
      <Schedule />
    </div>
  );
}
