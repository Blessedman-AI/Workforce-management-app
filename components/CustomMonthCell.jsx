import React from 'react';
import moment from 'moment';

const CustomMonthCell = (props) => {
  const { date, events = [] } = props;

  // Get all events for this day
  const dayEvents = events.filter((event) =>
    moment(event.start).isSame(date, 'day')
  );

  return (
    <div className="relative h-full w-full">
      <div className="h-full">{props.children}</div>
      {dayEvents.length === 2 && (
        <div
          className="absolute bottom-0 left-0 w-full px-1 py-0.5
           bg-teal-500 -z-50 text-gray-600 text-xs border-t
            border-gray-200 "
        >
          <span className="block text-center">+1 more</span>
        </div>
      )}
    </div>
  );
};

export default CustomMonthCell;
