'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment';

export default function ShiftExchangeResponse({ request }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResponse = async (status) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `/api/shift-exchange/${request.id}/respond`,
        { status }
      );

      console.log('response📩:', response);

      router.push('/shifts?response=success');
      router.refresh();
    } catch (error) {
      console.error('Error responding to request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-gray-600">From</p>
        <p className="font-medium">
          {request.requester.firstName} {request.requester.lastName}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-gray-600">Shift Details</p>
        <p className="font-medium">
          {moment(request.shift.start).format('MMMM d, yyyy')}
        </p>
        <p className="font-medium">
          {moment(request.shift.start).format('h:mm a')} -
          {moment(request.shift.end).format('h:mm a')}
        </p>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => handleResponse('ACCEPTED')}
          disabled={loading}
          className="button-primary"
        >
          Accept
        </button>
        <button
          onClick={() => handleResponse('REJECTED')}
          disabled={loading}
          className="button-secondary"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
