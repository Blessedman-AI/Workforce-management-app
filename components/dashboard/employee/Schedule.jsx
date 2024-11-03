'use client';

import React, { useState, useCallback, useEffect } from 'react';
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

import { dummyShifts } from '@/utils/data.js';
import { CustomEvent } from '@/utils/helpers';
// import { eventPropGetter } from '@/utils/helpers.jsx';
import AvailabilityModal from './modals/AvailabilityModal';
import ShiftDetailsModal from './modals/ShiftDetailsModal';
import '@/components/dashboard/rbc.css';
import ShiftReplacementModal from './modals/ShiftReplacementModal';
import ReplacementRequestSentModal from './modals/ReplacementRequestSentModal';
import UnavailabilityButton from '../buttons/UnavailabilityButton';

// const isAdmin = true;
const localizer = momentLocalizer(moment);

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.MONTH);
  const [unavailabilities, setUnavailabilities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isUser, setIsUser] = useState(false);
  const [shiftDetails, setShiftDetails] = useState(null);
  const [isShiftDetailsModalOpen, setIsShiftDetailsModalOpen] = useState(false);
  const [isReplacementModalOpen, setIsReplacementModalOpen] = useState(false);
  const [
    isReplacementRequestSentModalOpen,
    setIsReplacementRequestSentModalOpen,
  ] = useState(false);
  const [selectedReplacements, setSelectedReplacements] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

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

  useEffect(() => {
    setIsAdmin(false);
  }, []);

  const allEvents = [...dummyShifts, ...unavailabilities];

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
    <div className="scrollbar-custom overflow-x-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-subheading-1">Your schedule Calendar</h2>
        <UnavailabilityButton />
      </div>
      <Calendar
        localizer={localizer}
        events={allEvents}
        selectable
        onSelectSlot={handleSelectSlot}
        components={{
          event: (eventProps) => (
            <CustomEvent {...eventProps} shiftDetails={handleShiftClick} />
          ),
        }}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.MONTH}
        view={currentView}
        onView={handleViewChange}
        date={currentDate}
        onNavigate={handleNavigate}
        views={[Views.DAY, Views.WEEK, Views.MONTH]}
        style={{ height: '80vh', width: '82vw' }}
      />
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
        handleShiftReplacementButtonClick={(event) =>
          handleShiftReplacementButtonClick(event)
        }
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
