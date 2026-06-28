import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppImage from '../AppImage';
import { ch, cw } from '../../utils/dimensions';
import { AppText } from '../AppText';
import { Typography } from '../../theme/typography';
import { Colors } from '../../theme/colors';

type Props = {
  title: string;
  icon: string;
  onPress: () => void;
}

const SideMenuItem = ({ title, icon, onPress }: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <AppImage uri={icon} width={cw(24)} height={cw(24)} />
      <AppText style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: cw(20),
    paddingVertical: ch(16),
    paddingHorizontal: cw(16),
    backgroundColor: Colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey750,
  },
  title: {
    ...Typography.medium_16,
    color: Colors.white,
    flex: 1,
  },
});
export default SideMenuItem;