import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { store, persistor } from '../store/store';
import AppToastProvider from './AppToastProvider';
import { AppAlertProvider } from './AppAlertProvider';
import { DrawerProvider } from './DrawerProvider';
import AppDrawer from '../components/drawer/AppDrawer';

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SafeAreaProvider>
              <AppToastProvider>
                <AppAlertProvider>
                  <DrawerProvider>  
                    <AppDrawer>
                      {children}
                    </AppDrawer>
                  </DrawerProvider>
                </AppAlertProvider>
              </AppToastProvider>
            </SafeAreaProvider>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default Providers;