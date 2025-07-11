'use client';

import { Bell, TestTubeDiagonal } from 'lucide-react';
import { useState } from 'react';
import type { NotificationData } from '@/lib/types';
import { useFcm } from '@/hooks/use-fcm';
import { Button } from '@/components/ui/button';
import { NotificationForm } from '@/components/notification-form';
import { NotificationPreview } from '@/components/notification-preview';
import { NotificationLog } from '@/components/notification-log';
import { Card, CardContent } from '@/components/ui/card';

export default function AppLayout() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [templateData, setTemplateData] = useState<NotificationData>({
    title: 'Welcome to Firebase Notifier!',
    body: 'This is a sample notification. Edit the template to get started.',
    iconUrl: 'https://placehold.co/192x192.png',
    imageUrl: 'https://placehold.co/600x400.png',
  });

  const handleNewNotification = (data: NotificationData) => {
    const newNotification = {
      ...data,
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev].slice(0, 100)); // Keep max 100 logs
  };
  
  const { permission, requestPermission } = useFcm({ onMessage: handleNewNotification });

  const handleSendLocalNotification = (data: NotificationData) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        const { title, body, iconUrl, imageUrl } = data;
        const options: NotificationOptions = {
          body,
          icon: iconUrl || undefined,
          image: imageUrl || undefined,
        };
        new Notification(title, options);
        handleNewNotification(data);
      } else {
        requestPermission();
      }
    }
  };

  return (
    <div className="min-h-screen w-full">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Firebase Notifier</h1>
          </div>
          <Button
            onClick={requestPermission}
            variant={permission === 'granted' ? 'secondary' : 'default'}
            disabled={permission === 'granted'}
          >
            {permission === 'granted'
              ? 'Permissions Granted'
              : 'Enable Notifications'}
          </Button>
        </div>
      </header>

      <main className="container mx-auto grid grid-cols-1 gap-8 p-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <NotificationForm
            templateData={templateData}
            onTemplateChange={setTemplateData}
            onSendTest={handleSendLocalNotification}
          />
        </div>
        <div className="flex flex-col gap-8 lg:col-span-3">
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <TestTubeDiagonal className="h-5 w-5" />
              Notification Preview
            </h2>
            <Card>
              <CardContent className="p-4">
                <NotificationPreview data={templateData} />
              </CardContent>
            </Card>
          </div>
          <div className="flex-grow">
             <NotificationLog notifications={notifications} />
          </div>
        </div>
      </main>
    </div>
  );
}
