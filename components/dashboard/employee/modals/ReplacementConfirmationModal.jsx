import { format } from 'date-fns';
import { Clock, Calendar, X as XIcon } from 'lucide-react';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';

const ReplacementConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  onDecline,
  requestData,
}) => {
  const {
    requesterInitials = 'HB',
    replacementInitials = 'DO',
    requesterName = 'Hassleberg',
    shiftName = 'Testing shift',
    shiftStart = new Date(2024, 9, 24, 9, 0), // Oct 24, 2024 9:00 AM
    shiftEnd = new Date(2024, 9, 24, 17, 0), // Oct 24, 2024 5:00 PM
    shiftDuration = '8:00',
  } = requestData || {};

  return (
    <Dialog open={isOpen} as="div" className="relative z-[3]" onClose={onClose}>
      <div className="fixed inset-0 bg-black/60">
        <div
          className="flex min-h-full items-center justify-center
           p-4 text-center"
        >
          <DialogPanel
            className="w-full min-w-[40vw] max-w-[40vw] min-h-[60vh] 
            transform rounded-b-2xl rounded-t-3xl bg-white text-left
           align-middle shadow-xl transition-all"
          >
            <DialogTitle
              as="h3"
              className="text-subheading-1 rounded-t-2xl py-4 px-4
                 w-full bg-purple-1 text-white font-medium leading-6
                  flex justify-between items-center mb-8"
            >
              <div>
                {requestData.requesterName} is looking for a replacement
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

            <div className="flex flex-col items-center justify-center ">
              <div className="flex items-center gap-x-4">
                <div
                  className="flex h-12 w-12 items-center 
              justify-center rounded-full bg-yellow-300 
              text-xl font-semibold"
                >
                  {requestData.requesterInitials}
                </div>
                <div className="text-2xl">→</div>
                <div
                  className="flex h-12 w-12 items-center 
              justify-center rounded-full bg-blue-700
               text-white text-xl font-semibold"
                >
                  {requestData.replacementInitials}
                </div>
              </div>

              <div
                className="w-5/6 my-6 pl-6 border border-gray-100 rounded-lg
               p-4 space-y-4"
              >
                <h3 className="text-lg font-semibold">
                  {requestData.shiftName}
                </h3>

                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock color="#8e49ff" className="h-5 w-5" />
                  <span>
                    {format(requestData.shiftStart, 'h:mm a')} -{' '}
                    {format(requestData.shiftEnd, 'h:mm a')} -{' '}
                    {requestData.shiftDuration} hours
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar color="#8e49ff" className="h-5 w-5" />
                  <span>
                    {format(requestData.shiftStart, 'EEEE, MMM d, yyyy')}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 ">
                Replacement requires admin approval
              </p>

              <div className="flex space-x-3 my-6">
                <button onClick={onDecline} className="button-secondary">
                  Decline
                </button>
                <button onClick={onConfirm} className="button-primary">
                  Confirm
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ReplacementConfirmationModal;
