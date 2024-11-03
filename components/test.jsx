import React, { useState } from 'react';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

const TimeSelect = ({ value, onChange, className }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`bg-gray-700 text-white rounded px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  >
    {TIME_OPTIONS.map((time) => (
      <option key={time} value={time}>
        {time}
      </option>
    ))}
  </select>
);

const IntervalGroup = ({
  onDelete,
  groupIndex,
  intervals,
  updateIntervals,
}) => {
  const [selectedDays, setSelectedDays] = useState(['Monday']);
  const [showDayDropdown, setShowDayDropdown] = useState(false);

  const handleAddDay = (day) => {
    if (!selectedDays.includes(day)) {
      setSelectedDays([...selectedDays, day]);
    }
    setShowDayDropdown(false);
  };

  const handleRemoveDay = (dayToRemove) => {
    setSelectedDays(selectedDays.filter((day) => day !== dayToRemove));
  };

  const handleTimeChange = (type, value, intervalIndex) => {
    const newIntervals = [...intervals];
    newIntervals[intervalIndex] = {
      ...newIntervals[intervalIndex],
      [type]: value,
    };
    updateIntervals(groupIndex, newIntervals);
  };

  const addInterval = () => {
    updateIntervals(groupIndex, [
      ...intervals,
      { start: '09:00', end: '17:00' },
    ]);
  };

  const removeInterval = (intervalIndex) => {
    const newIntervals = intervals.filter(
      (_, index) => index !== intervalIndex
    );
    updateIntervals(groupIndex, newIntervals);
  };

  return (
    <div className="space-y-4 bg-gray-800 p-4 rounded-lg">
      {/* Time intervals */}
      {intervals.map((interval, intervalIndex) => (
        <div key={intervalIndex} className="flex items-center space-x-2">
          <TimeSelect
            value={interval.start}
            onChange={(value) =>
              handleTimeChange('start', value, intervalIndex)
            }
          />
          <TimeSelect
            value={interval.end}
            onChange={(value) => handleTimeChange('end', value, intervalIndex)}
          />
          <button
            onClick={() => removeInterval(intervalIndex)}
            className="text-red-500 hover:text-red-400 p-2"
          >
            ✕
          </button>
        </div>
      ))}

      {/* Add interval button */}
      <button
        onClick={addInterval}
        className="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm flex items-center"
      >
        <span className="mr-1">+</span> Add Time
      </button>

      {/* Days selection */}
      <div className="flex flex-wrap gap-2 mt-4">
        {selectedDays.map((day) => (
          <div
            key={day}
            className="flex items-center bg-gray-700 px-3 py-1 rounded text-white"
          >
            <span className="mr-2">{day}</span>
            <button
              onClick={() => handleRemoveDay(day)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Days dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDayDropdown(!showDayDropdown)}
          className="bg-gray-700 text-white px-3 py-2 rounded-md text-sm"
        >
          Add Day
        </button>
        {showDayDropdown && (
          <div className="absolute mt-1 w-40 bg-gray-700 rounded-md shadow-lg z-10">
            {DAYS_OF_WEEK.filter((day) => !selectedDays.includes(day)).map(
              (day) => (
                <button
                  key={day}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                  onClick={() => handleAddDay(day)}
                >
                  {day}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Delete group button */}
      <button
        onClick={() => onDelete(groupIndex)}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
      >
        Delete Group
      </button>
    </div>
  );
};

const Intervals = () => {
  const [intervalGroups, setIntervalGroups] = useState([
    {
      intervals: [{ start: '09:00', end: '17:00' }],
    },
  ]);

  const addIntervalGroup = () => {
    setIntervalGroups([
      ...intervalGroups,
      {
        intervals: [{ start: '09:00', end: '17:00' }],
      },
    ]);
  };

  const deleteIntervalGroup = (groupIndex) => {
    setIntervalGroups(
      intervalGroups.filter((_, index) => index !== groupIndex)
    );
  };

  const updateIntervals = (groupIndex, newIntervals) => {
    const newGroups = [...intervalGroups];
    newGroups[groupIndex] = {
      ...newGroups[groupIndex],
      intervals: newIntervals,
    };
    setIntervalGroups(newGroups);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Intervals</h3>

      {intervalGroups.map((group, groupIndex) => (
        <IntervalGroup
          key={groupIndex}
          groupIndex={groupIndex}
          intervals={group.intervals}
          updateIntervals={updateIntervals}
          onDelete={deleteIntervalGroup}
        />
      ))}

      <button
        onClick={addIntervalGroup}
        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm flex items-center"
      >
        <span className="mr-1">+</span> Add New Interval Group
      </button>

      <p className="text-sm text-gray-400">
        Select the days and times you will accept appointments. These intervals
        will repeat each week.
      </p>
    </div>
  );
};

export default Intervals;
