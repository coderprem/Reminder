// font.ts
import { PixelRatio } from 'react-native';
import { windowWidth } from './device';
import { getBaseWidth } from './dimensions';


// Moderate scaling for fonts
export const fs = (size: number, factor = 0.35) => {
  const baseWidth = getBaseWidth();
  const widthScale = windowWidth / baseWidth;
  const moderated = size + (widthScale - 1) * size * factor;

  return Math.round(PixelRatio.roundToNearestPixel(moderated));
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const sfs = (
  size: number,
  { factor = 0.35, minScale = 0.9, maxScale = 1.3 } = {}
) => {
  const normalized = fs(size, factor);
  const fontScale = clamp(PixelRatio.getFontScale(), minScale, maxScale);

  return Math.round(PixelRatio.roundToNearestPixel(normalized * fontScale));
};