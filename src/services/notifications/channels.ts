import notifee, { AndroidImportance } from '@notifee/react-native';
import { NotificationChannels } from './constants';

export async function ensureNotificationChannels(): Promise<void> {
  await notifee.createChannel({
    id: NotificationChannels.REMINDERS,
    name: 'Reminders',
    description: 'Scheduled reminder notifications',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: true,
  });

  await notifee.createChannel({
    id: NotificationChannels.LEARNING,
    name: 'Learning Lab',
    description: 'Demo notifications while learning',
    importance: AndroidImportance.DEFAULT,
    sound: 'default',
  });
}
