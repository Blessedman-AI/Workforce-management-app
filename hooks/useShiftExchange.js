'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

export function useShiftExchange() {
  const [loading, setLoading] = useState(false);
  const [exchangeError, setExchangeError] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const sendExchangeRequest = async (shiftId, requestedUserId) => {
    setLoading(true);
    setExchangeError(null);

    try {
      if (!shiftId || !requestedUserId) {
        throw new Error('Missing required parameters');
      }

      if (!session?.user?.id) {
        throw new Error('Requester ID is required');
      }

      const response = await axios.post('/api/shift-exchange/request', {
        shiftId,
        requesterId: session?.user?.id,
        requestedUserId,
      });

      router.refresh();
      const data = response.data;
      console.log('👋🥗', data);

      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setExchangeError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    sendExchangeRequest,
    loading,
    exchangeError,
  };
}
