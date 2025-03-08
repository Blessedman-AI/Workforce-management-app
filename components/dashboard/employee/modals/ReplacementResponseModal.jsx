'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment';

import { X as XIcon } from 'lucide-react';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReplacementResponseModal = ({
  isReplacementResponseOpen,
  onReplacementResponseClose,
  request,
  // error,
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const shiftCreatorName =
    request?.shift?.createdByUser?.firstName +
    ' ' +
    request?.shift?.createdByUser?.lastName;

  //   console.log('request🔴', request);
  //   console.log('shiftCreatorName 😉', shiftCreatorName);

  const handleResponse = async (status) => {
    setLoading(true);
    const loadingToastId = toast.loading('Processing request...');
    try {
      const response = await axios.post(
        `/api/shift-exchange/${request?.id}/respond`,
        { status }
      );

      toast.dismiss(loadingToastId);
      if (status === 'ACCEPTED') {
        toast.success('Exchange request accepted!', {
          duration: 4000,
          icon: '✅',
        });
      } else if (status === 'REJECTED') {
        toast.success('Exchange request rejected!', {
          duration: 4000,
          icon: '❌',
        });
      }

      console.log('response📩:', response);
      router.refresh();
      onReplacementResponseClose();
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error('Error processing request. Please try again.', {
        duration: 5000,
      });
      console.error('Error responding to request:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!request) return null;

  return isReplacementResponseOpen ? (
    <div>
      <Dialog
        open={isReplacementResponseOpen}
        as="div"
        className="relative z-10"
        onClose={onReplacementResponseClose}
      >
        <div className="fixed inset-0 bg-black/60">
          <div
            className="flex min-h-full items-center justify-center
           p-4 text-center"
          >
            <DialogPanel
              className="w-full max-w-[50vw] xl:max-w-[40vw]   transform
         rounded-b-2xl rounded-t-3xl bg-white text-left
           align-middle shadow-xl transition-all"
            >
              {/* {request.respondedAt && request.status && (
                <div>
                  <p>{`You have already ${request.status.toLowerCase()} this request`}</p>
                </div>
              )} */}
              <DialogTitle
                as="h3"
                className="text-subheading-1 rounded-t-2xl px-8 py-4
                 w-full bg-purple-1 text-white font-medium leading-6
                  flex justify-between items-center mb-8"
              >
                <div className="text-[16px] font-semibold">
                  Shift Exchange Request
                </div>

                <button
                  type="button"
                  className="rounded-md  text-white
                focus:border-none focus:outline-none"
                  onClick={onReplacementResponseClose}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </DialogTitle>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-y-4">
                  <div className="text-gray-600">From</div>
                  <div>
                    {' '}
                    {request?.requester?.firstName}{' '}
                    {request?.requester?.lastName}
                  </div>
                  <div className="text-gray-600">Date</div>
                  <div>
                    {moment(request?.shift?.start).format('MMMM d, yyyy')}
                  </div>

                  <div className="text-gray-600">Start & End time</div>
                  <div>
                    {moment(request?.shift?.start).format('h:mm a')} -{' '}
                    {moment(request?.shift?.end).format('h:mm a')}
                  </div>

                  <div className="text-gray-600">Break</div>
                  <div>1 minutes</div>

                  <div className="text-gray-600">Created by</div>
                  <div>{shiftCreatorName}</div>
                </div>
              </div>
              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex  gap-4">
                <button
                  onClick={() => handleResponse('ACCEPTED')}
                  disabled={loading}
                  className="button-primary disabled:bg-purple-300"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleResponse('REJECTED')}
                  disabled={loading}
                  className="button-secondary disabled:text-gray-400"
                >
                  Reject
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  ) : null;
};

export default ReplacementResponseModal;
