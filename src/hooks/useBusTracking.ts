import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface Bus {
  id: string;
  bus_number: string;
  route_name: string;
  status: string | null;
  created_at: string;
}

export const useBusTracking = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupRealtimeSubscription = async () => {
      try {
        // Fetch initial bus data
        const { data, error: fetchError } = await supabase
          .from('buses' as any)
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('Error fetching buses:', fetchError);
          setError(fetchError.message);
        } else {
          console.log('📍 Loaded buses:', data);
          setBuses((data as any[] as Bus[]) || []);
        }
        
        setIsLoading(false);

        // Subscribe to realtime changes
        channel = supabase
          .channel('buses-realtime')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'buses'
            },
            (payload) => {
              console.log('🔄 Bus update:', payload);
              
              if (payload.eventType === 'INSERT') {
                setBuses((prev) => [...prev, payload.new as Bus]);
              } else if (payload.eventType === 'UPDATE') {
                setBuses((prev) =>
                  prev.map((bus) =>
                    bus.id === (payload.new as Bus).id
                      ? (payload.new as Bus)
                      : bus
                  )
                );
              } else if (payload.eventType === 'DELETE') {
                setBuses((prev) =>
                  prev.filter((bus) => bus.id !== (payload.old as Bus).id)
                );
              }
            }
          )
          .subscribe((status) => {
            console.log('📡 Realtime subscription status:', status);
          });

      } catch (err) {
        console.error('Error setting up realtime:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    };

    setupRealtimeSubscription();

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return { buses, isLoading, error };
};
