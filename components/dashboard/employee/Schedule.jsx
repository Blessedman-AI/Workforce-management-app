'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { X as XIcon } from 'lucide-react';
import { format } from 'date-fns';

import { dummyShifts } from '@/helpers/data.js';
import { CustomEvent } from '@/helpers/helpers';
import AvailabilityModal from './modals/AvailabilityModal';
import ShiftDetailsModal from './modals/ShiftDetailsModal';
import '@/components/dashboard/rbc.css';
import ShiftReplacementModal from './modals/ShiftReplacementModal';
import ReplacementRequestSentModal from './modals/ReplacementRequestSentModal';
import UnavailabilityButton from '../buttons/UnavailabilityButton';
import { ShiftsForCalendar } from '@/helpers/utils';
import Spinner from '@/components/Spinner';

const localizer = momentLocalizer(moment);

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.MONTH);
  const [unavailabilities, setUnavailabilities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isUser, setIsUser] = useState(false);
  const [shifts, setShifts] = useState(null);
  const [shiftDetails, setShiftDetails] = useState(null);
  const [isShiftDetailsModalOpen, setIsShiftDetailsModalOpen] = useState(false);
  const [isReplacementModalOpen, setIsReplacementModalOpen] = useState(false);
  const [
    isReplacementRequestSentModalOpen,
    setIsReplacementRequestSentModalOpen,
  ] = useState(false);
  const [selectedReplacements, setSelectedReplacements] = useState([]);

  const [availabilityFormData, setAvailabilityFormData] = useState({
    isAllDay: false,
    date: '',
    fromTime: '',
    toTime: '',
    note: '',
    repeat: false,
    repeatStartDate: '',
    repeatEvery: 1,
    repeatOccurrences: 5,
  });

  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const isAuthorised = session?.user?.role === 'admin';

  // console.log('console logshift📩', shifts);
  // console.log('console shiftdetauls', shiftDetails);

  // Helper to determine if we're on mobile
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadShifts = async () => {
      setIsLoading(true);
      try {
        if (status === 'authenticated' && session?.user?.assignedShifts) {
          const formattedShifts = ShiftsForCalendar(
            session.user.assignedShifts
          );
          setShifts(formattedShifts);
        }
      } catch (error) {
        console.error('Error formatting shifts:', error);
        setShifts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadShifts();
  }, [session, status]);
  // console.log('Shifts on schedule comp', shifts);

  const allEvents = [...dummyShifts, ...unavailabilities];
  // console.log('All events', allEvents);

  const handleNavigate = useCallback((newDate) => {
    setCurrentDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView) => {
    setCurrentView(newView);
    console.log('Current view:', newView);
  }, []);

  const handleSelectSlot = useCallback((slotInfo) => {
    setSelectedSlot(slotInfo);

    const startDate = moment(slotInfo.start);
    const endDate = moment(slotInfo.end);

    setAvailabilityFormData({
      // isAllDay: currentView === Views.MONTH,
      isAllDay: false,
      date: format(startDate.toDate(), 'yyyy-MM-dd'),
      startTime: format(startDate.toDate(), 'HH:mm'),
      endTime: format(endDate.toDate(), 'HH:mm'),
      note: '',
      repeat: false,
      repeatStartDate: format(startDate.toDate(), 'yyyy-MM-dd'),
      repeatEvery: 1,
      repeatOccurrences: 5,
    });
    setIsModalOpen(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAvailabilityFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleShiftClick = (event) => {
    setShiftDetails(event);

    setIsShiftDetailsModalOpen(true);
  };

  const handleCloseEventDetailsModaL = useCallback(() => {
    setIsShiftDetailsModalOpen(false);
    setShiftDetails(null);
  }, []);

  const handleShiftReplacementButtonClick = useCallback((event) => {
    setShiftDetails(event);
    setIsShiftDetailsModalOpen(false);
    setIsReplacementModalOpen(true);
  }, []);

  const handleCloseReplacementModal = useCallback(() => {
    setIsReplacementModalOpen(false);
    setShiftDetails(null);
  });

  const handleCloseReplacementRequestSentModal = useCallback(() => {
    setIsReplacementRequestSentModalOpen(false);
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      date,
      startTime,
      endTime,
      isAllDay,
      note,
      repeat,
      repeatStartDate,
      repeatEvery,
      repeatOccurrences,
    } = availabilityFormData;

    const currentDate = moment().startOf('day');
    const selectedDate = moment(date).startOf('day');

    if (selectedDate.isBefore(currentDate)) {
      alert('You cannot set unavailability for dates in the past.');
      return;
    }

    const start = isAllDay
      ? moment(date).startOf('day').toDate()
      : moment(`${date} ${startTime}`).toDate();

    const end = isAllDay
      ? moment(date).endOf('day').toDate()
      : moment(`${date} ${endTime}`).toDate();

    const newUnavailability = {
      start,
      end,
      title: 'Unavailable',
      reason: note,
    };

    if (repeat) {
      // Handle repeating unavailability
      const repeatedUnavailabilities = [];
      for (let i = 0; i < repeatOccurrences; i++) {
        const repeatDate = moment(repeatStartDate).add(i * repeatEvery, 'days');
        repeatedUnavailabilities.push({
          ...newUnavailability,
          start: repeatDate
            .clone()
            .hour(moment(start).hour())
            .minute(moment(start).minute())
            .toDate(),
          end: repeatDate
            .clone()
            .hour(moment(end).hour())
            .minute(moment(end).minute())
            .toDate(),
        });
      }
      setUnavailabilities((prevUnavailabilities) => [
        ...prevUnavailabilities,
        ...repeatedUnavailabilities,
      ]);
    } else {
      setUnavailabilities((prevUnavailabilities) => [
        ...prevUnavailabilities,
        newUnavailability,
      ]);
    }

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
    setAvailabilityFormData({
      isAllDay: false,
      date: '',
      startTime: '',
      endTime: '',
      note: '',
      repeat: false,
      repeatStartDate: '',
      repeatEvery: 1,
      repeatOccurrences: 5,
    });
  };

  return (
    <div className="w-full">
      {/* Header Section - Full width but with padding */}
      <div className="px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 md:pt-8">
          <h2 className="text-subheading-1">Your Schedule Calendar</h2>
          <div className="w-full sm:w-auto">
            <UnavailabilityButton />
          </div>
        </div>
      </div>

      {/* Calendar Section - Horizontal Scroll Container */}
      <div
        className="scrollbar-custom flex justify-center items-center
         overflow-x-hidden overflow-y-hidden "
      >
        {/* <div
      className={`scrollbar-custom overflow-x-hidden ${
        isLoadingShifts ? 'flex justify-center items-center h-[80vh]' : ''
      }`}
    > */}
        {isLoading ? (
          <Spinner />
        ) : (
          <Calendar
            localizer={localizer}
            step={30}
            timeslots={2}
            // events={allEvents}
            events={shifts}
            selectable
            onSelectSlot={handleSelectSlot}
            components={{
              event: (eventProps) => (
                <CustomEvent
                  {...eventProps}
                  shiftDetails={handleShiftClick}
                  isAuthorised={isAuthorised}
                  Views={Views}
                />
              ),
            }}
            startAccessor="start"
            endAccessor="end"
            resourceIdAccessor="id"
            defaultView={Views.MONTH}
            view={currentView}
            onView={handleViewChange}
            date={currentDate}
            onNavigate={handleNavigate}
            views={[Views.DAY, Views.WEEK, Views.MONTH]}
            style={{ height: '80vh', width: '80vw' }}
          />
        )}
      </div>

      {/* Modals */}
      <AvailabilityModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        availabilityFormData={availabilityFormData}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
      />

      <ShiftDetailsModal
        isOpen={isShiftDetailsModalOpen}
        onClose={handleCloseEventDetailsModaL}
        event={shiftDetails}
        handleShiftReplacementButtonClick={handleShiftReplacementButtonClick}
      />

      <ShiftReplacementModal
        isOpen={isReplacementModalOpen}
        onClose={handleCloseReplacementModal}
        event={shiftDetails}
        onSendRequest={(users) => {
          setSelectedReplacements(users);
          setIsReplacementRequestSentModalOpen(true);
        }}
      />

      <ReplacementRequestSentModal
        isOpen={isReplacementRequestSentModalOpen}
        onClose={handleCloseReplacementRequestSentModal}
        selectedUsers={selectedReplacements}
      />
    </div>
  );
};

export default Schedule;
