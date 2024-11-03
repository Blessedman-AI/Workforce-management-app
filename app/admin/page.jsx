import Greeting from '@/components/Greeting';
import Overview from '@/components/dashboard/employee/Overview';
import UserSchedule from '@/components/dashboard/employee/Schedule';

export default function MyOverview() {
  return (
    <div>
      <Greeting name="John! 👋" />
      <Overview />
    </div>
  );
}
