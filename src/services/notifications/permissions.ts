import notifee, { AuthorizationStatus } from '@notifee/react-native';

export interface NotificationPermissionState {
  isGranted: boolean;
  status: AuthorizationStatus;
}

export async function getNotificationPermissionState(): Promise<NotificationPermissionState> {
  const settings = await notifee.getNotificationSettings();
  const status = settings.authorizationStatus;

  return {
    isGranted: status >= AuthorizationStatus.AUTHORIZED,
    status,
  };
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  const settings = await notifee.requestPermission();
  const status = settings.authorizationStatus;

  return {
    isGranted: status >= AuthorizationStatus.AUTHORIZED,
    status,
  };
}
