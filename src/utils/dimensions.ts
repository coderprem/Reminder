import { windowWidth, windowHeight, IS_TABLET, IS_IPAD, IS_MOBILE, IS_ANDROID_TABLET } from './device';

// 🎯 Figma reference sizes
export const MOBILE_BASE_WIDTH = 360;
export const MOBILE_BASE_HEIGHT = 800;

export const TABLET_BASE_WIDTH = 1280;
export const TABLET_BASE_HEIGHT = 800;

export const IPAD_BASE_WIDTH = 1024;
export const IPAD_BASE_HEIGHT = 800;

export const getBaseWidth = () => {
  if (IS_ANDROID_TABLET) return TABLET_BASE_WIDTH;
  if (IS_IPAD) return IPAD_BASE_WIDTH;
  return MOBILE_BASE_WIDTH;
};

// mobile only dimensions
export const mw = (size: number) => {
  return (windowWidth / MOBILE_BASE_WIDTH) * size;
};

export const mh = (size: number) => {
  return (windowHeight / MOBILE_BASE_HEIGHT) * size;
};

// tablet only dimensions
export const tw = (size: number) => {
  if (IS_TABLET) {
    return (windowWidth / TABLET_BASE_WIDTH) * size;
  }
  if (IS_IPAD) {
    return (windowWidth / IPAD_BASE_WIDTH) * size;
  }
  return mw(size);
};

export const th = (size: number) => {
  if (IS_TABLET) {
    return (windowHeight / TABLET_BASE_HEIGHT) * size;
  }
  if (IS_IPAD) {
    return (windowHeight / IPAD_BASE_HEIGHT) * size;
  }
  return mh(size);
};

// common dimensions
export const cw = (size: number) => {
  if (IS_MOBILE) {
    return mw(size);
  }
  if (IS_TABLET) {
    return tw(size);
  }
  return size;
}

export const ch = (size: number) => {
  if (IS_MOBILE) {
    return mh(size);
  }
  if (IS_TABLET) {
    return th(size);
  }
  return size;
}

// mobile and tablet dimensions
export const dw = (mobileSize: number, tabletSize: number) => {
  if (IS_MOBILE) {
    return mw(mobileSize);
  }
  return tw(tabletSize);
};

export const dh = (mobileSize: number, tabletSize: number) => {
  if (IS_MOBILE) {
    return mh(mobileSize);
  }
  return th(tabletSize);
};