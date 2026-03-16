import { useEffect, useState } from 'react';
import { loadGoogleMapsPlaces } from '../helpers/loadGoogleMapsPlaces.js';

export function useGoogleMapsPlaces(isEnabled) {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEnabled) {
      setIsLoading(false);
      setIsReady(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    loadGoogleMapsPlaces()
      .then(() => {
        if (cancelled) return;
        setIsReady(true);
      })
      .catch((err) => {
        if (cancelled) return;
        console.log('useGoogleMapsPlaces', 'Failed to load Google Maps Places', err);
        setError(err);
        setIsReady(false);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isEnabled]);

  return { isLoading, isReady, error };
}

