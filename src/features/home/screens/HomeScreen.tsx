import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import AppSafeAreaView from '../../../components/AppSafeAreaView';
import { AppText } from '../../../components/AppText';
import AddReminderForm from '../components/AddReminderForm';
import ReminderCard from '../components/ReminderCard';
import { useReminders } from '../../../hooks/useReminders';
import { Colors } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { ch, cw } from '../../../utils/dimensions';
import type { TabStackParamList } from '../../../navigation/paramsList/RootStackParamList';
import { ScreenNames } from '../../../navigation/utils/ScreenNames';
import type { CreateReminderInput } from '../../../types/reminderSchedule';
import type { Reminder } from '../../../store/slice/reminders/remindersSlice';

type HomeScreenRouteProp = RouteProp<TabStackParamList, typeof ScreenNames.HOME>;

const HomeScreen = () => {
  const route = useRoute<HomeScreenRouteProp>();
  const highlightedReminderId = route.params?.reminderId;

  const {
    activeReminders,
    completedReminders,
    createReminder,
    markReminderComplete,
    removeReminder,
  } = useReminders();

  const handleCreateReminder = useCallback(
    async (input: CreateReminderInput) => {
      await createReminder(input);
    },
    [createReminder],
  );

  const renderReminder = useCallback(
    ({ item }: { item: Reminder }) => (
      <ReminderCard
        reminder={item}
        onComplete={markReminderComplete}
        onDelete={removeReminder}
        isHighlighted={item.id === highlightedReminderId}
      />
    ),
    [highlightedReminderId, markReminderComplete, removeReminder],
  );

  const listHeader = (
    <View>
      <AppText style={styles.title} accessibilityRole="header">
        My Reminders
      </AppText>
      <AppText style={styles.subtitle}>
        Create scheduled local notifications. Tap a notification to open the matching reminder.
      </AppText>
      <AddReminderForm onSubmit={handleCreateReminder} />

      <AppText style={styles.sectionTitle}>Upcoming</AppText>
      {activeReminders.length === 0 && (
        <AppText style={styles.emptyText}>No upcoming reminders. Schedule one above.</AppText>
      )}
    </View>
  );

  const listFooter =
    completedReminders.length > 0 ? (
      <View style={styles.completedSection}>
        <AppText style={styles.sectionTitle}>Completed</AppText>
        {completedReminders.map((reminder) => (
          <ReminderCard
            key={reminder.id}
            reminder={reminder}
            onComplete={markReminderComplete}
            onDelete={removeReminder}
          />
        ))}
      </View>
    ) : null;

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <FlatList
        data={activeReminders}
        keyExtractor={(item) => item.id}
        renderItem={renderReminder}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.bgSecondary,
  },
  listContent: {
    padding: cw(16),
    paddingBottom: ch(32),
  },
  title: {
    ...Typography.semibold_24,
    color: Colors.textPrimary,
    marginBottom: ch(4),
  },
  subtitle: {
    ...Typography.regular_14,
    color: Colors.textMuted,
    marginBottom: ch(16),
  },
  sectionTitle: {
    ...Typography.semibold_16,
    color: Colors.textPrimary,
    marginBottom: ch(8),
  },
  emptyText: {
    ...Typography.regular_14,
    color: Colors.textMuted,
    marginBottom: ch(16),
  },
  completedSection: {
    marginTop: ch(16),
  },
});

export default HomeScreen;
