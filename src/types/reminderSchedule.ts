export type ScheduleMode = 'relative' | 'exact' | 'repeating';

export type ReminderScheduleType = 'once' | 'repeating';

export const MIN_RELATIVE_MINUTES = 1;
export const MIN_REPEAT_INTERVAL_MINUTES = 15;

export interface CreateReminderInput {
  title: string;
  body: string;
  mode: ScheduleMode;
  relativeMinutes?: number;
  exactTimestamp?: number;
  intervalMinutes?: number;
}

export function resolveScheduledAt(input: CreateReminderInput): number {
  switch (input.mode) {
    case 'relative':
      return Date.now() + (input.relativeMinutes ?? MIN_RELATIVE_MINUTES) * 60 * 1000;
    case 'exact':
      return input.exactTimestamp ?? Date.now();
    case 'repeating':
      return Date.now() + (input.intervalMinutes ?? MIN_REPEAT_INTERVAL_MINUTES) * 60 * 1000;
    default:
      return Date.now();
  }
}

export function validateCreateReminderInput(input: CreateReminderInput): string | null {
  if (!input.title.trim()) {
    return 'Please enter a reminder title.';
  }

  if (input.mode === 'relative') {
    const minutes = input.relativeMinutes ?? 0;
    if (!Number.isFinite(minutes) || minutes < MIN_RELATIVE_MINUTES) {
      return `Enter at least ${MIN_RELATIVE_MINUTES} minute.`;
    }
  }

  if (input.mode === 'exact') {
    if (!input.exactTimestamp || input.exactTimestamp <= Date.now()) {
      return 'Pick a date and time in the future.';
    }
  }

  if (input.mode === 'repeating') {
    const interval = input.intervalMinutes ?? 0;
    if (!Number.isFinite(interval) || interval < MIN_REPEAT_INTERVAL_MINUTES) {
      return `Repeating reminders must be at least every ${MIN_REPEAT_INTERVAL_MINUTES} minutes.`;
    }
  }

  return null;
}

export function formatScheduleLabel(reminder: {
  scheduleType: ReminderScheduleType;
  scheduledAt: number;
  intervalMinutes?: number;
}): string {
  if (reminder.scheduleType === 'repeating' && reminder.intervalMinutes) {
    return `Every ${reminder.intervalMinutes} min · next ~${new Date(reminder.scheduledAt).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    })}`;
  }

  return new Date(reminder.scheduledAt).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
