import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const DualCalendar = ({ isOpen, onClose, onSelect }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [viewingMonth, setViewingMonth] = useState(new Date());
  const [nextMonth, setNextMonth] = useState(
    new Date(new Date().setMonth(viewingMonth.getMonth() + 1))
  );

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    return Array.from({ length: daysInMonth }, (_, i) => ({
      date: new Date(year, month, i + 1),
      dayOfMonth: i + 1,
      isCurrentMonth: true,
    }));
  };

  const generateCalendarDays = (date) => {
    const days = getDaysInMonth(date);
    const firstDay = days[0].date.getDay();

    const paddingDays = Array.from({ length: firstDay }, (_, i) => ({
      date: new Date(date.getFullYear(), date.getMonth(), -i),
      dayOfMonth: new Date(date.getFullYear(), date.getMonth(), -i).getDate(),
      isCurrentMonth: false,
    })).reverse();

    return [...paddingDays, ...days];
  };

  const handleDateClick = (date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      if (date > selectedStartDate) {
        setSelectedEndDate(date);
      } else {
        setSelectedStartDate(date);
        setSelectedEndDate(null);
      }
    }
  };

  const isDateInRange = (date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const isDateSelected = (date) => {
    return (
      date.toDateString() === selectedStartDate?.toDateString() ||
      date.toDateString() === selectedEndDate?.toDateString()
    );
  };

  const navigateMonth = (direction) => {
    setViewingMonth(
      new Date(viewingMonth.setMonth(viewingMonth.getMonth() + direction))
    );
    setNextMonth(
      new Date(nextMonth.setMonth(nextMonth.getMonth() + direction))
    );
  };

  const formatMonthYear = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const renderCalendar = (date) => {
    const days = generateCalendarDays(date);
    const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    return (
      <div className="w-full sm:w-64">
        <div className="mb-4">
          <div className="text-gray-700 font-medium">
            {formatMonthYear(date)}
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-xs text-gray-500 text-center">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => handleDateClick(day.date)}
              className={`
                h-8 w-8 rounded-full text-sm flex items-center justify-center
                ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
                ${isDateSelected(day.date) ? 'bg-blue-500 text-white' : ''}
                ${isDateInRange(day.date) ? 'bg-blue-100' : ''}
                hover:bg-gray-100
              `}
            >
              {day.dayOfMonth}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-1 p-4 bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-full sm:w-auto">
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="relative">
          <button
            onClick={() => navigateMonth(-1)}
            className="absolute left-2 top-1/2 transform -translate-y-1/2"
          >
            <ChevronLeft className="h-4 w-4 text-gray-500" />
          </button>
          {renderCalendar(viewingMonth)}
        </div>
        <div className="relative">
          <button
            onClick={() => navigateMonth(1)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <ChevronRight className="h-4 w-4 text-gray-500" />
          </button>
          {renderCalendar(nextMonth)}
        </div>
      </div>
    </div>
  );
};

const Timesheet = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState('21/10 to 04/11');

  const timeEntries = [
    {
      date: 'Mon 4/11',
      entries: [
        {
          type: 'Morning Shift',
          start: '15:45',
          end: '15:45',
          totalHours: '--',
        },
        {
          type: 'Evening Shift',
          start: '15:59',
          end: '16:05',
          totalHours: '00:06',
        },
      ],
    },
    {
      date: 'Sun 3/11',
      entries: [],
    },
  ];

  return (
    <div className="pt-6 w-full mx-auto px-4 sm:px-6">
      <div className="bg-purple-2 rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Timesheet
              </h1>
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md flex items-center justify-between sm:justify-start gap-2 hover:bg-gray-50 focus:outline-none focus:ring-0 focus:border-none"
                >
                  <span>{dateRange}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
                <DualCalendar
                  isOpen={isCalendarOpen}
                  onClose={() => setIsCalendarOpen(false)}
                  onSelect={(range) => {
                    setDateRange(range);
                    setIsCalendarOpen(false);
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button className="button-primary text-[13px] sm:text-[16px]">
                Submit timesheet
              </button>
            </div>
          </div>

          {/* Table Header - Hidden on mobile */}
          <div className="hidden sm:grid sm:grid-cols-5 gap-4 mb-4 text-sm font-medium text-gray-700 px-4">
            <div className="col-span-1">Date</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-1">Start</div>
            <div className="col-span-1">End</div>
            <div className="col-span-1">Total hours</div>
          </div>

          {/* Time Entries */}
          {timeEntries.map((dayEntry, index) => (
            <div key={index} className="mb-4">
              <div
                className="flex items-center justify-center rounded-md
               bg-gray-100 px-4 py-2 text-sm text-gray-500"
              >
                {index === 0 ? 'Nov 04' : 'Oct 28 - Nov 03'}
              </div>

              {dayEntry.entries.length > 0 ? (
                dayEntry.entries.map((entry, entryIndex) => (
                  <div
                    key={entryIndex}
                    className="grid md:grid-cols-5 gap-2 sm:gap-4 p-4
                     items-center rounded-md"
                  >
                    <div className="sm:col-span-1">
                      {entryIndex === 0 && (
                        <div className="flex items-center gap-2">
                          <span>{dayEntry.date}</span>
                        </div>
                      )}
                    </div>
                    <div className="sm:col-span-1">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs
                           ${
                             entry.type === 'Morning Shift'
                               ? 'bg-purple-200 text-purple-1'
                               : 'bg-teal-100 text-teal-800'
                           }`}
                      >
                        {entry.type}
                      </span>
                    </div>
                    {/* Mobile labels */}
                    <div className="grid grid-cols-3 sm:hidden gap-2 mt-2">
                      <div className="text-gray-500">Start</div>
                      <div className="text-gray-500">End</div>
                      <div className="text-gray-500">Hours</div>
                    </div>
                    {/* Mobile values */}
                    <div className="grid grid-cols-3 sm:hidden gap-2">
                      <div>{entry.start}</div>
                      <div>{entry.end}</div>
                      <div>{entry.totalHours}</div>
                    </div>
                    {/* Desktop values */}
                    <div className="hidden sm:block sm:col-span-1">
                      {entry.start}
                    </div>
                    <div className="hidden sm:block sm:col-span-1">
                      {entry.end}
                    </div>
                    <div className="hidden sm:block sm:col-span-1">
                      {entry.totalHours}
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid sm:grid-cols-5 gap-4 px-4 py-2 text-sm items-center">
                  <div className="sm:col-span-1">
                    <div className="flex items-center gap-2">
                      <span>{dayEntry.date}</span>
                    </div>
                  </div>
                  <div className="sm:col-span-1">--</div>
                  <div className="sm:col-span-1">--</div>
                  <div className="sm:col-span-1">--</div>
                  <div className="sm:col-span-1">--</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timesheet;
