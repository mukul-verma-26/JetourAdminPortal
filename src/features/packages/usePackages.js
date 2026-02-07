import { useState, useCallback, useMemo } from 'react';
import { INITIAL_PACKAGES } from './constants';

export function usePackages() {
  const [packages, setPackages] = useState(INITIAL_PACKAGES);

  const addPackage = useCallback((pkg) => {
    const newId = `PKG-${String(Date.now()).slice(-3).padStart(3, '0')}`;
    setPackages((prev) => [...prev, { ...pkg, id: newId }]);
  }, []);

  const updatePackage = useCallback((id, updatedPkg) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedPkg, id } : p))
    );
  }, []);

  const deletePackage = useCallback((id) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const stats = useMemo(() => {
    const total = packages.length;
    const free = packages.filter((p) => p.priceT2 === 0 && p.priceT1 === 0).length;
    const paid = total - free;
    return { total, free, paid };
  }, [packages]);

  return { packages, stats, addPackage, updatePackage, deletePackage };
}
