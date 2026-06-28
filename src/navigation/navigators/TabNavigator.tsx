import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SCREEN_REGISTRY } from '../utils/ScreenRegistry';
import { TabStackParamList } from '../paramsList/RootStackParamList';

const Tab = createBottomTabNavigator<TabStackParamList>();


export default function TabsNavigator() {

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
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