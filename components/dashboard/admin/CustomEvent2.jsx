'use client';

import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import moment from 'moment';

const CustomEvent = ({ event, onEdit, onDelete }) => {
  const [isHovering, setIsHovering] = useState(false);
  const Admin = true;

  const handleEdit = (e) => {
    e.stopPropagation(); // Stop the event from bubbling up to the calendar
    if (onEdit) onEdit(shift, e);
  };

  const shift = event;

  const handleMouseEnter = () => {
    console.log('Mouse entered:', shift.title);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    console.log('Mouse left:', shift.title);
    setIsHovering(false);
  };

  const handleDelete = (event) => {
    e.stopPropagation();

    console.log('Delete event:', event);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative h-full"
      style={{ minHeight: '30px' }}
    >
      <div className="text-center pt-1 text-[12px] font-bold">
        <div className="font-bold text-left">{event.title}</div>
      </div>
      {isHovering && Admin && (
        <div
          className="absolute -bottom-6 left-0 right-0 flex 
        justify-center space-x-4 bg-white px-2 py-1 rounded shadow-lg
         z-50 transition-opacity duration-300"
        >
          <button
            onClick={handleEdit}
            disabled={!Admin}
            className="text-gray-600 hover:text-purple-1"
          >
            <Pencil size={18} />
          </button>
          <span className="h-5 w-px bg-gray-300"></span>
          <button
            onClick={handleDelete}
            className="text-gray-600 hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomEvent;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Pencil, Trash2, Plus } from 'lucide-react';

// const CustomEvent = ({ event, onEdit, onDelete }) => {
//   const [isHovering, setIsHovering] = useState(false);
//   const Admin = true;

//   const handleEdit = (e) => {
//     e.stopPropagation(); // Stop the event from bubbling up to the calendar
//     if (onEdit) onEdit(shift, e);
//   };

//   const shift = event;

//   useEffect(() => {
//     console.log('CustomEvent rendered:', shift.title);
//   }, [shift.title]);

//   const handleMouseEnter = () => {
//     console.log('Mouse entered:', shift.title);
//     setIsHovering(true);
//   };

//   const handleMouseLeave = () => {
//     console.log('Mouse left:', shift.title);
//     setIsHovering(false);
//   };

//   const handleDelete = (event) => {
//     e.stopPropagation();

//     console.log('Delete event:', event);
//   };

//   const handleAdd = (e) => {
//     e.stopPropagation();
//     console.log('Add to event:', event);
//   };

//   return (
//     <div
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       className="relative h-full"
//       style={{ minHeight: '30px' }}
//     >
//       <div className="text-center">{event.title}</div>
//       {isHovering && Admin && (
//         <div
//           className="absolute -bottom-6 left-0 right-0 flex
//         justify-center space-x-4 bg-white px-2 py-1 rounded shadow-lg
//          z-50 transition-opacity duration-300"
//         >
//           <button
//             onClick={handleEdit}
//             disabled={!Admin}
//             className="text-gray-600 hover:text-purple-1"
//           >
//             <Pencil size={18} />
//           </button>
//           <span className="h-5 w-px bg-gray-300"></span>
//           <button
//             onClick={handleDelete}
//             className="text-gray-600 hover:text-red-600"
//           >
//             <Trash2 size={18} />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomEvent;
