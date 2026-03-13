let googleMapsApiPromise;

function loadGoogleMapsApi() {
  if (window.google?.maps?.Geocoder) {
    return Promise.resolve();
  }

  if (!googleMapsApiPromise) {
    googleMapsApiPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener(
          'error',
          () => reject(new Error('Failed to load Google Maps API script')),
          { once: true }
        );
        return;
      }

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
      if (!apiKey) {
        reject(new Error('Google Maps API key not found'));
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps API script'));
      document.head.appendChild(script);
    });
  }

  return googleMapsApiPromise;
}

export async function reverseGeocodeLatLng(lat, lng) {
  const latNum = Number(lat);
  const lngNum = Number(lng);
  if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
    return '';
  }

  await loadGoogleMapsApi();
  if (!window.google?.maps?.Geocoder) {
    return '';
  }

  return new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat: latNum, lng: lngNum } }, (results, status) => {
      if (status === 'OK' && results?.length) {
        resolve(results[0].formatted_address || '');
        return;
      }
      reject(new Error(`Reverse geocoding failed with status: ${status}`));
    });
  });
}
