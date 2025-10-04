import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface BusPosition {
  vehicle_id: string;
  route_id: string | null;
  last_lat: number | null;
  last_lon: number | null;
  last_update: string | null;
}

export const useBusTracking = () => {
  const [buses, setBuses] = useState<BusPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupRealtimeSubscription = async () => {
      try {
        // Fetch initial bus positions
        const { data, error: fetchError } = await supabase
          .from('buses')
          .select('*')
          .order('last_update', { ascending: false });

        if (fetchError) {
          console.error('Error fetching buses:', fetchError);
          setError(fetchError.message);
        } else {
          console.log('📍 Loaded buses:', data);
          setBuses(data || []);
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
              console.log('🔄 Bus position update:', payload);
              
              if (payload.eventType === 'INSERT') {
                setBuses((prev) => [...prev, payload.new as BusPosition]);
              } else if (payload.eventType === 'UPDATE') {
                setBuses((prev) =>
                  prev.map((bus) =>
                    bus.vehicle_id === (payload.new as BusPosition).vehicle_id
                      ? (payload.new as BusPosition)
                      : bus
                  )
                );
              } else if (payload.eventType === 'DELETE') {
                setBuses((prev) =>
                  prev.filter((bus) => bus.vehicle_id !== (payload.old as BusPosition).vehicle_id)
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
