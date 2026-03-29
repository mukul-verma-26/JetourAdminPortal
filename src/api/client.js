import axios from 'axios';

export const BASE_URL = 'https://api.jetourcarekw.com/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('apiClient', 'Request failed', error);
    console.log('apiClient', 'Error response:', error?.response?.data);
    console.log('apiClient', 'Error status:', error?.response?.status);
    return Promise.reject(error);
  }
);
