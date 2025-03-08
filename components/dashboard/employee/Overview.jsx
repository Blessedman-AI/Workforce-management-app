'use client';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { dummyShifts } from '@/helpers/data.js';
import Link from 'next/link';
import ReplacementConfirmationModal from './modals/ReplacementConfirmationModal';
import Greeting from '@/components/Greeting';
import BadgeButton from '../buttons/BadgeButton';
import { useSession } from 'next-auth/react';
import Spinner from '@/components/Spinner';
import { AssignedShifts, findExchangeRequest } from '@/helpers/utils';
import { useAssignedShifts } from '@/hooks/useShiftDuration';
import ReplacementResponseModal from './modals/ReplacementResponseModal';
import toast from 'react-hot-toast';
import CircularSpinner from '@/components/Spinners';

const Overview = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isReplacementResponseOpen, setIsReplacementResponseOpen] = useState();
  const { data: session, update: updateSession } = useSession();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { shifts, loadingShifts } = useAssignedShifts({
    assignedShifts: session?.user?.assignedShifts || [],
    refreshTrigger,
  });
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [updatedRequests, setUpdatedRequests] = useState([]);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestId = searchParams.get('requestId');
  const action = searchParams.get('action');

  const pathname = usePathname();
  const processedRequestRef = useRef(null);

  // useEffect(() => {
  //   console.log('use effect running...');
  //   const loadExchangeRequest = async () => {
  //     if (!requestId || action !== 'respond') return;

  //     setLoadingRequests(true);
  //     const loadingToastId = toast.loading('Processing...');

  //     try {
  //       const exchangeRequest = await findExchangeRequest(requestId);

  //       if (exchangeRequest?.respondedAt) {
  //         const errorMessage = `You already ${exchangeRequest.status.toLowerCase()} on this request`;
  //         setError(errorMessage);
  //         toast.error(errorMessage);
  //         router.replace(pathname, undefined, { shallow: true });
  //         return;
  //       }

  //       if (exchangeRequest) {
  //         setCurrentRequest(exchangeRequest);
  //         setIsReplacementResponseOpen(true);
  //         router.replace(pathname, undefined, { shallow: true });
  //       }
  //     } catch (error) {
  //       console.error('Error loading exchange request:', error);
  //       setError(error);
  //     } finally {
  //       setLoadingRequests(false);
  //       toast.dismiss(loadingToastId);
  //     }
  //   };

  //   loadExchangeRequest();
  // }, [requestId, action]);

  useEffect(() => {
    console.log('use effect running...');
    const loadExchangeRequest = async () => {
      // Only run if we have params and haven't processed this request already
      if (
        !requestId ||
        action !== 'respond' ||
        processedRequestRef.current === requestId
      )
        return;

      // Set ref to track that we've processed this request
      processedRequestRef.current = requestId;

      setLoadingRequests(true);
      const loadingToastId = toast.loading('Processing...');

      try {
        const exchangeRequest = await findExchangeRequest(requestId);

        if (exchangeRequest?.respondedAt) {
          const errorMessage = `You already ${exchangeRequest.status.toLowerCase()} on this request`;
          setError(errorMessage);
          toast.error(errorMessage);
          router.replace(pathname, undefined, { shallow: true });
          return;
        }

        if (exchangeRequest) {
          setCurrentRequest(exchangeRequest);
          setIsReplacementResponseOpen(true);
          router.replace(pathname, undefined, { shallow: true });
        }
      } catch (error) {
        console.error('Error loading exchange request:', error);
        setError(error);
      } finally {
        setLoadingRequests(false);
        toast.dismiss(loadingToastId);
      }
    };

    loadExchangeRequest();
  }, [requestId, action, pathname, router]);
  // console.log('current request💵', currentRequest);

  if (loadingShifts || loadingRequests || !shifts) {
    return (
      <div className="w-full h-full py-[50px]">
        <CircularSpinner />
      </div>
    );
  }

  return (
    <>
      {shifts && (
        <div className="w-full p-4 sm:p-6 bg-purple-2 rounded-lg shadow overflow-x-auto">
          <div className="mb-6">
            <h2 className="text-subheading-2 ">My schedule</h2>
          </div>
          {shifts.length === 0 ? (
            <div>
              <p>No shifts yet</p>
            </div>
          ) : (
            <>
              {/* Desktop view */}
              <div className="hidden sm:block">
                <table className="w-full">
                  <thead>
                    <tr className="bg-purple-1 text-white text-left">
                      <th className="p-2 font-semibold">Shift</th>
                      <th className="p-2 font-semibold">Date</th>
                      <th className="p-2 font-semibold">Time</th>
                      <th className="p-2">Created by</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shifts?.map((shift) => (
                      <tr
                        key={shift.id}
                        className="border-b text-left hover:bg-grey-2 cursor-pointer"
                      >
                        <td className="p-2">{shift.title}</td>
                        <td className="p-2">{shift.date}</td>
                        <td className="p-2">{shift.time}</td>
                        <td className="p-2">{shift.createdBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile view */}
              <div className="sm:hidden">
                {shifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="mb-4 p-4 border rounded-lg bg-white hover:bg-grey-2 cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{shift.title}</span>
                      <Link href="/">
                        <span className="text-grey-3 hover:text-grey-3">
                          View details
                        </span>
                      </Link>
                    </div>
                    <div className="text-grey-3">{shift.date}</div>
                    <div className="mt-1 font-medium">{shift.time}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <ReplacementResponseModal
        isReplacementResponseOpen={isReplacementResponseOpen}
        onReplacementResponseClose={async () => {
          setIsReplacementResponseOpen(false);
          setCurrentRequest(null);
          await updateSession();
          processedRequestRef.current = null;
          setRefreshTrigger((prev) => prev + 1);
        }}
        request={currentRequest}
      />
    </>
  );
};

export default Overview;
