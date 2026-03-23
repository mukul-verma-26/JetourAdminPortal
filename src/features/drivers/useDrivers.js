import { useState, useCallback, useMemo, useEffect } from 'react';
import { createDriver, getDrivers, updateDriver as updateDriverApi, deleteDriver as deleteDriverApi } from '../../api/drivers';

function resolveImageUrl(raw) {
  if (!raw) return '';
  if (raw.startsWith('data:') || raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw;
  }
  return `data:image/png;base64,${raw}`;
}

function mapDriverFromApi(item) {
  const image = resolveImageUrl(item.image);
  return {
    id: item.driver_id || item._id,
    _id: item._id,
    name: item.name || '',
    contact: item.contact || '',
    civilId: item.civil_id || '',
    nationality: item.nationality || '',
    gender: item.gender || 'male',
    photo: image,
    rating: item.rating ?? 0,
    status: item.status || 'active',
    password: item.password || '',
  };
}

export function useDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchDrivers() {
      setIsLoading(true);
      try {
        const res = await getDrivers();
        const list = res?.data || res || [];
        if (!cancelled) {
          setDrivers(Array.isArray(list) ? list.map(mapDriverFromApi) : []);
        }
      } catch (error) {
        if (!cancelled) {
          console.log('useDrivers', 'Failed to fetch drivers', error);
          if (typeof window?.showToast === 'function') {
            window.showToast('Failed to load drivers', 'error');
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }
    fetchDrivers();
    return () => { cancelled = true; };
  }, []);

  const addDriver = useCallback(async (driver) => {
    setIsCreating(true);
    try {
      const data = await createDriver(driver);
      const created = data?.data || data?.driver || data;
      const newDriver = created
        ? mapDriverFromApi({
            ...created,
            driver_id: created.driver_id || created._id || created.id,
          })
        : {
            id: `D-${String(Date.now()).slice(-3).padStart(3, '0')}`,
            name: driver.name,
            contact: driver.contact,
            civilId: driver.civil_id,
            gender: driver.gender,
            status: driver.status,
            rating: driver.rating || 0,
            photo: '',
          };
      setDrivers((prev) => [...prev, newDriver]);
      if (typeof window?.showToast === 'function') {
        window.showToast('Driver added successfully', 'success');
      }
    } catch (error) {
      console.log('addDriver', 'Failed', error);
      console.log('addDriver', 'Error response:', error?.response?.data);
      console.log('addDriver', 'Error message:', error?.message);
      if (typeof window?.showToast === 'function') {
        window.showToast(error?.response?.data?.message || 'Failed to add driver', 'error');
      }
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateDriver = useCallback(async (id, updatedDriver) => {
    setIsUpdating(true);
    try {
      const driver = drivers.find((d) => d.id === id);
      const apiId = driver?._id || id;
      await updateDriverApi(apiId, updatedDriver);
      const res = await getDrivers();
      const list = res?.data || res || [];
      setDrivers(Array.isArray(list) ? list.map(mapDriverFromApi) : []);
      if (typeof window?.showToast === 'function') {
        window.showToast('Driver updated successfully', 'success');
      }
    } catch (error) {
      console.log('updateDriver', 'Failed', error);
      console.log('updateDriver', 'Error response:', error?.response?.data);
      console.log('updateDriver', 'Error message:', error?.message);
      if (typeof window?.showToast === 'function') {
        window.showToast(error?.response?.data?.message || 'Failed to update driver', 'error');
      }
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [drivers]);

  const deleteDriver = useCallback(async (id) => {
    setIsDeleting(true);
    try {
      const driver = drivers.find((d) => d.id === id);
      const apiId = driver?._id || id;
      await deleteDriverApi(apiId);
      setDrivers((prev) => prev.filter((d) => d.id !== id));
      if (typeof window?.showToast === 'function') {
        window.showToast('Driver deleted successfully', 'success');
      }
    } catch (error) {
      console.log('deleteDriver', 'Failed', error);
      console.log('deleteDriver', 'Error response:', error?.response?.data);
      console.log('deleteDriver', 'Error message:', error?.message);
      if (typeof window?.showToast === 'function') {
        window.showToast(error?.response?.data?.message || 'Failed to delete driver', 'error');
      }
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, [drivers]);

  const stats = useMemo(() => {
    const total = drivers.length;
    const onDuty = drivers.filter((d) => d.status === 'active').length;
    const avgRating =
      total > 0
        ? (
            drivers.reduce((sum, d) => sum + (d.rating || 0), 0) / total
          ).toFixed(1)
        : '0.0';
    return { total, onDuty, avgRating };
  }, [drivers]);

  return {
    drivers,
    stats,
    addDriver,
    updateDriver,
    deleteDriver,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
  };
}
