import { useState, useCallback } from 'react';

const useShiftDuration = (initialData) => {
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

export default useShiftDuration;

//WORKING CODE//////////////////////////////////////////
// import { useState, useCallback } from 'react';

// const useShiftDuration = (initialData) => {
//   const formatDateToInput = (date) => {
//     if (!date) return '';
//     const parsedDate = new Date(date);
//     const year = parsedDate.getFullYear();
//     const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
//     const day = String(parsedDate.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   const [shiftData, setShiftData] = useState(() => {
//     // Parse the shift start/end times from the initial clock times
//     const [schedStartHours, schedStartMinutes] = initialData.clockIn
//       .split(':')
//       .map(Number);
//     const [schedEndHours, schedEndMinutes] = initialData.clockOut
//       .split(':')
//       .map(Number);

//     // Create scheduled Date objects with the correct times
//     const scheduledStart = new Date(initialData.shiftStart);
//     scheduledStart.setHours(schedStartHours, schedStartMinutes, 0, 0);

//     const scheduledEnd = new Date(initialData.shiftEnd);
//     scheduledEnd.setHours(schedEndHours, schedEndMinutes, 0, 0);

//     // Format the dates for input fields
//     const formattedStartDate = formatDateToInput(scheduledStart);
//     const formattedEndDate = formatDateToInput(scheduledEnd);

//     console.log('Initializing with times:', {
//       originalScheduledStart: scheduledStart,
//       originalScheduledEnd: scheduledEnd,
//       schedStartHours,
//       schedStartMinutes,
//       schedEndHours,
//       schedEndMinutes,
//     });

//     return {
//       ...initialData,
//       startDate: formattedStartDate,
//       endDate: formattedEndDate,
//       clockIn: initialData.clockIn,
//       clockOut: initialData.clockOut,
//       // Store the original scheduled times with their proper hours/minutes
//       scheduledStart,
//       scheduledEnd,
//       // Store the original scheduled hours/minutes
//       scheduledStartTime: `${String(schedStartHours).padStart(2, '0')}:${String(
//         schedStartMinutes
//       ).padStart(2, '0')}`,
//       scheduledEndTime: `${String(schedEndHours).padStart(2, '0')}:${String(
//         schedEndMinutes
//       ).padStart(2, '0')}`,
//       totalHours: initialData.totalHours,
//       overtime: initialData.overtime,
//     };
//   });

//   const calculateDuration = useCallback(
//     (startDate, endDate, clockIn, clockOut, scheduledStart, scheduledEnd) => {
//       if (
//         !clockIn ||
//         !clockOut ||
//         !startDate ||
//         !endDate ||
//         !scheduledStart ||
//         !scheduledEnd
//       ) {
//         return { totalHours: '00:00', overtime: '00:00:00' };
//       }

//       try {
//         // Parse actual work times
//         const [inHours, inMinutes] = clockIn.split(':').map(Number);
//         const [outHours, outMinutes] = clockOut.split(':').map(Number);

//         // Create Date objects for actual work times
//         const actualStart = new Date(startDate);
//         actualStart.setHours(inHours, inMinutes, 0, 0);

//         const actualEnd = new Date(endDate);
//         actualEnd.setHours(outHours, outMinutes, 0, 0);

//         // Calculate worked duration
//         const workedMs = actualEnd.getTime() - actualStart.getTime();
//         const workedMinutes = Math.floor(workedMs / 60000);

//         // Get the original scheduled duration
//         const [schedStartHours, schedStartMinutes] =
//           shiftData.scheduledStartTime.split(':').map(Number);
//         const [schedEndHours, schedEndMinutes] = shiftData.scheduledEndTime
//           .split(':')
//           .map(Number);

//         // Calculate scheduled duration in minutes
//         const scheduledStart = new Date(startDate);
//         scheduledStart.setHours(schedStartHours, schedStartMinutes, 0, 0);

//         const scheduledEnd = new Date(endDate);
//         scheduledEnd.setHours(schedEndHours, schedEndMinutes, 0, 0);

//         const scheduledMs = scheduledEnd.getTime() - scheduledStart.getTime();
//         const scheduledMinutes = Math.floor(scheduledMs / 60000);

//         console.log('Duration calculation:', {
//           workedMinutes,
//           scheduledMinutes,
//           actualStart: actualStart.toISOString(),
//           actualEnd: actualEnd.toISOString(),
//           scheduledStart: scheduledStart.toISOString(),
//           scheduledEnd: scheduledEnd.toISOString(),
//         });

//         // Handle negative durations
//         if (workedMinutes < 0) {
//           return { totalHours: '00:00', overtime: '00:00:00' };
//         }

//         // Calculate overtime
//         const overtimeMinutes = Math.max(0, workedMinutes - scheduledMinutes);

//         // Format total hours
//         const totalHours = Math.floor(workedMinutes / 60);
//         const totalMinutes = workedMinutes % 60;

//         // Format overtime
//         const overtimeHours = Math.floor(overtimeMinutes / 60);
//         const overtimeRemainingMinutes = overtimeMinutes % 60;

//         return {
//           totalHours: `${String(totalHours).padStart(2, '0')}:${String(
//             totalMinutes
//           ).padStart(2, '0')}`,
//           overtime: `${String(overtimeHours).padStart(2, '0')}:${String(
//             overtimeRemainingMinutes
//           ).padStart(2, '0')}:00`,
//         };
//       } catch (error) {
//         console.error('Error calculating duration:', error);
//         return { totalHours: '00:00', overtime: '00:00:00' };
//       }
//     },
//     [shiftData.scheduledStartTime, shiftData.scheduledEndTime]
//   );

//   const handleTimeChange = useCallback(
//     (name, value) => {
//       console.log('handleTimeChange:', name, value);

//       setShiftData((prev) => {
//         const newState = { ...prev, [name]: value };

//         if (['startDate', 'endDate', 'clockIn', 'clockOut'].includes(name)) {
//           const duration = calculateDuration(
//             newState.startDate,
//             newState.endDate,
//             newState.clockIn,
//             newState.clockOut,
//             newState.scheduledStart,
//             newState.scheduledEnd
//           );

//           return {
//             ...newState,
//             totalHours: duration.totalHours,
//             overtime: duration.overtime,
//           };
//         }

//         return newState;
//       });
//     },
//     [calculateDuration]
//   );

//   return {
//     shiftData,
//     handleTimeChange,
//   };
// };

// export default useShiftDuration;
