import { useState, useEffect, useCallback } from 'react';
import { getPackageById } from '../../api/packages';
import { getVehicles } from '../../api/vehicles';
import { transformToTableFormat } from './helpers/managePackageHelpers';

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

      let pkgData = packageRes?.data || packageRes;
      if (Array.isArray(pkgData)) {
        pkgData = pkgData.find((p) => (p._id || p.id || p.package_id) === packageId) || pkgData[0];
      }

      if (pkgData) {
        const pricing = pkgData.pricing || [];
        const transformed = transformToTableFormat(vehicles, pricing);
        setPackageDetails({
          ...pkgData,
          tableRows: transformed.rows,
          vehicleColumns: transformed.vehicleColumns,
        });
      } else {
        const transformed = transformToTableFormat(vehicles, []);
        setPackageDetails({
          tableRows: transformed.rows,
          vehicleColumns: transformed.vehicleColumns,
        });
      }
    } catch (err) {
      console.log('useManagePackageDetails', 'Failed to fetch package or vehicles', err);
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
