'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Info } from 'lucide-react';
import type { NotificationData } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface NotificationLogProps {
  notifications: NotificationData[];
}

export function NotificationLog({ notifications }: NotificationLogProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Notification Log
        </CardTitle>
        <CardDescription>
          A log of recently received and triggered notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-[300px] md:h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
              <Info className="h-8 w-8 mb-2" />
              <p className="font-semibold">No notifications yet</p>
              <p className="text-sm">Trigger a test or wait for a push notification.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Body</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notification, index) => (
                  <TableRow key={`${notification.timestamp}-${index}`}>
                    <TableCell className="whitespace-nowrap">
                      {notification.timestamp ? formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true }) : 'N/A'}
                    </TableCell>
                    <TableCell className="font-medium max-w-[150px] truncate">{notification.title}</TableCell>
                    <TableCell className="max-w-[250px] truncate">{notification.body}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
