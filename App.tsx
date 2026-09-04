import Providers from './src/providers/Providers';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/navigation/utils/navigationRef';
import RootNavigator from './src/navigation/navigators/RootNavigator';
import { useNotificationBootstrap } from './src/hooks/useNotificationBootstrap';

function App() {
  useNotificationBootstrap();

  return (
    <Providers>
      <NavigationContainer ref={navigationRef}>
        <RootNavigator />
      </NavigationContainer>
    </Providers>
  );
}


export default App;
