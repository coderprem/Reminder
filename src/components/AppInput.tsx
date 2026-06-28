import React, { ComponentType, useMemo } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
  TextInputProps,
} from 'react-native';
import { SvgProps } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { cw, ch, dw, dh } from '../utils/dimensions';
import AppImage from './AppImage';
import { Typography } from '../theme/typography';
import { IS_IOS } from '../utils/device';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;

  leftIcon?: ComponentType<SvgProps>;
  rightIcon?: ComponentType<SvgProps>;
  rightIconColor?: string;
  onRightIconPress?: () => void;

  borderColor?: string;
  disabled?: boolean;

  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  placeholderColor?: string;

  keyboardType?: KeyboardTypeOptions;
} & TextInputProps;

const AppInput = ({
  value,
  onChangeText,
  placeholder,
  leftIcon,
  rightIcon,
  rightIconColor = Colors.grey300,
  onRightIconPress,
  borderColor = Colors.grey500,
  disabled = false,
  containerStyle,
  inputStyle,
  placeholderColor,
  keyboardType,
  multiline,
  ...TextInputProps
}: Props) => {

  const androidInputAlignment = useMemo(() => {
    if (IS_IOS) {
      return null;
    }
    return {
      includeFontPadding: false,
      textAlignVertical: multiline ? 'top' : 'center',
    } satisfies TextStyle;
  }, [multiline]);

  return (
    <View
      style={[
        styles.container,
        { borderColor, opacity: disabled ? 0.5 : 1 },
        containerStyle,
      ]}
    >

      {leftIcon && (
        <View style={styles.leftIcon}>
          <AppImage uri={leftIcon} width={dw(16, 32)} height={dh(16, 32)} />
        </View>
      )}


      <TextInput
        style={[styles.input, inputStyle, androidInputAlignment]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor || Colors.grey400}
        editable={!disabled}
        cursorColor={Colors.brandSecondary}
        selectionColor={Colors.brandSecondary}
        keyboardType={keyboardType}
        multiline={multiline}
        {...TextInputProps}
      />


      {rightIcon && (
        <TouchableOpacity
          onPress={onRightIconPress}
          disabled={!onRightIconPress || disabled}
          style={styles.rightIcon}
          activeOpacity={1}
        >
          <AppImage uri={rightIcon} width={dw(16, 32)} height={dh(16, 32)} color={rightIconColor} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: cw(8),
    minHeight: ch(45),
    maxHeight: dh(48, 48),
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    color: Colors.textStrong,
    ...Typography.medium_14,
    marginLeft: cw(12),
    textAlignVertical: 'center',
    paddingVertical: 0,
  },
  leftIcon: {
    marginRight: cw(8),
  },
  rightIcon: {
    marginRight: dw(12, 20),
  },
});

export default AppInput;