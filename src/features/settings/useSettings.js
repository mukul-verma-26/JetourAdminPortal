import { useState, useCallback, useEffect } from 'react';
import { usePackagesContext } from './PackagesContext';
import {
  createPackage as createPackageApi,
  updatePackage as updatePackageApi,
  deletePackage as deletePackageApi,
} from '../../api/packages';
import { getAdminSettings, updateAdminSettings } from '../../api/settings';

function mapPackageFromApi(item) {
  if (!item) return null;
  const id = item._id || item.id;
  if (!id) return null;
  const details = Array.isArray(item.details) ? item.details : [];
  return {
    id,
    _id: item._id,
    name: item.name || '',
    description: item.description || 'Customize features and pricing',
    status: item.status || 'active',
    details,
    pricingMatrix: item.pricingMatrix || [],
    worktime: item.worktime ?? item.work_time_minutes ?? item.workTimeMinutes ?? '',
  };
}

export function useSettings() {
  const { packages, setPackages, fetchPackages, isLoading } = usePackagesContext();
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [packageToEdit, setPackageToEdit] = useState(null);
  const [managePackageModalOpen, setManagePackageModalOpen] = useState(false);
  const [packageToManage, setPackageToManage] = useState(null);
  const [deleteConfirmPackage, setDeleteConfirmPackage] = useState(null);
  const [bufferTimeMinutes, setBufferTimeMinutes] = useState('');
  const [serviceFee, setServiceFee] = useState('');
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);
  const [isExtraDetailsUpdating, setIsExtraDetailsUpdating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchSettings() {
      setIsSettingsLoading(true);
      try {
        const res = await getAdminSettings();
        const data = res?.data || res || {};
        if (!cancelled) {
          const buffer = data.buffer_between_bookings_minutes;
          const fee = data.service_fee;
          setBufferTimeMinutes(buffer !== undefined && buffer !== null ? String(buffer) : '');
          setServiceFee(fee !== undefined && fee !== null ? String(fee) : '');
        }
      } catch (error) {
        if (!cancelled) {
          console.log('useSettings', 'Failed to fetch admin settings', error);
          if (typeof window?.showToast === 'function') {
            window.showToast('Failed to load settings', 'error');
          }
        }
      } finally {
        if (!cancelled) {
          setIsSettingsLoading(false);
        }
      }
    }
    fetchSettings();
    return () => {
      cancelled = true;
    };
  }, []);

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

  const handlePackageSubmit = useCallback(
    async (idOrPayload, maybePayload) => {
      const isEdit = typeof idOrPayload === 'string';
      const payload = isEdit ? maybePayload : idOrPayload;
      const apiPayload = {
        name: payload.name,
        status: payload.status,
        details: Array.isArray(payload.details) ? payload.details : [],
        worktime: payload.worktime ?? 0,
      };

      try {
        if (isEdit) {
          const pkg = packages.find((p) => p.id === idOrPayload);
          const apiId = pkg?._id || pkg?.id || idOrPayload;
          const updated = await updatePackageApi(apiId, apiPayload);
          const updatedPkg = updated?.data || updated?.package || updated;
          const mapped = updatedPkg ? mapPackageFromApi(updatedPkg) : null;
          if (mapped) {
            setPackages((prev) => prev.map((p) => (p.id === idOrPayload ? mapped : p)));
          } else {
            setPackages((prev) =>
              prev.map((p) =>
                p.id === idOrPayload ? { ...p, ...apiPayload, worktime: apiPayload.worktime } : p
              )
            );
          }
          if (typeof window?.showToast === 'function') {
            window.showToast('Package updated successfully', 'success');
          }
        } else {
          const created = await createPackageApi(apiPayload);
          const newPkg = created?.data || created?.package || created;
          if (newPkg) {
            const mapped = mapPackageFromApi(newPkg);
            if (mapped) {
              setPackages((prev) => [...prev, mapped]);
            } else {
              await fetchPackages();
            }
          } else {
            await fetchPackages();
          }
          if (typeof window?.showToast === 'function') {
            window.showToast('Package created successfully', 'success');
          }
        }
      } catch (error) {
        console.log('handlePackageSubmit', 'API failed', error);
        if (typeof window?.showToast === 'function') {
          window.showToast(
            error?.response?.data?.message || (isEdit ? 'Failed to update package' : 'Failed to create package'),
            'error'
          );
        }
        throw error;
      }
      setPackageModalOpen(false);
      setPackageToEdit(null);
    },
    [packages, setPackages, fetchPackages]
  );

  const handleManagePackageSubmit = useCallback(
    async (id, payload) => {
      const pkg = packages.find((p) => p.id === id || p.package_id === id || p._id === id);
      const apiId = pkg?._id || pkg?.id || id;
      const apiPayload = payload?.pricing != null ? { pricing: payload.pricing } : payload;
      try {
        await updatePackageApi(apiId, apiPayload);
        setPackages((prev) =>
          prev.map((p) =>
            p.id === id || p.package_id === id || p._id === id
              ? { ...p, pricing: payload?.pricing ?? p.pricing }
              : p
          )
        );
        if (typeof window?.showToast === 'function') {
          window.showToast('Package updated successfully', 'success');
        }
      } catch (error) {
        console.log('handleManagePackageSubmit', 'API failed', error);
        if (typeof window?.showToast === 'function') {
          window.showToast(
            error?.response?.data?.message || 'Failed to update package',
            'error'
          );
        }
        throw error;
      }
      setManagePackageModalOpen(false);
      setPackageToManage(null);
    },
    [packages, setPackages]
  );

  const handleDeletePackage = useCallback(
    async (id) => {
      const pkg = packages.find((p) => p.id === id);
      const apiId = pkg?._id || pkg?.id || id;
      try {
        await deletePackageApi(apiId);
        setPackages((prev) => prev.filter((p) => p.id !== id));
        if (typeof window?.showToast === 'function') {
          window.showToast('Package deleted successfully', 'success');
        }
      } catch (error) {
        console.log('handleDeletePackage', 'API failed', error);
        if (typeof window?.showToast === 'function') {
          window.showToast(
            error?.response?.data?.message || 'Failed to delete package',
            'error'
          );
        }
        throw error;
      }
      setDeleteConfirmPackage(null);
      setManagePackageModalOpen(false);
      setPackageToManage(null);
    },
    [packages, setPackages]
  );

  const handleOpenDeleteConfirm = useCallback((pkg) => {
    setDeleteConfirmPackage(pkg);
  }, []);

  const handleCloseDeleteConfirm = useCallback(() => {
    setDeleteConfirmPackage(null);
  }, []);

  const handleBufferTimeChange = useCallback((value) => {
    setBufferTimeMinutes(value);
  }, []);

  const handleServiceFeeChange = useCallback((value) => {
    setServiceFee(value);
  }, []);

  const handleExtraDetailsUpdate = useCallback(async () => {
    const bufferNum = parseInt(String(bufferTimeMinutes || '0'), 10);
    const feeNum = parseFloat(String(serviceFee || '0'));
    const payload = {
      buffer_between_bookings_minutes: Number.isNaN(bufferNum) ? 0 : Math.max(0, bufferNum),
      service_fee: Number.isNaN(feeNum) ? 0 : Math.max(0, feeNum),
    };
    setIsExtraDetailsUpdating(true);
    try {
      await updateAdminSettings(payload);
      if (typeof window?.showToast === 'function') {
        window.showToast('Extra details updated', 'success');
      }
    } catch (error) {
      if (typeof window?.showToast === 'function') {
        window.showToast(
          error?.response?.data?.message || 'Failed to update settings',
          'error'
        );
      }
      throw error;
    } finally {
      setIsExtraDetailsUpdating(false);
    }
  }, [bufferTimeMinutes, serviceFee]);

  return {
    packages,
    isLoading,
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
    bufferTimeMinutes,
    serviceFee,
    handleBufferTimeChange,
    handleServiceFeeChange,
    isSettingsLoading,
    isExtraDetailsUpdating,
    handleExtraDetailsUpdate,
  };
}
