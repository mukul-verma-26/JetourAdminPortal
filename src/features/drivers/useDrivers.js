import { useState, useCallback, useMemo } from 'react';
import { INITIAL_DRIVERS } from './constants';

export function useDrivers() {
  const [drivers, setDrivers] = useState(INITIAL_DRIVERS);

  const addDriver = useCallback((driver) => {
    const newId = `D-${String(Date.now()).slice(-3).padStart(3, '0')}`;
    const newDriver = {
      ...driver,
      id: newId,
      jobsCompleted: driver.jobsCompleted || 0,
    };
    setDrivers((prev) => [...prev, newDriver]);
  }, []);

  const updateDriver = useCallback((id, updatedDriver) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updatedDriver, id } : d))
    );
  }, []);

  const deleteDriver = useCallback((id) => {
    setDrivers((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const stats = useMemo(() => {
    const total = drivers.length;
    const onDuty = drivers.filter((d) => d.status === 'active').length;
    const onJob = drivers.filter(
      (d) => d.status === 'active' && d.jobsCompleted > 100
    ).length;
    return { total, onDuty, onJob };
  }, [drivers]);

  return { drivers, stats, addDriver, updateDriver, deleteDriver };
}
