import { StyleSheet, TouchableOpacity } from "react-native";
import { AppText } from "./AppText";
import { mw } from "../utils/dimensions";
import { Colors } from "../theme/colors";
import { Typography } from "../theme/typography";

interface AppChipProps {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

const AppChip = ({ title, isSelected, onPress }: AppChipProps) => {
  return (
    <TouchableOpacity 
      style={[
      styles.container, 
      isSelected && styles.selected
      ]}
      activeOpacity={1}
      onPress={() => onPress()}
    >
      <AppText style={[styles.text, isSelected && styles.selectedText]}>{title}</AppText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: mw(10),
    borderRadius: mw(100),
    borderWidth: 1,
    borderColor: Colors.lightPink,
  },
  selected: {
    backgroundColor: Colors.lightPink,
  },
  text: {
    ...Typography.medium_14,
    color: Colors.lightPink,
  },
  selectedText: {
    color: Colors.purpleDark,
  },
});

export default AppChip;