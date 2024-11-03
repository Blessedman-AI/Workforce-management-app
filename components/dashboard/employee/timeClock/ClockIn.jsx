'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Timer, X as XIcon, Search as SearchIcon } from 'lucide-react';
import { dummyShifts } from '@/utils/data';
import ClockTimer from './ClockTimer';
import { getFromLocalStorage, saveToLocalStorage } from '@/utils/timeUtils';

const ClockIn = () => {
  const [isClockInClicked, setIsClockInClicked] = useState(false);
  const [isClocked, setIsClocked] = useState(false);
  const [selectedShift, setSelectedShift] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true); // Ensures this runs on the client.
  }, []);

  const shiftTitles = dummyShifts.map((shift) => shift.title);
  // console.log(shiftTitles);

  // Load total seconds from localStorage on component mount
  const [totalSeconds, setTotalSeconds] = useState(() => {
    if (typeof window !== 'undefined') {
      return getFromLocalStorage('totalWorkSeconds', 0); // Retrieve the value
    }
    return 0;
  });

  // Add handleUpdateTotal function
  const handleUpdateTotal = (newTotal) => {
    setTotalSeconds(newTotal);
    saveToLocalStorage('totalWorkSeconds', newTotal);
  };

  // // Format time for display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}`;
  };

  const toggleSearchOpen = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const filteredShifts = searchQuery
    ? dummyShifts.filter((shift) =>
        shift.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : dummyShifts;

  const handleClockInButtonClick = () => {
    setIsClockInClicked(true);
    setTimeout(() => setIsClockInClicked(false), 200);
    setIsOpen(true);
  };

  const handleShiftSelect = (shift) => {
    setSelectedShift(shift);
    setIsClocked(true);
    setIsOpen(false);
  };

  const handleEndClock = (time) => {
    setIsClocked(false);
    setTotalSeconds(getFromLocalStorage('totalWorkSeconds', 0));
    // Don't clear selectedShift immediately
  };

  const handleSummaryClose = () => {
    setSelectedShift(''); // Clear the shift only after summary is closed
  };

  useEffect(() => {
    const lastResetDate = getFromLocalStorage('lastResetDate', '');
    const today = new Date().toDateString();

    if (lastResetDate !== today) {
      setTotalSeconds(0);
      saveToLocalStorage('totalWorkSeconds', 0);
      saveToLocalStorage('lastResetDate', today);
    }
  }, []);
  // console.log('seconds are:😉😶‍🌫️', totalSeconds);

  // // If clock is running, show the timer instead of the main view
  if (selectedShift) {
    return (
      <ClockTimer
        shiftTitles={shiftTitles}
        selectedShift={selectedShift}
        onEnd={handleEndClock}
        totalSeconds={totalSeconds}
        onUpdateTotal={handleUpdateTotal}
        onSummaryClose={handleSummaryClose}
      />
    );
  }

  return (
    <div
      className="relative bg-purple-2 p-6 shadow rounded-lg h-[300px] w-full
     overflow-hidden"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-subheading-1 font-medium">{"Today's clock"}</h2>
        <div className="bg-gray-100 px-3 py-1 rounded">
          <span className="text-sm text-gray-600">
            Total work hours today:{' '}
            {isHydrated ? formatTime(totalSeconds) : '--:--'}
          </span>
        </div>
      </div>

      {/* ClockIn button */}
      <div className="flex justify-center">
        <button
          onClick={handleClockInButtonClick}
          className={`w-40 h-40 rounded-full flex flex-col items-center
           justify-center transition-transform duration-300 hover:scale-110
            ${isClockInClicked && isOpen ? 'scale-95' : ''}
          bg-gradient-to-b from-purple-1 to-purple-400
          focus:outline-none `}
        >
          <Timer className="w-8 h-8 text-white mb-2" />
          <span className="text-white font-medium">Clock in</span>
        </button>
      </div>

      {/* Modal */}
      <div
        className={`absolute inset-0 z-10 
    transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-black/60 z-5
    transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Content */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-sm
             bg-purple-2 rounded-lg shadow-lg transform 
             transition-all duration-500 ease-in-out ${
               isOpen
                 ? 'translate-x-0 pointer-events-auto'
                 : 'translate-x-full pointer-events-none'
             }`}
        >
          <div
            className="  pl-4 pr-4 flex items-center justify-between
           border-b"
          >
            <div className="  flex items-center gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className=" hover:bg-gray-100 rounded-full cursor-pointer"
                aria-label="Close preview"
              >
                <XIcon className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-medium">Select shift</h2>
            </div>

            <div
              className="py-4 border-b  
            overflow-hidden "
            >
              <input
                type="text"
                placeholder="Search shifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`py-1 pl-2 border-[1.5px] bg-purple-2
                     rounded-lg transition-all 
                    duration-300 ease-in-out transform origin-right ${
                      isSearchOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
              />
              <button onClick={toggleSearchOpen}>
                <SearchIcon
                  className="absolute cursor-pointer    hover:bg-gray-200
                   rounded-full right-[20px] top-[21px] h-6 w-6 
                   text-gray-400"
                />
              </button>
            </div>
          </div>
          <div className="flex flex-col overflow-y-auto h-[77%]">
            {filteredShifts.map((shift, index) => (
              <div
                onClick={() => handleShiftSelect(shift)}
                key={index}
                className="flex cursor-pointer items-center hover:bg-gray-200
                 py-4 pl-4 space-x-4 border-b
                 border-gray-200"
              >
                {/* Left circle with bgColor */}
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: shift.bgColor }}
                ></div>

                {/* Shift title */}
                <span className="text-gray-800">{shift.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClockIn;
