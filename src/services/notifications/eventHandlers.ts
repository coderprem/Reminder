import type { Event, EventDetail } from '@notifee/react-native';
import { EventType } from '@notifee/react-native';
import {
  NotificationActions,
  NotificationDataKeys,
  SNOOZE_DURATION_MS,
} from './constants';
import { cancelLocalNotification, snoozeNotification } from './display';
import { handleNotificationNavigation } from './navigation';
import { log } from '../../utils/logger';
import { ScreenNames } from '../../navigation/utils/ScreenNames';
import { store } from '../../store/store';
import { completeReminder } from '../../store/slice/reminders/remindersSlice';

export function getReminderIdFromEvent(detail: EventDetail): string | undefined {
  const value = detail.notification?.data?.[NotificationDataKeys.REMINDER_ID];
  return value != null ? String(value) : undefined;
}

export function getScreenNameFromEvent(detail: EventDetail): string | undefined {
  const value = detail.notification?.data?.[NotificationDataKeys.SCREEN_NAME];
  return value != null ? String(value) : undefined;
}

export async function handleNotificationEvent({ type, detail }: Event): Promise<void> {
  const { notification, pressAction } = detail;

  if (!notification) {
    return;
  }

  switch (type) {
    case EventType.DISMISSED:
      log('Notification dismissed', notification.id);
      break;

    case EventType.PRESS:
      handleNotificationNavigation({
        screenName: getScreenNameFromEvent(detail) ?? ScreenNames.HOME,
        reminderId: getReminderIdFromEvent(detail),
      });
      break;

    case EventType.ACTION_PRESS:
      await handleNotificationActionPress(notification, pressAction?.id);
      break;

    default:
      break;
  }
}

async function handleNotificationActionPress(
  notification: NonNullable<EventDetail['notification']>,
  actionId?: string,
): Promise<void> {
  const reminderIdRaw = notification.data?.[NotificationDataKeys.REMINDER_ID];
  const screenNameRaw = notification.data?.[NotificationDataKeys.SCREEN_NAME];
  const reminderId = reminderIdRaw != null ? String(reminderIdRaw) : undefined;
  const screenName = screenNameRaw != null ? String(screenNameRaw) : undefined;
  const title = notification.title ?? 'Reminder';
  const body = notification.body ?? '';

  switch (actionId) {
    case NotificationActions.SNOOZE:
      if (notification.id) {
        await snoozeNotification({
          notificationId: notification.id,
          title,
          body,
          delayMs: SNOOZE_DURATION_MS,
          data: {
            screenName: screenName === ScreenNames.HOME || screenName === ScreenNames.SEARCH
              ? screenName
              : ScreenNames.HOME,
            reminderId,
          },
        });
      }
      break;

    case NotificationActions.MARK_DONE:
    case NotificationActions.DISMISS:
      if (notification.id) {
        await cancelLocalNotification(notification.id);
      }
      if (reminderId) {
        store.dispatch(completeReminder(reminderId));
      }
      break;

    default:
      break;
  }
}
