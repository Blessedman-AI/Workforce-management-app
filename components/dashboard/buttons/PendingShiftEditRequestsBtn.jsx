'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import ReplacementConfirmationModal from '../employee/modals/ReplacementConfirmationModal';
import ReplacementRequestPreview from '../ReplacementRequestPreview';
import ReplacementApprovalSlider from '../admin/ReplacementApprovalSlider';
import ShiftEditRequests from '../admin/ShiftEditRequests';

const PendingShiftEditRequestsBtn = ({
  count,
  requests = [],
  onApprove,
  onDecline,
  children,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  // console.log('🔥', requests);

  const handleRequestButtonClick = () => {
    const isAdminPage = pathname?.startsWith('/admin');
    setIsAdmin(isAdminPage); // Set admin status first

    if (isAdminPage) {
      setIsSliderOpen(true);
    }
  };

  const handleDecline = (request) => {
    console.log('Declined request:', request);
  };

  const handleApprove = (request) => {
    console.log('Approved request:', request);
  };

  return (
    <>
      <button
        typeof="button"
        // onClick={() => setIsPreviewOpen(true)}
        onClick={handleRequestButtonClick}
        className="button-tertiary cursor-pointer relative"
      >
        {children}
        <span
          className="cursor-pointer absolute -top-3 -left-2 flex items-center 
      justify-center h-5 w-5 rounded-full bg-purple-1
       text-white text-xs"
        >
          {count}
        </span>
      </button>
      {isSliderOpen && (
        <ShiftEditRequests
          isOpen={isSliderOpen}
          onClose={() => setIsSliderOpen(false)}
          requests={requests}
        />
      )}
    </>
  );
};

export default PendingShiftEditRequestsBtn;
