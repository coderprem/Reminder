import notifee, {
  AndroidStyle,
  TimestampTrigger,
  TriggerType,
  TimeUnit,
  type IntervalTrigger,
} from '@notifee/react-native';
import {
  NotificationActions,
  NotificationChannels,
  NotificationDataKeys,
  NotificationTypes,
} from './constants';
import type {
  DisplayNotificationInput,
  NotificationPayload,
  ScheduleReminderInput,
  ScheduleRepeatingReminderInput,
} from './types';
import { ScreenNames } from '../../navigation/utils/ScreenNames';

function buildNotificationData(data?: NotificationPayload): Record<string, string> {
  const payload: Record<string, string> = {};

  if (data?.screenName) {
    payload[NotificationDataKeys.SCREEN_NAME] = data.screenName;
  }

  if (data?.reminderId) {
    payload[NotificationDataKeys.REMINDER_ID] = data.reminderId;
  }

  if (data?.type) {
    payload[NotificationDataKeys.TYPE] = data.type;
  }

  return payload;
}

function buildAndroidActions() {
  return [
    {
      title: 'Snooze 5m',
      pressAction: { id: NotificationActions.SNOOZE },
    },
    {
      title: 'Done',
      pressAction: { id: NotificationActions.MARK_DONE },
    },
    {
      title: 'Dismiss',
      pressAction: { id: NotificationActions.DISMISS },
    },
  ];
}

export async function displayLocalNotification({
  id,
  title,
  body,
  data,
  channelId = NotificationChannels.LEARNING,
  showActions = false,
}: DisplayNotificationInput): Promise<string> {
  const notificationId = id ?? `notification-${Date.now()}`;

  return notifee.displayNotification({
    id: notificationId,
    title,
    body,
    data: buildNotificationData(data),
    android: {
      channelId,
      smallIcon: 'ic_noti_small',
      pressAction: { id: 'default' },
      style: {
        type: AndroidStyle.BIGTEXT,
        text: body,
      },
      actions: showActions ? buildAndroidActions() : undefined,
    },
    ios: {
      sound: 'default',
      foregroundPresentationOptions: {
        badge: true,
        sound: true,
        banner: true,
        list: true,
      },
    },
  });
}

export async function updateLocalNotification({
  id,
  title,
  body,
  data,
  channelId = NotificationChannels.LEARNING,
}: DisplayNotificationInput & { id: string }): Promise<string> {
  return displayLocalNotification({ id, title, body, data, channelId });
}

export async function cancelLocalNotification(notificationId: string): Promise<void> {
  await notifee.cancelNotification(notificationId);
}

export async function scheduleReminderNotification({
  id,
  title,
  body,
  scheduledAt,
}: ScheduleReminderInput): Promise<string> {
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: scheduledAt,
    alarmManager: {
      allowWhileIdle: true,
    },
  };

  return notifee.createTriggerNotification(
    {
      id,
      title,
      body,
      data: buildNotificationData({
        screenName: ScreenNames.HOME,
        reminderId: id,
        type: NotificationTypes.REMINDER,
      }),
      android: {
        channelId: NotificationChannels.REMINDERS,
        smallIcon: 'ic_noti_small',
        pressAction: { id: 'default' },
        style: {
          type: AndroidStyle.BIGTEXT,
          text: body,
        },
        actions: buildAndroidActions(),
      },
      ios: {
        sound: 'default',
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
      },
    },
    trigger,
  );
}

export async function scheduleRepeatingReminderNotification({
  id,
  title,
  body,
  intervalMinutes,
}: ScheduleRepeatingReminderInput): Promise<string> {
  const trigger: IntervalTrigger = {
    type: TriggerType.INTERVAL,
    interval: intervalMinutes,
    timeUnit: TimeUnit.MINUTES,
  };

  return notifee.createTriggerNotification(
    {
      id,
      title,
      body,
      data: buildNotificationData({
        screenName: ScreenNames.HOME,
        reminderId: id,
        type: NotificationTypes.REMINDER,
      }),
      android: {
        channelId: NotificationChannels.REMINDERS,
        smallIcon: 'ic_noti_small',
        pressAction: { id: 'default' },
        style: {
          type: AndroidStyle.BIGTEXT,
          text: body,
        },
        actions: buildAndroidActions(),
      },
      ios: {
        sound: 'default',
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
      },
    },
    trigger,
  );
}

export async function cancelScheduledNotification(notificationId: string): Promise<void> {
  await notifee.cancelNotification(notificationId);
}

export async function snoozeNotification({
  notificationId,
  title,
  body,
  data,
  delayMs,
}: {
  notificationId: string;
  title: string;
  body: string;
  data?: NotificationPayload;
  delayMs: number;
}): Promise<string> {
  await notifee.cancelNotification(notificationId);

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: Date.now() + delayMs,
    alarmManager: {
      allowWhileIdle: true,
    },
  };

  return notifee.createTriggerNotification(
    {
      id: notificationId,
      title: `[Snoozed] ${title}`,
      body,
      data: buildNotificationData(data),
      android: {
        channelId: NotificationChannels.REMINDERS,
        smallIcon: 'ic_noti_small',
        pressAction: { id: 'default' },
        actions: buildAndroidActions(),
      },
      ios: {
        sound: 'default',
      },
    },
    trigger,
  );
}

export async function displaySimulatedPushNotification(): Promise<string> {
  return displayLocalNotification({
    title: 'Simulated Push Notification',
    body: 'This mimics what FCM delivers in the foreground. Wire @react-native-firebase/messaging to receive real pushes.',
    channelId: NotificationChannels.LEARNING,
    showActions: true,
    data: {
      screenName: ScreenNames.SEARCH,
      type: NotificationTypes.SIMULATED_PUSH,
    },
  });
}
