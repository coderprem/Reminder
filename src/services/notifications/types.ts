import type { ScreenName } from '../../navigation/utils/ScreenNames';
import type { NotificationTypes } from './constants';

export type NotificationType =
  (typeof NotificationTypes)[keyof typeof NotificationTypes];

export interface NotificationPayload {
  screenName?: ScreenName;
  reminderId?: string;
  type?: NotificationType;
}

export interface DisplayNotificationInput {
  id?: string;
  title: string;
  body: string;
  data?: NotificationPayload;
  channelId?: string;
  showActions?: boolean;
}

export interface ScheduleReminderInput {
  id: string;
  title: string;
  body: string;
  scheduledAt: number;
}

export interface ScheduleRepeatingReminderInput {
  id: string;
  title: string;
  body: string;
  intervalMinutes: number;
}
