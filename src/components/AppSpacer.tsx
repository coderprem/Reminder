import { View } from "react-native";
import { ch, cw } from "../utils/dimensions";

interface AppSpacerProps {
  height?: number;
  width?: number;
}

const AppSpacer = ({ height, width }: AppSpacerProps) => {
  return (
    <View
      style={{
        height: height ? ch(height) : undefined,
        width: width ? cw(width) : undefined,
      }}
    />
  );
};

export default AppSpacer;
