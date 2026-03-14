import { useCallback, useState } from 'react';
import { getVehicles } from '../../../api/vehicles';
import { getPackages } from '../../../api/packages';
import { getDrivers } from '../../../api/drivers';
import { getTechnicians } from '../../../api/technicians';
import { getServiceVans } from '../../../api/serviceVans';

function mapVehicleOption(item) {
  return {
    id: item._id || item.id,
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

function mapDriver(item) {
  return { id: item._id || item.id, name: item.name || '' };
}

function mapTechnician(item) {
  return { id: item._id || item.id, name: item.name || '' };
}

function mapServiceVan(item) {
  return {
    id: item._id || item.id,
    registration_number: item.registration_number || '',
  };
}

export function useBookingFormDependencies() {
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [packages, setPackages] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [serviceVans, setServiceVans] = useState([]);
  const [isLoadingFormDependencies, setIsLoadingFormDependencies] = useState(false);
  const [hasLoadedDependencies, setHasLoadedDependencies] = useState(false);

  const loadFormDependencies = useCallback(async () => {
    const assignmentDepsLoaded =
      drivers.length > 0 || technicians.length > 0 || serviceVans.length > 0;
    if (hasLoadedDependencies && assignmentDepsLoaded) return true;

    setIsLoadingFormDependencies(true);
    try {
      const [vehiclesRes, packagesRes, driversRes, techniciansRes, serviceVansRes] =
        await Promise.all([
          getVehicles(),
          getPackages(),
          getDrivers(),
          getTechnicians(),
          getServiceVans(),
        ]);

      const vehiclesList = vehiclesRes?.data || vehiclesRes || [];
      const packagesList = packagesRes?.data || packagesRes || [];
      const driversList = driversRes?.data || driversRes || [];
      const techniciansList = techniciansRes?.data || techniciansRes || [];
      const serviceVansList = serviceVansRes?.data || serviceVansRes || [];

      setVehicleOptions(
        Array.isArray(vehiclesList) ? vehiclesList.map(mapVehicleOption) : []
      );
      setPackages(
        Array.isArray(packagesList)
          ? packagesList.map(mapPackage).filter(Boolean)
          : []
      );
      setDrivers(
        Array.isArray(driversList) ? driversList.map(mapDriver) : []
      );
      setTechnicians(
        Array.isArray(techniciansList) ? techniciansList.map(mapTechnician) : []
      );
      setServiceVans(
        Array.isArray(serviceVansList) ? serviceVansList.map(mapServiceVan) : []
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
  }, [hasLoadedDependencies, drivers.length, technicians.length, serviceVans.length]);

  return {
    vehicleOptions,
    packages,
    drivers,
    technicians,
    serviceVans,
    isLoadingFormDependencies,
    loadFormDependencies,
  };
}
