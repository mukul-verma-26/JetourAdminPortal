import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  createServiceVan,
  getServiceVans,
  updateServiceVan as updateServiceVanApi,
  deleteServiceVan as deleteServiceVanApi,
} from '../../api/serviceVans';

function mapServiceVanFromApi(item) {
  const image = item.image
    ? (item.image.startsWith('data:') ? item.image : `data:image/png;base64,${item.image}`)
    : '';
  return {
    id: item.service_van_id || item._id,
    _id: item._id,
    vehicleModel: item.vehicle_model || '',
    mileage: item.mileage ?? 0,
    lastService: item.last_service_date || '',
    status: item.status || 'active',
    photo: image,
    technicianId: item.technician_id || '',
    technician_id: item.technician_id || '',
    driverId: item.driver_id || '',
    driver_id: item.driver_id || '',
  };
}

export function useServiceVans() {
  const [serviceVans, setServiceVans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchServiceVans() {
      setIsLoading(true);
      try {
        const res = await getServiceVans();
        const list = res?.data || res || [];
        if (!cancelled) {
          setServiceVans(Array.isArray(list) ? list.map(mapServiceVanFromApi) : []);
        }
      } catch (error) {
        if (!cancelled) {
          console.log('useServiceVans', 'Failed to fetch service vans', error);
          if (typeof window?.showToast === 'function') {
            window.showToast('Failed to load service vans', 'error');
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }
    fetchServiceVans();
    return () => {
      cancelled = true;
    };
  }, []);

  const addServiceVan = useCallback(async (van) => {
    setIsCreating(true);
    try {
      const data = await createServiceVan(van);
      const created = data?.data || data?.service_van || data;
      const newVan = created
        ? mapServiceVanFromApi({
            ...created,
            service_van_id: created.service_van_id || created._id || created.id,
          })
        : {
            id: `KWT-${String(Date.now()).slice(-3).padStart(3, '0')}`,
            vehicleModel: van.vehicle_model || '',
            mileage: van.mileage || 0,
            lastService: van.last_service_date || '',
            status: van.status || 'active',
            photo: '',
          };
      setServiceVans((prev) => [...prev, newVan]);
      if (typeof window?.showToast === 'function') {
        window.showToast('Service van added successfully', 'success');
      }
    } catch (error) {
      console.log('addServiceVan', 'Failed', error);
      console.log('addServiceVan', 'Error response:', error?.response?.data);
      console.log('addServiceVan', 'Error message:', error?.message);
      if (typeof window?.showToast === 'function') {
        window.showToast(error?.response?.data?.message || 'Failed to add service van', 'error');
      }
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateServiceVan = useCallback(async (id, updatedVan) => {
    setIsUpdating(true);
    try {
      const van = serviceVans.find((v) => v.id === id);
      const apiId = van?._id || id;
      await updateServiceVanApi(apiId, updatedVan);
      const res = await getServiceVans();
      const list = res?.data || res || [];
      setServiceVans(Array.isArray(list) ? list.map(mapServiceVanFromApi) : []);
      if (typeof window?.showToast === 'function') {
        window.showToast('Service van updated successfully', 'success');
      }
    } catch (error) {
      console.log('updateServiceVan', 'Failed', error);
      console.log('updateServiceVan', 'Error response:', error?.response?.data);
      console.log('updateServiceVan', 'Error message:', error?.message);
      if (typeof window?.showToast === 'function') {
        window.showToast(error?.response?.data?.message || 'Failed to update service van', 'error');
      }
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [serviceVans]);

  const deleteServiceVan = useCallback(async (id) => {
    setIsDeleting(true);
    try {
      const van = serviceVans.find((v) => v.id === id);
      const apiId = van?._id || id;
      await deleteServiceVanApi(apiId);
      setServiceVans((prev) => prev.filter((v) => v.id !== id));
      if (typeof window?.showToast === 'function') {
        window.showToast('Service van deleted successfully', 'success');
      }
    } catch (error) {
      console.log('deleteServiceVan', 'Failed', error);
      console.log('deleteServiceVan', 'Error response:', error?.response?.data);
      console.log('deleteServiceVan', 'Error message:', error?.message);
      if (typeof window?.showToast === 'function') {
        window.showToast(error?.response?.data?.message || 'Failed to delete service van', 'error');
      }
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, [serviceVans]);

  const stats = useMemo(() => {
    const total = serviceVans.length;
    const active = serviceVans.filter((v) => v.status === 'active').length;
    const inMaintenance = serviceVans.filter((v) => v.status === 'maintenance').length;
    return { total, active, inMaintenance };
  }, [serviceVans]);

  return {
    serviceVans,
    stats,
    addServiceVan,
    updateServiceVan,
    deleteServiceVan,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
  };
}
