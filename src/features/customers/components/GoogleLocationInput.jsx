import { useEffect, useMemo, useRef } from 'react';
import { FiMapPin } from 'react-icons/fi';
import styles from './GoogleLocationInput.module.scss';
import { useGoogleMapsPlaces } from '../../googleMaps/hooks/useGoogleMapsPlaces.js';

function GoogleLocationInput({ value, onChange, name, id, error, placeholder }) {
  const inputRef = useRef(null);
  const searchBoxRef = useRef(null);
  const { isLoading: isMapsLoading, isReady: isMapsReady, error: mapsError } = useGoogleMapsPlaces(true);

  const isLocationDisabled = useMemo(() => isMapsLoading || !!mapsError || !isMapsReady, [isMapsLoading, mapsError, isMapsReady]);

  useEffect(() => {
    if (!isMapsReady) return;
    if (!inputRef.current || !window.google?.maps?.places) return;

    const searchBox = new window.google.maps.places.SearchBox(inputRef.current);

    const listener = searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (!places || places.length === 0) return;

      const place = places[0];
      if (place.geometry && place.geometry.location) {
        const location = {
          formatted_address: place.formatted_address || place.name || '',
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address_components: place.address_components || [],
        };
        const displayValue = place.formatted_address || place.name || '';

        onChange({
          target: {
            name,
            value: displayValue,
            locationData: location,
          },
        });
      }
    });

    searchBoxRef.current = searchBox;

    return () => {
      try {
        listener?.remove?.();
      } catch (err) {
        console.log('GoogleLocationInput', 'Failed to remove SearchBox listener', err);
      }
      if (searchBoxRef.current) {
        window.google?.maps?.event?.clearInstanceListeners?.(searchBoxRef.current);
      }
      searchBoxRef.current = null;
    };
  }, [isMapsReady, name, onChange]);

  const handleInputChange = (e) => {
    onChange({
      target: {
        name,
        value: e.target.value,
      },
    });
  };

  return (
    <div className={styles.locationInputWrapper}>
      <div className={styles.inputContainer}>
        <FiMapPin className={styles.icon} size={18} />
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          placeholder={placeholder || 'Search for location...'}
          value={value || ''}
          onChange={handleInputChange}
          autoComplete="off"
          disabled={isLocationDisabled}
        />
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}
      {isMapsLoading && (
        <div className={styles.apiWarning}>
          Loading Google Maps…
        </div>
      )}
      {mapsError && !isMapsLoading && (
        <div className={styles.apiWarning}>
          Google Maps API failed to load. Please check API key configuration.
        </div>
      )}
    </div>
  );
}

export default GoogleLocationInput;
