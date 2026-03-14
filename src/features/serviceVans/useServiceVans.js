import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  createServiceVan,
  getServiceVans,
  getServiceVanById,
  updateServiceVan as updateServiceVanApi,
  deleteServiceVan as deleteServiceVanApi,
} from '../../api/serviceVans';

function resolveImageUrl(raw) {
  if (!raw) return '';
  if (raw.startsWith('data:') || raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw;
  }
  return `data:image/png;base64,${raw}`;
}

function mapServiceVanFromApi(item) {
  const imageValue = item.image ?? item.vehicle_image;
  const photo = resolveImageUrl(imageValue ? String(imageValue).trim() : '');
  const techDetails = item.technician_details;
  const driverDetails = item.driver_details;
  return {
    id: item.id || item.service_van_id || item._id,
    _id: item._id || item.id,
    registrationNumber: item.registration_number || '',
    registration_number: item.registration_number || '',
    vehicleModel: item.vehicle_model || '',
    mileage: item.mileage ?? 0,
    lastService: item.last_service_date || '',
    status: item.status || 'active',
    photo,
    technicianId:
      item.technician_id || techDetails?.technician_id || techDetails?.id || techDetails?._id || '',
    technician_id:
      item.technician_id || techDetails?.technician_id || techDetails?.id || techDetails?._id || '',
    technicianDetails: techDetails,
    driverId: item.driver_id || driverDetails?.driver_id || driverDetails?.id || driverDetails?._id || '',
    driver_id:
      item.driver_id || driverDetails?.driver_id || driverDetails?.id || driverDetails?._id || '',
    driverDetails: driverDetails,
  };
}

export function useServiceVans() {
  const [serviceVans, setServiceVans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editVan, setEditVan] = useState(null);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [viewVan, setViewVan] = useState(null);
  const [isViewLoading, setIsViewLoading] = useState(false);

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
            registrationNumber: van.registration_number || '',
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
    const inMaintenance = serviceVans.filter((v) => v.status === 'under_maintenance').length;
    return { total, active, inMaintenance };
  }, [serviceVans]);

  const openEdit = useCallback(async (van) => {
    const apiId = van?._id || van?.id;
    if (!apiId) return;
    setIsEditLoading(true);
    try {
      const res = await getServiceVanById(apiId);
      const data = res?.data || res || {};
      setEditVan(mapServiceVanFromApi(data));
    } catch (error) {
      console.log('openEdit', `GET /service-vans/${apiId}`, error);
      if (typeof window?.showToast === 'function') {
        window.showToast('Failed to load van details', 'error');
      }
    } finally {
      setIsEditLoading(false);
    }
  }, []);

  const closeEdit = useCallback(() => setEditVan(null), []);

  const openView = useCallback(async (van) => {
    const apiId = van?._id || van?.id;
    setViewVan(mapServiceVanFromApi(van));
    if (!apiId) return;
    setIsViewLoading(true);
    try {
      const res = await getServiceVanById(apiId);
      const data = res?.data || res || {};
      setViewVan(mapServiceVanFromApi(data));
    } catch (err) {
      console.log('openView', 'Failed to fetch van details', err);
      if (typeof window?.showToast === 'function') {
        window.showToast('Failed to load van details', 'error');
      }
    } finally {
      setIsViewLoading(false);
    }
  }, []);

  const closeView = useCallback(() => setViewVan(null), []);

  return {
    serviceVans,
    stats,
    addServiceVan,
    updateServiceVan,
    deleteServiceVan,
    openEdit,
    closeEdit,
    editVan,
    isEditLoading,
    openView,
    closeView,
    viewVan,
    isViewLoading,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
  };
}
