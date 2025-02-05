'use client';

import React, { useState } from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import moment from 'moment';

export const CustomEvent = ({
  event,
  onEdit,
  onDelete,
  shiftDetails,
  isAuthorised,
  isDeletingShift,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  // console.log('This is event', event);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // console.log('isAuthorised:✅', isAuthorised);

  return (
    <div
      style={{
        backgroundColor:
          event.title !== 'Unavailable' ? 'white' : 'rgba(242, 96, 114, .4)',
        border: event.title !== 'Unavailable' ? '2px solid #38c173' : 'none',
        borderRadius: '4px',
        padding: '12px 6px',
        height: '50px',
        width: 'fit-content',
        overflowY: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        lineHeight: '1.5',
        position: 'relative',
        letterSpacing: 'normal',
        overfloWrap: 'break-word',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        style={{
          color: event.title !== 'Unavailable' ? '#333132' : 'red',
          fontSize: '12px',
        }}
      >
        <strong
          style={{
            textAlign: 'center',
            overflowWrap: 'break-word',
            whiteSpace: 'normal',
          }}
        >
          {event.title}
        </strong>
      </span>
      <span
        style={{
          color: event.title !== 'Unavailable' ? '#333132' : 'red',
          fontWeight: 'normal',
          fontSize: '11px',
          textAlign: 'center',
          overflowWrap: 'break-word',
          whiteSpace: 'normal',
        }}
      >
        {moment(event.start).format('HH:mm')} -{' '}
        {moment(event.end).format('HH:mm')}
      </span>

      {isHovering && isAuthorised && (
        <div
          className="absolute inset-0 w-full h-full space-x-3 flex justify-center 
          items-center border border-r-4 bg-white rounded-sm
          shadow-lg transition-opacity duration-300 z-[99]"
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
            className="text-grey-3 hover:text-purple-1"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}

      {isHovering && event.title !== 'Unavailable' && !isAuthorised && (
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
