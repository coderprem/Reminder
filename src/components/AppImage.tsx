import React, { useMemo, useState, useEffect } from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  ImageStyle,
  View,
  DimensionValue,
  StyleSheet,
} from 'react-native';
import FastImage, { ImageStyle as FastImageImageStyle } from 'react-native-fast-image';
import { SvgXml, SvgUri } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
import LottieView from 'lottie-react-native';
import type { ComponentType } from 'react';
import { IMAGES } from '../utils/assetsPath';

const styles = StyleSheet.create({
  lottieFill: {
    width: '100%',
    height: '100%',
  },
});

type Props = {
  uri: string | ImageSourcePropType | ComponentType<SvgProps>;
  width: DimensionValue;
  height: DimensionValue;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'repeat';
  style?: StyleProp<ImageStyle>;
  color?: string;
};

function toSvgSize(value: DimensionValue): string | number | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  return value as string | number;
}

const isSvgString = (val: unknown): val is string =>
  typeof val === 'string' && val.trim().startsWith('<svg');

const isSvgUrl = (val: unknown): val is string =>
  typeof val === 'string' && val.endsWith('.svg');

const isLottie = (val: unknown): val is string =>
  typeof val === 'string' &&
  (val.endsWith('.json') || val.endsWith('.lottie'));

function toFastImageResizeMode(
  mode: 'contain' | 'cover' | 'stretch' | 'repeat',
): 'contain' | 'cover' | 'stretch' | 'center' {
  if (mode === 'repeat') {
    return 'contain';
  }
  return mode;
}

const AppImage: React.FC<Props> = ({
  uri,
  width,
  height,
  resizeMode = 'contain',
  style,
  color,
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false); // reset when uri changes
  }, [uri]);

  const fastImageStyle = useMemo(
    () =>
      StyleSheet.flatten([{ width, height }, style]) as
        | FastImageImageStyle
        | undefined,
    [width, height, style],
  );

  const svgW = toSvgSize(width);
  const svgH = toSvgSize(height);

  // Show placeholder if error
  if (hasError || !uri) {
    return (
      <Image
        source={IMAGES.placeholder}
        style={[{ width, height }, style]}
        resizeMode={resizeMode}
      />
    );
  }

  if (typeof uri === 'function') {
    const SvgComponent = uri;
    return (
      <SvgComponent
        width={svgW}
        height={svgH}
        style={style}
        color={color}
      />
    );
  }

  if (isSvgString(uri)) {
    return (
      <SvgXml
        xml={uri}
        width={svgW}
        height={svgH}
        style={style}
        color={color}
      />
    );
  }

  if (isSvgUrl(uri)) {
    return (
      <SvgUri
        uri={uri}
        width={svgW}
        height={svgH}
        style={style}
        color={color}
        onError={() => setHasError(true)}
      />
    );
  }

  if (isLottie(uri)) {
    return (
      <View style={[{ width, height }, style]}>
        <LottieView
          source={{ uri }}
          autoPlay
          loop
          style={styles.lottieFill}
          onAnimationFailure={() => setHasError(true)}
        />
      </View>
    );
  }

  if (typeof uri === 'string') {
    const fastMode = toFastImageResizeMode(resizeMode);
    return (
      <FastImage
        source={{ uri }}
        style={fastImageStyle}
        resizeMode={FastImage.resizeMode[fastMode]}
        onError={() => setHasError(true)}
      />
    );
  }

  // local images (require)
  return (
    <Image
      source={uri}
      style={[{ width, height }, style]}
      resizeMode={resizeMode}
      onError={() => setHasError(true)}
    />
  );
};

export default React.memo(AppImage);
