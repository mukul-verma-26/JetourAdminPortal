import { useState, useCallback } from 'react';
import { createEmptyPricingRow } from './constants';
import { usePackagesContext } from './PackagesContext';

export function useSettings() {
  const { packages, setPackages } = usePackagesContext();
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [packageToEdit, setPackageToEdit] = useState(null);
  const [managePackageModalOpen, setManagePackageModalOpen] = useState(false);
  const [packageToManage, setPackageToManage] = useState(null);
  const [deleteConfirmPackage, setDeleteConfirmPackage] = useState(null);

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
    const pkg = packages.find((p) => p.id === id);
    setPackageToManage(pkg ? { ...pkg } : null);
    setManagePackageModalOpen(true);
  }, [packages]);

  const handleClosePackageModal = useCallback(() => {
    setPackageModalOpen(false);
    setPackageToEdit(null);
  }, []);

  const handleCloseManagePackageModal = useCallback(() => {
    setManagePackageModalOpen(false);
    setPackageToManage(null);
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
      const payload = { ...idOrPayload };
      if (!payload.pricingMatrix) {
        payload.pricingMatrix = [createEmptyPricingRow()];
      }
      setPackages((prev) => [
        ...prev,
        { id: newId, description: 'Customize features and pricing', ...payload },
      ]);
    }
    setPackageModalOpen(false);
    setPackageToEdit(null);
  }, []);

  const handleManagePackageSubmit = useCallback((id, payload) => {
    setPackages((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...payload } : p
      )
    );
    setManagePackageModalOpen(false);
    setPackageToManage(null);
  }, []);

  const handleDeletePackage = useCallback((id) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirmPackage(null);
    setManagePackageModalOpen(false);
    setPackageToManage(null);
  }, []);

  const handleOpenDeleteConfirm = useCallback((pkg) => {
    setDeleteConfirmPackage(pkg);
  }, []);

  const handleCloseDeleteConfirm = useCallback(() => {
    setDeleteConfirmPackage(null);
  }, []);

  return {
    packages,
    packageModalOpen,
    packageToEdit,
    managePackageModalOpen,
    packageToManage,
    deleteConfirmPackage,
    handleOpenAddPackage,
    handleConfigurePackage,
    handleManagePackage,
    handleClosePackageModal,
    handleCloseManagePackageModal,
    handlePackageSubmit,
    handleManagePackageSubmit,
    handleDeletePackage,
    handleOpenDeleteConfirm,
    handleCloseDeleteConfirm,
  };
}
