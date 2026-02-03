import { useState, useCallback, useMemo } from 'react';
import { INITIAL_TECHNICIANS } from './constants';

export function useTechnicians() {
  const [technicians, setTechnicians] = useState(INITIAL_TECHNICIANS);

  const addTechnician = useCallback((technician) => {
    const newId = `T-${String(Date.now()).slice(-3).padStart(3, '0')}`;
    const newTechnician = {
      ...technician,
      id: newId,
      jobsCompleted: technician.jobsCompleted || 0,
      rating: technician.rating || 0,
    };
    setTechnicians((prev) => [...prev, newTechnician]);
  }, []);

  const updateTechnician = useCallback((id, updatedTechnician) => {
    setTechnicians((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedTechnician, id } : t))
    );
  }, []);

  const deleteTechnician = useCallback((id) => {
    setTechnicians((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const stats = useMemo(() => {
    const total = technicians.length;
    const onDuty = technicians.filter((t) => t.status === 'active').length;
    const onJob = technicians.filter(
      (t) => t.status === 'active' && t.jobsCompleted > 100
    ).length;
    const avgRating =
      total > 0
        ? (
            technicians.reduce((sum, t) => sum + t.rating, 0) / total
          ).toFixed(1)
        : '0.0';
    return { total, onDuty, onJob, avgRating };
  }, [technicians]);

  return { technicians, stats, addTechnician, updateTechnician, deleteTechnician };
}
