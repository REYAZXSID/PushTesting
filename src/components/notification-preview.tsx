'use client';

import Image from 'next/image';
import { Bell, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NotificationData } from '@/lib/types';

interface NotificationPreviewProps {
  data: NotificationData;
}

export function NotificationPreview({ data }: NotificationPreviewProps) {
  const { title, body, iconUrl, imageUrl } = data;

  return (
    <div className="mx-auto w-full max-w-md rounded-xl bg-background/50 p-4 shadow-lg ring-1 ring-black/5">
      {imageUrl && (
         <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted relative mb-3">
            <Image
                src={imageUrl}
                alt="Notification Preview Image"
                layout="fill"
                objectFit="cover"
                data-ai-hint="notification image"
            />
         </div>
      )}
      <div className="flex items-start gap-4">
        <div className="mt-1 flex-shrink-0">
          {iconUrl ? (
            <Image
              src={iconUrl}
              alt="Notification Icon"
              width={40}
              height={40}
              className="rounded-full"
              data-ai-hint="company logo"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">
              {title || 'Notification Title'}
            </p>
            <p className="text-xs text-muted-foreground">now</p>
          </div>
          <p className={cn("text-sm text-muted-foreground", !body && "italic")}>
            {body || 'Notification body will appear here...'}
          </p>
        </div>
      </div>
    </div>
  );
}
