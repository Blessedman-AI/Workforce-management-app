import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { format } from 'date-fns';

import { X as XIcon } from 'lucide-react';

const ScheduleModal = ({
  isOpen,
  onClose,
  formData,
  handleSubmit,
  handleInputChange,
  employeeList,
  repeatFrequency,
  setRepeatFrequency,
}) => {
  return (
    <div>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10"
        onClose={onClose}
      >
        <div className="fixed inset-0 bg-black/60 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <DialogPanel
              className="w-full  max-w-[50vw] transform
          overflow-hidden rounded-b-2xl rounded-t-3xl bg-white text-left
           align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                className="text-subheading-1 px-8 py-4 w-full bg-purple-1
                 text-white font-medium leading-6 flex justify-between items-center"
              >
                Shift for {formData.employee} {' - '}
                {formData.date && !isNaN(new Date(formData.date).getTime())
                  ? format(new Date(formData.date), 'EEEE dd MMMM yyyy')
                  : 'No date selected'}
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

              <div className="scrollbar-custom max-h-[75vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="mt-4 p-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <label
                        htmlFor="date"
                        className="block  text-sm font-medium text-gray-700"
                      >
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        className="block w-[55%] p-2 border rounded shadow-sm
                     focus:border-none focus:outline-none sm:text-sm"
                        value={formData.date}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <label
                        htmlFor="shiftType"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Shift Type:
                      </label>
                      <input
                        name="shiftType"
                        className="block w-[55%] p-2 border rounded shadow-sm
                     focus:border-none focus:outline-none sm:text-sm"
                        value={formData.shiftType}
                        readOnly
                        // onChange={handleInputChange}
                      />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <label
                        htmlFor="employee"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Employee
                      </label>
                      <select
                        name="employee"
                        id="employee"
                        className="block w-[55%] p-2 border rounded shadow-sm
                     focus:border-none focus:outline-none sm:text-sm"
                        value={formData.employee}
                        onChange={handleInputChange}
                      >
                        <option value="">Select employee</option>
                        {employeeList.map((employee) => (
                          <option key={employee.id} value={employee.title}>
                            {employee.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <label
                        htmlFor="start & end time"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Start & End Time
                      </label>
                      <div className="flex w-[55%] items-center gap-4">
                        <input
                          type="time"
                          name="startTime"
                          id="startTime"
                          className="block w-[35%] rounded-md focus:outline-none
                     border-gray-300 shadow-sm  sm:text-sm"
                          value={formData.startTime}
                          onChange={handleInputChange}
                        />

                        <input
                          type="time"
                          name="endTime"
                          id="endTime"
                          className=" block w-45%] focus:outline-none rounded-md
                     border-gray-300 shadow-sm sm:text-sm"
                          value={formData.endTime}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <label
                        htmlFor="break"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Break (minutes)
                      </label>
                      <input
                        type="number"
                        name="break"
                        id="break"
                        className="block w-[55%] p-2 border rounded shadow-sm
                     focus:border-none focus:outline-none sm:text-sm"
                        value={formData.break}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows={3}
                        className="block w-[55%] p-2 border rounded shadow-sm
                     focus:border-none focus:outline-none sm:text-sm"
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="flex items-center justify-between  mb-4">
                      <label
                        htmlFor="repeat shift"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {''}
                      </label>
                      <div className="flex w-[55%] items-center">
                        <input
                          type="checkbox"
                          name="repeatShift"
                          id="repeatShift"
                          className=""
                          checked={formData.repeatShift}
                          onChange={handleInputChange}
                        />
                        <label
                          htmlFor="repeatShift"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Repeat shift
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between  mb-4">
                      {formData.repeatShift && (
                        <>
                          <label className="block  text-sm font-medium text-gray-700">
                            Repeat this shift every
                          </label>
                          <select
                            value={repeatFrequency}
                            onChange={(e) => setRepeatFrequency(e.target.value)}
                            className="block w-[55%] p-2 border rounded shadow-sm
                     focus:border-none focus:outline-none sm:text-sm"
                          >
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                          </select>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between  mb-4">
                      <label
                        htmlFor="send notification"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {''}
                      </label>
                      <div className="flex w-[55%] items-center">
                        <input
                          type="checkbox"
                          name="sendNotification"
                          id="sendNotification"
                          className=""
                          checked={formData.sendNotification}
                          onChange={handleInputChange}
                        />
                        <label
                          htmlFor="sendNotification"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Send notification
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      className="mr-4 button-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="button-primary">
                      Save
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

export default ScheduleModal;
