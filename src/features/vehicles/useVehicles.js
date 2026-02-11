import { useState, useCallback, useMemo } from 'react';
import { INITIAL_VEHICLES } from './constants';

export function useVehicles() {
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);

  const addVehicle = useCallback((vehicle) => {
    const newId = `VH-${String(Date.now()).slice(-3).padStart(3, '0')}`;
    const newVehicle = {
      ...vehicle,
      id: newId,
    };
    setVehicles((prev) => [...prev, newVehicle]);
  }, []);

  const updateVehicle = useCallback((id, updatedVehicle) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updatedVehicle, id } : v))
    );
  }, []);

  const deleteVehicle = useCallback((id) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  }, []);

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

  return { vehicles, stats, vehicleOptions, addVehicle, updateVehicle, deleteVehicle };
}
