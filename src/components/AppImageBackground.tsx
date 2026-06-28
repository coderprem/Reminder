import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import AppImage from './AppImage';

type Props = {
  uri: any;
  width: number;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'repeat';
};

const AppImageBackground: React.FC<Props> = ({
  uri,
  width,
  height,
  borderRadius = 0,
  style,
  children,
  resizeMode = 'contain',
}) => {
  return (
    <View
      style={[
        { width, height, borderRadius, overflow: 'hidden' },
        style,
      ]}
    >
      {/* Background Image */}
      <AppImage
        uri={uri}
        width="100%"
        height="100%"
        resizeMode={resizeMode}
        style={StyleSheet.absoluteFill}
      />

      {/* Overlay content */}
      {children}
    </View>
  );
};

export default React.memo(AppImageBackground);