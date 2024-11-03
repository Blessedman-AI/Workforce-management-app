'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Trash2, X as XIcon } from 'lucide-react';
import Intervals from './Intervals';

const SetUnavailability = ({ isOpen, onClose }) => {
  const [vacationDates, setVacationDates] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleAddVacationDate = () => {
    if (startDate && endDate) {
      setVacationDates([
        ...vacationDates,
        { start: new Date(startDate), end: new Date(endDate) },
      ]);
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleRemoveVacationDate = (index) => {
    const newVacationDates = [...vacationDates];
    newVacationDates.splice(index, 1);
    setVacationDates(newVacationDates);
  };

  return (
    <div
      // onClick={onClose}
      className={`fixed inset-0 bg-black/60 transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } z-[98]`}
    >
      <div
        className={`fixed  top-0 right-0 h-full bg-white overflow-y-auto
           rounded-lg z-[99] shadow-lg transition-transform duration-500 ease-in-out 
        w-[400px] transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-subheading-2 ">Set unavailability</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
            aria-label="Close preview"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Start and end date */}
        <div className="px-4 border-b py-6">
          <div className="  flex space-x-4">
            <div>
              <label
                htmlFor="start-date"
                className="block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                value={startDate || ''}
                onChange={handleStartDateChange}
                className="mt-1 block w-full border rounded-md border-gray-300 
            shadow-sm focus:border-none bg-transparent px-2 py-0.5"
              />
            </div>
            <div>
              <>
                <label
                  htmlFor="end-date"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="end-date"
                  value={endDate || ''}
                  onChange={handleEndDateChange}
                  className="mt-1 block w-full border rounded-md border-gray-300 
            shadow-sm focus:border-none bg-transparent px-2 py-0.5"
                />
              </>
            </div>
          </div>
          <p className="text-[14px] mt-2 text-gray-500 italic">
            Allow selection only between these dates
          </p>
        </div>

        {/* Vacation and holidays */}
        <div className="px-4 border-b py-6">
          <div className="mb-2">
            <h2 className="text-subheading-2">Vacation and Holidays</h2>
          </div>
          <div className=" flex space-x-4">
            <div>
              <label
                htmlFor="start-date"
                className="block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>
              <input
                type="date"
                id="vacation-start-date"
                value={startDate || ''}
                onChange={handleStartDateChange}
                className="mt-1 block w-full border rounded-md border-gray-300 
            shadow-sm focus:border-none bg-transparent px-2 py-0.5"
              />
            </div>
            <div>
              <>
                <label
                  htmlFor="end-date"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="vacation-end-date"
                  value={endDate || ''}
                  onChange={handleEndDateChange}
                  className="mt-1 block w-full border rounded-md
                   border-gray-300 shadow-sm focus:border-none bg-transparent px-2 py-0.5"
                />
              </>
            </div>
          </div>

          <div className="mt-2">
            <button
              type="button"
              onClick={handleAddVacationDate}
              className="inline-flex items-center rounded-md border
           bg-transparent px-4 py-2  font-medium  shadow-sm
            focus:outline-none border-gray-300 hover:bg-gray-100 mt-1"
            >
              + Add New Vacation Date
            </button>
            <ul className="space-y-2 mt-3">
              {vacationDates.map((vacation, index) => (
                <li key={index} className="flex items-center gap-2 ">
                  <div
                    className="rounded-md min-w-[235px]
                   bg-gray-100 px-4 py-2 "
                  >
                    {format(vacation.start, 'MMM d, yyyy')} -{' '}
                    {format(vacation.end, 'MMM d, yyyy')}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVacationDate(index)}
                    className="bg-purple-1 border p-1 rounded-md"
                  >
                    <Trash2 color="white" size={20} />
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-[14px] mt-2 text-gray-500 italic">
              Block out dates on your calendar so that shifts can't be assigned
              to you on those days.
            </p>
          </div>
        </div>
        <div className="px-4 py-6 mb-2">
          <Intervals />
        </div>
      </div>
    </div>
  );
};

export default SetUnavailability;
