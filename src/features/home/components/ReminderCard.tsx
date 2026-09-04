import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { ch, cw } from '../../../utils/dimensions';
import type { Reminder } from '../../../store/slice/reminders/remindersSlice';
import { formatScheduleLabel } from '../../../types/reminderSchedule';

interface ReminderCardProps {
  reminder: Reminder;
  onComplete: (reminder: Reminder) => void;
  onDelete: (reminder: Reminder) => void;
  isHighlighted?: boolean;
}

const ReminderCard = ({
  reminder,
  onComplete,
  onDelete,
  isHighlighted = false,
}: ReminderCardProps) => {
  return (
    <View
      style={[styles.card, isHighlighted && styles.cardHighlighted]}
      accessibilityRole="summary"
      accessibilityLabel={`Reminder ${reminder.title}, scheduled for ${formatScheduleLabel(reminder)}`}
    >
      <View style={styles.content}>
        <AppText style={styles.title}>{reminder.title}</AppText>
        <AppText style={styles.body}>{reminder.body}</AppText>
        <AppText style={styles.schedule}>{formatScheduleLabel(reminder)}</AppText>
      </View>

      {!reminder.isCompleted && (
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => onComplete(reminder)}
            style={[styles.actionButton, styles.completeButton]}
            accessibilityRole="button"
            accessibilityLabel={`Mark ${reminder.title} as done`}
          >
            <AppText style={styles.actionText}>Done</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(reminder)}
            style={[styles.actionButton, styles.deleteButton]}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${reminder.title}`}
          >
            <AppText style={styles.actionText}>Delete</AppText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: cw(12),
    padding: cw(16),
    marginBottom: ch(12),
    borderWidth: 1,
    borderColor: Colors.purpleBorder,
  },
  cardHighlighted: {
    borderColor: Colors.brandSecondary,
    backgroundColor: Colors.purpleTint,
  },
  content: {
    gap: ch(4),
  },
  title: {
    ...Typography.semibold_16,
    color: Colors.textPrimary,
  },
  body: {
    ...Typography.regular_14,
    color: Colors.textSecondary,
  },
  schedule: {
    ...Typography.medium_12,
    color: Colors.brandSecondary,
    marginTop: ch(4),
  },
  actions: {
    flexDirection: 'row',
    gap: cw(8),
    marginTop: ch(12),
  },
  actionButton: {
    paddingHorizontal: cw(12),
    paddingVertical: ch(8),
    borderRadius: cw(6),
  },
  completeButton: {
    backgroundColor: Colors.success,
  },
  deleteButton: {
    backgroundColor: Colors.error,
  },
  actionText: {
    ...Typography.medium_12,
    color: Colors.white,
  },
});

export default ReminderCard;
