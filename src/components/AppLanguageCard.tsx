import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from './AppText';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { mh, mw } from '../utils/dimensions';

type Props = {
  name: string;
  nativeLanguage: string;
  isSelected: boolean;
  onPress: () => void;
}

const AppLanguageCard = ({ 
  name, 
  nativeLanguage, 
  isSelected, 
  onPress = () => {}
}: Props) => {
  const showNativeLanguage = useMemo(() => {
    if(name.toLowerCase() === nativeLanguage.toLowerCase()) {
      return false;
    }
    return nativeLanguage && nativeLanguage.trim() !== '';
  }, [nativeLanguage, name]);
  return (
    <TouchableOpacity style={[styles.container, isSelected && styles.selectedContainer]} onPress={onPress} activeOpacity={1}>
      <AppText style={[styles.title, isSelected && styles.selectedTitle]}>{name}</AppText>
      {showNativeLanguage && <AppText style={[styles.nativeLanguage, isSelected && styles.selectedTitle]}>{nativeLanguage}</AppText>}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: mw(8),
    borderRadius: mw(8),
    borderWidth: 1,
    borderColor: Colors.lightPink,
    backgroundColor: Colors.bgDark,
    minHeight: mh(46),
  },
  selectedContainer: {
    backgroundColor: Colors.lightPink
  },
  title: {
    ...Typography.medium_12,
    color: Colors.lightPink,
  },
  selectedTitle: {
    color: Colors.purpleDark,
  },
  nativeLanguage: {
    ...Typography.semibold_12,
    color: Colors.lightPink,
  },
})

export default AppLanguageCard;