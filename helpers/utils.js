import axios from 'axios';

import moment from 'moment';
import { Description } from '@headlessui/react';
import { ArrowLeftRight, Mail, CheckSquare } from 'lucide-react';

export function capitalizeInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const getInitials = (name) => {
  if (!name || typeof name !== 'string') {
    return '';
  }
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export const formatDateAdded = (date) => {
  if (!date) return '-';
  return moment(date).format('MMM D, YYYY');
};

export const formatLastLogin = (date) => {
  if (!date) return 'Never';
  return moment(date).fromNow();
};

export const getTimeAgo = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${minutes}m ago`;
};

//Password strength check
export function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export const formatShift = (shift) => ({
  date: new Date(shift.start).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }),
  time: `${new Date(shift.start).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })} - ${new Date(shift.end).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })}`,
  title: shift.shiftType,
  createdBy: shift.createdByUser.firstName || 'Unknown',
  id: shift.id,
});

export const ShiftsForCalendar = (assignedShifts) => {
  const formatted = assignedShifts?.map((shift) => ({
    shiftId: shift.id,
    title: shift.shiftType,
    start: new Date(shift.start),
    end: new Date(shift.end),
    createdByFirstName: shift.createdByUser.firstName || 'Unknown',
    createdByLastName: shift.createdByUser.lastName || 'Unknown',
    resourceId: shift.id,
    break: shift.break,
    createdBY: shift.createdByUser,
    description: shift.description,
    repeatFrequency: shift.repeatFrequency,
    repeatShift: shift.repeatShift,
    sendNotification: shift.sendNotification,
    assignedToFirstName: shift.assignedToUser.firstName || 'Unknown',
    assignedToLastName: shift.assignedToUser.lastName || 'Unknown',
    exchangeRequestStatus: shift.exchangeRequests?.[0]?.status || 'NONE',
    exchangeRequestId: shift.exchangeRequests?.[0]?.id,
    // You can add additional properties as needed
  }));
  return formatted;
};

export const generateShiftEmail = ({
  shiftType,
  firstName,
  start,
  end,
  description,
  breaks,
  createdByFirstName,
  createdByLastName,
  repeatShift,
  repeatFrequency,
}) => `
    <div>
      <h2>New Shift Assignment</h2>
      <p>Hello ${firstName},</p>
      <p>You have been assigned a new ${shiftType}.</p>
      <p><strong>When:</strong> ${start} - ${end}</p>
      ${
        description ? `<p><strong>Description:</strong> ${description}</p>` : ''
      }
      ${
        breaks
          ? `<p><strong>Break duration:</strong> ${breaks} minutes</p>`
          : ''
      }
      <p><strong>Assigned by:</strong> ${createdByFirstName} ${createdByLastName}</p>
      ${
        repeatShift
          ? `<p><strong>This shift repeats:</strong> Every ${repeatFrequency}</p>`
          : ''
      }
      <p>Please contact your supervisor if you have any questions.</p>
    </div>
  `;

export const findExchangeRequest = async (requestId) => {
  try {
    const { data } = await axios.get(
      `/api/shift-exchange/request/${requestId}`
    );
    // console.log('request😲', data);
    return data;
  } catch (error) {
    console.error('Error fetching exchange request:', error);
    throw error; // Re-throw the error to handle it in the component
  }
};

export const fetchShifts = async () => {
  const url = '/api/shifts';
  // console.log('fetching shifts from🏀', url);
  try {
    const response = await axios.get(url);

    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching shifts details:', error);
    throw error;
  }
};

export const cancelShiftExchange = async (requestId) => {
  console.log('Attempting to cancel with ID:', requestId); // Add this log
  try {
    const response = await axios.patch(
      `/api/shift-exchange/request/${requestId}`
    );
    const data = response.data;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error || 'Error cancelling request');
    }
    throw error;
  }
};

export const fetchUnavailability = async () => {
  try {
    const response = await axios.get('/api/unavailability');
    console.log('response is🔫🥇', response);
    const formattedUnavailabilities = response.data.unavailabilities.map(
      (item) => ({
        id: item.id,
        title: item.type === 'VACATION' ? 'Vacation' : 'Unavailable',
        start: item.startDate,
        end: item.endDate,
        // start: new Date(item.startDate),
        // end: new Date(item.endDate),
        type: item.type,
        // allDay: item.type === 'VACATION',
        className:
          item.type === 'VACATION' ? 'vacation-event' : 'unavailable-event',
      })
    );
    console.log('formatted unavailabilities🔫🥇', formattedUnavailabilities);
    return formattedUnavailabilities;
  } catch (error) {
    console.error('Error fetching unavailabilities:', error);
    return [];
  }
};

export const createVacation = async (startDate, endDate) => {
  try {
    const response = await axios.post('/api/unavailability', {
      startDate,
      endDate,
      type: 'VACATION',
      intervals: [],
    });

    // console.log('🩸🩸', response);
    return response.data.unavailability; // Return the created vacation data
  } catch (err) {
    console.log('Error adding unavailability:🌴', err?.response);
    throw new Error('Failed to add unavailability', err);
  }
};

export const removeVacation = async (id) => {
  try {
    await axios.delete(`/api/unavailability/${id}`);
  } catch (err) {
    console.error('Error removing unavailability:', err);
    throw new Error('Failed to remove unavailability');
  }
};

export const saveRestrictedHours = async (intervals) => {
  try {
    const response = await axios.post('/api/unavailability', {
      startDate: new Date().toISOString(), // Current date
      endDate: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString(), // One year from now
      type: 'RESTRICTED_HOURS',
      intervals: intervals.map((interval) => ({
        dayOfWeek: interval.dayOfWeek,
        startTime: interval.startTime,
        endTime: interval.endTime,
      })),
    });

    return response.data;
  } catch (err) {
    console.error('Error saving restricted hours:', err);
    throw new Error('Failed to save restricted hours');
  }
};

// export const checkUnavailabilityConflict = (
//   shiftStart,
//   shiftEnd,
//   unavailabilities
// ) => {
//   // Check if the shift overlaps with any unavailability periods
//   const hasConflict = unavailabilities.some((unavailability) => {
//     const unavailStart = unavailability.startDate;
//     const unavailEnd = unavailability.endDate;

//     // Check for overlap between shift and unavailability
//     return shiftStart < unavailEnd && shiftEnd > unavailStart;
//   });

//   return hasConflict;
// };

export const checkUnavailabilityConflict = (
  shiftStart,
  shiftEnd,
  unavailabilities
) => {
  const hasConflict = unavailabilities.some((unavailability) => {
    const unavailStart = new Date(unavailability.startDate);
    const unavailEnd = new Date(unavailability.endDate);
    // Add one day to include the full last day
    unavailEnd.setDate(unavailEnd.getDate() + 1);

    // Check if the shift overlaps with the unavailability period
    return (
      (shiftStart >= unavailStart && shiftStart < unavailEnd) ||
      (shiftEnd > unavailStart && shiftEnd <= unavailEnd) ||
      (shiftStart <= unavailStart && shiftEnd >= unavailEnd)
    );
  });

  return hasConflict;
};
