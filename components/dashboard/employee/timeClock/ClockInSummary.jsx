import React, { useEffect, useState } from 'react';
import { Edit, NotebookPen } from 'lucide-react';

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import ShiftSummaryEditModal from './ShiftSummaryEditModal';

const ClockInSummary = ({
  shiftTitles,
  isOpen,
  onClose,
  shiftStart,
  shiftEnd,
  shiftDuration,
  clockIn,
  clockOut,
  overtime,
  shiftName,
  totalHours,
  note,
  onApprove,
}) => {
  const [showShiftSummaryEditModal, setShowShiftSummaryEditModal] =
    useState(false);

  const handleEdit = () => {
    setShowShiftSummaryEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowShiftSummaryEditModal(false);
    onClose(); // Close both modals when edit modal closes
  };

  const handleSendForApprovalRequest = () => {
    onClose();
    setShowShiftSummaryEditModal(false);
  };

  if (!isOpen) return null;

  // console.log('Overtime in Shiftsummary:', overtime);
  console.log('Initial data🔥', {
    shiftStart,
    shiftEnd,
    clockIn,
    clockOut,
    overtime,
    shiftName,
    totalHours,
    note,
  });

  return (
    <>
      <Dialog
        open={isOpen && !showShiftSummaryEditModal}
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
                {shiftName} summary
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
                    <div className="font-medium">{shiftStart}</div>
                  </div>

                  <div className="grid grid-cols-2  gap-6 mb-4">
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

                  <div className="grid grid-cols-2  gap-6">
                    <div>
                      <div
                        className="text-gray-500 flex justify-center
                       items-center border-b border-gray-300 bg-purple-2 shadow-sm
                    px-4 py-2 rounded-tr-md rounded-tl-md"
                      >
                        Total hours
                      </div>
                      <div
                        className="font-medium flex justify-center
                       items-center  border-gray-300 bg-purple-2 shadow-sm
                   px-4 py-2 rounded-br-md rounded-bl-md"
                      >
                        {totalHours}
                      </div>
                    </div>

                    <div>
                      <div
                        className="text-gray-500 flex justify-center
                       items-center border-b border-gray-300 bg-purple-2 shadow-sm
                    px-4 py-2 rounded-tr-md rounded-tl-md"
                      >
                        Overtime
                      </div>
                      <div
                        className="font-medium flex justify-center
                       items-center  border-gray-300 bg-purple-2 shadow-sm
                   px-4 py-2 rounded-br-md rounded-bl-md"
                      >
                        {overtime || '00:00:00'}
                      </div>
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
      {showShiftSummaryEditModal && (
        <ShiftSummaryEditModal
          isOpen={showShiftSummaryEditModal}
          onClose={handleCloseEditModal} // Close both modals on edit modal close
          onSendForApproval={handleSendForApprovalRequest}
          shiftTitles={shiftTitles}
          initialData={{
            shiftStart,
            shiftEnd,
            clockIn,
            clockOut,
            overtime,
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
