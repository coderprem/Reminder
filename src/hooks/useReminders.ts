import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addReminder,
  completeReminder,
  deleteReminder,
  type Reminder,
} from '../store/slice/reminders/remindersSlice';
import {
  cancelScheduledNotification,
  requestNotificationPermission,
  scheduleReminderNotification,
  scheduleRepeatingReminderNotification,
} from '../services/notifications';
import type { CreateReminderInput } from '../types/reminderSchedule';
import { resolveScheduledAt } from '../types/reminderSchedule';

function createReminderId(): string {
  return `reminder-${Date.now()}`;
}

export function useReminders() {
  const dispatch = useAppDispatch();
  const reminders = useAppSelector((state) => state.reminders.items);

  const activeReminders = reminders.filter((item) => !item.isCompleted);
  const completedReminders = reminders.filter((item) => item.isCompleted);

  const createReminder = useCallback(
    async (input: CreateReminderInput) => {
      const permission = await requestNotificationPermission();
      if (!permission.isGranted) {
        throw new Error('Notification permission is required to schedule reminders.');
      }

      const id = createReminderId();
      const { title, body, mode } = input;
      const reminderBody = body.trim() || 'Time for your reminder!';
      const scheduledAt = resolveScheduledAt(input);

      let notificationId: string;

      if (mode === 'repeating') {
        notificationId = await scheduleRepeatingReminderNotification({
          id,
          title,
          body: reminderBody,
          intervalMinutes: input.intervalMinutes!,
        });
      } else {
        notificationId = await scheduleReminderNotification({
          id,
          title,
          body: reminderBody,
          scheduledAt,
        });
      }

      const reminder: Reminder = {
        id,
        title,
        body: reminderBody,
        scheduledAt,
        notificationId,
        isCompleted: false,
        createdAt: Date.now(),
        scheduleType: mode === 'repeating' ? 'repeating' : 'once',
        intervalMinutes: mode === 'repeating' ? input.intervalMinutes : undefined,
      };

      dispatch(addReminder(reminder));
      return reminder;
    },
    [dispatch],
  );

  const markReminderComplete = useCallback(
    async (reminder: Reminder) => {
      await cancelScheduledNotification(reminder.notificationId);
      dispatch(completeReminder(reminder.id));
    },
    [dispatch],
  );

  const removeReminder = useCallback(
    async (reminder: Reminder) => {
      await cancelScheduledNotification(reminder.notificationId);
      dispatch(deleteReminder(reminder.id));
    },
    [dispatch],
  );

  return {
    reminders,
    activeReminders,
    completedReminders,
    createReminder,
    markReminderComplete,
    removeReminder,
  };
}
