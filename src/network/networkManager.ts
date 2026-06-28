import NetInfo from '@react-native-community/netinfo';
import { log } from '../utils/logger';
import { AxiosRequestConfig } from 'axios';

let isConnected = true;

export const initNetworkListener = () => {
  NetInfo.addEventListener((state) => {
    const wasConnected = isConnected;

    const nowConnected =
      state.isConnected === true &&
      state.isInternetReachable !== false;

    isConnected = nowConnected;

    if (wasConnected && !nowConnected) {
    }

    if (!wasConnected && nowConnected) {
    }
  });
};

export const getNetworkType = async () => {
  try {
    const networkState = await NetInfo.fetch();

    if (!networkState.isConnected) {
      return 'NONE';
    }

    switch (networkState.type) {
      case 'wifi':
        return 'Wifi';

      case 'cellular':
        const gen = networkState.details.cellularGeneration;
        switch (gen) {
          case '2g':
            return 'Mobile Data EDGE 2G';
          case '3g':
            return 'Mobile Data 3G';
          case '4g':
            return 'Mobile Data 4G';
          case '5g':
            return 'Mobile Data 5G';
          default:
            return 'Mobile Data';
        }

      default:
        return 'noNetwork';
    }
  } catch (error) {
    log('Error getting network type:', error);
    return 'noNetwork';
  }
};

export const isInternetAvailable = () => isConnected;

export const generateCurl = (config: AxiosRequestConfig) => {
  const method = (config.method || 'GET').toUpperCase();
  const url = `${config.baseURL || ''}${config.url}`;

  let curl = `curl -X ${method} '${url}'`;

  // Headers
  if (config.headers) {
    Object.entries(config.headers).forEach(([key, value]) => {
      curl += ` \\\n  -H '${key}: ${value}'`;
    });
  }

  // Body (for POST, PUT, PATCH)
  if (config.data) {
    const data =
      typeof config.data === 'string'
        ? config.data
        : JSON.stringify(config.data);
    curl += ` \\\n  -d '${data}'`;
  }

  return curl;
};