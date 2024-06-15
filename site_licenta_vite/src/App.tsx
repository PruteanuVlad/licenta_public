import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { useEffect } from 'react';
import { Router } from './Router';

const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Acord primit.');
  }
};

const subscribeUser = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: 'BBdROhb681xQ1osDiyR8vC4Gq_xeDUpr_pWzJyfz2dabLwcrXR-4dD1v0y9vH9PunUhfiiyekom5M6Znw21ATz8',
  });

  await fetch('https://site-licenta-10aff3814de1.herokuapp.com/api/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default function App() {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const initNotificationSubscription = async () => {
      subscribeUser();
    };

    initNotificationSubscription();
  }, []);

  return (
    <MantineProvider>
      <Router />
    </MantineProvider>
  );
}
