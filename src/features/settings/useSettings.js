import { useState, useCallback } from 'react';
import { INITIAL_SERVICE_PACKAGES } from './constants';

export function useSettings() {
  const [packages, setPackages] = useState(INITIAL_SERVICE_PACKAGES);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [packageToEdit, setPackageToEdit] = useState(null);

  const handleOpenAddPackage = useCallback(() => {
    setPackageToEdit(null);
    setPackageModalOpen(true);
  }, []);

  const handleConfigurePackage = useCallback((id) => {
    const pkg = packages.find((p) => p.id === id);
    setPackageToEdit(pkg ? { ...pkg } : null);
    setPackageModalOpen(true);
  }, [packages]);

  const handleManagePackage = useCallback((id) => {
    console.log('Manage package:', id);
  }, []);

  const handleClosePackageModal = useCallback(() => {
    setPackageModalOpen(false);
    setPackageToEdit(null);
  }, []);

  const handlePackageSubmit = useCallback((idOrPayload, maybePayload) => {
    const isEdit = typeof idOrPayload === 'string';
    if (isEdit) {
      setPackages((prev) =>
        prev.map((p) =>
          p.id === idOrPayload ? { ...p, ...maybePayload, description: p.description } : p
        )
      );
    } else {
      const newId = `pkg-${Date.now()}`;
      setPackages((prev) => [
        ...prev,
        { id: newId, description: 'Customize features and pricing', ...idOrPayload },
      ]);
    }
    setPackageModalOpen(false);
    setPackageToEdit(null);
  }, []);

  return {
    packages,
    packageModalOpen,
    packageToEdit,
    handleOpenAddPackage,
    handleConfigurePackage,
    handleManagePackage,
    handleClosePackageModal,
    handlePackageSubmit,
  };
}
