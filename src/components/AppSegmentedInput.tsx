import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';


export interface AppSegmentedInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  ref?: React.RefObject<TextInput | null>;
  style?: StyleProp<ViewStyle>;
}

function AppSegmentedInput({ length = 4, value, ref, onChange, style }: AppSegmentedInputProps) {
  const inputRef = ref || useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const cursorBlinkAnim = useRef(new Animated.Value(1)).current;

  const handleChange = useCallback(
    (text: string) => {
      const digits = text.replace(/[^0-9]/g, '');
      if (digits.length <= length) {
        onChange(digits);
      }
    },
    [length, onChange]
  );

  const handleSelectionChange = useCallback((event: {
    nativeEvent: { selection: { start: number; end: number } };
  }) => {
    const { start, end } = event.nativeEvent.selection;
    setSelectionStart(start);
    setSelectionEnd(end);
  }, []);

  useEffect(() => {
    const len = Math.min(value.length, length);
    setSelectionStart(len);
    setSelectionEnd(len);
  }, [value, length]);

  useEffect(() => {
    if (!isFocused) {
      cursorBlinkAnim.setValue(0);
      return;
    }
    cursorBlinkAnim.setValue(1);
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorBlinkAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorBlinkAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    );
    blinkAnimation.start();
    return () => {
      blinkAnimation.stop();
      cursorBlinkAnim.setValue(0);
    };
  }, [isFocused, cursorBlinkAnim]);

  return (
    <View style={[styles.root, style]}>
      <View style={styles.inputShell}>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={handleChange}
          onSelectionChange={handleSelectionChange}
          keyboardType="number-pad"
          maxLength={length}
          autoComplete="sms-otp"
          textContentType="oneTimeCode"
          selectTextOnFocus={false}
          selection={{ start: selectionStart, end: selectionEnd }}
          selectionColor="transparent"
          cursorColor="transparent"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={styles.hiddenInput}
          accessible
          accessibilityLabel="One-time password"
          accessibilityHint="Enter the verification code"
        />

        <TouchableOpacity
          style={styles.otpContainer}
          onPress={() => inputRef.current?.focus()}
          activeOpacity={1}
          accessibilityRole="none"
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          {Array.from({ length }).map((_, index) => {
            const digit = value[index] ?? '';
            const isCurrentInputPosition = index === value.length;
            const isLastDigit = index === length - 1;
            const shouldShowActiveBorder =
              (isCurrentInputPosition && isFocused) ||
              (isLastDigit && value.length === length);

            return (
              <View
                key={index}
                style={[
                  styles.otpCell,
                  shouldShowActiveBorder ? styles.focusedOtp : null,
                ]}
              >
                <Text style={styles.otpDigit}>{digit}</Text>
                {isCurrentInputPosition &&
                isFocused &&
                value.length < length ? (
                  <Animated.View
                    style={[styles.cursor, { opacity: cursorBlinkAnim }]}
                  />
                ) : null}
              </View>
            );
          })}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default React.memo(AppSegmentedInput);

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  inputShell: {
    position: 'relative',
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    opacity: 0,
    zIndex: 1,
    color: 'transparent',
    backgroundColor: 'transparent',
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  otpCell: {
    flex: 1,
    minWidth: 0,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.borderMuted,
    backgroundColor: Colors.textPrimary,
    borderRadius: 2,
  },
  focusedOtp: {
    borderBottomColor: Colors.lightPink,
    borderBottomWidth: 2,
  },
  otpDigit: {
    ...Typography.medium_16,
    color: Colors.white,
    textAlign: 'center',
  },
  cursor: {
    position: 'absolute',
    width: 1,
    height: 20,
    backgroundColor: Colors.brandSecondary,
    left: '50%',
    marginLeft: -0.5,
  },
});
