import ClockIn from '@/components/dashboard/admin/clockIn/ClockIn';

const TimeClock = () => {
  return (
    <div className="flex  flex-col">
      <div className="flex  items-center justify-between mb-6">
        <ClockIn />
      </div>
    </div>
  );
};

export default TimeClock;
