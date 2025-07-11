'use client';

import { useEffect, useState } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import type { NotificationData } from '@/lib/types';

interface UseFcmProps {
  onMessage: (data: NotificationData) => void;
}

export function useFcm({ onMessage: handleNewNotification }: UseFcmProps) {
  const { toast } = useToast();
  const [permission, setPermission] = useState<NotificationPermission | 'loading'>('loading');
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    } else {
      setPermission('denied');
    }
  }, []);

  const requestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    
    const currentPermission = await Notification.requestPermission();
    setPermission(currentPermission);

    if (currentPermission === 'granted') {
      await setupFcm();
    } else {
      toast({
        title: 'Permission Denied',
        description: 'You will not receive push notifications.',
        variant: 'destructive',
      });
    }
  };

  const setupFcm = async () => {
    if (typeof window === 'undefined' || !app) return;
    
    try {
      const messaging = getMessaging(app);
      if ('serviceWorker' in navigator) {
        const serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration
        });
  
        if (token) {
          setFcmToken(token);
          console.log('FCM Token:', token);
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      }
    } catch (error) {
      console.error('An error occurred while retrieving token. ', error);
      toast({
        title: 'FCM Setup Failed',
        description: 'Could not set up Firebase messaging. See console for details.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (permission === 'granted') {
      setupFcm();
    }
    
    if (typeof window !== 'undefined' && app && permission === 'granted') {
      const messaging = getMessaging(app);
      
      // Handle foreground messages
      unsubscribe = onMessage(messaging, (payload) => {
        console.log('Foreground message received.', payload);
        const notificationData: NotificationData = {
          title: payload.notification?.title || 'No Title',
          body: payload.notification?.body || 'No Body',
          iconUrl: payload.notification?.icon,
          imageUrl: payload.notification?.image,
        };
        handleNewNotification(notificationData);
        toast({
          title: notificationData.title,
          description: notificationData.body,
        });
      });
    }

    return () => {
      unsubscribe?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission]);

  return { permission, requestPermission, fcmToken };
}
