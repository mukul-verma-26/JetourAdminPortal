import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  createVehicle,
  getVehicles,
  updateVehicle as updateVehicleApi,
  deleteVehicle as deleteVehicleApi,
} from '../../api/vehicles';

function mapVehicleFromApi(item) {
  const image = item.vehicle_image
    ? (item.vehicle_image.startsWith('data:')
        ? item.vehicle_image
        : `data:image/png;base64,${item.vehicle_image}`)
    : '';
  const categoryRaw = item.vehicle_category || '';
  const category = categoryRaw.toLowerCase();
  return {
    id: item.vehicle_id || item._id || item.id,
    _id: item._id,
    category,
    vehicle_category: categoryRaw,
    modelName: item.vehicle_model || '',
    vehicle_model: item.vehicle_model || '',
    image,
    vehicle_image: item.vehicle_image || '',
  };
}

export function useVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchVehicles() {
      setIsLoading(true);
      try {
        const res = await getVehicles();
        const list = res?.data || res || [];
        if (!cancelled) {
          setVehicles(Array.isArray(list) ? list.map(mapVehicleFromApi) : []);
        }
      } catch (error) {
        if (!cancelled) {
          console.log('useVehicles', 'Failed to fetch vehicles', error);
          if (typeof window?.showToast === 'function') {
            window.showToast('Failed to load vehicles', 'error');
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }
    fetchVehicles();
    return () => {
      cancelled = true;
    };
  }, []);

  const addVehicle = useCallback(async (payload) => {
    setIsCreating(true);
    try {
      const data = await createVehicle(payload);
      const created = data?.data || data?.vehicle || data;
      const newVehicle = created
        ? mapVehicleFromApi({
            ...created,
            vehicle_id: created.vehicle_id || created._id || created.id,
          })
        : {
            id: `VH-${String(Date.now()).slice(-3).padStart(3, '0')}`,
            category: (payload.vehicle_category || '').toLowerCase(),
            modelName: payload.vehicle_model || '',
            image: '',
          };
      setVehicles((prev) => [...prev, newVehicle]);
      if (typeof window?.showToast === 'function') {
        window.showToast('Vehicle added successfully', 'success');
      }
    } catch (error) {
      console.log('addVehicle', 'Failed', error);
      console.log('addVehicle', 'Error response:', error?.response?.data);
      console.log('addVehicle', 'Error message:', error?.message);
      if (typeof window?.showToast === 'function') {
        window.showToast(error?.response?.data?.message || 'Failed to add vehicle', 'error');
      }
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateVehicle = useCallback(async (id, payload) => {
    setIsUpdating(true);
    try {
      const vehicle = vehicles.find((v) => v.id === id);
      const apiId = vehicle?._id || id;
      await updateVehicleApi(apiId, payload);
      const res = await getVehicles();
      const list = res?.data || res || [];
      setVehicles(Array.isArray(list) ? list.map(mapVehicleFromApi) : []);
      if (typeof window?.showToast === 'function') {
        window.showToast('Vehicle updated successfully', 'success');
      }
    } catch (error) {
      console.log('updateVehicle', 'Failed', error);
      console.log('updateVehicle', 'Error response:', error?.response?.data);
      console.log('updateVehicle', 'Error message:', error?.message);
      if (typeof window?.showToast === 'function') {
        window.showToast(error?.response?.data?.message || 'Failed to update vehicle', 'error');
      }
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [vehicles]);

  const deleteVehicle = useCallback(async (id) => {
    setIsDeleting(true);
    try {
      const vehicle = vehicles.find((v) => v.id === id);
      const apiId = vehicle?._id || id;
      await deleteVehicleApi(apiId);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      if (typeof window?.showToast === 'function') {
        window.showToast('Vehicle deleted successfully', 'success');
      }
    } catch (error) {
      console.log('deleteVehicle', 'Failed', error);
      console.log('deleteVehicle', 'Error response:', error?.response?.data);
      console.log('deleteVehicle', 'Error message:', error?.message);
      if (typeof window?.showToast === 'function') {
        window.showToast(error?.response?.data?.message || 'Failed to delete vehicle', 'error');
      }
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, [vehicles]);

  const stats = useMemo(() => {
    const total = vehicles.length;
    const suv = vehicles.filter((v) => v.category === 'suv').length;
    const sedan = vehicles.filter((v) => v.category === 'sedan').length;
    const hatchback = vehicles.filter((v) => v.category === 'hatchback').length;
    return { total, suv, sedan, hatchback };
  }, [vehicles]);

  const vehicleOptions = useMemo(() => {
    return vehicles.map((v) => ({
      id: v.id,
      name: v.modelName,
    }));
  }, [vehicles]);

  return {
    vehicles,
    stats,
    vehicleOptions,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
  };
}
