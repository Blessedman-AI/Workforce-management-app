'use client';

import Greeting from '@/components/Greeting';
import QuickActions from '@/components/dashboard/QuickActions';
import Overview from '@/components/dashboard/admin/Overview';
import BadgeButton from '@/components/dashboard/buttons/BadgeButton';

export default function MyOverview() {
  const requests = [
    {
      requesterInitials: 'DB',
      replacementInitials: 'CX',
      replacementName: 'Craxis',
      requesterName: 'Diokpa',
      shiftName: 'Morning shift',
      shiftStart: new Date(2024, 9, 24, 9, 0),
      shiftEnd: new Date(2024, 9, 24, 17, 0),
      shiftDuration: '8:00',
    },
    {
      requesterInitials: 'CD',
      replacementInitials: 'EF',
      requesterName: 'charlie',
      replacementName: 'Anautovich',
      shiftName: 'Evening shift',
      shiftStart: new Date(2024, 9, 24, 17, 0),
      shiftEnd: new Date(2024, 9, 25, 1, 0),
      shiftDuration: '8:00',
    },
  ];
  ('');

  const handleConfirm = (request) => {
    console.log('Confirmed request:', request);
  };

  const handleDecline = (request) => {
    console.log('Declined request:', request);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center my-6 justify-between">
        <Greeting name="John! 👋" />
        <BadgeButton
          count={requests.length}
          requests={requests}
          onConfirm={handleConfirm}
          onDecline={handleDecline}
        >
          Requests
        </BadgeButton>
      </div>
      <QuickActions />
      <Overview />
    </div>
  );
}
