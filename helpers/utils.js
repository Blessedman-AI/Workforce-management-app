'use client';

import { useSession } from 'next-auth/react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Description } from '@headlessui/react';

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

export const verificationEmail = ({ firstName, verificationUrl }) =>
  `
    <h2>Welcome ${firstName}!</h2>
    <p>You've been invited to join the employee portal.</p>
    <p>Click the button below to complete your registration:</p>
    <p><a href="${verificationUrl}" style="padding: 10px 20px; background-color: #8e49ff; color: white; text-decoration: none; border-radius: 5px;">Sign In to Portal</a></p>
    <p style="color: #666; font-size: 14px;">If you weren't expecting this invitation, please ignore this email.</p>
  `;

// export const AssignedShifts = () => {
//   const [formattedShifts, setFormattedShifts] = useState([]);
//   const { data: session, status } = useSession();
//   // Fetch shifts assigned to the current user from the server
//   // and return the shifts as an array of objects
//   const assignedShifts = session?.user?.assignedShifts;
//   // console.log('Assigned shifts🔥', assignedShifts);

//   useEffect(() => {
//     const formatted = assignedShifts.map((shift) => ({
//       date: new Date(shift.start).toLocaleDateString('en-US', {
//         day: '2-digit',
//         month: 'short',
//         year: 'numeric',
//       }),
//       time: `${new Date(shift.start).toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: false,
//       })} - ${new Date(shift.end).toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: false,
//       })}`,
//       title: shift.shiftType,
//       createdBy: shift.createdByUser.firstName || 'Unknown',
//       id: shift.id,
//     }));
//     setFormattedShifts(formatted);
//   }, [assignedShifts]);
//   return formattedShifts;
// };

export const useAssignedShifts = () => {
  const [formattedShifts, setFormattedShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.assignedShifts) {
      setLoading(false);
      return;
    }

    const formatted = session.user.assignedShifts.map((shift) => ({
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
    }));

    setFormattedShifts(formatted);
    setLoading(false);
  }, [session]);

  return { shifts: formattedShifts, loading };
};

export const ShiftsForCalendar = (assignedShifts) => {
  const formatted = assignedShifts?.map((shift) => ({
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
