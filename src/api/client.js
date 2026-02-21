import axios from 'axios';

const BASE_URL = 'https://jetour-1.onrender.com/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
