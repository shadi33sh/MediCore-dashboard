// components/PusherPrivateListener.tsx
'use client';

import { useEffect } from 'react';
import Pusher from 'pusher-js';

// PUSHER_APP_CLUSTER=eu
// PUSHER_APP_ID=2010002
// PUSHER_APP_KEY=efdc857648cf7ce3e669
// PUSHER_APP_SECRET=ae449ed4efff501e5075

export function PusherPrivateListener({ doctorId  }: any) {
  Pusher.logToConsole = true;
  useEffect(() => {
    const pusher = new Pusher( "efdc857648cf7ce3e669", {
      cluster: 'eu',
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
      },
    });
    const channel = pusher.subscribe(`enter-patient.19`);
    channel.bind('patient.entered', (data: any) => {
      console.log('Received data from private channel:', data);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [doctorId]);

  return null;
}
