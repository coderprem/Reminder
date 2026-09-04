export const NotificationChannels = {
  REMINDERS: 'reminders',
  LEARNING: 'learning',
} as const;

export const NotificationActions = {
  SNOOZE: 'snooze',
  DISMISS: 'dismiss',
  MARK_DONE: 'mark-done',
} as const;

export const NotificationDataKeys = {
  SCREEN_NAME: 'screenName',
  REMINDER_ID: 'reminderId',
  TYPE: 'type',
} as const;

export const NotificationTypes = {
  REMINDER: 'reminder',
  LEARNING: 'learning',
  SIMULATED_PUSH: 'simulated_push',
} as const;

export const SNOOZE_DURATION_MS = 5 * 60 * 1000;
