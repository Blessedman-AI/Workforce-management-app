'use client';

import { useState } from 'react';
import { Tooltip, Button } from 'antd';

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { format } from 'date-fns';

import {
  X as XIcon,
  ToggleLeft,
  Calendar,
  Clock,
  Plus,
  Info,
} from 'lucide-react';
// import { Tooltip } from '@/components/tooltip';

const AvailabilityModal = ({
  isOpen,
  onClose,
  availabilityFormData,
  handleSubmit,
  handleInputChange,
}) => {
  const handleToggle = () => {
    handleInputChange({
      target: {
        name: 'isAllDay',
        type: 'checkbox',
        checked: !availabilityFormData.isAllDay,
      },
    });
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10"
        onClose={onClose}
      >
        <div className="fixed inset-0 bg-black/60">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <DialogPanel
              className="w-full max-w-[50vw]  transform
         rounded-b-2xl rounded-t-3xl bg-white text-left
           align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                className="text-subheading-1 rounded-t-2xl px-8 py-4
                 w-full bg-purple-1 text-white font-medium leading-6
                  flex justify-between items-center "
              >
                Add Unavailability
                <button
                  type="button"
                  className="rounded-md  text-white
                focus:border-none focus:outline-none"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </DialogTitle>

              <div className="scrollbar-custom max-h-[80vh]  overflow-y-auto">
                <form onSubmit={handleSubmit} className="px-8 pt-8">
                  <div className="flex gap-4 items-center mb-4">
                    <div className="flex justify-center  gap-[2px]">
                      <label className="text-sm font-medium text-gray-700">
                        Unavailable all day
                      </label>
                      <Tooltip title="Toggle on to set your unavailability for a whole day">
                        <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                      </Tooltip>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={availabilityFormData.isAllDay}
                      className={`${
                        availabilityFormData.isAllDay
                          ? 'bg-purple-1'
                          : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer
                   rounded-full border-2 border-transparent transition-colors
                    duration-200 ease-in-out focus:outline-none focus:ring-2
                     focus:ring-purple-2 focus:ring-offset-2`}
                      onClick={handleToggle}
                    >
                      <span
                        aria-hidden="true"
                        className={`${
                          availabilityFormData.isAllDay
                            ? 'translate-x-5'
                            : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform
                       rounded-full bg-white shadow ring-0 transition
                        duration-200 ease-in-out`}
                      />
                    </button>
                  </div>

                  <div className="flex gap-10 items-center my-4">
                    <div className="flex item-center justify-center gap-[2px]">
                      <label
                        className=" text-sm font-medium
                   text-gray-700 mb-1"
                      >
                        Date
                      </label>

                      <Tooltip
                        title="Set the date of your unavailability"
                        placement="topLeft"
                        overlayInnerStyle={{
                          fontSize: '13px',
                        }}
                      >
                        <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                      </Tooltip>
                    </div>
                    <div className="">
                      <input
                        type="date"
                        name="date"
                        id="date"
                        className="block  p-2 border rounded shadow-sm
                       sm:text-sm"
                        value={availabilityFormData.date}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {!availabilityFormData.isAllDay && (
                    <div className="flex gap-10 items-center mb-4">
                      <div className="flex gap-[2px]">
                        <label
                          htmlFor="From"
                          className="block text-sm font-medium text-gray-700"
                        >
                          From
                        </label>
                        <Tooltip
                          title="Set the duration of your unavailability"
                          placement="topLeft"
                          overlayInnerStyle={{
                            fontSize: '13px',
                          }}
                        >
                          <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                        </Tooltip>
                      </div>
                      <div className="flex w-[55%] items-center gap-4">
                        <input
                          type="time"
                          name="startTime"
                          id="startTime"
                          className=" w-[35%] rounded-md focus:outline-none
                     border-gray-300 shadow-sm  "
                          value={availabilityFormData.startTime}
                          onChange={handleInputChange}
                        />
                        <label
                          htmlFor="To"
                          className="block text-sm font-medium text-gray-700"
                        >
                          To
                        </label>

                        <input
                          type="time"
                          name="endTime"
                          id="endTime"
                          className=" block w-45%] focus:outline-none rounded-md
                     border-gray-300 shadow-sm sm:text-sm"
                          value={availabilityFormData.endTime}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center mb-4 gap-[52px]">
                    <label
                      htmlFor="note"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Note
                    </label>
                    <textarea
                      name="note"
                      id="note"
                      rows={3}
                      className="block w-[55%] p-2 border rounded shadow-sm
                     focus:border-none focus:outline-none sm:text-sm"
                      value={availabilityFormData.note}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex items-center mb-6">
                    <input
                      type="checkbox"
                      id="repeat"
                      name="repeat"
                      className=""
                      checked={availabilityFormData.repeat}
                      onChange={handleInputChange}
                    />

                    <label
                      htmlFor="repeat"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Repeat
                    </label>
                  </div>

                  {availabilityFormData.repeat && (
                    <div className="mb-6 items-center">
                      <div
                        className="inline-flex mb-4 gap-6
                     p-2 border rounded shadow-sm"
                      >
                        <div className="flex gap-[2px">
                          <label
                            className="block text-sm font-medium
                       text-gray-700"
                          >
                            Starting from
                          </label>
                          <Tooltip
                            title="Choose when you want the repeat to begin"
                            placement="topLeft"
                            overlayInnerStyle={{
                              fontSize: '13px',
                            }}
                          >
                            <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                          </Tooltip>
                        </div>

                        <input
                          type="date"
                          name="repeatStartDate"
                          id="repeatStartDate"
                          className="flex items-center sm:text-sm"
                          value={availabilityFormData.repeatStartDate}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="flex gap-4 mb-4">
                        <div className="flex-1 flex items-center">
                          <div className="flex gap-[2px]">
                            <span className="font-bold">Every</span>
                            <Tooltip
                              title="Choose how often you want your current unavailability
                               settings to apply"
                              placement="topLeft"
                              overlayInnerStyle={{
                                fontSize: '13px',
                              }}
                            >
                              <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                            </Tooltip>
                          </div>
                          <select
                            name="repeatEvery"
                            className="p-2 mx-2 font-bold"
                            value={availabilityFormData.repeatEvery}
                            onChange={handleInputChange}
                          >
                            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>

                          <span className="ml-2">
                            {availabilityFormData.repeatEvery === 1
                              ? 'Day'
                              : 'Days'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex gap-[6px]">
                          End repeat
                          <div className="flex gap-[2px]">
                            <span className="font-bold">After</span>
                            <Tooltip
                              title="Select the number of times you want you 
                              unavailablity settings to repeat before it stops"
                              placement="topLeft"
                              overlayInnerStyle={{
                                fontSize: '13px',
                              }}
                            >
                              <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                            </Tooltip>
                          </div>
                        </div>
                        <input
                          type="number"
                          name="repeatOccurrences"
                          className="w-16 p-2 border rounded-md"
                          value={availabilityFormData.repeatOccurrences}
                          onChange={handleInputChange}
                        />
                        <span className="self-center">occurrences</span>
                      </div>
                    </div>
                  )}
                  <div className="pb-4">
                    <button type="submit" className="button-primary">
                      Save unavailabity
                    </button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AvailabilityModal;
