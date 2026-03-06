import { useState, useEffect, useCallback } from 'react';
import { getPackageById } from '../../api/packages';
import { getVehicles } from '../../api/vehicles';

/**
 * Transforms API data to table format.
 * vehicleColumns: [{ id: vehicle_Id, name: vehicle_model }] from vehicles API
 * pricing: [{ mileage, vehicles: [{ vehicle_Id, vehicle_model, price }] }] from package API
 * Table rows: [{ mileage, prices: { [vehicle_Id]: price } }]
 */
function transformToTableFormat(pricing, vehicleColumns) {
  if (!Array.isArray(vehicleColumns) || vehicleColumns.length === 0) {
    return [];
  }

  const vehicleIds = vehicleColumns.map((v) => v.id);

  if (!Array.isArray(pricing) || pricing.length === 0) {
    return [{ mileage: '', prices: Object.fromEntries(vehicleIds.map((id) => [id, ''])) }];
  }

  return pricing.map((item) => {
    const prices = {};
    vehicleIds.forEach((id) => { prices[id] = ''; });
    const vehicles = item.vehicles || [];
    vehicles.forEach((v) => {
      const vid = v.vehicle_Id || v.vehicle_id || v.id || v._id;
      if (vid != null) prices[vid] = v.price ?? '';
    });
    return { mileage: item.mileage ?? '', prices };
  });
}

export function useManagePackageDetails(packageId, open) {
  const [packageDetails, setPackageDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetails = useCallback(async () => {
    if (!packageId || !open) return;
    setIsLoading(true);
    setError(null);
    try {
      const [packageRes, vehiclesRes] = await Promise.all([
        getPackageById(packageId),
        getVehicles(),
      ]);

      const vehiclesList = vehiclesRes?.data || vehiclesRes || [];
      const vehicles = Array.isArray(vehiclesList) ? vehiclesList : [];
      const vehicleColumns = vehicles.map((v) => ({
        id: v.vehicle_id || v._id || v.id,
        name: v.vehicle_model || v.modelName || v.name || '',
      })).filter((v) => v.id);

      let pkgData = packageRes?.data || packageRes;
      if (Array.isArray(pkgData) && pkgData.length > 0) {
        pkgData = pkgData[0];
      }
      if (!pkgData) pkgData = null;

      if (pkgData && vehicleColumns.length > 0) {
        const tableRows = transformToTableFormat(pkgData.pricing || [], vehicleColumns);
        setPackageDetails({
          ...pkgData,
          tableRows,
          vehicleColumns,
        });
      } else if (pkgData) {
        setPackageDetails({
          ...pkgData,
          tableRows: [{ mileage: '', prices: {} }],
          vehicleColumns: [],
        });
      } else {
        setPackageDetails(null);
      }
    } catch (err) {
      console.log('useManagePackageDetails', 'Failed to fetch package/vehicles', err);
      setError(err);
      setPackageDetails(null);
      if (typeof window?.showToast === 'function') {
        window.showToast('Failed to load package details', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [packageId, open]);

  useEffect(() => {
    if (open && packageId) {
      fetchDetails();
    } else {
      setPackageDetails(null);
      setError(null);
    }
  }, [open, packageId, fetchDetails]);

  return { packageDetails, isLoading, error, refetch: fetchDetails };
}
