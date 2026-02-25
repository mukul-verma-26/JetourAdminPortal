import { useState, useCallback, useMemo, useEffect } from 'react';
import { createTechnician, getTechnicians, updateTechnician as updateTechnicianApi, deleteTechnician as deleteTechnicianApi } from '../../api/technicians';

function mapTechnicianFromApi(item) {
  const image = item.image
    ? (item.image.startsWith('data:') ? item.image : `data:image/png;base64,${item.image}`)
    : '';
  return {
    id: item.technician_id || item._id,
    _id: item._id,
    name: item.name || '',
    contact: item.contact || '',
    civilId: item.civil_id || '',
    nationality: item.nationality || '',
    gender: item.gender || 'male',
    photo: image,
    password: item.password || '',
    rating: item.rating ?? 0,
    status: item.status || 'active',
  };
}

export function useTechnicians() {
  const [technicians, setTechnicians] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchTechnicians() {
      setIsLoading(true);
      try {
        const res = await getTechnicians();
        const list = res?.data || res || [];
        if (!cancelled) {
          setTechnicians(Array.isArray(list) ? list.map(mapTechnicianFromApi) : []);
        }
      } catch (error) {
        if (!cancelled) {
          console.log('useTechnicians', 'Failed to fetch technicians', error);
          if (typeof window?.showToast === 'function') {
            window.showToast('Failed to load technicians', 'error');
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }
    fetchTechnicians();
    return () => { cancelled = true; };
  }, []);

  const addTechnician = useCallback(async (technician) => {
    setIsCreating(true);
    try {
      const data = await createTechnician(technician);
      const created = data?.data || data?.technician || data;
      const newTechnician = created
        ? mapTechnicianFromApi({
            ...created,
            technician_id: created.technician_id || created._id || created.id,
          })
        : {
            id: `T-${String(Date.now()).slice(-3).padStart(3, '0')}`,
            name: technician.name,
            contact: technician.contact,
            civilId: technician.civil_id,
            gender: technician.gender,
            status: technician.status,
            rating: technician.rating || 0,
            photo: '',
          };
      setTechnicians((prev) => [...prev, newTechnician]);
      if (typeof window?.showToast === 'function') {
        window.showToast('Technician added successfully', 'success');
      }
    } catch (error) {
      console.log('addTechnician', 'Failed', error);
      console.log('addTechnician', 'Error response:', error?.response?.data);
      console.log('addTechnician', 'Error message:', error?.message);
      if (typeof window?.showToast === 'function') {
        window.showToast(error?.response?.data?.message || 'Failed to add technician', 'error');
      }
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateTechnician = useCallback(async (id, updatedTechnician) => {
    setIsUpdating(true);
    try {
      const tech = technicians.find((t) => t.id === id);
      const apiId = tech?._id || id;
      await updateTechnicianApi(apiId, updatedTechnician);
      const res = await getTechnicians();
      const list = res?.data || res || [];
      setTechnicians(Array.isArray(list) ? list.map(mapTechnicianFromApi) : []);
      if (typeof window?.showToast === 'function') {
        window.showToast('Technician updated successfully', 'success');
      }
    } catch (error) {
      console.log('updateTechnician', 'Failed', error);
      console.log('updateTechnician', 'Error response:', error?.response?.data);
      console.log('updateTechnician', 'Error message:', error?.message);
      if (typeof window?.showToast === 'function') {
        window.showToast(error?.response?.data?.message || 'Failed to update technician', 'error');
      }
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [technicians]);

  const deleteTechnician = useCallback(async (id) => {
    setIsDeleting(true);
    try {
      const tech = technicians.find((t) => t.id === id);
      const apiId = tech?._id || id;
      await deleteTechnicianApi(apiId);
      setTechnicians((prev) => prev.filter((t) => t.id !== id));
      if (typeof window?.showToast === 'function') {
        window.showToast('Technician deleted successfully', 'success');
      }
    } catch (error) {
      console.log('deleteTechnician', 'Failed', error);
      console.log('deleteTechnician', 'Error response:', error?.response?.data);
      console.log('deleteTechnician', 'Error message:', error?.message);
      if (typeof window?.showToast === 'function') {
        window.showToast(error?.response?.data?.message || 'Failed to delete technician', 'error');
      }
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, [technicians]);

  const stats = useMemo(() => {
    const total = technicians.length;
    const onDuty = technicians.filter((t) => t.status === 'active').length;
    const avgRating =
      total > 0
        ? (
            technicians.reduce((sum, t) => sum + (t.rating || 0), 0) / total
          ).toFixed(1)
        : '0.0';
    return { total, onDuty, avgRating };
  }, [technicians]);

  return {
    technicians,
    stats,
    addTechnician,
    updateTechnician,
    deleteTechnician,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
  };
}
