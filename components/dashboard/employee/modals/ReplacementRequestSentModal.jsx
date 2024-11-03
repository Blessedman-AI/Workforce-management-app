import { X as XIcon } from 'lucide-react';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';

const ReplacementRequestSentModal = ({
  isOpen,
  onClose,
  event,
  selectedUsers,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 bg-black/60">
        <div
          className="flex  min-h-full items-center justify-center
           p-4 text-center"
        >
          <DialogPanel
            className="flex flex-col w-full max-w-[40vw]  min-h-[50vh]  transform
         rounded-b-2xl rounded-t-3xl bg-white text-left
           align-middle shadow-xl transition-all"
          >
            <div
              className="w-full bg-purple-1 flex justify-end
             items-center rounded-t-2xl px-3 py-4 mb-8 text-white"
            >
              <button
                type="button"
                className="rounded-md  text-white
                focus:border-none focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* HEADER */}

            <DialogTitle
              as="h3"
              className="text-subheading-2 flex 
            items-center justify-center text-center mb-4"
            >
              Replacement request sent to {selectedUsers.join(' and ')}
            </DialogTitle>

            {/* CONTENT */}

            <Description
              as="p"
              className="px-4 flex-1 flex flex-col items-center
               justify-center
            text-center"
            >
              <span className="mb-5 w-4/5">
                We will notify you when {selectedUsers.join(' and ')} responds
                to your replacement request and your admin approves it.
              </span>
              <span className="w-2/3 text-gray-400">
                You will remain assigned to this shift until
                {selectedUsers.join(' and ')} responds to your request
              </span>
            </Description>

            {/* FOOTER */}
            <div className="flex mb-4 justify-end mr-4">
              <button onClick={onClose} className="button-primary">
                Done
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ReplacementRequestSentModal;
