import moment from 'moment';

import {
  Grid,
  BarChart2,
  Users,
  UserPlus,
  UserGroup,
  MessageSquare,
  Mail,
  Book,
  Clock,
  Calendar,
  CheckSquare,
  PlusCircle,
  ChevronLeft,
} from 'lucide-react';
import { useMemo } from 'react';

export const userSidebarLinks = [
  {
    title: null,
    items: [
      {
        path: '/user/my-overview',
        name: 'Overview',
        icon: Grid,
        color: '#ad1cfc',
        bgColor: '#f6e6ff',
      },
      {
        path: '/user/my-schedule',
        name: 'Schedule',
        icon: Calendar,
        color: '#FF856C',
        bgColor: '#FFEEE7',
      },
      {
        path: '/user/time-clock',
        name: 'Time Clock',
        icon: Clock,
        color: '#80c7cb',
        bgColor: '#edf7f8',
      },
    ],
  },
];

export const adminSidebarLinks = [
  {
    title: null,
    items: [
      {
        path: '/admin/my-overview',
        name: 'Overview',
        icon: Grid,
        color: '#ad1cfc',
        bgColor: '#f6e6ff',
      },

      {
        path: '/admin/schedule-task',
        name: 'Schedule Task',
        icon: Calendar,
        color: '#FF856C',
        bgColor: '#FFEEE7',
      },
      // {
      //   name: 'Activity',
      //   icon: BarChart2,
      //   color: '#dd9d6f',
      //   bgColor: '#faf1ea',
      // },
    ],
  },
  {
    title: null,
    items: [
      {
        name: 'Users',
        path: '/admin/users',
        icon: Users,
        color: '#d8cf74',
        bgColor: '#f9f8eb',
      },
      //   { name: 'Smart groups', icon: UserPlus },
    ],
  },
  {
    title: 'Operations',
    items: [
      {
        path: '/admin/time-clock',
        name: 'Time Clock',
        icon: Clock,
        color: '#80c7cb',
        bgColor: '#edf7f8',
      },
      {
        name: 'Quick Tasks',
        icon: CheckSquare,
        color: '#0086C0',
        bgColor: '#E5F4F9',
      },
    ],
  },

  {
    title: 'Communication',
    items: [
      {
        name: 'Chat',
        icon: MessageSquare,
        color: '#00C875',
        bgColor: '#E5F7F0',
        badge: 2,
      },
      { name: 'Updates', icon: Mail, color: '#4353FF', bgColor: '#EAEBFF' },
      //   { name: 'Directory', icon: Book, color: '#FF642E', bgColor: '#FFEEE7' },
    ],
  },
];

export const dummyShifts = [
  {
    title: 'test Shift',
    employee: 'Gdinee',
    start: new Date('2024-10-24T09:00:00'),
    end: new Date('2024-10-24T09:01:00'),
    Break: 30,

    bgColor: '#7FFFD4',
  },

  {
    title: 'Morning Shift',
    employee: 'Peter',
    start: new Date('2024-10-24T09:00:00'),
    end: new Date('2024-10-24T17:00:00'),
    Break: 30,

    bgColor: '#7FFFD4',
  },

  {
    title: 'Afternoon Shift',
    employee: 'Ivan',
    start: new Date('2024-10-30T12:00:00'),
    end: new Date('2024-10-27T16:00:00'),
    Break: 30,
    bgColor: '#FFC0CB',
  },

  {
    title: 'Evening Shift',
    employee: 'Cathy',
    start: new Date('2024-10-31T08:00:00'),
    end: new Date('2024-10-31T20:00:00'),
    Break: 30,
    bgColor: '#ADD8E6',
  },
];

export const employees = [
  {
    id: 1,
    bgColor: '#00FFFF',
    firstName: 'Papa',
    initials: 'PP',
    job: 'Project A',
    clockIn: '07:07',
    clockOut: '07:08',
    totalHours: '00:01',
  },
  {
    id: 2,
    bgColor: '##ADD8E6',
    firstName: 'John',
    initials: 'JS',
    job: 'Project B',
    clockIn: '07:07',
    clockOut: '07:08',
    totalHours: '00:01',
  },
  {
    id: 3,
    bgColor: '#FFC0CB',
    firstName: 'Sarah',
    initials: 'SW',
    job: 'Project B',
    clockIn: '07:07',
    clockOut: '07:08',
    totalHours: '00:01',
  },
  {
    id: 4,
    bgColor: '#7FFFD4',
    firstName: 'Emma',
    initials: 'ED',
    job: 'Project B',
    clockIn: '08:07',
    clockOut: '09:08',
    totalHours: '00:01',
  },
];

export const requests = [
  {
    id: 1,
    user: {
      initials: 'AB',
      name: 'ala bp',
      type: 'Edit Shift',
    },
    originalShift: {
      startDate: '05/11',
      endDate: '05/11',
      startTime: '07:07',
      endTime: '07:08',
      duration: '00:01 hours',
      project: 'Project A',
      note: 'clack clack',
    },
    editRequested: {
      startDate: '05/11',
      endDate: '05/11',
      startTime: '07:07',
      endTime: '09:08',
      duration: '02:01 hours',
      project: 'Project A',
      note: 'clack clack',
    },
    requestNote: 'timer is inaccurate',
  },
  {
    id: 2,
    user: {
      initials: 'AB',
      name: 'ala bp',
      type: 'Edit Shift',
    },
    originalShift: {
      startDate: '05/11',
      endDate: '05/11',
      startTime: '21:00',
      endTime: '21:00',
      duration: '00:00 hours',
      project: 'Project A',
      note: '',
    },
    editRequested: {
      startDate: '05/11',
      endDate: '05/11',
      startTime: '21:00',
      endTime: '21:00',
      duration: '00:00 hours',
      project: 'Project A',
      note: '',
    },
  },
];

export const getInitialRequests = () => [
  {
    requesterInitials: 'DB',
    replacementInitials: 'CX',
    replacementName: 'Craxis',
    requesterName: 'Diokpa',
    shiftName: 'Morning shift',
    shiftStart: new Date(2024, 9, 24, 9, 0),
    shiftEnd: new Date(2024, 9, 24, 17, 0),
    shiftDuration: '8:00',
  },
  {
    requesterInitials: 'CD',
    replacementInitials: 'EF',
    requesterName: 'charlie',
    replacementName: 'Anautovich',
    shiftName: 'Evening shift',
    shiftStart: new Date(2024, 9, 24, 17, 0),
    shiftEnd: new Date(2024, 9, 25, 1, 0),
    shiftDuration: '8:00',
  },
];
