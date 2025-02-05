import React from 'react';
import { X as XIcon } from 'lucide-react';
import useShiftDuration from '@/hooks/useShiftDuration';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

const ShiftSummaryEditModal = ({
  isOpen,
  onClose,
  onSendForApproval,
  shiftTitles,
  initialData,
}) => {
  const { shiftData, handleTimeChange } = useShiftDuration(initialData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    handleTimeChange(name, value);
  };

  console.log('⭕', shiftData);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[10]">
      <div className="fixed inset-0 bg-black/60">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <DialogPanel className="w-full max-w-[60vw] transform bg-white rounded-b-2xl rounded-t-3xl text-left align-middle shadow-xl transition-all">
            <DialogTitle
              as="h2"
              className="text-subheading-1 rounded-t-2xl px-8 py-4 mb-4 w-full bg-purple-1 text-white font-medium leading-6 flex justify-between items-center"
            >
              Edit shift request
              <button
                onClick={onClose}
                className="p-2 hover:bg-purple-600 rounded-full transition-colors"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </DialogTitle>

            <form
              onSubmit={onSendForApproval}
              className="flex flex-col flex-1 px-6 py-4 overflow-x-auto"
            >
              <div className="flex flex-col flex-grow">
                <div className="flex">
                  <div className="flex-[0.70]">
                    <div className="flex items-center space-x-6 mb-4">
                      <label className="font-medium" htmlFor="project">
                        Job:
                      </label>
                      <select
                        id="Job"
                        value={shiftData.shiftName}
                        onChange={(e) =>
                          handleTimeChange('shiftName', e.target.value)
                        }
                        className="bg-white border rounded-md text-gray-800 px-4 py-2"
                      >
                        <option value={shiftData.shiftName}>
                          {shiftData.shiftName}
                        </option>
                        {shiftTitles &&
                          shiftTitles
                            .filter((title) => title !== shiftData.shiftName)
                            .map((title, index) => (
                              <option key={index} value={title}>
                                {title}
                              </option>
                            ))}
                      </select>
                    </div>

                    <div className="flex items-center mb-4 space-x-2">
                      <label className="font-medium" htmlFor="startDate">
                        Starts:
                      </label>
                      <input
                        id="startDate"
                        type="date"
                        name="startDate"
                        value={shiftData.startDate}
                        onChange={handleChange}
                        className="bg-white border rounded-md text-gray-800 px-4 py-2"
                      />

                      <label className="space-x-2">At:</label>
                      <input
                        id="startTime"
                        type="time"
                        name="clockIn"
                        value={shiftData.clockIn}
                        onChange={handleChange}
                        step="60"
                        className="bg-white w-[27%] items-center justify-center border inline-flex rounded-md text-gray-800 pl-3 py-2"
                      />
                    </div>

                    <div className="flex items-center mb-4">
                      <label htmlFor="endDate" className="font-medium mr-4">
                        Ends:
                      </label>
                      <input
                        id="endDate"
                        type="date"
                        name="endDate"
                        value={shiftData.endDate}
                        onChange={handleChange}
                        className="bg-white border rounded-md text-gray-800 px-4 py-2"
                      />
                      <span className="mx-2">At:</span>
                      <input
                        id="endTime"
                        type="time"
                        name="clockOut"
                        value={shiftData.clockOut}
                        onChange={handleChange}
                        step="60"
                        className="bg-white w-[27%] text-gray-800 px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      Overtime:{' '}
                      <span
                        className="bg-purple-2 text-purple-1 py-1 px-2 rounded-lg
                       font-bold"
                      >
                        {shiftData.overtime}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col flex-[0.30] bg-purple-2 rounded-lg items-center justify-center">
                    <div className="text-purple-1 text-[18px]">Total hours</div>
                    <div className="text-purple-1 font-medium text-[30px]">
                      {shiftData.totalHours}
                    </div>
                  </div>
                </div>
                <div className="my-6 border-t border-t-gray-400">
                  <label
                    htmlFor="note"
                    className="block my-4 text-subheading-2"
                  >
                    Shift attachments
                  </label>
                  <div className="flex flex-col items-start justify-start">
                    <div className="mb-2"> 📝Note</div>
                    <input
                      id="note"
                      type="text"
                      name="note"
                      value={shiftData.note}
                      onChange={handleChange}
                      rows={4}
                      className="bg-white w-full text-gray-800 px-4 py-2 border rounded-md flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex">
                <button type="submit" className="button-primary">
                  Send for approval
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ShiftSummaryEditModal;
