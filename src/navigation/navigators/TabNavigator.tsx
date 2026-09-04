import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SCREEN_REGISTRY } from '../utils/ScreenRegistry';
import { TabStackParamList } from '../paramsList/RootStackParamList';
import { ScreenNames } from '../utils/ScreenNames';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';

const Tab = createBottomTabNavigator<TabStackParamList>();

const TAB_LABELS: Record<keyof TabStackParamList, string> = {
  [ScreenNames.HOME]: 'Reminders',
  [ScreenNames.SEARCH]: 'Learn',
};

export default function TabsNavigator() {

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.brandSecondary,
        tabBarInactiveTintColor: Colors.grey500,
        tabBarLabelStyle: Typography.medium_12,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.purpleBorder,
        },
        tabBarLabel: TAB_LABELS[route.name as keyof TabStackParamList],
      })}
    >
      {Object.keys(SCREEN_REGISTRY).map((screenName) => {
        const Component = SCREEN_REGISTRY[screenName];

        if (!Component) return null;

        return (
          <Tab.Screen
            key={screenName}
            name={screenName as keyof TabStackParamList}
            component={Component}
          />
        );
      })}
    </Tab.Navigator>
  );
}