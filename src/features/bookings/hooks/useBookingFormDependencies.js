import { useCallback, useState } from 'react';
import { getVehicles } from '../../../api/vehicles';
import { getPackages } from '../../../api/packages';

function mapVehicleOption(item) {
  return {
    id: item.vehicle_id || item._id || item.id,
    name: item.vehicle_model || '',
  };
}

function mapPackage(item) {
  const id = item._id || item.id;
  if (!id) return null;
  return {
    id,
    _id: item._id,
    package_id: item.package_id,
    name: item.name || '',
    description: item.description || 'Customize features and pricing',
    status: item.status || 'active',
    details: Array.isArray(item.details) ? item.details : [],
    pricing: item.pricing || item.pricingMatrix || [],
    pricingMatrix: item.pricingMatrix || item.pricing || [],
    worktime: item.worktime ?? item.work_time_minutes ?? item.workTimeMinutes ?? '',
  };
}

export function useBookingFormDependencies() {
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isLoadingFormDependencies, setIsLoadingFormDependencies] = useState(false);
  const [hasLoadedDependencies, setHasLoadedDependencies] = useState(false);

  const loadFormDependencies = useCallback(async () => {
    if (hasLoadedDependencies) return true;

    setIsLoadingFormDependencies(true);
    try {
      const [vehiclesRes, packagesRes] = await Promise.all([
        getVehicles(),
        getPackages(),
      ]);

      const vehiclesList = vehiclesRes?.data || vehiclesRes || [];
      const packagesList = packagesRes?.data || packagesRes || [];

      setVehicleOptions(
        Array.isArray(vehiclesList) ? vehiclesList.map(mapVehicleOption) : []
      );
      setPackages(
        Array.isArray(packagesList)
          ? packagesList.map(mapPackage).filter(Boolean)
          : []
      );
      setHasLoadedDependencies(true);
      return true;
    } catch (error) {
      console.log('useBookingFormDependencies', 'Failed to fetch booking form dependencies', error);
      if (typeof window?.showToast === 'function') {
        window.showToast('Failed to load form data', 'error');
      }
      return false;
    } finally {
      setIsLoadingFormDependencies(false);
    }
  }, [hasLoadedDependencies]);

  return {
    vehicleOptions,
    packages,
    isLoadingFormDependencies,
    loadFormDependencies,
  };
}
