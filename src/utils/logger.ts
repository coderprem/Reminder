let tron: any;

if (__DEV__) {
  tron = require('../config/ReactotronConfig').default;
}

export const log = (...args: any[]) => {
  if (__DEV__ && tron) {
    tron.log(...args);
  } else {
    console.log(...args);
  }
};

export const error = (...args: any[]) => {
  if (__DEV__ && tron) {
    tron.error(...args);
  } else {
    console.error(...args);
  }
};