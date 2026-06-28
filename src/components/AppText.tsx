import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { Typography } from '../theme/typography';

export const AppText = ({ style, ...props }: TextProps) => {
  const finalStyle = StyleSheet.flatten([
    Typography.regular_14,
    style,
  ]);

  return (
    <Text
      {...props}
      style={[
        {
          includeFontPadding: false,
        },
        finalStyle,
      ]}
    />
  );
};
