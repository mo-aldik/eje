import axios, { AxiosResponse } from 'axios';

// Create API instance
const http2 = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL_2 + '/',
});

http2.defaults.headers.post['Content-Type'] = 'application/json';

// Add a request interceptor
http2.interceptors.request.use(
  (config: any) => {
    config.headers = {
      ['internalToken']: '63cde9c4063a486e92460c8a35e38b8e',
      ...config.headers,
    };

    return config;
  },
  (error) => Promise.reject(error),
);

// Add a response interceptor
http2.interceptors.response.use((response: AxiosResponse) => response);

export default http2;
