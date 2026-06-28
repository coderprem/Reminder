import { Dimensions, Platform } from "react-native";
import { DeviceInfo } from "react-native-device-info";

export const IS_TABLET = DeviceInfo.isTablet();
export const IS_MOBILE = !IS_TABLET;
export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';

export const IS_IPAD = IS_IOS && IS_TABLET;
export const IS_ANDROID_TABLET = IS_ANDROID && IS_TABLET;

export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

export const screenWidth = Dimensions.get('screen').width;
export const screenHeight = Dimensions.get('screen').height;