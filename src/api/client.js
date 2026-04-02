import axios from 'axios';
import { API_BASE_URL, API_KEY } from '../config/env.js';

if (!API_BASE_URL) {
  console.log(
    'apiClient',
    'VITE_API_BASE_URL is not set; define it in .env (see .env.example)',
  );
}

/** @deprecated Prefer importing API_BASE_URL from '../config/env.js'. Kept for any legacy imports. */
export const BASE_URL = API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL || undefined,
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
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
