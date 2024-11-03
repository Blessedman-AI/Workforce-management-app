'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { dummyShifts } from '@/utils/data.js';
import Link from 'next/link';
import ReplacementConfirmationModal from './modals/ReplacementConfirmationModal';

const Overview = () => {
  const [formattedShifts, setFormattedShifts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const requestData = {
    requesterInitials: 'DB',
    replacementInitials: 'DO',
    requesterName: 'Diokpa',
    shiftName: 'Testing shift',
    shiftStart: new Date(2024, 9, 24, 9, 0),
    shiftEnd: new Date(2024, 9, 24, 17, 0),
    shiftDuration: '8:00',
  };

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
    }));
    setFormattedShifts(formatted);
  }, []);

  return (
    <div className=" max-w-3xl p-6  bg-purple-2 rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-left ">My schedule</h2>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-purple-1 text-white text-left">
            <th className="p-2 font-semibold ">Date</th>
            <th className="p-2 font-semibold">Time</th>
            <th className="p-2 font-semibold">Shift</th>
            <th className="p-2"></th>
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
              <td className="p-2">
                <Link href="/" className="text-gray-600 hover:text-gray-800">
                  View details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReplacementConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          console.log('Confirmed');
          setIsOpen(false);
        }}
        onDecline={() => {
          console.log('Declined');
          setIsOpen(false);
        }}
        requestData={requestData}
      />
    </div>
  );
};

export default Overview;
