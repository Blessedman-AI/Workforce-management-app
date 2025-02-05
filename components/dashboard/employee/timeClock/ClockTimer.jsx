import React, { useState, useEffect } from 'react';
import { Timer, NotebookPen } from 'lucide-react';

import { getFromLocalStorage, saveToLocalStorage } from '@/helpers/timeUtils';
import ClockInSummary from './ClockInSummary';
import ShiftSummaryEditSlideInModal from './ShiftSummaryEditModal';

const ClockTimer = ({
  shiftTitles,
  selectedShift,
  onEnd,
  totalSeconds,
  onUpdateTotal,
  onSummaryClose,
}) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [showClockInSummary, setShowClockInSummary] = useState(false);
  const [overtime, setOvertime] = useState(0);

  const [note, setNote] = useState('');
  const [clockInTime, setClockInTime] = useState(
    new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  );

  const shiftDuration = Math.floor(
    (new Date(selectedShift.end) - new Date(selectedShift.start)) / 1000
  );

  const formatShiftDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          if (newTime > shiftDuration) {
            setOvertime(newTime - shiftDuration);
          }
          return newTime;
        });
        onUpdateTotal((prevTotal) => prevTotal + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, onUpdateTotal, shiftDuration]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}:${String(secs).padStart(2, '0')}`;
  };

  const handleEnd = () => {
    setIsRunning(false);
    const newTotal = totalSeconds + time;
    onUpdateTotal(newTotal);
    if (onEnd) {
      onEnd(time);
    }
    setShowClockInSummary(true);
  };

  return (
    <>
      <div className="relative bg-purple-2 shadow rounded-lg min-h-[380px] w-full overflow-hidden">
        {/* Main Timer Card */}
        <div className="flex flex-col md:flex-row h-full">
          <div
            className="flex-1 lg:flex-[3] lg:border-r-2 pt-4 px-4 lg:px-6
           border-gray-200 "
          >
            <h2 className="text-subheading-1 mb-4">{`Today's Clock`}</h2>
            {/* Job Info */}
            <div className="flex flex-col items-center bg-gradient-to-b from-purple-1 to-purple-400 rounded-xl p-4 lg:p-6 mb-6 max-h-[220px]">
              <div className="flex flex-col lg:flex-row min-w-full items-center justify-between gap-4">
                <div className="flex flex-col lg:flex-row justify-between gap-4 lg:gap-8">
                  <div className="flex flex-col lg:flex-row justify-start gap-2 items-center">
                    <span className="text-[16px] lg:text-[18px] font-medium text-white-1 text-center lg:text-left">
                      Work time on
                    </span>
                    <div className="bg-white px-3 py-1 rounded-full text-sm border border-gray-200 flex items-center">
                      <span className="flex items-center gap-2 justify-center truncate max-w-[150px]">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: selectedShift.bgColor }}
                        ></div>
                        {selectedShift.title || 'No job selected'}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Overtime Display */}
                {overtime > 0 && (
                  <div className="flex justify-center gap-2 text-white-1 text-center">
                    <strong>+{formatTime(overtime)}</strong>
                    <div className="font-medium text-[16px] lg:text-[18px]">
                      Overtime
                    </div>
                  </div>
                )}
              </div>

              {/* Timer Display */}
              <div className="text-[48px] lg:text-[58px] animate-pulse font-bold py-4 lg:py-6 text-white-1 text-center">
                {formatTime(time)}
              </div>
            </div>
            {/* End Button */}
            <button
              onClick={handleEnd}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200 mb-6 lg:mb-0"
            >
              <Timer className="w-5 h-5" />
              <span>End Shift</span>
            </button>
          </div>

          {/* Note Section */}
          <div className="flex-1 lg:flex-[2] mt-4 px-4 lg:px-6 pb-6 lg:pb-0">
            <div className="flex items-center space-x-2 text-gray-600 mb-2">
              <NotebookPen color="#8e49ff" />
              <div className="text-[22px] lg:text-[26px]">Note</div>
            </div>

            <div>
              <input
                type="text"
                placeholder="Add a note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-gray-300 bg-transparent rounded-lg shadow-sm p-4 outline-none focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ClockInSummary component */}
      {showClockInSummary && (
        <ClockInSummary
          shiftTitles={shiftTitles}
          isOpen={showClockInSummary}
          shiftStart={formatShiftDate(selectedShift.start)}
          shiftEnd={formatShiftDate(selectedShift.end)}
          clockIn={clockInTime}
          clockOut={new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
          overtime={formatTime(overtime)}
          shiftName={selectedShift.title}
          totalHours={formatTime(time)}
          note={note}
          onClose={() => {
            setShowClockInSummary(false);
            onSummaryClose();
          }}
          onApprove={() => {
            setShowClockInSummary(false);
            onSummaryClose();
          }}
        />
      )}
    </>
  );
};

export default ClockTimer;
