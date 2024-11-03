import React, { useState } from 'react';
import { X as XIcon, Check, CheckSquare } from 'lucide-react';

const ReplacementApprovalSlider = ({
  isOpen,
  onClose,
  onDecline,
  onApprove,
  requests,
}) => {
  const [selectedRequests, setSelectedRequests] = useState(new Set());
  const [batchAction, setBatchAction] = useState(null);

  if (!requests) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
    });
  };

  const handleSelectAll = (action) => {
    if (batchAction === action) {
      setSelectedRequests(new Set());
      setBatchAction(null);
    } else {
      const allIndices = requests.map((_, index) => index);
      setSelectedRequests(new Set(allIndices));
      setBatchAction(action);
    }
  };

  const handleToggleRequest = (index) => {
    const newSelected = new Set(selectedRequests);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRequests(newSelected);

    // Clear batch action if no items are selected
    if (newSelected.size === 0) {
      setBatchAction(null);
    }
  };

  const handleBatchAction = () => {
    const selectedIndices = Array.from(selectedRequests);
    if (batchAction === 'approve') {
      onApprove(selectedIndices);
    } else {
      onDecline(selectedIndices);
    }
    setSelectedRequests(new Set());
    setBatchAction(null);
  };

  const getCheckboxStyles = (isSelected) => {
    if (!isSelected) {
      return {
        button: 'hover:bg-gray-100',
        icon: 'text-gray-400',
      };
    }

    if (batchAction === 'approve') {
      return {
        button: 'bg-purple-1/10',
        icon: 'text-purple-1',
      };
    }

    return {
      button: 'bg-red-100',
      icon: 'text-red-700',
    };
  };

  return (
    <div
      className={`fixed inset-0 bg-black/60 transition-opacity z-50
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div
        className={`scrollbar-custom fixed top-0 right-0 h-full bg-white shadow-lg
          w-[500px] transform transition-transform duration-500 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Main container with max height */}
        <div className="flex flex-col h-full max-h-screen">
          {/* Header section - fixed height */}
          <div className="border-b flex-none">
            <div className="flex justify-between items-center p-6">
              <h2 className="text-subheading-2">Replacement requests</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="px-6 pt-6">
              <div className="flex gap-4">
                <button
                  onClick={() => handleSelectAll('approve')}
                  className={`flex items-center gap-2 px-3 py-1 rounded ${
                    batchAction === 'approve'
                      ? 'bg-purple-1/10 text-purple-1'
                      : 'bg-gray-100'
                  }`}
                >
                  <CheckSquare className="h-4 w-4" />
                  Approve All
                </button>
                <button
                  onClick={() => handleSelectAll('decline')}
                  className={`flex items-center gap-2 px-3 py-1 rounded ${
                    batchAction === 'decline'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100'
                  }`}
                >
                  <CheckSquare className="h-4 w-4" />
                  Decline All
                </button>
              </div>

              {/* Requests list */}
              {requests.map((request, index) => {
                const styles = getCheckboxStyles(selectedRequests.has(index));
                return (
                  <div key={index} className="border-b pt-6 pb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <button
                        onClick={() => handleToggleRequest(index)}
                        className={`p-1 rounded ${styles.button}`}
                      >
                        <Check className={`h-4 w-4 ${styles.icon}`} />
                      </button>
                      <div className="text-center font-bold flex-1">
                        {request.requesterName} asked {request.replacementName}{' '}
                        for a replacement
                      </div>
                    </div>

                    <div className="relative h-20 flex justify-center items-center">
                      <div className="absolute left-0 flex flex-col items-center">
                        <div
                          className="bg-[#81a8cc] text-white-1 rounded-full
                           w-8 h-8 flex items-center justify-center font-semibold 
                         mb-2"
                        >
                          {request.requesterInitials}
                        </div>
                        <span className="text-[15px] font-semibold text-gray-600">
                          {request.requesterName}
                        </span>
                      </div>

                      <div className="w-[200px]">
                        <div className="bg-[#81a8cc] rounded-lg p-4">
                          <div className="text-white text-[14px]">
                            {formatDate(request.shiftStart)} -{' '}
                            {formatDate(request.shiftEnd)} (
                            {request.shiftDuration}
                            h)
                          </div>
                          <div className="text-sm text-white">
                            {request.shiftName}
                          </div>
                        </div>
                      </div>

                      <div className="absolute right-0 flex flex-col items-center">
                        <div
                          className="bg-[#81a8cc] rounded-full w-8 h-8 
                        flex items-center justify-center text-white font-semibold mb-2"
                        >
                          {request.replacementInitials}
                        </div>
                        <span className="text-[15px] font-semibold text-gray-600">
                          {request.replacementName}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                      <button
                        onClick={() => onDecline([index])}
                        className="decline-button"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => onApprove([index])}
                        className="button-primary"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer section with batch action - fixed height */}
          {selectedRequests.size > 0 && (
            <div className="flex-none  bg-white">
              <div className="flex items-center justify-center p-4">
                <button
                  onClick={handleBatchAction}
                  className={`relative ${
                    batchAction === 'approve'
                      ? 'button-primary'
                      : 'decline-button'
                  }`}
                >
                  {batchAction === 'approve' ? 'Approve' : 'Decline'}
                  <span
                    className={`cursor-pointer absolute -top-3 -left-2 flex items-center 
                    justify-center h-5 w-5 rounded-full text-xs ${
                      batchAction === 'approve'
                        ? 'bg-purple-1/70'
                        : 'bg-red-600/70'
                    }`}
                  >
                    {selectedRequests.size}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReplacementApprovalSlider;
