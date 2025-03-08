'use client';

import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/components/dashboard/rbc.css';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { CustomEvent } from '@/helpers/helpers';
import ScheduleModal from './ScheduleModal';
import { getUsers } from '@/helpers/fetchers';
import Spinner from '@/components/Spinner';
import CustomMonthCell from '@/components/CustomMonthCell';
import CircularSpinner from '@/components/Spinners';
const localizer = momentLocalizer(moment);

const TaskSchedule = () => {
  const [shifts, setShift] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.DAY);
  const [editingShift, setEditingShift] = useState(null);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(null);
  const [isLoadingShifts, setIsLoadingShifts] = useState(null);
  const [isDeletingShift, setIsDeletingShift] = useState(null);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const { data: session, status } = useSession();
  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    date: '',
    employee: '',
    shiftType: '',
    startTime: '',
    endTime: '',
    break: '',
    description: '',
    repeatShift: false,
    repeatFrequency: 'day',
    sendNotification: false,
  });

  const currentHour = new Date();
  currentHour.setMinutes(0, 0, 0); // Reset minutes, seconds, milliseconds

  useEffect(() => {
    if (['owner', 'admin'].includes(session?.user?.role)) {
      setIsAdmin(true);
    }

    if (session?.user?.role === 'employee') {
      setIsUser(true);
    }
  }, [session]);
  // console.log('session🔫', session);

  //fetch employees and store in state
  useEffect(() => {
    const getEmployees = async () => {
      try {
        setIsLoadingEmployees(true);
        const employeeList = await getUsers('employee');
        setEmployees(employeeList);
      } catch (err) {
        setError(err);
        setIsLoadingEmployees(false);
      } finally {
        setIsLoadingEmployees(false);
      }
    };
    getEmployees();
  }, []);

  // if (employees) {handleSubmit
  //   console.log('list of employees😒', employees);
  // }3

  const fetchShifts = async () => {
    try {
      setIsLoadingShifts(true);
      const response = await axios.get('/api/shifts'); // Axios GET request
      const shiftsData = response.data; // Axios stores data in `response.data`

      // Transform shifts to match react-big-calendar format
      const formattedShifts = shiftsData.map((shift) => ({
        ...shift,
        start: new Date(shift.start),
        end: new Date(shift.end),
        title: `${shift.assignedToUser.firstName} - ${shift.shiftType}`,
        resourceId: shift.assignedToUserId,
        assignedToUserId: shift.assignedToUser.id,
        break: shift.break,
        description: shift.description,
        repeatShift: shift.repeatShift,
        repeatFrequency: shift.repeatFrequency,
        sendNotification: shift.sendNotification,
        shiftType: shift.shiftType,
      }));

      setShift(formattedShifts);
    } catch (error) {
      console.error('Error fetching shifts:', error);
    } finally {
      setIsLoadingShifts(false);
    }
  };

  //call fetchShifts on component mount
  useEffect(() => {
    fetchShifts();
  }, []);

  const handleSelectSlot = useCallback(
    (slotInfo) => {
      const selectedResource = employees.find(
        (item) => item.id === slotInfo.resourceId
      );

      setSelectedSlot(slotInfo);

      let startDate = moment(slotInfo.start);
      let endDate = moment(slotInfo.end);

      if (currentView === Views.MONTH || currentView === Views.WEEK) {
        // For month and week views, set the time to the current time
        const now = moment();
        startDate = moment(startDate).set({
          hour: now.hour(),
          minute: now.minute(),
          second: 0,
          millisecond: 0,
        });
        endDate = moment(startDate).add(1, 'hour');
      }

      setFormData({
        ...formData,
        date: startDate.format('YYYY-MM-DD'),
        startTime: startDate.format('HH:mm'),
        endTime: endDate.format('HH:mm'),
        employee: selectedResource ? selectedResource.id : '',
        shiftType: getShiftType(startDate.toDate()),
      });
      setIsModalOpen(true);
    },
    [formData, employees, currentView]
  );

  // console.log('Form data🔴:', formData);

  const getShiftType = (startTime) => {
    const hour = startTime.getHours();
    if (hour >= 5 && hour < 12) return 'Morning Shift';
    if (hour >= 12 && hour < 17) return 'Afternoon Shift';
    if (hour >= 17 && hour < 22) return 'Evening Shift';
    return 'Night Shift';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading(
      editingShift ? 'Editing shift...' : 'Creating Shift...'
    );

    const now = moment();
    const startTime = moment(
      `${formData.date} ${formData.startTime}`,
      'YYYY-MM-DD HH:mm'
    );
    const endTime = moment(
      `${formData.date} ${formData.endTime}`,
      'YYYY-MM-DD HH:mm'
    );

    if (startTime.isBefore(now)) {
      // alert('The start time cannot be in the past.');
      toast.error('The start time cannot be in the past.');
      toast.dismiss(toastId);
      return; // Prevent form submission
    }
    if (endTime.isBefore(now)) {
      // alert('The end time cannot be in the past.');
      toast.error('The end time cannot be in the past.');
      toast.dismiss(toastId);
      return; // Prevent form submission
    }

    if (startTime.isAfter(endTime)) {
      // alert('Start time must be before end time.');
      toast.error('Start time must be before end time.');
      toast.dismiss(toastId);
      return;
    }
    try {
      // Determine if this is a new shift or an existing shift to update
      const shiftData = {
        date: formData.date,
        employee: formData.employee,
        shiftType: formData.shiftType,
        startTime: formData.startTime,
        endTime: formData.endTime,
        breaks: parseInt(formData.break),
        description: formData.description,
        repeatShift: Boolean(formData.repeatShift),
        repeatFrequency: formData.repeatFrequency,
        sendNotification: Boolean(formData.sendNotification),
      };

      console.log('Sending shift data:', shiftData);
      console.log('Send notification', formData.sendNotification);

      // If editing an existing shift
      if (editingShift) {
        console.log('Sending update data:', {
          id: editingShift.id,
          ...shiftData,
        });
        const response = await axios.put('/api/shifts', {
          id: editingShift.id,
          ...shiftData,
        });
        const updatedShift = response.data;

        // Update local state
        setShift((prevShifts) =>
          prevShifts.map((shift) =>
            shift.id === updatedShift.id
              ? {
                  // ...shift,
                  ...updatedShift, // Keep all fields from the response
                  start: new Date(updatedShift.start),
                  end: new Date(updatedShift.end),
                  title: `${updatedShift.assignedToUser.firstName} ${updatedShift.assignedToUser.lastName}`,
                  resourceId: updatedShift.assignedToUserId,
                  assignedToUserId: updatedShift.assignedToUser.id,
                  break: updatedShift.break,
                  description: updatedShift.description,
                  repeatShift: updatedShift.repeatShift,
                  repeatFrequency: updatedShift.repeatFrequency,
                  sendNotification: updatedShift.sendNotification,
                  shiftType: updatedShift.shiftType,
                }
              : shift
          )
        );
      } else {
        // Create a new shift
        const response = await axios.post('/api/shifts', shiftData);
        console.log('response:' + response);

        const newShift = await response.data;
        setShift((prevShifts) => [
          ...prevShifts,
          {
            ...newShift,
            start: new Date(newShift.start),
            end: new Date(newShift.end),
            title: `${newShift.assignedToUser.firstName} ${newShift.assignedToUser.lastName}`,
            assignedTo: formData.employee,
            resourceId: newShift.assignedToUserId,

            createdByName: `${newShift.createdByUser.firstName} ${newShift.createdByUser.lastName}`,
            createdByEmail: newShift.createdByUser.email,
          },
        ]);
      }

      handleCloseModal();
      toast.success(
        editingShift
          ? 'Shift edited successfully!'
          : 'Shift created successfully!'
      );
    } catch (error) {
      // toast.error(error.message);
      toast.error(error.response.data.error || 'Failed to save shift');
      console.error('Shift submission error:', error);

      // Add more detailed error logging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      } else {
        toast.error('Failed to save shift. Please try again.');
      }
    } finally {
      toast.dismiss(toastId);
    }
  };

  // Edit handler
  const handleEdit = (shift, e) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }

    // Ensure shift.start and shift.end are Date objects
    const startDate =
      shift.start instanceof Date ? shift.start : new Date(shift.start);
    const endDate = shift.end instanceof Date ? shift.end : new Date(shift.end);

    // Check if the dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      // console.error('Invalid date in shift:', shift);
      return; // Exit the function if dates are invalid
    }

    setEditingShift(shift);
    console.log(' shift', shift);
    setFormData({
      date: moment(startDate).format('YYYY-MM-DD'),
      employee: shift.resourceId || shift.assignedToUserId,
      shiftType: shift.shiftType,
      startTime: moment(startDate).format('HH:mm'),
      endTime: moment(endDate).format('HH:mm'),
      break: shift.break?.toString() || '',
      description: shift.description || '',
      repeatShift: Boolean(shift.repeatShift),
      repeatFrequency: shift.repeatFrequency || 'day',
      sendNotification: shift.sendNotification,
    });
    setIsModalOpen(true);
  };

  // Add a delete handler
  const handleDelete = async (shiftToDelete) => {
    try {
      setIsDeletingShift(true);
      const response = await axios.delete(`/api/shifts?id=${shiftToDelete.id}`);
      console.log(response.data.message);

      setShift((prevShifts) =>
        prevShifts.filter((shift) => shift.id !== shiftToDelete.id)
      );
      toast.success('Shift deleted successfully!');
    } catch (error) {
      console.error('Shift deletion error:', error);
      toast.error('Failed to delete shift. Please try again.');
    } finally {
      setIsDeletingShift(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
    setEditingShift(null);
    setFormData({
      date: '',
      employee: '',
      shiftType: '',
      startTime: '',
      endTime: '',
      break: '',
      description: '',
      repeatShift: false,
      repeatFrequency: 'day',
      sendNotification: false,
    });
  };

  const handleNavigate = useCallback((newDate) => {
    setCurrentDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView) => {
    setCurrentView(newView);
    // console.log('Current view: 😍', newView);
    // console.log('Events after view change:', shifts);
  }, []);

  useEffect(() => {
    if (formData.startTime) {
      const [hours, minutes] = formData.startTime.split(':');
      const startDate = new Date(formData.date);
      startDate.setHours(parseInt(hours), parseInt(minutes));
      setFormData((prev) => ({
        ...prev,
        shiftType: getShiftType(startDate),
      }));
    }
  }, [formData.date, formData.startTime]);

  return (
    <div
      className=" scrollbar-custom
   flex justify-center items-center h-[100vh] overflow-x-hidden
    "
    >
      {/* <div
      className={`scrollbar-custom overflow-x-hidden ${
        isLoadingShifts ? 'flex justify-center items-center h-[80vh]' : ''
      }`}
    > */}
      {isLoadingShifts ? (
        <CircularSpinner />
      ) : (
        <Calendar
          step={30}
          timeslots={2}
          localizer={localizer}
          events={shifts}
          min={currentHour}
          // selectable={canManageShifts}
          selectable
          components={{
            event: (eventProps) => (
              <CustomEvent
                {...eventProps}
                onEdit={(e) => handleEdit(eventProps.event, e)}
                onDelete={handleDelete}
                isAdmin={isAdmin}
                isUser={isUser}
                isDeletingShift={isDeletingShift}
                Views={Views}
                currentView={currentView}
              />
            ),
          }}
          startAccessor={(event) => moment(event.start).toDate()}
          endAccessor={(event) => moment(event.end).toDate()}
          view={currentView}
          onView={handleViewChange}
          views={[Views.DAY, Views.WEEK, Views.MONTH]}
          resourceIdAccessor="id"
          resourceTitleAccessor="title"
          onSelectSlot={handleSelectSlot}
          date={currentDate}
          onNavigate={handleNavigate}
          style={{ height: '80vh', width: '80vw' }}
        />
      )}

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        employeeList={employees}
        repeatFrequency={formData.repeatFrequency}
      />
    </div>
  );
};

export default TaskSchedule;
