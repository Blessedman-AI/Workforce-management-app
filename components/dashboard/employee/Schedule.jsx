'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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

import { CustomEvent } from '@/helpers/helpers';
import AvailabilityModal from './modals/AvailabilityModal';
import ShiftDetailsModal from './modals/ShiftDetailsModal';
import '@/components/dashboard/rbc.css';
import ShiftReplacementModal from './modals/ShiftReplacementModal';
import ReplacementRequestSentModal from './modals/ReplacementRequestSentModal';
import UnavailabilityButton from '../buttons/UnavailabilityButton';
import {
  cancelShiftExchange,
  fetchShifts,
  fetchUnavailability,
  ShiftsForCalendar,
} from '@/helpers/utils';
import toast from 'react-hot-toast';
import CircularSpinner from '@/components/Spinners';

const localizer = momentLocalizer(moment);

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.MONTH);
  const [unavailabilities, setUnavailabilities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  // const [isUser, setIsUser] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [shiftDetails, setShiftDetails] = useState(null);
  const [unavailabilityDetails, setUnavailabilityDetails] = useState(null);
  const [isShiftDetailsModalOpen, setIsShiftDetailsModalOpen] = useState(false);
  const [isReplacementModalOpen, setIsReplacementModalOpen] = useState(false);
  const [isCancellingExchangeRequest, setIsCancellingExchangeRequest] =
    useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

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

  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const isUser = session?.user?.role === 'employee';
  const requestId = searchParams.get('requestId');
  // console.log('requestId🥇👿', requestId);
  console.log('console logshift📩', shifts);
  // console.log('console shiftdetails', shiftDetails);
  // console.log('ASsignedShifts✅❌', session?.user?.assignedShifts);
  // console.log('sessions is', session);

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

  const loadShifts = async () => {
    setIsLoading(true);
    try {
      const getShifts = await fetchShifts();
      // if (getShifts) {
      // console.log('getShifts🥇🪗', getShifts);
      // }
      const formattedShifts = getShifts ? ShiftsForCalendar(getShifts) : [];
      setShifts(formattedShifts);
    } catch (error) {
      console.error('Error formatting shifts:', error);
      setShifts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnavailabilities = async () => {
    try {
      const unavailabilityData = await fetchUnavailability();
      setUnavailabilities(unavailabilityData);
    } catch (error) {
      console.error('Error loading unavailabilities:', error);
      setUnavailabilities([]);
    }
  };

  useEffect(() => {
    loadShifts();
    loadUnavailabilities();
    // console.log('shifts loaded!⚔️🔫');
  }, [status]);

  // console.log('loading changed', isLoading);
  // console.log('Shifts on schedule comp🔥', shifts);
  // console.log('Unavailabilities🏀', unavailabilities);

  const handleCancelExchangeRequest = async (shifts) => {
    setIsCancellingExchangeRequest(true);
    const loadingToastId = toast.loading('Cancelling request...');
    try {
      const exchangeRequest = await cancelShiftExchange(
        shifts.exchangeRequestId
      );
      console.log('exchange request', exchangeRequest);

      toast.success('Request cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling request', error);
      setError(error);
      toast.error(error.message || 'Failed to cancel request');
    } finally {
      setIsCancellingExchangeRequest(false);
      setIsShiftDetailsModalOpen(false);
      setShiftDetails(null);
      toast.dismiss(loadingToastId);
      await loadShifts();
    }
  };

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleViewChange = (newView) => {
    setCurrentView(newView);
    // console.log('Current view:', newView);
  };

  const handleSelectSlot = (slotInfo) => {
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
  };

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

  const handleUnavailabilityClick = (event) => {
    setUnavailabilityDetails(event);
    setIsShiftDetailsModalOpen(true);
  };

  const handleCloseEventDetailsModaL = () => {
    setIsShiftDetailsModalOpen(false);
    setShiftDetails(null);
  };

  const handleShiftReplacementButtonClick = (event) => {
    setShiftDetails(event);
    setIsShiftDetailsModalOpen(false);
    setIsReplacementModalOpen(true);
  };

  // useEffect(() => {
  //   if (shiftDetails) {
  //     console.log('shiftDetails updated:🔥', shiftDetails);
  //   }
  // }, [shiftDetails]);

  const handleCloseReplacementModal = () => {
    setIsReplacementModalOpen(false);
    setShiftDetails(null);
    // loadShifts();
  };

  const handleCloseReplacementRequestSentModal = () => {
    setIsReplacementRequestSentModalOpen(false);
  };

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

  if (isLoading || !shifts) {
    return (
      <div
        className="relative min-h-[80vh] w-full flex justify-center
     items-center bg-white/50"
      >
        <CircularSpinner />
      </div>
    );
  }

  return (
    <>
      {shifts && (
        <div className="w-full flex flex-col justify-center">
          <div
            className="flex items-center justify-between  gap-4 pt-4
              py-8 px-4"
          >
            <div className="w-full flex items-center justify-between">
              <h2 className="text-subheading-1">Your Schedule Calendar</h2>
              {/* <div className="w-full sm:w-auto"> </div> */}
              <UnavailabilityButton />
            </div>
          </div>

          {/* Calendar Section - Horizontal Scroll Container */}
          <div
            className="scrollbar-custom flex justify-center items-center
         overflow-x-hidden overflow-y-hidden "
          >
            <Calendar
              localizer={localizer}
              step={30}
              timeslots={2}
              // events={allEvents}
              events={[...shifts, ...unavailabilities]}
              // events={shifts}
              selectable
              onSelectSlot={handleSelectSlot}
              components={{
                event: (eventProps) => (
                  <CustomEvent
                    {...eventProps}
                    shiftDetails={handleShiftClick}
                    unavailabilityDetails={handleUnavailabilityClick}
                    isUser={isUser}
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
            handleShiftReplacementButtonClick={
              handleShiftReplacementButtonClick
            }
            handleCancelExchangeRequest={handleCancelExchangeRequest}
          />

          <ShiftReplacementModal
            loadShifts={loadShifts}
            isOpen={isReplacementModalOpen}
            onClose={handleCloseReplacementModal}
            shiftId={shiftDetails?.shiftId} // Use shiftDetails instead of event
            shiftTitle={shiftDetails?.title} // Use shiftDetails instead of event
          />

          <ReplacementRequestSentModal
            isOpen={isReplacementRequestSentModalOpen}
            onClose={handleCloseReplacementRequestSentModal}
            selectedUsers={selectedReplacements}
          />
        </div>
      )}
    </>
  );
};

export default Schedule;
