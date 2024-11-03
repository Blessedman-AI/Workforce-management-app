'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse } from 'date-fns';

import '@/components/dashboard/rbc.css';
import { employees } from '@/utils/data';
import ScheduleModal from './ScheduleModal';
// import HoverCustomEvent from '@/components/dashboard/HoverCustomEvent';
import { CustomEvent } from '@/utils/helpers';

const admin = true;
const localizer = momentLocalizer(moment);

const TaskSchedule = () => {
  const [shifts, setShift] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.DAY);
  const [editingShift, setEditingShift] = useState(null);
  const [repeatFrequency, setRepeatFrequency] = useState('weekly');
  const [isAdmin, setIsAdmin] = useState(false);

  const [formData, setFormData] = useState({
    date: '',
    employee: '',
    shiftType: '',
    startTime: '',
    endTime: '',
    break: '',
    description: '',
    repeatShift: false,
    repeatFrequency: '',
    sendNotification: false,
  });

  useEffect(() => {
    setIsAdmin(true);
  }, []);

  const employeeList = employees();

  const handleSelectSlot = useCallback(
    (slotInfo) => {
      const selectedResource = employeeList.find(
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
        employee: selectedResource ? selectedResource.title : '',
        shiftType: getShiftName(startDate.toDate()),
      });
      setIsModalOpen(true);
    },
    [formData, employeeList, currentView]
  );

  const getShiftName = (startTime) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();

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
      alert('The start time cannot be in the past.');
      return; // Prevent form submission
    }
    if (endTime.isBefore(now)) {
      alert('The end time cannot be in the past.');
      return; // Prevent form submission
    }

    if (!formData.employee) {
      alert('Please select an employee.');
      return; // Prevent form submission
    }

    if (startTime.isAfter(endTime)) {
      alert('Start time must be before end time.');
      return;
    }

    const shiftData = {
      start: startTime.toDate(),
      end: endTime.toDate(),
      title: formData.shiftType,
      assignTo: formData.employee,
      resourceId: employeeList.find(
        (employee) => employee.title === formData.employee
      )?.id,
      allDay: false,
      description: formData.description,
      break: formData.break,
      // breakMinutes: formData.break,
    };

    if (editingShift) {
      // Update existing shift
      setShift((prevShift) =>
        prevShift.map((shift) =>
          shift === editingShift ? { ...shift, ...shiftData } : shift
        )
      );
    } else {
      // Create new shift
      setShift((prevShifts) => {
        const newShifts = [...prevShifts, shiftData];
        // console.log('New shift data 👌:', shiftData);
        return newShifts;
      });
    }

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
    setEditingShift(null);
    setFormData({
      date: '',
      employee: '',
      shift: '',
      startTime: '',
      endTime: '',
      break: 0,
      description: '',
      repeatShift: false,
      repeatFrequency: '',
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

  const handleDelete = (shiftToDelete) => {
    setShift((prevShifts) =>
      prevShifts.filter((shift) => shift !== shiftToDelete)
    );
  };

  const handleEdit = (shift, e) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    if (!admin) return;

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
    setFormData({
      date: format(startDate, 'yyyy-MM-dd'),
      employee: shift.assignTo,
      shiftType: shift.Title,
      startTime: format(startDate, 'HH:mm'),
      endTime: format(endDate, 'HH:mm'),
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (formData.startTime) {
      const [hours, minutes] = formData.startTime.split(':');
      const startDate = new Date(formData.date);
      startDate.setHours(parseInt(hours), parseInt(minutes));
      setFormData((prev) => ({
        ...prev,
        shiftType: getShiftName(startDate),
      }));
    }
  }, [formData.date, formData.startTime]);

  if (admin) {
    return (
      <div className="scrollbar-custom overflow-x-hidden">
        <Calendar
          step={30}
          timeslots={2}
          localizer={localizer}
          events={shifts}
          selectable
          components={{
            event: (eventProps) => (
              <CustomEvent
                {...eventProps}
                onEdit={(e) => handleEdit(eventProps.event, e)}
                onDelete={handleDelete}
                isAdmin={isAdmin}
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
          style={{ height: '80vh', width: '75vw' }}
        />

        <ScheduleModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          formData={formData}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          employeeList={employeeList}
          repeatFrequency={repeatFrequency}
          setRepeatFrequency={setRepeatFrequency}
        />
      </div>
    );
  }
};

export default TaskSchedule;
