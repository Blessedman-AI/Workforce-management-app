import React, { useState } from 'react';
import {
  Search,
  Filter,
  MessageCircle,
  ChevronDown,
  X as XIcon,
} from 'lucide-react';

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';

const ShiftEditRequests = ({ isOpen, onClose, requests }) => {
  //   console.log('⭕', requests);

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-[11]"
      onClose={onClose}
    >
      <div className="fixed inset-0 bg-black/60">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <DialogPanel
            className="w-full max-w-[70vw]  transform
         rounded-b-2xl rounded-t-3xl bg-white text-left
           align-middle shadow-xl transition-all"
          >
            <DialogTitle
              as="h2"
              className="text-subheading-1 px-8 rounded-t-2xl
               py-4 w-full bg-purple-1
                 text-white font-medium leading-6 flex justify-between 
                 items-center"
            >
              Replacement requests
              <button
                onClick={onClose}
                className="p-1 hover:bg-purple-600 rounded-full cursor-pointer"
                aria-label="Close preview"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </DialogTitle>

            <div className="scrollbar-custom max-h-[80vh]  overflow-y-auto">
              <div
                className="flex items-center  justify-between
               my-6 px-4"
              >
                <div className="relative">
                  <button className="button-primary">
                    <span>Pending {requests.length}</span>
                  </button>
                </div>

                <div className="">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search"
                      className="px-4 py-2 pr-10 border border-gray-200 
                      rounded-lg"
                    />
                    <Search
                      className="absolute right-3 top-1/2 transform -translate-y-1/2
                       text-gray-400 cursor-pointer"
                      size={20}
                    />
                  </div>
                </div>
              </div>

              {/* Requests List */}
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="border-b   border-gray-200  p-6"
                  >
                    <div
                      className="flex items-center justify-center
                     gap-14"
                    >
                      {/* User Info */}
                      <div className="flex flex-col items-center">
                        <div
                          className="w-10 h-10 rounded-full bg-yellow-300 
                        flex items-center justify-center text-white font-bold"
                        >
                          {request.user.initials}
                        </div>
                        <div className="mt-2 text-sm">{request.user.name}</div>
                      </div>

                      {/* Shift Details */}
                      <div className=" grid grid-cols-2 gap-8">
                        <div>
                          {/*Original shift  */}
                          <div className="font-bold mb-4">Original shift:</div>
                          <div className="space-y-2">
                            <div className="flex flex-col items-start gap-2">
                              <div className="flex gap-8">
                                <span>{request.originalShift.startDate}</span>
                                <span>{request.originalShift.endDate}</span>
                              </div>
                              <div className="flex gap-2 font-bold">
                                <span className="text-black-1 ">
                                  {request.originalShift.startTime}
                                </span>
                                <span>→</span>
                                <span className="text-red-600">
                                  {request.originalShift.endTime}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-3 border-b pb-3">
                              <span className="font-bold text-red-600">
                                ({request.originalShift.duration})
                              </span>
                              <span className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                                <span>{request.originalShift.project}</span>
                              </span>
                            </div>

                            {request.originalShift.note && (
                              <div className="text-gray-500">
                                <span className="font-medium">Shift Note:</span>{' '}
                                {request.originalShift.note}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Shift edit request */}
                        <div>
                          <div className="font-bold mb-4">Edit requested:</div>
                          <div className="space-y-2">
                            <div className="flex flex-col items-start gap-2">
                              <div className="flex gap-8">
                                <span>{request.editRequested.endDate}</span>
                                <span>{request.editRequested.endDate}</span>
                              </div>
                              <div className="flex gap-2 font-bold">
                                <span className="text-black-1 ">
                                  {request.editRequested.startTime}
                                </span>
                                <span>→</span>
                                <span className="text-green-500">
                                  {request.editRequested.endTime}
                                </span>
                              </div>

                              <div className="flex gap-3 border-b pb-3">
                                <span className="font-bold text-green-500">
                                  ({request.editRequested.duration})
                                </span>
                                <span className="flex items-center gap-1">
                                  <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                                  <span>{request.editRequested.project}</span>
                                </span>
                              </div>
                              {/* Shift edit request note */}
                              <div>
                                {request.editRequested.note && (
                                  <div className="text-gray-500">
                                    <span className="font-medium">
                                      Shift Note:
                                    </span>{' '}
                                    {request.editRequested.note}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex  gap-12 items-center">
                        {/* Request Note */}
                        <div className=" font-medium">
                          <strong>Request Note:</strong> <br />{' '}
                          {request.requestNote}{' '}
                        </div>
                        {/* Action buttons */}
                        <div className="flex  flex-col  gap-2">
                          <button className="button-primary">Approve</button>
                          <button className="button-secondary">Decline</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Bottom Actions */}
              <div className="flex justify-end gap-4 py-6 px-6">
                <button className="button-secondary">Decline all</button>
                <button className="button-primary">Approve all</button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ShiftEditRequests;
