import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import AppInput from '../../../components/AppInput';
import AppButton from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { ch, cw } from '../../../utils/dimensions';
import type { CreateReminderInput, ScheduleMode } from '../../../types/reminderSchedule';
import {
  MIN_RELATIVE_MINUTES,
  MIN_REPEAT_INTERVAL_MINUTES,
  validateCreateReminderInput,
} from '../../../types/reminderSchedule';

interface AddReminderFormProps {
  onSubmit: (input: CreateReminderInput) => Promise<void>;
}

const QUICK_RELATIVE_OPTIONS = [1, 5, 15, 30, 60] as const;

const SCHEDULE_MODES: { id: ScheduleMode; label: string }[] = [
  { id: 'relative', label: 'In minutes' },
  { id: 'exact', label: 'Exact time' },
  { id: 'repeating', label: 'Repeating' },
];

function getDefaultExactDate(): Date {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 30);
  date.setSeconds(0, 0);
  return date;
}

function parsePositiveInt(value: string, fallback: number): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const AddReminderForm = ({ onSubmit }: AddReminderFormProps) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mode, setMode] = useState<ScheduleMode>('relative');
  const [relativeMinutesInput, setRelativeMinutesInput] = useState('10');
  const [intervalMinutesInput, setIntervalMinutesInput] = useState('30');
  const [exactDate, setExactDate] = useState(getDefaultExactDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const relativeMinutes = useMemo(
    () => parsePositiveInt(relativeMinutesInput, MIN_RELATIVE_MINUTES),
    [relativeMinutesInput],
  );

  const intervalMinutes = useMemo(
    () => parsePositiveInt(intervalMinutesInput, MIN_REPEAT_INTERVAL_MINUTES),
    [intervalMinutesInput],
  );

  const handleExactDateChange = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'dismissed' || !selectedDate) {
      return;
    }
    setExactDate((current) => {
      const next = new Date(current);
      next.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      return next;
    });
  }, []);

  const handleExactTimeChange = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (event.type === 'dismissed' || !selectedDate) {
      return;
    }
    setExactDate((current) => {
      const next = new Date(current);
      next.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    const input: CreateReminderInput = {
      title: title.trim(),
      body: body.trim(),
      mode,
      relativeMinutes: mode === 'relative' ? relativeMinutes : undefined,
      exactTimestamp: mode === 'exact' ? exactDate.getTime() : undefined,
      intervalMinutes: mode === 'repeating' ? intervalMinutes : undefined,
    };

    const validationError = validateCreateReminderInput(input);
    if (validationError) {
      Alert.alert('Invalid schedule', validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(input);
      setTitle('');
      setBody('');
      setRelativeMinutesInput('10');
      setIntervalMinutesInput('30');
      setExactDate(getDefaultExactDate());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not schedule reminder.';
      Alert.alert('Unable to schedule', message);
    } finally {
      setIsSubmitting(false);
    }
  }, [body, exactDate, intervalMinutes, mode, onSubmit, relativeMinutes, title]);

  return (
    <View style={styles.container}>
      <AppText style={styles.heading}>Create Reminder</AppText>
      <AppText style={styles.subheading}>
        Choose when to notify — in X minutes, at an exact time, or on a repeating interval.
      </AppText>

      <AppInput
        value={title}
        onChangeText={setTitle}
        placeholder="Reminder title"
        accessibilityLabel="Reminder title"
        containerStyle={styles.input}
      />
      <AppInput
        value={body}
        onChangeText={setBody}
        placeholder="Description (optional)"
        accessibilityLabel="Reminder description"
        containerStyle={styles.input}
        multiline
      />

      <AppText style={styles.label}>Schedule type</AppText>
      <View style={styles.modeRow}>
        {SCHEDULE_MODES.map((option) => {
          const isSelected = mode === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => setMode(option.id)}
              style={[styles.modeChip, isSelected && styles.modeChipSelected]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Schedule type ${option.label}`}
            >
              <AppText style={[styles.modeChipText, isSelected && styles.modeChipTextSelected]}>
                {option.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {mode === 'relative' && (
        <View style={styles.section}>
          <AppText style={styles.sectionLabel}>Custom minutes from now</AppText>
          <AppInput
            value={relativeMinutesInput}
            onChangeText={setRelativeMinutesInput}
            placeholder="e.g. 10"
            keyboardType="number-pad"
            accessibilityLabel="Minutes from now"
            containerStyle={styles.input}
          />
          <AppText style={styles.hint}>Quick picks</AppText>
          <View style={styles.chipRow}>
            {QUICK_RELATIVE_OPTIONS.map((minutes) => {
              const isSelected = relativeMinutes === minutes;
              return (
                <AppButton
                  key={minutes}
                  title={`${minutes}m`}
                  onPress={() => setRelativeMinutesInput(String(minutes))}
                  buttonStyle={[styles.chip, isSelected && styles.chipSelected]}
                  titleStyle={[styles.chipText, isSelected && styles.chipTextSelected]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                />
              );
            })}
          </View>
        </View>
      )}

      {mode === 'exact' && (
        <View style={styles.section}>
          <AppText style={styles.sectionLabel}>Pick date and time</AppText>
          <AppText style={styles.selectedDateTime}>
            {exactDate.toLocaleString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </AppText>
          <View style={styles.pickerButtons}>
            <AppButton
              title="Change date"
              onPress={() => setShowDatePicker(true)}
              buttonStyle={styles.pickerButton}
              accessibilityLabel="Change reminder date"
            />
            <AppButton
              title="Change time"
              onPress={() => setShowTimePicker(true)}
              buttonStyle={styles.pickerButton}
              accessibilityLabel="Change reminder time"
            />
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={exactDate}
              mode="date"
              minimumDate={new Date()}
              onChange={handleExactDateChange}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            />
          )}
          {showTimePicker && (
            <DateTimePicker
              value={exactDate}
              mode="time"
              onChange={handleExactTimeChange}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            />
          )}
        </View>
      )}

      {mode === 'repeating' && (
        <View style={styles.section}>
          <AppText style={styles.sectionLabel}>Repeat every (minutes)</AppText>
          <AppInput
            value={intervalMinutesInput}
            onChangeText={setIntervalMinutesInput}
            placeholder={`Min ${MIN_REPEAT_INTERVAL_MINUTES}`}
            keyboardType="number-pad"
            accessibilityLabel="Repeat interval in minutes"
            containerStyle={styles.input}
          />
          <AppText style={styles.hint}>
            Notifee requires at least {MIN_REPEAT_INTERVAL_MINUTES} minutes between repeating alerts.
          </AppText>
        </View>
      )}

      <AppButton
        title={isSubmitting ? 'Scheduling...' : 'Schedule Reminder'}
        onPress={handleSubmit}
        disabled={isSubmitting}
        accessibilityLabel="Schedule reminder"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: cw(12),
    padding: cw(16),
    marginBottom: ch(16),
    borderWidth: 1,
    borderColor: Colors.purpleBorder,
    gap: ch(8),
  },
  heading: {
    ...Typography.semibold_18,
    color: Colors.textPrimary,
  },
  subheading: {
    ...Typography.regular_12,
    color: Colors.textMuted,
    marginBottom: ch(4),
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: ch(4),
  },
  label: {
    ...Typography.medium_14,
    color: Colors.textPrimary,
    marginTop: ch(4),
  },
  modeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: cw(8),
    marginBottom: ch(4),
  },
  modeChip: {
    paddingHorizontal: cw(12),
    paddingVertical: ch(8),
    borderRadius: cw(20),
    backgroundColor: Colors.bgMuted,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  modeChipSelected: {
    backgroundColor: Colors.brandSecondary,
    borderColor: Colors.brandSecondary,
  },
  modeChipText: {
    ...Typography.medium_12,
    color: Colors.textPrimary,
  },
  modeChipTextSelected: {
    color: Colors.white,
  },
  section: {
    gap: ch(6),
    marginBottom: ch(4),
  },
  sectionLabel: {
    ...Typography.medium_14,
    color: Colors.textPrimary,
  },
  selectedDateTime: {
    ...Typography.semibold_16,
    color: Colors.brandSecondary,
  },
  pickerButtons: {
    flexDirection: 'row',
    gap: cw(8),
  },
  pickerButton: {
    flex: 1,
    minHeight: ch(40),
    paddingVertical: ch(8),
  },
  hint: {
    ...Typography.regular_12,
    color: Colors.textMuted,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: cw(8),
  },
  chip: {
    backgroundColor: Colors.bgMuted,
    minHeight: ch(36),
    paddingVertical: ch(8),
  },
  chipSelected: {
    backgroundColor: Colors.brandSecondary,
  },
  chipText: {
    ...Typography.medium_12,
    color: Colors.textPrimary,
  },
  chipTextSelected: {
    color: Colors.white,
  },
});

export default AddReminderForm;
