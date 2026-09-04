import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ReminderScheduleType } from '../../../types/reminderSchedule';

export interface Reminder {
  id: string;
  title: string;
  body: string;
  scheduledAt: number;
  notificationId: string;
  isCompleted: boolean;
  createdAt: number;
  scheduleType: ReminderScheduleType;
  intervalMinutes?: number;
}

interface RemindersState {
  items: Reminder[];
}

const initialState: RemindersState = {
  items: [],
};

const remindersSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    addReminder: (state, action: PayloadAction<Reminder>) => {
      state.items.unshift(action.payload);
    },
    completeReminder: (state, action: PayloadAction<string>) => {
      const reminder = state.items.find((item) => item.id === action.payload);
      if (reminder) {
        reminder.isCompleted = true;
      }
    },
    deleteReminder: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateReminderSchedule: (
      state,
      action: PayloadAction<{ id: string; scheduledAt: number; notificationId: string }>,
    ) => {
      const reminder = state.items.find((item) => item.id === action.payload.id);
      if (reminder) {
        reminder.scheduledAt = action.payload.scheduledAt;
        reminder.notificationId = action.payload.notificationId;
        reminder.isCompleted = false;
      }
    },
  },
});

export const { addReminder, completeReminder, deleteReminder, updateReminderSchedule } =
  remindersSlice.actions;

export default remindersSlice.reducer;
