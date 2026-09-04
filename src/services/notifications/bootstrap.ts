import notifee from '@notifee/react-native';
import { ensureNotificationChannels } from './channels';
import { getNotificationPermissionState } from './permissions';
import { handleNotificationEvent } from './eventHandlers';
import { handleNotificationNavigation } from './navigation';
import { NotificationDataKeys } from './constants';
import { ScreenNames } from '../../navigation/utils/ScreenNames';
import { log } from '../../utils/logger';
import { navigationRef } from '../../navigation/utils/navigationRef';

function waitForNavigationReady(): Promise<void> {
  return new Promise((resolve) => {
    if (navigationRef.isReady()) {
      resolve();
      return;
    }

    const interval = setInterval(() => {
      if (navigationRef.isReady()) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
}

export async function bootstrapNotifications(): Promise<void> {
  await ensureNotificationChannels();

  const permission = await getNotificationPermissionState();
  log('Notification permission:', permission);

  const initialNotification = await notifee.getInitialNotification();
  if (initialNotification) {
    await waitForNavigationReady();

    const screenName =
      initialNotification.notification.data?.[NotificationDataKeys.SCREEN_NAME] ??
      ScreenNames.HOME;
    const reminderId =
      initialNotification.notification.data?.[NotificationDataKeys.REMINDER_ID];

    handleNotificationNavigation({
      screenName: String(screenName),
      reminderId: reminderId != null ? String(reminderId) : undefined,
    });
  }
}

export function subscribeToForegroundNotificationEvents(): () => void {
  return notifee.onForegroundEvent(handleNotificationEvent);
}
