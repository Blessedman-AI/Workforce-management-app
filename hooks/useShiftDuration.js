import { useState, useCallback, useEffect } from 'react';
import { formatShift } from '@/helpers/utils';

export const useShiftDuration = (initialData) => {
  const formatDateToInput = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const calculateMinutesBetween = (start, end) => {
    return Math.floor((end.getTime() - start.getTime()) / 60000);
  };

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatMinutesToTime = (totalMinutes, includeSeconds = false) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const timeStr = `${String(hours).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')}`;
    return includeSeconds ? `${timeStr}:00` : timeStr;
  };

  // Parse initial overtime minutes
  const getInitialOvertimeMinutes = (overtimeStr) => {
    if (!overtimeStr) return 0;
    const [hours, minutes] = overtimeStr.split(':');
    return parseInt(hours) * 60 + parseInt(minutes);
  };

  const [shiftData, setShiftData] = useState(() => {
    const formattedStartDate = formatDateToInput(initialData.shiftStart);
    const formattedEndDate = formatDateToInput(initialData.shiftEnd);

    // Store initial dates and times for reference
    const initialStart = new Date(formattedStartDate);
    const [startHours, startMinutes] = initialData.clockIn
      .split(':')
      .map(Number);
    initialStart.setHours(startHours, startMinutes, 0, 0);

    const initialEnd = new Date(formattedEndDate);
    const [endHours, endMinutes] = initialData.clockOut.split(':').map(Number);
    initialEnd.setHours(endHours, endMinutes, 0, 0);

    // Calculate and store initial worked minutes
    const initialWorkedMinutes = calculateMinutesBetween(
      initialStart,
      initialEnd
    );

    // Store initial overtime minutes
    const initialOvertimeMinutes = getInitialOvertimeMinutes(
      initialData.overtime
    );

    return {
      ...initialData,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      clockIn: initialData.clockIn,
      clockOut: initialData.clockOut,
      initialWorkedMinutes,
      initialOvertimeMinutes,
      totalHours: initialData.totalHours,
      overtime: initialData.overtime,
    };
  });

  const calculateDuration = useCallback(
    (startDate, endDate, clockIn, clockOut) => {
      if (!clockIn || !clockOut || !startDate || !endDate) {
        return { totalHours: '00:00', overtime: '00:00:00' };
      }

      try {
        // Calculate current worked minutes
        const currentStart = new Date(startDate);
        const [startHours, startMinutes] = clockIn.split(':').map(Number);
        currentStart.setHours(startHours, startMinutes, 0, 0);

        const currentEnd = new Date(endDate);
        const [endHours, endMinutes] = clockOut.split(':').map(Number);
        currentEnd.setHours(endHours, endMinutes, 0, 0);

        const currentWorkedMinutes = calculateMinutesBetween(
          currentStart,
          currentEnd
        );

        // Calculate the difference in worked minutes
        const workedMinutesDiff =
          currentWorkedMinutes - shiftData.initialWorkedMinutes;

        // Add the difference to the initial overtime
        const newOvertimeMinutes = Math.max(
          0,
          shiftData.initialOvertimeMinutes + workedMinutesDiff
        );

        console.log('Duration calculation:', {
          currentWorkedMinutes,
          initialWorkedMinutes: shiftData.initialWorkedMinutes,
          workedMinutesDiff,
          initialOvertimeMinutes: shiftData.initialOvertimeMinutes,
          newOvertimeMinutes,
        });

        if (currentWorkedMinutes < 0) {
          return { totalHours: '00:00', overtime: '00:00:00' };
        }

        return {
          totalHours: formatMinutesToTime(currentWorkedMinutes),
          overtime: formatMinutesToTime(newOvertimeMinutes, true),
        };
      } catch (error) {
        console.error('Error calculating duration:', error);
        return { totalHours: '00:00', overtime: '00:00:00' };
      }
    },
    [shiftData.initialWorkedMinutes, shiftData.initialOvertimeMinutes]
  );

  const handleTimeChange = useCallback(
    (name, value) => {
      console.log('handleTimeChange:', name, value);

      setShiftData((prev) => {
        const newState = { ...prev, [name]: value };

        if (['startDate', 'endDate', 'clockIn', 'clockOut'].includes(name)) {
          const duration = calculateDuration(
            newState.startDate,
            newState.endDate,
            newState.clockIn,
            newState.clockOut
          );

          return {
            ...newState,
            totalHours: duration.totalHours,
            overtime: duration.overtime,
          };
        }

        return newState;
      });
    },
    [calculateDuration]
  );

  return {
    shiftData,
    handleTimeChange,
  };
};

export const useAssignedShifts = ({ assignedShifts, refreshTrigger }) => {
  const [formattedShifts, setFormattedShifts] = useState([]);
  const [loadingShifts, setLoadingShifts] = useState(true);

  useEffect(() => {
    if (!assignedShifts) {
      setLoadingShifts(false);
      return;
    }

    const formatted = assignedShifts.map(formatShift);
    setFormattedShifts(formatted);
    setLoadingShifts(false);
  }, [assignedShifts, refreshTrigger]);

  return { shifts: formattedShifts, loadingShifts };
};
