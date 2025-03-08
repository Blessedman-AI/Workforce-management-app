'use client';

import React, { useState, useEffect } from 'react';
import { XIcon, Trash2 } from 'lucide-react';
import moment from 'moment';
import axios from 'axios';
import Intervals from './Intervals';
import { createVacation, removeVacation } from '@/helpers/utils';
import toast from 'react-hot-toast';

const Unavailability = ({ isOpen, onClose, onUnavailabilityUpdated }) => {
  const [vacationDates, setVacationDates] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isOpen) {
          const vacations = await fetchUnavailability();
          setVacationDates(vacations);
          console.log('vacations are✈️🚢🌴', vacationDates);
        }
      } catch (error) {
        setError(error);
        console.log('Error is', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  const fetchUnavailability = async () => {
    const response = await axios.get('/api/unavailability');
    // Filter for vacation type unavailabilities
    return response.data.unavailabilities
      .filter((item) => item.type === 'VACATION')
      .map((vacation) => ({
        id: vacation.id,
        start: vacation.startDate,
        end: vacation.endDate,
        // start: moment(vacation.startDate),
        // end: moment(vacation.endDate),
      }));
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleAddVacationDate = async () => {
    if (startDate && endDate) {
      const toastId = toast.loading('Adding vacation date...');
      try {
        setLoading(true);
        const newVacation = await createVacation(startDate, endDate);
        console.log('🩸🩸', newVacation);

        setVacationDates([
          ...vacationDates,
          {
            id: newVacation.id,
            start: startDate,
            end: endDate,
            // start: moment.utc(startDate).startOf('day'),
            // end: moment.utc(endDate),
            // end: moment.utc(endDate).startOf('day'),
          },
        ]);

        setStartDate(null);
        setEndDate(null);
        setError(null);

        // Notify parent component
        if (onUnavailabilityUpdated) {
          onUnavailabilityUpdated();
        }
        toast.success('Vacation date added successfully!');
      } catch (err) {
        // toast.error(err);
        // setError(err);
        console.error('Error 🩸🏀🌴', err?.response);
      } finally {
        toast.dismiss(toastId);
        setLoading(false);
      }
    }
  };

  const handleRemoveVacationDate = async (index) => {
    const dateToRemove = vacationDates[index];
    const toastId = toast.loading('Deleting vacation date...');

    try {
      setLoading(true);
      // Delete the vacation date via API
      await removeVacation(dateToRemove.id);

      // Update local state
      const newVacationDates = [...vacationDates];
      newVacationDates.splice(index, 1);
      setVacationDates(newVacationDates);
      setError(null);

      // Notify parent component about the update
      if (onUnavailabilityUpdated) {
        onUnavailabilityUpdated();
      }
      toast.success('Vacation date deleted!');
    } catch (err) {
      console.error('Error removing vacation date:', err);
      setError('Failed to remove vacation date');
      toast.error(err);
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  };

  const saveRestrictedHours = async (intervals) => {
    try {
      // First, delete existing RESTRICTED_HOURS unavailability
      const existingResponse = await axios.get('/api/unavailability');
      const restrictedHours = existingResponse.data.unavailabilities.filter(
        (item) => item.type === 'RESTRICTED_HOURS'
      );

      // Delete existing entries
      for (const entry of restrictedHours) {
        await axios.delete(`/api/unavailability/${entry.id}`);
      }

      // Create new unavailability with provided intervals
      await axios.post('/api/unavailability', {
        startDate: new Date().toISOString(),
        endDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ).toISOString(),
        type: 'RESTRICTED_HOURS',
        intervals: intervals,
      });

      return true;
    } catch (error) {
      console.error('Error saving restricted hours:', error);
      throw error;
    }
  };

  const handleSaveIntervals = async (intervals) => {
    try {
      setLoading(true);

      await saveRestrictedHours(intervals);

      setError(null);

      // Notify parent component about the update
      if (onUnavailabilityUpdated) {
        onUnavailabilityUpdated();
      }
    } catch (err) {
      console.error('Error saving intervals:', err);
      setError('Failed to save intervals');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/60 transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } z-[98]`}
    >
      <div
        className={`fixed top-0 right-0 h-full bg-white-1 overflow-y-auto
           rounded-lg z-[99] shadow-lg transition-transform duration-[600] ease-in-out 
        w-[400px] transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-purple-3 p-4 border-b m-0 flex justify-between items-center">
          <h2 className="text-subheading-2 text-white-1 ">
            Set unavailability
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full cursor-pointer"
            aria-label="Close preview"
          >
            <XIcon className="h-5 w-5 text-white-1 hover:text-grey-1" />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
            {error}
          </div>
        )}

        {/* Start and end date */}
        {/* <div className="px-4 border-b py-6">
          <div className="flex space-x-4">
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
        </div> */}

        {/* Vacation and holidays */}
        <div className="px-4 border-b py-6">
          <div className="mb-2">
            <h2 className="text-subheading-2">Vacation and Holidays</h2>
          </div>
          <div className="flex space-x-4">
            <div>
              <label
                htmlFor="vacation-start-date"
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
                  htmlFor="vacation-end-date"
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

          <div className="mt-4">
            <button
              type="button"
              onClick={handleAddVacationDate}
              className={`plain-button-1
            ${loading || !startDate || !endDate ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Add Vacation Date
            </button>
            <ul className="space-y-2 mt-3">
              {vacationDates.map((vacation, index) => (
                <li key={index} className="flex items-center gap-2 ">
                  <div
                    className="rounded-md min-w-[235px]
                   bg-gray-100 px-4 py-2 "
                  >
                    {/* {moment(vacation.start).format('MMM d, yyyy')} -{' '}
                    {moment(vacation.end).format('MMM d, yyyy')} */}
                    {moment.utc(vacation.start).format('MMM D, YYYY')} -{' '}
                    {moment.utc(vacation.end).format('MMM D, YYYY')}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVacationDate(index)}
                    disabled={loading}
                    className={`bg-purple-1 border p-1 rounded-md
                       ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Trash2 color="white" size={20} />
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-[14px] mt-2 text-gray-500 italic">
              {
                " Block out dates on your calendar so that shifts can't be assigned to you on those days."
              }
            </p>
          </div>
        </div>
        <div className="px-4 py-6 mb-2">
          <Intervals onSave={handleSaveIntervals} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Unavailability;
