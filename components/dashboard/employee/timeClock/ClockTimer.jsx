import React, { useState, useEffect } from 'react';
import { Timer, NotebookPen } from 'lucide-react';

import { getFromLocalStorage, saveToLocalStorage } from '@/utils/timeUtils';
import ClockInSummary from './ClockInSummary';
import ShiftSummaryEditSlideInModal from './ShiftSummaryEditSlideInModal';

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

  const [note, setNote] = useState('');
  const [clockInTime, setClockInTime] = useState(
    new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  );

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
        onUpdateTotal((prevTotal) => prevTotal + 1); // Increment total by 1
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, onUpdateTotal]);

  // Format the time as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}:${String(secs).padStart(2, '0')}`;
  };

  // Format total hours as HH:MM:SS
  const formatTotalHours = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}:${String(secs).padStart(2, '0')}`;
  };

  // Get current date in the format "Tue, Oct 29"
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleEnd = () => {
    setIsRunning(false);
    const newTotal = totalSeconds + time;
    onUpdateTotal(newTotal);
    if (onEnd) {
      console.log('calling onEnd');
      onEnd(time);
    }

    console.log('handleEnd completed');
    setShowClockInSummary(true);
  };

  return (
    <>
      <div
        className="relative bg-purple-2  shadow rounded-lg h-[380px] w-3/4
     overflow-hidden"
      >
        {/* Main Timer Card */}
        <div className="flex h-full">
          <div className=" flex-[3] border-r-2 pt-4 px-6 border-gray-200">
            <h2 className="text-subheading-1 mb-4">{`Today's Clock`}</h2>
            {/* Job Info */}
            <div
              className="bg-gradient-to-b from-purple-1 to-purple-400 
          rounded-xl p-6 mb-6 max-h-[250px]"
            >
              <div className="flex  items-center justify-center gap-4">
                <span className="text-[18px] text-white-1">Work time on</span>
                <div
                  className=" bg-white px-3 py-1 rounded-full 
              text-sm border border-gray-200 flex items-center"
                >
                  <span
                    className="flex items-center  gap-2 justify-center truncate 
                max-w-[150px]"
                  >
                    <div
                      className="h-3 w-3 rounded-full "
                      style={{ backgroundColor: selectedShift.bgColor }}
                    ></div>
                    {selectedShift.title || 'No job selected'}
                  </span>
                </div>
              </div>

              {/* Timer Display */}
              <div className="text-[58px] py-2 text-white-1 text-center  ">
                {formatTime(time)}
              </div>

              {/* Total Hours */}
              <div
                className="flex text-[18px] justify-between items-center 
            text-sm text-white-1  "
              >
                <div className="">Total work hours for {getCurrentDate()}</div>
                <strong>{formatTotalHours(totalSeconds)}</strong>
              </div>
            </div>
            {/* End Button */}
            <button
              onClick={handleEnd}
              className="w-full bg-red-500 hover:bg-red-600
             text-white py-3 px-4 rounded-lg flex items-center
              justify-center space-x-2 transition-colors duration-200"
            >
              <Timer className="w-5 h-5" />
              <span>End Shift</span>
            </button>
          </div>

          {/* Note Section */}
          <div className="flex-[2] mt-4 px-6">
            <div className="flex  items-center space-x-2 text-gray-600 mb-2">
              <NotebookPen color="#8e49ff" />
              <div className="text-[26px]">Note</div>
            </div>

            <div>
              <input
                type="text"
                placeholder="Add a note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-gray-300 bg-transparent rounded-lg shadow-sm
                p-4 outline-none focus:outline-none"
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
          shiftDate={getCurrentDate()}
          clockIn={clockInTime}
          clockOut={new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
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
