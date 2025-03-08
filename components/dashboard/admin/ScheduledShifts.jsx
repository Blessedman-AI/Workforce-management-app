'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { dummyShifts } from '@/helpers/data.js';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { getUser } from '@/helpers/fetchers';
import Spinner from '@/components/Spinner';
import CircularSpinner from '@/components/Spinners';

const ScheduledShifts = () => {
  const [formattedShifts, setFormattedShifts] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [shifts, setShifts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingShifts, setIsLoadingShifts] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userdetails = await getUser(); // Add await here
        setUser(userdetails);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [status]);

  // console.log('🔥', user);
  // console.log('shifts are 👋:', shifts);

  const fetchShifts = async () => {
    try {
      setIsLoadingShifts(true);
      const response = await axios.get('/api/shifts');
      const shiftsData = response.data;
      // console.log('Shift data:', shiftsData);

      const formattedShifts = shiftsData.map((shift) => ({
        ...shift,
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

        title: shift.shiftType,
        assignedTo: `${shift.assignedToUser.firstName}
         ${shift.assignedToUser.lastName}`,
      }));

      setShifts(formattedShifts);
    } catch (error) {
      console.error('Error fetching shifts:', error);
    } finally {
      setIsLoadingShifts(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  if (isLoadingShifts) {
    return (
      <div className="w-full p-6  ">
        <CircularSpinner size={12} />;
      </div>
    );
  }

  return (
    <>
      {shifts && (
        <div className="w-full p-6 bg-purple-2 rounded-lg shadow">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-left">
                Scheduled Shifts
              </h2>
              <select
                className="block px-4 py-2 border border-gray-300 
                rounded-md bg-purple-2 text-gray-700 focus:outline-none 
                hover:bg-gray-100"
                name="schedule-period"
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-purple-1 text-white text-left">
                <th className="p-2 font-semibold rounded-l-md">Date</th>
                <th className="p-2 font-semibold">Time</th>
                <th className="p-2 font-semibold">Shift</th>
                <th className="p-2 font-semibold rounded-r-md">Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {shifts?.map((shift, index) => (
                <tr
                  key={index}
                  className="border-b text-left hover:bg-gray-200 cursor-pointer"
                >
                  <td className="p-2">{shift.date}</td>
                  <td className="p-2">{shift.time}</td>
                  <td className="p-2">{shift.title}</td>
                  <td className="p-2">{shift.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ScheduledShifts;
