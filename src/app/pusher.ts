// components/PusherPrivateListener.tsx
'use client';

import { useEffect } from 'react';
import Pusher from 'pusher-js';

// PUSHER_APP_CLUSTER=eu
// PUSHER_APP_ID=2010002
// PUSHER_APP_KEY=c7137e2e884c3e1d021c

export function PusherPrivateListener({ onData }: { onData?: (data: any) => void } = {}) {
  useEffect(() => {
    const doctorId = localStorage.getItem('doctor_id');
    if (!doctorId) return;

    Pusher.logToConsole = true;

    const pusher = new Pusher('c7137e2e884c3e1d021c', {
      cluster: 'eu',
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    });

    const channel = pusher.subscribe(`enter-patient.${doctorId}`);

    channel.bind('patient.entered', (data: any) => {
      console.log('Received data from private channel:', data);
      onData?.(data);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  return null;
}
