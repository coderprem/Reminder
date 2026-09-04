import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import AppSafeAreaView from '../../../components/AppSafeAreaView';
import { AppText } from '../../../components/AppText';
import AppButton from '../../../components/AppButton';
import {
  cancelLocalNotification,
  displayLocalNotification,
  displaySimulatedPushNotification,
  getNotificationPermissionState,
  requestNotificationPermission,
  updateLocalNotification,
} from '../../../services/notifications';
import { NotificationChannels, NotificationTypes } from '../../../services/notifications/constants';
import { ScreenNames } from '../../../navigation/utils/ScreenNames';
import { Colors } from '../../../theme/colors';
import { Typography } from '../../../theme/typography';
import { ch, cw } from '../../../utils/dimensions';

interface LabStep {
  id: string;
  level: 'Basic' | 'Intermediate';
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => Promise<void>;
}

const SearchScreen = () => {
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(null);
  const [permissionLabel, setPermissionLabel] = useState('Check permission');

  const refreshPermission = useCallback(async () => {
    const permission = await getNotificationPermissionState();
    setPermissionLabel(permission.isGranted ? 'Permission granted' : 'Permission not granted');
  }, []);

  const labSteps: LabStep[] = [
    {
      id: 'permission',
      level: 'Basic',
      title: '1. Request permission',
      description:
        'Apps must ask before showing notifications (required on Android 13+ and iOS).',
      actionLabel: 'Request permission',
      onAction: async () => {
        await requestNotificationPermission();
        await refreshPermission();
      },
    },
    {
      id: 'display',
      level: 'Basic',
      title: '2. Display a local notification',
      description:
        'Shows an immediate notification with a channel, icon, and deep-link data payload.',
      actionLabel: 'Show notification',
      onAction: async () => {
        const id = await displayLocalNotification({
          title: 'Hello from Notifee',
          body: 'Tap me to navigate to this Learning Lab screen.',
          channelId: NotificationChannels.LEARNING,
          data: {
            screenName: ScreenNames.SEARCH,
            type: NotificationTypes.LEARNING,
          },
        });
        setLastNotificationId(id);
      },
    },
    {
      id: 'update',
      level: 'Basic',
      title: '3. Update a notification',
      description:
        'Reuse the same notification ID to update title/body instead of creating a new alert.',
      actionLabel: 'Update last notification',
      onAction: async () => {
        if (!lastNotificationId) {
          Alert.alert('No notification', 'Show a notification first (step 2).');
          return;
        }
        await updateLocalNotification({
          id: lastNotificationId,
          title: 'Updated notification',
          body: 'Same ID, new content. This is how progress or chat apps update alerts.',
          channelId: NotificationChannels.LEARNING,
        });
      },
    },
    {
      id: 'actions',
      level: 'Intermediate',
      title: '4. Notification actions',
      description:
        'Add Snooze, Done, and Dismiss buttons. Handled in index.js (background) and App bootstrap (foreground).',
      actionLabel: 'Show with actions',
      onAction: async () => {
        const id = await displayLocalNotification({
          title: 'Actions demo',
          body: 'Try Snooze, Done, or Dismiss from the notification shade.',
          channelId: NotificationChannels.LEARNING,
          showActions: true,
          data: {
            screenName: ScreenNames.SEARCH,
            type: NotificationTypes.LEARNING,
          },
        });
        setLastNotificationId(id);
      },
    },
    {
      id: 'cancel',
      level: 'Basic',
      title: '5. Cancel a notification',
      description: 'Remove a notification programmatically using its ID.',
      actionLabel: 'Cancel last notification',
      onAction: async () => {
        if (!lastNotificationId) {
          Alert.alert('No notification', 'Show a notification first.');
          return;
        }
        await cancelLocalNotification(lastNotificationId);
        setLastNotificationId(null);
      },
    },
    {
      id: 'simulated-push',
      level: 'Intermediate',
      title: '6. Simulate a push (FCM preview)',
      description:
        'Real push uses Firebase Cloud Messaging. This simulates the foreground handler pattern: receive payload → display via Notifee.',
      actionLabel: 'Simulate push',
      onAction: async () => {
        const id = await displaySimulatedPushNotification();
        setLastNotificationId(id);
      },
    },
  ];

  return (
    <AppSafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppText style={styles.title} accessibilityRole="header">
          Notification Learning Lab
        </AppText>
        <AppText style={styles.subtitle}>
          Hands-on steps from basic local notifications to intermediate push patterns.
          Scheduled reminders live on the Home tab.
        </AppText>

        <View style={styles.permissionCard}>
          <AppText style={styles.permissionText}>{permissionLabel}</AppText>
          <AppButton title="Refresh status" onPress={refreshPermission} buttonStyle={styles.smallButton} />
        </View>

        {labSteps.map((step) => (
          <View key={step.id} style={styles.card} accessibilityRole="summary">
            <View style={styles.levelBadge}>
              <AppText style={styles.levelText}>{step.level}</AppText>
            </View>
            <AppText style={styles.cardTitle}>{step.title}</AppText>
            <AppText style={styles.cardDescription}>{step.description}</AppText>
            <AppButton
              title={step.actionLabel}
              onPress={step.onAction}
              buttonStyle={styles.actionButton}
              accessibilityLabel={step.actionLabel}
            />
          </View>
        ))}

        <View style={styles.fcmCard}>
          <AppText style={styles.cardTitle}>Next: Real FCM push</AppText>
          <AppText style={styles.cardDescription}>
            Add @react-native-firebase/app and messaging, place google-services.json /
            GoogleService-Info.plist, then call messaging().onMessage() to display incoming
            pushes with Notifee — same pattern as the simulate button above.
          </AppText>
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.bgSecondary,
  },
  content: {
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
  permissionCard: {
    backgroundColor: Colors.purpleTint,
    borderRadius: cw(12),
    padding: cw(16),
    marginBottom: ch(16),
    borderWidth: 1,
    borderColor: Colors.purpleBorder,
    gap: ch(8),
  },
  permissionText: {
    ...Typography.medium_14,
    color: Colors.brandSecondary,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: cw(12),
    padding: cw(16),
    marginBottom: ch(12),
    borderWidth: 1,
    borderColor: Colors.purpleBorder,
    gap: ch(8),
  },
  levelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.brandAccentBlue,
    borderRadius: cw(4),
    paddingHorizontal: cw(8),
    paddingVertical: ch(2),
  },
  levelText: {
    ...Typography.medium_10,
    color: Colors.white,
  },
  cardTitle: {
    ...Typography.semibold_16,
    color: Colors.textPrimary,
  },
  cardDescription: {
    ...Typography.regular_14,
    color: Colors.textSecondary,
  },
  actionButton: {
    marginTop: ch(4),
  },
  smallButton: {
    alignSelf: 'flex-start',
    minHeight: ch(36),
    paddingVertical: ch(8),
  },
  fcmCard: {
    backgroundColor: Colors.bgDark,
    borderRadius: cw(12),
    padding: cw(16),
    marginTop: ch(8),
    gap: ch(8),
  },
});

export default SearchScreen;
