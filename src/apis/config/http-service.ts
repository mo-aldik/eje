import axios, { AxiosResponse } from 'axios';

// Create API instance
const http = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL + '/',
});

http.defaults.headers.post['Content-Type'] = 'application/json';

// Add a request interceptor
http.interceptors.request.use(
  (config: any) => {
    config.headers = {
      ['Token']: 'ABKr83AQDm2iI4OoBGcDZLqpveZl',
      ...config.headers,
    };

    return config;
  },
  (error) => Promise.reject(error),
);

// Add a response interceptor
http.interceptors.response.use((response: AxiosResponse) => response);

export default http;
