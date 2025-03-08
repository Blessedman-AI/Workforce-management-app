'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';

// Helper function to convert day number to name
const dayNumberToName = (dayNumber) => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[dayNumber];
};

// Helper function to convert day name to number
const dayNameToNumber = (dayName) => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days.indexOf(dayName);
};

// IntervalGroup component for managing a group of time intervals
const IntervalGroup = ({
  groupIndex,
  intervals,
  selectedDays,
  updateIntervals,
  updateSelectedDays,
  onDelete,
}) => {
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const addInterval = () => {
    updateIntervals(groupIndex, [
      ...intervals,
      { start: '09:00', end: '17:00' },
    ]);
  };

  const deleteInterval = (intervalIndex) => {
    updateIntervals(
      groupIndex,
      intervals.filter((_, index) => index !== intervalIndex)
    );
  };

  const updateInterval = (intervalIndex, field, value) => {
    const newIntervals = [...intervals];
    newIntervals[intervalIndex] = {
      ...newIntervals[intervalIndex],
      [field]: value,
    };
    updateIntervals(groupIndex, newIntervals);
  };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      updateSelectedDays(
        groupIndex,
        selectedDays.filter((d) => d !== day)
      );
    } else {
      updateSelectedDays(groupIndex, [...selectedDays, day]);
    }
  };

  return (
    <div className="border rounded-md p-4 mb-4">
      <div className="flex justify-between mb-4">
        <h4 className="font-medium">Interval Group {groupIndex + 1}</h4>
        {groupIndex > 0 && (
          <button
            onClick={() => onDelete(groupIndex)}
            className="text-red-500 hover:text-red-700"
          >
            Remove Group
          </button>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Select Days</label>
        <div className="flex flex-wrap gap-2">
          {days.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`py-1 px-3 text-sm rounded-full ${
                selectedDays.includes(day)
                  ? 'bg-purple-1 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {intervals.map((interval, intervalIndex) => (
          <div key={intervalIndex} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div>
                <label className="block text-sm mb-1">Start Time</label>
                <input
                  type="time"
                  value={interval.start}
                  onChange={(e) =>
                    updateInterval(intervalIndex, 'start', e.target.value)
                  }
                  className="border rounded p-1"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">End Time</label>
                <input
                  type="time"
                  value={interval.end}
                  onChange={(e) =>
                    updateInterval(intervalIndex, 'end', e.target.value)
                  }
                  className="border rounded p-1"
                />
              </div>
            </div>

            {intervals.length > 1 && (
              <button
                onClick={() => deleteInterval(intervalIndex)}
                className="text-red-500 hover:text-red-700 mt-6"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addInterval}
        className="mt-3 text-sm text-purple-1 hover:text-purple-3
         inline-flex items-center"
      >
        <Plus size={16} className="mr-1" />
        Add Time Interval
      </button>
    </div>
  );
};

const Intervals = ({ onSave, loading }) => {
  const [intervalGroups, setIntervalGroups] = useState([
    {
      intervals: [{ start: '09:00', end: '17:00' }],
      selectedDays: ['Monday'],
    },
  ]);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch existing intervals when component mounts
  useEffect(() => {
    fetchIntervals();
  }, []);

  const fetchIntervals = async () => {
    try {
      const response = await axios.get('/api/unavailability');

      // Find the restricted hours type entries
      const restrictedHours = response.data.unavailabilities.filter(
        (item) => item.type === 'RESTRICTED_HOURS'
      );

      if (restrictedHours.length > 0) {
        // Get intervals from the most recent entry
        const sortedByDate = restrictedHours.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Group intervals by day
        const intervalsByDay = {};

        sortedByDate[0].intervals.forEach((interval) => {
          const dayName = dayNumberToName(interval.dayOfWeek);

          if (!intervalsByDay[dayName]) {
            intervalsByDay[dayName] = [];
          }

          intervalsByDay[dayName].push({
            start: interval.startTime,
            end: interval.endTime,
          });
        });

        // Convert to our format
        const newIntervalGroups = Object.entries(intervalsByDay).map(
          ([day, timeIntervals]) => ({
            selectedDays: [day],
            intervals: timeIntervals,
          })
        );

        if (newIntervalGroups.length > 0) {
          setIntervalGroups(newIntervalGroups);
        }
      }
    } catch (err) {
      console.error('Error fetching intervals:', err);
      setError('Failed to load your schedule restrictions');
    }
  };

  const addIntervalGroup = () => {
    setIntervalGroups([
      ...intervalGroups,
      {
        intervals: [{ start: '09:00', end: '17:00' }],
        selectedDays: ['Monday'],
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

  const updateSelectedDays = (groupIndex, newSelectedDays) => {
    const newGroups = [...intervalGroups];
    newGroups[groupIndex] = {
      ...newGroups[groupIndex],
      selectedDays: newSelectedDays,
    };
    setIntervalGroups(newGroups);
  };

  const handleSave = async () => {
    // Validate intervals
    let isValid = true;
    const validationErrors = [];

    intervalGroups.forEach((group, groupIndex) => {
      if (group.selectedDays.length === 0) {
        isValid = false;
        validationErrors.push(`Group ${groupIndex + 1} has no days selected`);
      }

      group.intervals.forEach((interval, intervalIndex) => {
        if (interval.start >= interval.end) {
          isValid = false;
          validationErrors.push(
            `Group ${groupIndex + 1}, interval ${intervalIndex + 1}: End time must be after start time`
          );
        }
      });
    });

    if (!isValid) {
      setError(validationErrors.join(', '));
      return;
    }

    setIsSaving(true);
    try {
      // Convert to the format expected by the API
      const allIntervals = [];

      intervalGroups.forEach((group) => {
        group.selectedDays.forEach((day) => {
          const dayNumber = dayNameToNumber(day);

          group.intervals.forEach((interval) => {
            allIntervals.push({
              dayOfWeek: dayNumber,
              startTime: interval.start,
              endTime: interval.end,
            });
          });
        });
      });

      // Call the parent's onSave function
      if (onSave) {
        await onSave(allIntervals);
      }

      setError(null);
    } catch (err) {
      console.error('Error saving intervals:', err);
      setError('Failed to save intervals');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h3 className="text-subheading-2 font-medium mb-4">
        Unavailable Time Intervals
      </h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-4 rounded">
          {error}
        </div>
      )}

      {intervalGroups.map((group, groupIndex) => (
        <IntervalGroup
          key={groupIndex}
          groupIndex={groupIndex}
          intervals={group.intervals}
          selectedDays={group.selectedDays}
          updateIntervals={updateIntervals}
          updateSelectedDays={updateSelectedDays}
          onDelete={deleteIntervalGroup}
        />
      ))}

      <div className="flex flex-col space-y-4 mt-4">
        <button
          onClick={addIntervalGroup}
          className="border rounded-md border-gray-300 px-4 py-2 text-sm inline-flex items-center self-start"
        >
          <Plus className="mr-2" size={16} />
          Add New Interval Group
        </button>

        <button
          onClick={handleSave}
          disabled={loading || isSaving}
          className={`bg-purple-1 text-white px-4 py-2 rounded-md ${
            loading || isSaving
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-purple-3'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save All Intervals'}
        </button>
      </div>

      <p className="text-[14px] mt-2 text-gray-500 italic">
        {` Select the days and times when you're NOT available for shifts. These
        intervals will repeat each week`}
      </p>
    </div>
  );
};

export default Intervals;
