import { NotificationDataKeys, NotificationTypes } from '../src/services/notifications/constants';
import { ScreenNames } from '../src/navigation/utils/ScreenNames';

describe('notification constants', () => {
  it('exposes stable channel and action identifiers', () => {
    expect(NotificationTypes.REMINDER).toBe('reminder');
    expect(NotificationDataKeys.SCREEN_NAME).toBe('screenName');
  });
});

describe('notification navigation targets', () => {
  it('uses tab screen names for deep links', () => {
    expect(ScreenNames.HOME).toBe('Home');
    expect(ScreenNames.SEARCH).toBe('Search');
  });
});
