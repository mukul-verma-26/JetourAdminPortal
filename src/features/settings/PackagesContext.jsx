import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getPackages } from '../../api/packages';

function mapPackageFromApi(item) {
  if (!item) return null;
  const id = item._id || item.id;
  if (!id) return null;
  const details = Array.isArray(item.details) ? item.details : [];
  return {
    id,
    _id: item._id,
    package_id: item.package_id,
    name: item.name || '',
    description: item.description || 'Customize features and pricing',
    status: item.status || 'active',
    details,
    pricingMatrix: item.pricingMatrix || item.pricing || [],
    worktime: item.worktime ?? item.work_time_minutes ?? item.workTimeMinutes ?? '',
  };
}

const PackagesContext = createContext(null);

export function PackagesProvider({ children }) {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPackages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getPackages();
      const list = res?.data || res || [];
      const mapped = Array.isArray(list)
        ? list.map(mapPackageFromApi).filter(Boolean)
        : [];
      setPackages(mapped);
    } catch (error) {
      console.log('PackagesProvider', 'Failed to fetch packages', error);
      if (typeof window?.showToast === 'function') {
        window.showToast('Failed to load packages', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const value = {
    packages,
    setPackages,
    fetchPackages,
    isLoading,
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
