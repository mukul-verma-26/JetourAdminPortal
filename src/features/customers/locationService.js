import { loadGoogleMapsPlaces } from '../googleMaps/helpers/loadGoogleMapsPlaces.js';

export async function reverseGeocodeLatLng(lat, lng) {
  const latNum = Number(lat);
  const lngNum = Number(lng);
  if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
    return '';
  }

  await loadGoogleMapsPlaces();
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
