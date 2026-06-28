import React, { ComponentType } from 'react';
import { ImageSourcePropType, ImageStyle, StyleProp, StyleSheet, TextStyle, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { Colors } from '../theme/colors';
import { ch, cw } from '../utils/dimensions';
import { Typography } from '../theme/typography';
import AppImage from './AppImage';
import { SvgProps } from 'react-native-svg';

interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  onPress?: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  icon?: string | ImageSourcePropType | ComponentType<SvgProps>;
  iconStyle?: StyleProp<ImageStyle & SvgProps>;
}

const AppButton = ({ title, onPress = () => {}, buttonStyle, titleStyle, icon, iconStyle, ...props }: AppButtonProps) => {
  return (
    <TouchableOpacity style={[styles.button, buttonStyle]} activeOpacity={1} onPress={onPress} {...props}>
      {icon && <AppImage uri={icon} width={cw(18)} height={ch(18)} style={iconStyle} />}
      <AppText style={[styles.title, titleStyle]} numberOfLines={1}>{title}</AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: cw(20),
    paddingVertical: ch(12),
    borderRadius: cw(4),
    minHeight: ch(44),
    maxHeight: ch(48),
    backgroundColor: Colors.brandSecondary,
    gap: cw(4),
  },
  title: {
    ...Typography.medium_16,
    color: Colors.white,
    textAlign: 'center',
  },
});

export default AppButton;
