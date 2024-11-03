import React from 'react';
import { X as XIcon } from 'lucide-react';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import moment from 'moment';

const ShiftDetailsModal = ({
  isOpen,
  onClose,
  handleShiftReplacementButtonClick,
  event,
}) => {
  if (!isOpen || !event) return null;

  // Calculate shift duration
  const start = moment(event.start);
  const end = moment(event.end);
  const duration = moment.duration(end.diff(start));
  const hours = duration.asHours();



  return (
    <div>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10"
        onClose={onClose}
      >
        <div className="fixed inset-0 bg-black/60">
          <div
            className="flex min-h-full items-center justify-center
           p-4 text-center"
          >
            <DialogPanel
              className="w-full max-w-[50vw]  transform
         rounded-b-2xl rounded-t-3xl bg-white text-left
           align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                className="text-subheading-1 rounded-t-2xl px-8 py-4
                 w-full bg-purple-1 text-white font-medium leading-6
                  flex justify-between items-center mb-8"
              >
                <div>
                  Shift: {event.employee} ,{' '}
                  {moment(event.start).format('ddd DD/MM/YYYY')}
                </div>

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

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-y-4">
                  <div className="text-gray-600">User</div>
                  <div>{event.employee}</div>

                  {/* <div className="text-gray-600">Department</div>
                  <div>{event.department || 'General'}</div> */}

                  <div className="text-gray-600">Shift</div>
                  <div>{event.title}</div>

                  <div className="text-gray-600">Start time & End time</div>
                  <div>
                    {moment(event.start).format('HH:mm')} -{' '}
                    {moment(event.end).format('HH:mm')} (
                    {hours % 1 === 0 ? hours : hours.toFixed(1)})
                  </div>

                  <div className="text-gray-600">Break</div>
                  <div>{event.Break} minutes</div>

                  <div className="text-gray-600">Scheduled on</div>
                  <div>
                    {moment(event.ScheduleDate).format('YYYY-MM-DD HH:mm:ss')}{' '}
                    by {event.scheduledBy || 'System'}
                  </div>
                </div>
              </div>
              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-4">
                <button onClick={onClose} className="button-secondary">
                  Close
                </button>
                <button
                  onClick={() => handleShiftReplacementButtonClick(event)}
                  className="button-primary"
                >
                  Request Exchange
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ShiftDetailsModal;
