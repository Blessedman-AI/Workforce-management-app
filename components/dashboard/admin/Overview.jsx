'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { dummyShifts } from '@/utils/data.js';
import Link from 'next/link';

const Overview = () => {
  const [formattedShifts, setFormattedShifts] = useState([]);

  useEffect(() => {
    const formatted = dummyShifts.map((shift) => ({
      date: new Date(shift.start).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      time: `${new Date(shift.start).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })} - ${new Date(shift.end).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })}`,
      title: shift.title,
      assignedTo: shift.employee,
    }));
    setFormattedShifts(formatted);
  }, []);

  return (
    <div className="max-w-3xl p-6 bg-purple-2 rounded-lg shadow">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-left ">Scheduled Shifts</h2>
          <select
            className='block  px-4 py-2 border border-gray-300 
            rounded-md bg-purple-2 text-gray-700 focus:outline-none 
           
            hover:bg-gray-100"'
            name="schedule-period"
          >
            <option value="day">Day</option>
            <option value="weak">Week</option>
            <option value="year">Month</option>
          </select>
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-purple-1 text-white text-left ">
            <th className="p-2 font-semibold rounded-l-md ">Date</th>
            <th className="p-2 font-semibold">Time</th>
            <th className="p-2 font-semibold">Shift</th>
            <th className="p-2 font-semibold rounded-r-md">Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {formattedShifts.map((shift, index) => (
            <tr
              key={index}
              className="border-b text-left hover:bg-grey-2
               cursor-pointer"
            >
              <td className="p-2 ">{shift.date}</td>
              <td className="p-2">{shift.time}</td>
              <td className="p-2">{shift.title}</td>
              <td className="p-2"> {shift.assignedTo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Overview;
