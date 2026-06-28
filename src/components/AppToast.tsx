// AppToast.tsx
import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppText } from './AppText';
import AppImage from './AppImage';
import { SVGS } from '../utils/assetsPath';
import { cw, ch, mw } from '../utils/dimensions';
import { Colors } from '../theme/colors';
import { windowWidth } from '../utils/device';
import { Typography } from '../theme/typography';
type Props = {
  message: string;
  showIcon?: boolean;
  visible: boolean;
  position: number;
  onHide: () => void;
};

const AppToast = ({
  message,
  showIcon = false,
  visible,
  position,
  onHide,
}: Props) => {
  const translateX = useRef(new Animated.Value(windowWidth)).current;

  const startAnimation = () => {
    translateX.setValue(windowWidth);
  
    Animated.sequence([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(translateX, {
        toValue: -windowWidth,
        duration: 150,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(onHide);
  };

  useEffect(() => {
    if (visible) {
      startAnimation();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: position,
          transform: [{ translateX }],
        },
      ]}
      pointerEvents="none"
    >
      <LinearGradient
        colors={[Colors.toast1, Colors.toast2]}
        style={styles.toast}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.content}>
          {showIcon && (
            <AppImage
              uri={SVGS.tick}
              width={cw(20)}
              height={ch(20)}
            />
          )}
          <AppText style={styles.text}>{message}</AppText>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export default memo(AppToast);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: mw(16),
    right: mw(16),
    zIndex: 9999,
    elevation: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: mw(8),
    gap: mw(8),
    height: ch(40),
  },
  text: {
    color: Colors.white,
    flexShrink: 1,
    ...Typography.bold_16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: mw(8),
  },
});