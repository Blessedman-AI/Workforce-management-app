'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import ReplacementConfirmationModal from '../employee/modals/ReplacementConfirmationModal';
import ReplacementRequestPreview from '../ReplacementRequestPreview';
import ReplacementApprovalSlider from '../admin/ReplacementApprovalSlider';

const BadgeButton = ({
  count = 1,
  requests = [],
  onConfirm,
  onDecline,
  children,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  // const adminPage = pathname?.startsWith('/admin');

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleRequestButtonClick = () => {
    const isAdminPage = pathname?.startsWith('/admin');
    setIsAdmin(isAdminPage); // Set admin status first

    if (isAdminPage) {
      setIsSliderOpen(true);
    } else {
      setIsPreviewOpen(true);
    }
  };

  const handleDecline = (request) => {
    console.log('Declined request:', request);
    setIsSliderOpen(false); // Use this instead of onClose
  };

  const handleApprove = (request) => {
    console.log('Approved request:', request);
    setIsSliderOpen(false); // Use this instead of onClose
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

      <ReplacementRequestPreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        requests={requests}
        onRequestClick={handleRequestClick}
      />

      {/* Details Modal */}
      {selectedRequest && (
        <ReplacementConfirmationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setSelectedRequest(null);
          }}
          onConfirm={() => {
            onConfirm?.(selectedRequest);
            setIsModalOpen(false);
            setSelectedRequest(null);
          }}
          onDecline={() => {
            onDecline?.(selectedRequest);
            setIsModalOpen(false);
            setSelectedRequest(null);
          }}
          requestData={selectedRequest}
        />
      )}
      <ReplacementApprovalSlider
        isOpen={isSliderOpen}
        onClose={() => setIsSliderOpen(false)}
        onDecline={handleDecline}
        onApprove={handleApprove}
        requests={requests}
        isAdmin={isAdmin}
      />
    </>
  );
};

export default BadgeButton;
