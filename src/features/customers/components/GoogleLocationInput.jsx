import { useEffect, useRef } from 'react';
import { FiMapPin } from 'react-icons/fi';
import styles from './GoogleLocationInput.module.scss';

function GoogleLocationInput({ value, onChange, name, id, error, placeholder }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', initializeAutocomplete);
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
        script.onload = initializeAutocomplete;
        script.onerror = () => {
          console.error('Failed to load Google Maps API');
        };
        document.head.appendChild(script);
      }
    } else {
      initializeAutocomplete();
    }

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners?.(autocompleteRef.current);
      }
    };
  }, []);

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google?.maps?.places) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'kw' },
      fields: ['formatted_address', 'geometry', 'address_components'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (place.geometry) {
        const location = {
          formatted_address: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address_components: place.address_components,
        };

        onChange({
          target: {
            name,
            value: place.formatted_address,
            locationData: location,
          },
        });
      }
    });

    autocompleteRef.current = autocomplete;
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
