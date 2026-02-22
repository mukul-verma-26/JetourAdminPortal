import { useEffect, useRef } from 'react';
import { FiMapPin } from 'react-icons/fi';
import styles from './GoogleLocationInput.module.scss';

function GoogleLocationInput({ value, onChange, name, id, error, placeholder }) {
  const inputRef = useRef(null);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', initializeSearchBox);
      } else {
        const script = document.createElement('script');
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
        if (!apiKey) {
          console.warn('Google Maps API key not found. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file');
          return;
        }
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initializeSearchBox;
        script.onerror = () => {
          console.error('Failed to load Google Maps API');
        };
        document.head.appendChild(script);
      }
    } else {
      initializeSearchBox();
    }

    return () => {
      if (searchBoxRef.current) {
        window.google?.maps?.event?.clearInstanceListeners?.(searchBoxRef.current);
      }
    };
  }, []);

  const initializeSearchBox = () => {
    if (!inputRef.current || !window.google?.maps?.places) return;

    const searchBox = new window.google.maps.places.SearchBox(inputRef.current);

    searchBox.addListener('places_changed', () => {
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
  };

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
        />
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}
      {!window.google?.maps?.places && (
        <div className={styles.apiWarning}>
          Google Maps API not loaded. Please check API key configuration.
        </div>
      )}
    </div>
  );
}

export default GoogleLocationInput;
