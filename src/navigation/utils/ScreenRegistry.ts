import HomeScreen from '../../features/home/screens/HomeScreen';
import { ScreenNames } from './ScreenNames';
import SearchScreen from '../../features/search/screens/SearchScreen';

export const SCREEN_REGISTRY: Record<string, any> = {
  [ScreenNames.HOME]: HomeScreen,
  [ScreenNames.SEARCH]: SearchScreen,
};