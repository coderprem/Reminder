import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from './AppText';
import { Typography } from '../theme/typography';
import { Colors } from '../theme/colors';
import { ch, cw, mh, mw } from '../utils/dimensions';
import AppImage from './AppImage';
import { SVGS } from '../utils/assetsPath';
import { IS_ANDROID } from '../utils/device';
import { goBack } from '../navigation/utils/navigationRef';

type position = 'left' | 'center';

interface AppHeaderProps {
  title: string;
  onBackPress?: () => void;
  showBorderBottom?: boolean;
  rightComponent?: React.ReactNode;
  rightComponentOnPress?: () => void;
  position?: position;
  showBackButton?: boolean;
}

const AppHeader = ({ 
  title, 
  onBackPress = goBack, 
  showBorderBottom = true, 
  rightComponent, 
  rightComponentOnPress = () => {},
  position = 'left',
  showBackButton = true,
}: AppHeaderProps) => {

  const renderTitle = useMemo(() => {
    if (position === 'left') {
      return <AppText style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</AppText>
    }
    if (position === 'center') {
      return <View style={styles.centerContainer}>
        <AppText style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</AppText>
      </View>
    }
  }, [title, position])

  return (
    <View style={[styles.container, showBorderBottom && styles.borderBottom]}>
      {showBackButton && (
        <TouchableOpacity activeOpacity={1} onPress={onBackPress}>
          <AppImage uri={IS_ANDROID ? SVGS.androidBack : SVGS.iosBack} width={cw(24)} height={ch(24)} />
        </TouchableOpacity>
      )}
      {renderTitle}
      {rightComponent && (
        <TouchableOpacity activeOpacity={1} onPress={rightComponentOnPress}>
          {rightComponent}
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: mw(48),
    backgroundColor: Colors.bgDark,
    paddingHorizontal: mw(16),
    gap: mw(32),
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: Colors.grey750,
  },
  title: {
    flex: 1,
    ...Typography.semibold_20,
    color: Colors.white,
  },
  centerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
export default AppHeader;