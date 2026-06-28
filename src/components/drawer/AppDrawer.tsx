import React, { useEffect } from 'react';
import { View, Dimensions, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useDrawer } from '../../providers/DrawerProvider';
import { Colors } from '../../theme/colors';
import { navigationRef } from '../../navigation/utils/navigationRef';
import { IS_TABLET } from '../../utils/device';
import { AppText } from '../AppText';

const sideMenuData = [
  {
    id: 1,
    title: 'Home',
    icon: 'home',
    linkUrl: '/home',
  },
];

const SCREEN_WIDTH = Dimensions.get('window').width;

const getDrawerWidth = () => {
  if (IS_TABLET) {
    return 320; // tablet standard
  }
  return SCREEN_WIDTH * 0.83; // mobile 80%
};

const DRAWER_WIDTH = getDrawerWidth();

const AppDrawer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOpen, close } = useDrawer();
  const translateX = useSharedValue(-DRAWER_WIDTH);

  useEffect(() => {
    translateX.value = withTiming(isOpen ? 0 : -DRAWER_WIDTH, { duration: 250 });
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', () => {
      close();
    });
  
    return unsubscribe;
  }, [close]);

  return (
    <View style={{ flex: 1 }}>
      {children}

      {/* Overlay */}
      {isOpen && (
        <Pressable style={styles.overlay} onPress={close} />
      )}

      {/* Drawer */}
      <Animated.View style={[styles.drawer, animatedStyle]}>
        <AppText> Drawer Content </AppText>
      </Animated.View>
    </View>
  );
};


const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: Colors.bgDark,
    zIndex: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.blackOpacity60,
  },
});

export default AppDrawer;