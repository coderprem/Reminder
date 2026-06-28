// AppToastProvider.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AppToast from '../components/AppToast';
import { setToastRef, ToastConfig } from '../utils/toast';

const AppToastProvider = ({ children }: any) => {
  const [toast, setToast] = useState<ToastConfig & { visible: boolean }>({
    message: '',
    showIcon: false,
    position: 100,
    visible: false,
  });

  const show = (config: ToastConfig) => {
    setToast({
      ...config,
      visible: true,
      position: config.position ?? 100,
    });
  };

  const hide = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  // register global function
  setToastRef(show);

  return (
    <View style={styles.container}>
      {children}

      {/* THIS ensures it renders above everything */}
      <AppToast
        message={toast.message}
        showIcon={toast.showIcon}
        visible={toast.visible}
        position={toast.position ?? 100}
        onHide={hide}
      />
    </View>
  );
};

export default AppToastProvider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});