import { ADMIN_AUTH_TOKEN_STORAGE_KEY } from '../constants';

export function saveAdminAuthToken(token) {
  localStorage.setItem(ADMIN_AUTH_TOKEN_STORAGE_KEY, token);
}

export function getAdminAuthToken() {
  return localStorage.getItem(ADMIN_AUTH_TOKEN_STORAGE_KEY);
}

export function clearAdminAuthSession() {
  localStorage.removeItem(ADMIN_AUTH_TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(ADMIN_AUTH_TOKEN_STORAGE_KEY);
}
