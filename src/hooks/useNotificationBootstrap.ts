import { useEffect } from 'react';
import {
  bootstrapNotifications,
  subscribeToForegroundNotificationEvents,
} from '../services/notifications';

export function useNotificationBootstrap(): void {
  useEffect(() => {
    bootstrapNotifications().catch((error) => {
      console.error('Failed to bootstrap notifications', error);
    });

    return subscribeToForegroundNotificationEvents();
  }, []);
}
