import axios from 'axios';
import { Platform } from 'react-native';
import { IS_TABLET } from '../utils/device';
import { generateCurl } from './networkManager';
import { ApiError } from './apiError';
import { log } from '../utils/logger';

export const API_SUCCESS_CODE = 0;

export const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {

  config.headers['Accept-Encoding'] = 'gzip';
  config.headers['User-Agent'] = 'okhttp/4.10.0';
  config.headers['Content-Type'] = 'application/json';
  config.headers['platform'] = Platform.OS;
  config.headers['isTablet'] = IS_TABLET;

  const curl = generateCurl(config);
  log('API_CURL:\n', curl);
  return config;
});

api.interceptors.response.use(
  (response) => {
    const data = response.data;
    log('API_RESPONSE:', data);

    if (typeof data?.code !== 'undefined') {
      if (data.code !== API_SUCCESS_CODE) {
        throw new ApiError({
          message: data.message,
          localizedMessage: data.localizedMessage,
          code: data.code,
          status: response.status,
          data: data.data,
        });
      }

      return response; 
    }

    if (!data || data.message) {
      throw new ApiError({
        message: data?.message || 'Unknown error',
        status: response.status,
      });
    }

    return response;
  },
  (error) => {
    log('API_ERROR:', error?.response?.data);
    const status = error?.response?.status;
    const data = error?.response?.data;

    throw new ApiError({
      message: data?.message || error.message || 'Something went wrong',
      localizedMessage: data?.localizedMessage || 'Something went wrong',
      code: data?.code,
      status,
      data,
    });
    
  }
);
