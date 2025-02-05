import React from 'react';
import { Bell, Clock, Calendar } from 'lucide-react';
import { dummyShifts } from '@/helpers/data';

const Notifications = () => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="w-96 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="max-h-[600px] overflow-y-auto">
        {/* Edit notification */}
        <div className="p-4 border-b hover:bg-gray-50 transition-colors">
          <div className="flex items-start gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
                DO
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                <Clock size={14} className="text-blue-700" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">
                <span className="font-medium">diokpa opka</span> edited a shift
                on 28/10/2024
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
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                <Calendar size={14} className="text-blue-700" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">
                <span className="font-medium">diokpa opka</span> didn't accept
                the shift: d shift
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
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {getInitials(shift.employee)}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                  <Calendar size={14} className="text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  <span className="font-medium">{shift.employee}</span> is
                  asking to replace a shift with diokpa
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
        <div className="p-4 bg-gray-50">
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
        </div>
      </div>
    </div>
  );
};

export default Notifications;
