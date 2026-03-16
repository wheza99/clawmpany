import { useCallback, useEffect, useState } from 'react';
import type { Payment } from '../types/database.js';
import { supabase } from '../lib/supabase.js';

export interface UsePaymentsReturn {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getPendingPayments: () => Payment[];
}

export function usePayments(): UsePaymentsReturn {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    if (!supabase) {
      setError('Supabase is not configured');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setPayments(data as Payment[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const getPendingPayments = useCallback(
    () => payments.filter((p) => p.status === 'pending'),
    [payments]
  );

  return {
    payments,
    loading,
    error,
    refetch: fetchPayments,
    getPendingPayments,
  };
}
