import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Colors } from "../theme/colors";

type Props = {
  size?: 'small' | 'large';
  color?: string;
}

const AppActivityIndicator = ({ size = 'large', color = Colors.lightPink }: Props) => {
  return ( 
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgDark,
  }
})

export default AppActivityIndicator;  