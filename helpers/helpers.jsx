'use client';

import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import moment from 'moment';

export const CustomEvent = ({
  event,
  onEdit,
  onDelete,
  shiftDetails,
  isAdmin,
  isUser,
  isDeletingShift,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  let backgroundColor = '#51a4b2';
  let textColor;

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // console.log('Event is', event);

  if (event.title === 'Unavailable') {
    backgroundColor = '#f7e6e8'; // Light red/pink
    textColor = '#d32f2f'; // Dark red
  } else if (event.title === 'Vacation') {
    backgroundColor = '#FFC107'; // Yellow
    textColor = '#a64f03'; // Brown (for contrast)
  } else if (event.title?.includes('shift')) {
    backgroundColor = '#51a4b2'; // Teal
    textColor = '#ffffff'; // White
  } else if (event.exchangeRequestStatus === 'PENDING') {
    backgroundColor = '#fac85c'; // Light Orange
    textColor = '#8a5400'; // Darker Orange/Brown
  }

  return (
    <div
      style={{
        backgroundColor,
        color: textColor,
        borderRadius: '4px',
        padding: '12px 6px',
        height: '50px',
        width: '100%',
        minWidth: '100%',
        overflowY: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        lineHeight: '1.5',
        position: 'relative',
        textAlign: 'center',
        letterSpacing: 'normal',
        fontSize: '13px',
        overflowWrap: 'break-word',
        whiteSpace: 'normal',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        style={{
          fontWeight: '500',
        }}
      >
        {event.title}
        {/* <strong>{event.title}</strong> */}
      </span>
      <span
        style={{
          fontWeight: 'normal',
          fontSize: '11px',
        }}
      >
        {/* {event.title === 'Vacation'
          ? `${event.start} - ${event.end}`
          : `${event.start} - ${event.end}`} */}

        {event.title === 'Vacation'
          ? `${moment(event.start).format('D/M/YY')} - ${moment(event.end).format('D/M/YY')}`
          : `${moment(event.start).format('HH:mm')} - ${moment(event.end).format('HH:mm')}`}
      </span>

      {(isHovering || isDeletingShift) && isAdmin && (
        <div
          className="absolute w-full h-full space-x-3 flex justify-center 
          items-center border border-r-4 bg-white rounded-sm
          shadow-lg transition-opacity duration-300 "
          style={{
            border: '2px solid',
            borderColor: backgroundColor,
          }}
        >
          <button
            onClick={() => onEdit(event)}
            className="text-gray-600 hover:text-purple-1"
          >
            <Pencil size={18} />
          </button>
          <span className="h-5 w-px bg-gray-300"></span>
          <button
            onClick={() => onDelete(event)}
            disabled={isDeletingShift}
            className="text-grey-3 hover:text-purple-3
             disabled:text-grey-1 disabled:hover:text-grey-1"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}

      {isHovering && isUser && event?.title?.includes('shift') && (
        <button
          onClick={() => shiftDetails(event)}
          className="flex text-[12px] flex-col absolute inset-0 
          w-full h-full justify-center items-center text-purple-1
           font-semibold bg-white-1  z-[99] transition-opacity
            duration-[900ms] "
          // style={{ border: '1px solid #38c173' }}
        >
          <Eye size={20} color="#8e49ff" />
          View details
        </button>
      )}
    </div>
  );
};

export const eventPropGetter = (event, start, end, isSelected) => {
  return {
    style: {
      backgroundColor: 'transparent',
      border: 'none',
    },
  };
};
