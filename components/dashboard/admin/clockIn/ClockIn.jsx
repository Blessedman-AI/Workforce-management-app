'use client';

import React, { useState } from 'react';
import { Timer } from 'lucide-react';
import PendingShiftEditRequestsBtn from '../../buttons/PendingShiftEditRequestsBtn';
import { requests } from '@/helpers/data';
import { employees } from '@/helpers/data';

const ClockIn = () => {
  const [shiftEditRequestsData, setShiftEditRequestsData] = useState(requests);
  const emloyeeList = employees;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full">
      <div className="flex bg-purple-2 p-6 rounded-lg justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Timer className="text-purple-1 w-8 h-8" />
          <h1 className="text-subheading-1 text-gray-700">Time Clock</h1>
        </div>
        <div>
          <PendingShiftEditRequestsBtn
            count={requests.length}
            requests={shiftEditRequestsData}
          >
            Pending requests
          </PendingShiftEditRequestsBtn>
        </div>
      </div>

      <div className="mb-6 flex justify-center">
        <span className="text-purple-1 text-[20px]">1</span>
        <span className="text-gray-500 text-[20px]">
          /3 employees clocked in today
        </span>
      </div>

      <table className="w-full">
        <thead>
          <tr className="flex justify-between bg-purple-2 border-b py-4 px-4">
            <th className="text-left font-medium text-gray-700 flex-1">
              First name
            </th>
            <th className="text-left font-medium text-gray-700 flex-1">Job</th>
            <th className="text-left font-medium text-gray-700 flex-1">
              Clock in
            </th>
            <th className="text-left font-medium text-gray-700 flex-1">
              Clock out
            </th>
            <th className="text-left font-medium text-gray-700 flex-1">
              Total hours
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr
              key={employee.id}
              className="flex justify-between border-b py-4 px-4"
            >
              <td className="flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full ${employee.color} flex items-center justify-center text-white`}
                  >
                    {employee.initials}
                  </div>
                  {employee.firstName}
                </div>
              </td>
              <td className="flex-1">
                {employee.job === 'Project A' ? (
                  <span className="bg-teal-400 text-white px-3 py-1 rounded-full text-sm">
                    {employee.job}
                  </span>
                ) : (
                  employee.job
                )}
              </td>
              <td className="flex-1">{employee.clockIn}</td>
              <td className="flex-1">{employee.clockOut}</td>
              <td className="flex-1">{employee.totalHours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClockIn;
