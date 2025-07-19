import { useEffect, useState } from 'react';
import initializePusher from '../lib/echo';

export const useSensorReadings = (pondId = null) => {
  const [newReading, setNewReading] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const pusherInstance = initializePusher();
    const channel = pusherInstance?.subscribe('sensor-readings');

    channel?.bind('pusher:subscription_succeeded', () => {
      console.log('✅ Connected to sensor-readings channel');
      setIsConnected(true);
    });

    channel?.bind('pusher:subscription_error', (error) => {
      console.error('Failed to subscribe to sensor-readings channel:', error);
      setIsConnected(false);
    });

    channel?.bind('sensor-reading.created', (data) => {
      setNewReading(data.data.reading);
      console.log('📊 New sensor reading received:', data);
      console.log(data.data.reading);
      
        

    });

    return () => {
      channel?.unbind_all();
      channel?.unsubscribe();
    };
  }, [pondId]);

  return { newReading, isConnected };
}; 