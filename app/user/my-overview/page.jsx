'use client';

import Greeting from '@/components/Greeting';
import BadgeButton from '@/components/dashboard/buttons/BadgeButton';
import Overview from '@/components/dashboard/employee/Overview';
import UserSchedule from '@/components/dashboard/employee/Schedule';

export default function MyOverview() {
  const requests = [
    {
      requesterInitials: 'DB',
      replacementInitials: 'PO',
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
      shiftName: 'Evening shift',
      shiftStart: new Date(2024, 9, 24, 17, 0),
      shiftEnd: new Date(2024, 9, 25, 1, 0),
      shiftDuration: '8:00',
    },
  ];

  const handleConfirm = (request) => {
    console.log('Confirmed request:', request);
  };

  const handleDecline = (request) => {
    console.log('Declined request:', request);
  };

  return (
    <div className="flex  flex-col px-4">
      <div className="flex items-center justify-between mb-4">
        <Greeting name="Jane! 👋" />
        <BadgeButton
          count={requests.length}
          requests={requests}
          onConfirm={handleConfirm}
          onDecline={handleDecline}
        >
          {' '}
          Replacements
        </BadgeButton>
      </div>
      <Overview />
    </div>
  );
}
