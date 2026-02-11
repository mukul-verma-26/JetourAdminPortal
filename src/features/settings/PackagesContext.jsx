import { createContext, useContext, useState, useCallback } from 'react';
import { INITIAL_SERVICE_PACKAGES, createEmptyPricingRow } from './constants';

const PackagesContext = createContext(null);

export function PackagesProvider({ children }) {
  const [packages, setPackages] = useState(INITIAL_SERVICE_PACKAGES);

  const value = {
    packages,
    setPackages,
  };

  return (
    <PackagesContext.Provider value={value}>
      {children}
    </PackagesContext.Provider>
  );
}

export function usePackagesContext() {
  const context = useContext(PackagesContext);
  if (!context) {
    throw new Error('usePackagesContext must be used within PackagesProvider');
  }
  return context;
}
