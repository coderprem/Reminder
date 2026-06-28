import React from "react";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";
import AppButton from "./AppButton";
import AppSpacer from "./AppSpacer";

export type ButtonItem = {
  title: string;
  onPress?: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
};
interface AppButtonGroupProps {
  buttons: ButtonItem[];
  spacerHeight?: number;
}

const AppButtonGroup = (props: AppButtonGroupProps) => {
  const { 
    buttons,
    spacerHeight = 16
  } = props;

  if (!buttons || buttons.length === 0) return null;
  return (
    <>
      {buttons.map((button, index) => (
        <React.Fragment key={button?.title || index}>
          <AppButton
            title={button.title}
            onPress={button.onPress}
            buttonStyle={button.buttonStyle}
            titleStyle={button.titleStyle}
            disabled={button.disabled}
          />
          {index !== buttons.length - 1 && (
            <AppSpacer height={spacerHeight} />
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default AppButtonGroup;
