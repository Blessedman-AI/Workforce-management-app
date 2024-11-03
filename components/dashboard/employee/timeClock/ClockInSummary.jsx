import React, { useEffect, useState } from 'react';
import { Edit, NotebookPen } from 'lucide-react';

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import ShiftSummaryEditSlideInModal from './ShiftSummaryEditSlideInModal';

const ClockInSummary = ({
  shiftTitles,
  isOpen,
  onClose,
  shiftDate,
  clockIn,
  clockOut,
  shiftName,
  totalHours,
  note,
  onApprove,
}) => {
  const [
    showShiftSummaryEditSlideInModal,
    setShowShiftSummaryEditSlideInModal,
  ] = useState(false);

  //   const handleEdit = () => {
  //     setShowShiftSummaryEditSlideInModal(true);
  //   };

  const handleEdit = () => {
    setShowShiftSummaryEditSlideInModal(true);
  };

  const handleCloseEditModal = () => {
    setShowShiftSummaryEditSlideInModal(false);
    onClose(); // Close both modals when edit modal closes
  };

  const handleSendForApprovalRequest = () => {
    onClose();
    setShowShiftSummaryEditSlideInModal(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog
        open={isOpen && !showShiftSummaryEditSlideInModal}
        onClose={onClose}
        className="relative z-[10]"
      >
        <div className="fixed inset-0 bg-black/60">
          <div
            className="flex min-h-full items-center justify-center 
          p-4 text-center"
          >
            <DialogPanel
              className="w-full max-w-[60vw]  transform bg-white
         rounded-b-2xl rounded-t-3xl  text-left
           align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h2"
                className="text-subheading-1 rounded-t-2xl px-8 py-4
                 w-full bg-purple-1 text-white font-medium leading-6
                  flex justify-between items-center "
              >
                Shift Summary
              </DialogTitle>

              {/* Content */}
              <div className="flex ">
                {/* Shift Details */}
                <div
                  className="flex flex-col flex-[0.55] p-6  border-r
               border-gray-300"
                >
                  <div
                    className="flex bg-purple-2 shadow-sm mb-4 py-4 px-4 
                  rounded-md items-center justify-between"
                  >
                    <div className="text-black font-medium mb-1">
                      Shift date
                    </div>
                    <div className="font-medium">{shiftDate}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div
                        className="text-gray-500 flex justify-center
                       items-center border-b border-gray-300 bg-purple-2 shadow-sm
                    px-4 py-2 rounded-tr-md rounded-tl-md"
                      >
                        Clock in
                      </div>
                      <div
                        className="font-medium flex justify-center
                       items-center  border-gray-300 bg-purple-2 shadow-sm
                   px-4 py-2 rounded-br-md rounded-bl-md"
                      >
                        {clockIn}
                      </div>
                    </div>

                    <div>
                      <div
                        className="text-gray-500 flex justify-center
                       items-center border-b border-gray-300 bg-purple-2 shadow-sm
                    px-4 py-2 rounded-tr-md rounded-tl-md"
                      >
                        Clock out
                      </div>
                      <div
                        className="font-medium flex justify-center
                       items-center  border-gray-300 bg-purple-2 shadow-sm
                   px-4 py-2 rounded-br-md rounded-bl-md"
                      >
                        {clockOut}
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex bg-purple-2 shadow-sm mt-4 py-4 px-4 
                  rounded-md items-center space-x-6 w-full"
                  >
                    <div className="text-black font-medium">Total hours</div>
                    <div className="flex items-center space-x-2">
                      <div
                        className="bg-teal-100 text-teal-700 px-3 py-1 
                    rounded-full text-sm"
                      >
                        {shiftName}
                      </div>
                      <div className="font-bold text-xl">{totalHours}</div>
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                <div className="flex flex-col flex-[0.45] p-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Shift attachments
                  </h3>
                  <div className="flex items-center space-x-2">
                    <NotebookPen color="#8e49ff" />
                    <div className="text-gray-700">Note</div>
                  </div>
                  <div
                    className="border text-gray-600 flex items-center
                 rounded-lg p-4"
                  >
                    {note}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-300 rounded-b-2xl bg-gray-50 flex justify-end space-x-3">
                <button onClick={handleEdit} className=" button-secondary ">
                  {/* <Edit className="w-4 h-4 mr-2" /> */}
                  Edit shift
                </button>
                <button onClick={onApprove} className="button-primary ">
                  Approve shift
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {/* ShiftSummaryEditSlideInModal overlaying the ClockInSummary */}
      {showShiftSummaryEditSlideInModal && (
        <ShiftSummaryEditSlideInModal
          isOpen={showShiftSummaryEditSlideInModal}
          onClose={handleCloseEditModal} // Close both modals on edit modal close
          onSendForApproval={handleSendForApprovalRequest}
          shiftTitles={shiftTitles}
          initialData={{
            shiftDate,
            clockIn,
            clockOut,
            shiftName,
            totalHours,
            note,
          }}
          className="relative z-20" // Ensures this modal is on top
        />
      )}
    </>
  );
};

export default ClockInSummary;
