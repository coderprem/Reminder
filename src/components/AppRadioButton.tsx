import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from './AppText';
import { ch, cw } from '../utils/dimensions';
import AppImage from './AppImage';
import { SVGS } from '../utils/assetsPath';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

export type RadioItem = {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

const AppRadioButton = ({ title, isSelected, onPress }: RadioItem) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={1}>
      <AppImage uri={isSelected ? SVGS.radioSelected : SVGS.radio} width={cw(18)} height={ch(18)} />
      <AppText style={styles.title}>{title}</AppText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: cw(8),
    padding: cw(8),
    borderRadius: cw(8),
    borderWidth: cw(1),
    borderColor: Colors.borderMuted,
  },
  title: {
    ...Typography.medium_16,
    color: Colors.white,
  },
});

export default AppRadioButton;