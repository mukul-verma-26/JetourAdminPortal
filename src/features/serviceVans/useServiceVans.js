import { useState, useCallback, useMemo } from 'react';
import { INITIAL_SERVICE_VANS } from './constants';

export function useServiceVans() {
  const [serviceVans, setServiceVans] = useState(INITIAL_SERVICE_VANS);

  const addServiceVan = useCallback((van) => {
    const newId = `KWT-${String(Date.now()).slice(-3).padStart(3, '0')}`;
    const newVan = {
      ...van,
      id: newId,
      mileage: van.mileage || 0,
    };
    setServiceVans((prev) => [...prev, newVan]);
  }, []);

  const updateServiceVan = useCallback((id, updatedVan) => {
    setServiceVans((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updatedVan, id } : v))
    );
  }, []);

  const deleteServiceVan = useCallback((id) => {
    setServiceVans((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const stats = useMemo(() => {
    const total = serviceVans.length;
    const active = serviceVans.filter((v) => v.status === 'active').length;
    const inMaintenance = serviceVans.filter((v) => v.status === 'maintenance').length;
    return { total, active, inMaintenance };
  }, [serviceVans]);

  return { serviceVans, stats, addServiceVan, updateServiceVan, deleteServiceVan };
}
