'use client';

import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Eye } from 'lucide-react';
import moment from 'moment';
import { format } from 'date-fns';

import '@/components/dashboard/rbc.css';

export const CustomEvent = ({
  event,
  onEdit,
  onDelete,
  shiftDetails,
  isAdmin,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    console.log('Mouse entered:', event.title);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    console.log('Mouse left:', event.title);
    setIsHovering(false);
  };

  return (
    <div
      style={{
        backgroundColor:
          event.title !== 'Unavailable' ? 'white' : 'rgba(242, 96, 114, .4)',
        border: event.title !== 'Unavailable' ? '2px solid #38c173' : 'none',

        // backgroundColor: 'white',
        // border: '2px solid #38c173',
        borderRadius: '4px',
        padding: '8px 12px',
        height: 'auto',
        width: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        lineHeight: '1.5',

        position: 'relative',
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
        <strong>{event.title}</strong>
      </span>
      <span
        style={{
          color: event.title !== 'Unavailable' ? '#333132' : 'red',
          fontWeight: 'normal',
          fontSize: '11px',
        }}
      >
        {moment(event.start).format('HH:mm')} -{' '}
        {moment(event.end).format('HH:mm')}
      </span>

      {isHovering && isAdmin && (
        <div
          className="absolute inset-0 w-full h-full space-x-3 flex justify-center 
          items-center border  bg-white rounded-sm
           shadow-lg z-50 transition-opacity duration-300"
        >
          <button
            onClick={() => onEdit(event)}
            handleCloseModaleventDetails
            className="text-gray-600 hover:text-purple-1"
          >
            <Pencil size={18} />
          </button>
          <span className="h-5 w-px bg-gray-300"></span>
          <button
            onClick={onDelete}
            className="text-gray-600 hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}

      {isHovering && event.title !== 'Unavailable' && !isAdmin && (
        <button
          onClick={() => shiftDetails(event)}
          style={{ color: '#333132', backgroundColor: 'white' }}
          className="flex text-[12px] flex-col absolute inset-0 
          w-full h-full justify-center items-center
         shadow-lg z-60 transition-opacity duration-[900ms]"
        >
          <Eye size="18px" />
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
