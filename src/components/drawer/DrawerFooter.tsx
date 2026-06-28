import React from 'react';
import { View, StyleSheet } from 'react-native';
import { mh, mw } from '../../utils/dimensions';
import { AppText } from '../AppText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '../../theme/typography';
import { Colors } from '../../theme/colors';

const DrawerFooter = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <AppText style={styles.tnc}>Terms and Conditions</AppText>
      <AppText style={styles.appVersion}>App Version 1.0.0</AppText>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    paddingStart: mw(20),
    gap: mh(10)
  },
  tnc: {
    ...Typography.medium_12,
    color: Colors.lightPink
  },
  appVersion: {
    ...Typography.regular_10,
    color: Colors.grey300
  }
});
export default DrawerFooter;