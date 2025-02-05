import { UserPlus, Crown } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function DropdownMenu({
  isOpen,
  onClose,
  triggerRef,
  onAddStaff,
  onAddAdmin,
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (triggerRef?.current?.contains(event.target)) {
        return;
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`
      absolute right-0 w-36 rounded-md shadow-lg bg-white-1 py-4 flex
       flex-col transition-all duration-300 ease-out transform
      ${
        isOpen
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-95 pointer-events-none'
      }
    `}
    >
      <div className="text-[14px] flex justify-center flex-col  gap-2 px-2">
        <button
          className="flex items-center gap-2 m-0 py-2 px-2 rounded-md transition-all duration-300 hover:bg-grey-2"
          onClick={onAddStaff}
        >
          <UserPlus color="#38c173" size={18} />
          Add Staff
        </button>

        <button
          className="flex items-center gap-2 m-0 py-2 px-2 rounded-md transition-all duration-300 hover:bg-grey-2"
          onClick={onAddAdmin}
        >
          <Crown color="#ff9500" size={18} />
          Add Admin
        </button>
      </div>
    </div>
  );
}
