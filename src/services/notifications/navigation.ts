import { NavigatorScreenParams } from '@react-navigation/native';
import { NavigatorNames, ScreenNames, type ScreenName } from '../../navigation/utils/ScreenNames';
import type { TabStackParamList } from '../../navigation/paramsList/RootStackParamList';
import { navigate } from '../../navigation/utils/navigationRef';

const TAB_SCREENS = new Set<string>([ScreenNames.HOME, ScreenNames.SEARCH]);

export { TAB_SCREENS };

export function navigateToTab<RouteName extends keyof TabStackParamList>(
  screenName: RouteName,
  params?: TabStackParamList[RouteName],
): void {
  const tabParams = {
    screen: screenName,
    ...(params !== undefined ? { params } : {}),
  } as NavigatorScreenParams<TabStackParamList>;

  navigate(NavigatorNames.TABS, tabParams);
}

export function handleNotificationNavigation({
  screenName,
  reminderId,
}: {
  screenName: string;
  reminderId?: string;
}): void {
  const targetScreen = TAB_SCREENS.has(screenName)
    ? (screenName as ScreenName)
    : ScreenNames.HOME;

  if (targetScreen === ScreenNames.HOME && reminderId) {
    navigateToTab(ScreenNames.HOME, { reminderId });
    return;
  }

  navigateToTab(targetScreen);
}
