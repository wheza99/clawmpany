import { useCallback, useEffect, useState } from 'react';
import type { Server } from '../types/database.js';
import { supabase } from '../lib/supabase.js';

export interface UseServersReturn {
  servers: Server[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getServerCount: () => number;
}

export function useServers(): UseServersReturn {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServers = useCallback(async () => {
    if (!supabase) {
      setError('Supabase is not configured');
      setLoading(false);
      return;
    }

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setServers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('servers')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setServers(data as Server[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchServers();

    // Listen for auth state changes to clear data on logout
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') {
          setServers([]);
        } else if (event === 'SIGNED_IN') {
          fetchServers();
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [fetchServers]);

  const getServerCount = useCallback(() => servers.length, [servers]);

  return {
    servers,
    loading,
    error,
    refetch: fetchServers,
    getServerCount,
  };
}
