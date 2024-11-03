import { Trash2, Plus } from 'lucide-react';
import React, { useState } from 'react';

const WeekDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const TimeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

const TimeSelect = ({ value, onChange, className }) => (
  <select
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    className={` border border-gray-300 
            shadow-sm focus:border-none bg-transparent pl-2 pr-8
         py-2 w-28 focus:outline-none 
          focus:ring-0 ${className}`}
  >
    {TimeOptions.map((time) => (
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
    <div className="">
      {/* Time intervals */}
      {intervals.map((interval, intervalIndex) => (
        <div key={intervalIndex} className="flex items-center space-x-2">
          <TimeSelect
            value={interval.start || ''}
            onChange={(value) =>
              handleTimeChange('start', value, intervalIndex)
            }
          />
          <TimeSelect
            value={interval.end || ''}
            onChange={(value) => handleTimeChange('end', value, intervalIndex)}
          />
          <button
            onClick={() => removeInterval(intervalIndex)}
            className="bg-purple-2 border p-1 rounded-md"
          >
            <Trash2 color="black" size={18} />
          </button>
        </div>
      ))}

      {/* Add interval button */}
      <button
        onClick={addInterval}
        className="border rounded-md mt-2 border-gray-300 shadow-sm 
        focus:border-none bg-transparent px-1 py-0.5"
      >
        <Plus />
      </button>

      {/* Days selection */}
      <div className="flex flex-wrap gap-2 mt-4">
        {selectedDays.map((day) => (
          <div
            key={day}
            className="flex border rounded-md
                   border-gray-300 shadow-sm focus:border-none
                    bg-transparent px-2 py-0.5 text-[14px]"
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
        <div className="flex gap-2 mt-4 mb-6">
          <button
            onClick={() => setShowDayDropdown(!showDayDropdown)}
            className="button-secondary"
          >
            + Add Day
          </button>

          {/* Delete group button */}
          <button
            onClick={() => onDelete(groupIndex)}
            className="button-primary"
          >
            Delete Group
          </button>
        </div>
        {showDayDropdown && (
          <div className="absolute mt-1 w-40 bg-white text-black rounded-md shadow-lg z-10">
            {WeekDays.filter((day) => !selectedDays.includes(day)).map(
              (day) => (
                <button
                  key={day}
                  className="block w-full text-left px-4 py-2 text-sm
                   text-black hover:bg-purple-2"
                  onClick={() => handleAddDay(day)}
                >
                  {day}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Delete group button
      <button
        onClick={() => onDelete(groupIndex)}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
      >
        Delete Group
      </button> */}
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
    <div className="">
      <h3 className="text-subheading-2 font-medium mb-2 ">Intervals</h3>

      {intervalGroups.map((group, groupIndex) => (
        <IntervalGroup
          key={groupIndex}
          groupIndex={groupIndex}
          intervals={group.intervals}
          updateIntervals={updateIntervals}
          onDelete={deleteIntervalGroup}
        />
      ))}

      <button onClick={addIntervalGroup} className="button-primary">
        <span className="mr-1">+</span>Add New Interval Group
      </button>

      <p className="text-[14px] mt-2 text-gray-500 italic">
        Select the days and times you will accept appointments. These intervals
        will repeat each week.
      </p>
    </div>
  );
};

export default Intervals;
