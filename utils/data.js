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
      {
        name: 'Activity',
        icon: BarChart2,
        color: '#dd9d6f',
        bgColor: '#faf1ea',
      },
    ],
  },
  {
    title: null,
    items: [
      { name: 'Employees', icon: Users, color: '#d8cf74', bgColor: '#f9f8eb' },
      //   { name: 'Smart groups', icon: UserPlus },
    ],
  },
  {
    title: 'Operations',
    items: [
      { name: 'Time Clock', icon: Clock, color: '#80c7cb', bgColor: '#edf7f8' },
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

export const employees = () => [
  { id: 1, title: 'Barry' },
  { id: 2, title: 'Bert' },
  { id: 3, title: 'Jacob Getz' },
  { id: 4, title: 'Yakov' },
  { id: 6, title: 'Merino' },
];

export const dummyShifts = [
  {
    title: 'Morning Shift',
    employee: 'Peter',
    start: new Date('2024-10-24T09:00:00'),
    end: new Date('2024-10-24T17:00:00'),
    Break: 30,
    ScheduleDate: new Date('2024-10-22T10:00:00'),
    bgColor: '#7FFFD4',
  },

  {
    title: 'Afternoon Shift',
    employee: 'Ivan',
    start: new Date('2024-10-30T12:00:00'),
    end: new Date('2024-10-27T16:00:00'),
    Break: 30,
    ScheduleDate: new Date('2024-10-22T10:00:00'),
    bgColor: '#FFC0CB',
  },

  {
    title: 'Evening Shift',
    employee: 'Cathy',
    start: new Date('2024-10-31T08:00:00'),
    end: new Date('2024-10-31T20:00:00'),
    Break: 30,
    ScheduleDate: new Date('2024-10-22T10:00:00'),
    bgColor: '#ADD8E6',
  },
];

export const dummyEmployees = [
  { id: 1, name: 'Po Porpov', avatar: 'PP', bgColor: '#00FFFF' },
  { id: 2, name: 'John Smith', avatar: 'JS', bgColor: '#ADD8E6' },
  { id: 3, name: 'Sarah Wilson', avatar: 'SW', bgColor: '#FFC0CB' },
  { id: 4, name: 'Mike Johnson', avatar: 'MJ', bgColor: '#FFC0CB' },
  { id: 5, name: 'Emma Davis', avatar: 'ED', bgColor: '#7FFFD4' },
];
