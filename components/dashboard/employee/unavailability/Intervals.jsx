// import { Trash2, Plus } from 'lucide-react';
// import { Plus, Trash2 } from 'lucide-react';
// import axios from 'axios';

// const WeekDays = [
//   'Monday',
//   'Tuesday',
//   'Wednesday',
//   'Thursday',
//   'Friday',
//   'Saturday',
//   'Sunday',
// ];

// const TimeOptions = Array.from({ length: 48 }, (_, i) => {
//   const hour = Math.floor(i / 2);
//   const minute = i % 2 === 0 ? '00' : '30';
//   return `${hour.toString().padStart(2, '0')}:${minute}`;
// });

// const TimeSelect = ({ value, onChange, className }) => (
//   <select
//     value={value || ''}
//     onChange={(e) => onChange(e.target.value)}
//     className={` border border-gray-300
//             shadow-sm focus:border-none bg-transparent pl-2 pr-8
//          py-2 w-28 focus:outline-none
//           focus:ring-0 ${className}`}
//   >
//     {TimeOptions.map((time) => (
//       <option key={time} value={time}>
//         {time}
//       </option>
//     ))}
//   </select>
// );

// const IntervalGroup = ({
//   onDelete,
//   groupIndex,
//   intervals,
//   updateIntervals,
// }) => {
//   const [selectedDays, setSelectedDays] = useState(['Monday']);
//   const [showDayDropdown, setShowDayDropdown] = useState(false);

//   const handleAddDay = (day) => {
//     if (!selectedDays.includes(day)) {
//       setSelectedDays([...selectedDays, day]);
//     }
//     setShowDayDropdown(false);
//   };

//   const handleRemoveDay = (dayToRemove) => {
//     setSelectedDays(selectedDays.filter((day) => day !== dayToRemove));
//   };

//   const handleTimeChange = (type, value, intervalIndex) => {
//     const newIntervals = [...intervals];
//     newIntervals[intervalIndex] = {
//       ...newIntervals[intervalIndex],
//       [type]: value,
//     };
//     updateIntervals(groupIndex, newIntervals);
//   };

//   const addInterval = () => {
//     updateIntervals(groupIndex, [
//       ...intervals,
//       { start: '09:00', end: '17:00' },
//     ]);
//   };

//   const removeInterval = (intervalIndex) => {
//     const newIntervals = intervals.filter(
//       (_, index) => index !== intervalIndex
//     );
//     updateIntervals(groupIndex, newIntervals);
//   };

//   return (
//     <div className="">
//       {/* Time intervals */}
//       {intervals.map((interval, intervalIndex) => (
//         <div key={intervalIndex} className="flex items-center space-x-2">
//           <TimeSelect
//             value={interval.start || ''}
//             onChange={(value) =>
//               handleTimeChange('start', value, intervalIndex)
//             }
//           />
//           <TimeSelect
//             value={interval.end || ''}
//             onChange={(value) => handleTimeChange('end', value, intervalIndex)}
//           />
//           <button
//             onClick={() => removeInterval(intervalIndex)}
//             className="bg-purple-2 border p-1 rounded-md"
//           >
//             <Trash2 color="black" size={18} />
//           </button>
//         </div>
//       ))}

//       {/* Add interval button */}
//       <button
//         onClick={addInterval}
//         className="border rounded-md mt-2 border-gray-300 shadow-sm
//         focus:border-none bg-transparent px-1 py-0.5"
//       >
//         <Plus />
//       </button>

//       {/* Days selection */}
//       <div className="flex flex-wrap gap-2 mt-4">
//         {selectedDays.map((day) => (
//           <div
//             key={day}
//             className="flex border rounded-md
//                    border-gray-300 shadow-sm focus:border-none
//                     bg-transparent px-2 py-0.5 text-[14px]"
//           >
//             <span className="mr-2">{day}</span>
//             <button
//               onClick={() => handleRemoveDay(day)}
//               className="text-gray-400 hover:text-white"
//             >
//               ✕
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Days dropdown */}
//       <div className="relative">
//         <div className="flex gap-2 mt-4 mb-6">
//           <button
//             onClick={() => setShowDayDropdown(!showDayDropdown)}
//             className="button-secondary"
//           >
//             + Add Day
//           </button>

//           {/* Delete group button */}
//           <button
//             onClick={() => onDelete(groupIndex)}
//             className="button-primary"
//           >
//             Delete Group
//           </button>
//         </div>
//         {showDayDropdown && (
//           <div className="absolute mt-1 w-40 bg-white text-black rounded-md shadow-lg z-10">
//             {WeekDays.filter((day) => !selectedDays.includes(day)).map(
//               (day) => (
//                 <button
//                   key={day}
//                   className="block w-full text-left px-4 py-2 text-sm
//                    text-black hover:bg-purple-2"
//                   onClick={() => handleAddDay(day)}
//                 >
//                   {day}
//                 </button>
//               )
//             )}
//           </div>
//         )}
//       </div>

//       {/* Delete group button
//       <button
//         onClick={() => onDelete(groupIndex)}
//         className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
//       >
//         Delete Group
//       </button> */}
//     </div>
//   );
// };

// const Intervals = () => {
//   const [intervalGroups, setIntervalGroups] = useState([
//     {
//       intervals: [{ start: '09:00', end: '17:00' }],
//     },
//   ]);

//   const addIntervalGroup = () => {
//     setIntervalGroups([
//       ...intervalGroups,
//       {
//         intervals: [{ start: '09:00', end: '17:00' }],
//       },
//     ]);
//   };

//   const deleteIntervalGroup = (groupIndex) => {
//     setIntervalGroups(
//       intervalGroups.filter((_, index) => index !== groupIndex)
//     );
//   };

//   const updateIntervals = (groupIndex, newIntervals) => {
//     const newGroups = [...intervalGroups];
//     newGroups[groupIndex] = {
//       ...newGroups[groupIndex],
//       intervals: newIntervals,
//     };
//     setIntervalGroups(newGroups);
//   };

//   return (
//     <div className="">
//       <h3 className="text-subheading-2 font-medium mb-2 ">Intervals</h3>

//       {intervalGroups.map((group, groupIndex) => (
//         <IntervalGroup
//           key={groupIndex}
//           groupIndex={groupIndex}
//           intervals={group.intervals}
//           updateIntervals={updateIntervals}
//           onDelete={deleteIntervalGroup}
//         />
//       ))}

//       <button onClick={addIntervalGroup} className="button-primary">
//         <span className="mr-1">+</span>Add New Interval Group
//       </button>

//       <p className="text-[14px] mt-2 text-gray-500 italic">
//         Select the days and times you will accept appointments. These intervals
//         will repeat each week.
//       </p>
//     </div>
//   );
// };

// export default Intervals;

'use client';

// import { useState, useEffect } from 'react';
// import { Trash2, Plus } from 'lucide-react';
// import axios from 'axios';

// const WeekDays = [
//   'Monday',
//   'Tuesday',
//   'Wednesday',
//   'Thursday',
//   'Friday',
//   'Saturday',
//   'Sunday',
// ];

// // Convert day name to number (0-6, with Monday as 1 and Sunday as 7)
// const dayNameToNumber = (dayName) => {
//   return WeekDays.indexOf(dayName) + 1 === 7
//     ? 0
//     : WeekDays.indexOf(dayName) + 1;
// };

// // Convert day number to name
// const dayNumberToName = (dayNumber) => {
//   // Convert Sunday (0) to index 6 in our array
//   const adjustedIndex = dayNumber === 0 ? 6 : dayNumber - 1;
//   return WeekDays[adjustedIndex];
// };

// const TimeOptions = Array.from({ length: 48 }, (_, i) => {
//   const hour = Math.floor(i / 2);
//   const minute = i % 2 === 0 ? '00' : '30';
//   return `${hour.toString().padStart(2, '0')}:${minute}`;
// });

// const TimeSelect = ({ value, onChange, className }) => (
//   <select
//     value={value || ''}
//     onChange={(e) => onChange(e.target.value)}
//     className={` border border-gray-300
//             shadow-sm focus:border-none bg-transparent pl-2 pr-8
//          py-2 w-28 focus:outline-none
//           focus:ring-0 ${className}`}
//   >
//     {TimeOptions.map((time) => (
//       <option key={time} value={time}>
//         {time}
//       </option>
//     ))}
//   </select>
// );

// const IntervalGroup = ({
//   onDelete,
//   groupIndex,
//   intervals,
//   updateIntervals,
//   selectedDays,
//   updateSelectedDays,
// }) => {
//   const [showDayDropdown, setShowDayDropdown] = useState(false);

//   const handleAddDay = (day) => {
//     if (!selectedDays.includes(day)) {
//       updateSelectedDays(groupIndex, [...selectedDays, day]);
//     }
//     setShowDayDropdown(false);
//   };

//   const handleRemoveDay = (dayToRemove) => {
//     updateSelectedDays(
//       groupIndex,
//       selectedDays.filter((day) => day !== dayToRemove)
//     );
//   };

//   const handleTimeChange = (type, value, intervalIndex) => {
//     const newIntervals = [...intervals];
//     newIntervals[intervalIndex] = {
//       ...newIntervals[intervalIndex],
//       [type]: value,
//     };
//     updateIntervals(groupIndex, newIntervals);
//   };

//   const addInterval = () => {
//     updateIntervals(groupIndex, [
//       ...intervals,
//       { start: '09:00', end: '17:00' },
//     ]);
//   };

//   const removeInterval = (intervalIndex) => {
//     const newIntervals = intervals.filter(
//       (_, index) => index !== intervalIndex
//     );
//     updateIntervals(groupIndex, newIntervals);
//   };

//   return (
//     <div className="mb-6 p-4 border rounded-md">
//       {/* Time intervals */}
//       {intervals.map((interval, intervalIndex) => (
//         <div key={intervalIndex} className="flex items-center space-x-2 mb-2">
//           <TimeSelect
//             value={interval.start || ''}
//             onChange={(value) =>
//               handleTimeChange('start', value, intervalIndex)
//             }
//           />
//           <TimeSelect
//             value={interval.end || ''}
//             onChange={(value) => handleTimeChange('end', value, intervalIndex)}
//           />
//           <button
//             onClick={() => removeInterval(intervalIndex)}
//             className="bg-purple-2 border p-1 rounded-md"
//           >
//             <Trash2 color="black" size={18} />
//           </button>
//         </div>
//       ))}

//       {/* Add interval button */}
//       <button
//         onClick={addInterval}
//         className="border rounded-md mt-2 border-gray-300 shadow-sm
//         focus:border-none bg-transparent px-1 py-0.5"
//       >
//         <Plus />
//       </button>

//       {/* Days selection */}
//       <div className="flex flex-wrap gap-2 mt-4">
//         {selectedDays.map((day) => (
//           <div
//             key={day}
//             className="flex border rounded-md
//                    border-gray-300 shadow-sm focus:border-none
//                     bg-transparent px-2 py-0.5 text-[14px]"
//           >
//             <span className="mr-2">{day}</span>
//             <button
//               onClick={() => handleRemoveDay(day)}
//               className="text-gray-400 hover:text-black"
//             >
//               ✕
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Days dropdown */}
//       <div className="relative">
//         <div className="flex gap-2 mt-4 mb-2">
//           <button
//             onClick={() => setShowDayDropdown(!showDayDropdown)}
//             className="border rounded-md border-gray-300 px-2 py-1 text-sm"
//           >
//             + Add Day
//           </button>

//           {/* Delete group button */}
//           <button
//             onClick={() => onDelete(groupIndex)}
//             className="bg-purple-1 text-white px-2 py-1 rounded-md text-sm"
//           >
//             Delete Group
//           </button>
//         </div>
//         {showDayDropdown && (
//           <div className="absolute mt-1 w-40 bg-white text-black rounded-md shadow-lg z-10">
//             {WeekDays.filter((day) => !selectedDays.includes(day)).map(
//               (day) => (
//                 <button
//                   key={day}
//                   className="block w-full text-left px-4 py-2 text-sm
//                    text-black hover:bg-purple-2"
//                   onClick={() => handleAddDay(day)}
//                 >
//                   {day}
//                 </button>
//               )
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

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
        Select the days and times when you're NOT available for shifts. These
        intervals will repeat each week.
      </p>
    </div>
  );
};

export default Intervals;
