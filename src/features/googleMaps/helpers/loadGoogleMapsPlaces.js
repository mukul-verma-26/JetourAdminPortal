import { GOOGLE_MAPS_API_KEY } from '../../../constants/config.js';

let googleMapsPlacesPromise;

function ensureScriptTag(src) {
  const existing = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
  if (existing) return existing;
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
  return script;
}

export function loadGoogleMapsPlaces() {
  if (window.google?.maps?.places) {
    return Promise.resolve(window.google);
  }

  if (googleMapsPlacesPromise) return googleMapsPlacesPromise;

  googleMapsPlacesPromise = new Promise((resolve, reject) => {
    const apiKey = GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      reject(new Error('Google Maps API key not found'));
      return;
    }

    const src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    const script = ensureScriptTag(src);

    const handleLoad = () => {
      if (window.google?.maps?.places) {
        resolve(window.google);
        return;
      }
      reject(new Error('Google Maps API loaded but Places library is unavailable'));
    };

    const handleError = (err) => {
      reject(err instanceof Error ? err : new Error('Failed to load Google Maps API script'));
    };

    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });
  });

  return googleMapsPlacesPromise;
}

