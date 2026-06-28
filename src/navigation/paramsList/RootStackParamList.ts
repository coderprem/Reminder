import { NavigatorScreenParams } from '@react-navigation/native';
import { NavigatorNames, ScreenNames } from '../utils/ScreenNames';

export type RootStackParamList = {
  [ScreenNames.HOME]: undefined;
  [ScreenNames.SEARCH]: undefined;
  [NavigatorNames.TABS]: NavigatorScreenParams<TabStackParamList>;
};


export type TabStackParamList = {
  [ScreenNames.HOME]: undefined;
  [ScreenNames.SEARCH]: undefined;
};