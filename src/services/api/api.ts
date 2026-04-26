import { isDevelopment } from '@utils/common/isDevelopment';
import { validateEnvs } from '@utils/validation/validateEnvs';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

type ErrorResponseData = {
  message?: string;
  statusCode?: number;
  error?: string;
};

const { EXPO_PUBLIC_API_URL, EXPO_PUBLIC_API_KEY } = validateEnvs();

const api = axios.create({
  baseURL: EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  if (config.method?.toLowerCase() === 'get') {
    config.params = {
      ...config.params,
      api_key: EXPO_PUBLIC_API_KEY,
    };
  }
  return config;
};

const requestErrorInterceptor = (error: unknown) => {
  return Promise.reject(error);
};

const responseInterceptor = (response: AxiosResponse) => {
  return response;
};

const responseErrorInterceptor = async (error: AxiosError<ErrorResponseData>) => {
  if (!error.response) {
    if (isDevelopment) {
      console.warn('Network error:', error.message);
    }
    return Promise.reject({
      ...error,
      networkError: true,
      message: 'Network error. Please check your connection.',
    });
  }

  return Promise.reject(error);
};

api.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
api.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

export { api };
