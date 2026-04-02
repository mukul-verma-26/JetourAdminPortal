/**
 * Single place for Vite environment variables (import.meta.env).
 * Set values in the project root `.env` (see `.env.example`).
 */

function trimOrEmpty(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export const API_BASE_URL = trimOrEmpty(import.meta.env.VITE_API_BASE_URL);

/** Optional; when set, sent on every API request (header name: X-API-Key). */
export const API_KEY = trimOrEmpty(import.meta.env.VITE_API_KEY);

export const GOOGLE_MAPS_API_KEY = trimOrEmpty(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
