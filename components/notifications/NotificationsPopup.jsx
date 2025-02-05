import React from 'react';
import { Calendar, ChevronUp, Clock } from 'lucide-react';

import {
  formatTime,
  formatDate,
  getInitials,
  getTimeAgo,
} from '@/helpers/utils';
import { dummyShifts } from '@/helpers/data';

const NotificationPopup = ({ isOpen, onClose, isAdmin }) => {
  const formattedTime = formatTime();
  const formattedDate = formatDate();
  const initials = getInitials();
  const TimeAgo = getTimeAgo();

  return (
    <div
      className={`scrollbar-custom absolute top-[66px] right-[234px] min-h-[300px] max-h-[88vh]
         bg-purple-2 rounded-lg shadow-lg p-4 w-[500px] overflow-y-auto z-10 ${
           isOpen ? 'block' : 'hidden'
         }`}
    >
      {/* Edit notification */}
      <div className="p-4 border-b hover:bg-gray-50 transition-colors">
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
              DO
            </div>
            <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1">
              <Clock size={14} className="text-white-1" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-800">
              <span className="font-medium">Diokpa okpa</span> edited a shift on
              28/10/2024
            </p>
            <p className="text-sm text-gray-500">from 17:23 - 17:23</p>
            <p className="text-xs text-gray-400 mt-1">28/10 18:24</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">...</button>
        </div>
      </div>

      {/* Rejection notification */}
      <div className="p-4 border-b hover:bg-gray-50 transition-colors">
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
              DO
            </div>
            <div className="absolute -bottom-1 -right-1 bg-yellow-500  rounded-full p-1">
              <Calendar size={14} className="text-white-1" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-800">
              <span className="font-medium">diokpa opka</span> didn&#39;t accept
              the shift: Project A
            </p>
            <p className="text-xs text-gray-400 mt-1">25/10 10:01</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">...</button>
        </div>
      </div>

      {/* Shift replacement notifications from dummy data */}
      {dummyShifts.map((shift, index) => (
        <div
          key={index}
          className="p-4 border-b hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="relative">
              <div
                className="w-10 h-10 bg-teal-600 rounded-full flex items-center
               justify-center text-white font-semibold"
              >
                {getInitials(shift.employee)}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-orange-400 rounded-full p-1">
                <Calendar size={14} className="text-white-1" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">
                <span className="font-medium">{shift.employee}</span> is asking
                to replace a shift with diokpa
              </p>
              <p className="text-sm text-gray-500">
                for the shift {shift.title} on {formatDate(shift.start)}
              </p>
              <p className="text-sm text-gray-500">
                from {formatTime(shift.start)} - {formatTime(shift.end)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {getTimeAgo(shift.start)}
              </p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">...</button>
          </div>
        </div>
      ))}

      {/* Notification preferences */}
      {/* <div className="p-4 bg-gray-50">
        <p className="text-sm text-gray-700 mb-2">
          Do you find this type of notification helpful?
        </p>
        <div className="flex gap-4">
          <button className="text-blue-500 text-sm hover:underline">
            Yes, keep receiving
          </button>
          <button className="text-red-500 text-sm hover:underline">
            No, turn this off
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default NotificationPopup;
