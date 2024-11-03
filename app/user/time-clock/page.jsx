import ClockIn from '@/components/dashboard/employee/timeClock/ClockIn';
import React from 'react';

const TimeClock = () => {
  return (
    <div className="flex  flex-col">
      <div className="flex items-center justify-between mb-6">
        <ClockIn />
      </div>
    </div>
  );
};

export default ClockIn;
