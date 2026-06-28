import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorNames } from '../utils/ScreenNames';
import type { RootStackParamList } from '../paramsList/RootStackParamList';
import TabsNavigator from './TabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={NavigatorNames.TABS}>
      <Stack.Screen name={NavigatorNames.TABS} component={TabsNavigator} /> 
    </Stack.Navigator>
  );
};

