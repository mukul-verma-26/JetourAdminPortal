import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import ManagePackageTable from './components/ManagePackageTable';
import { VEHICLE_MODELS } from './constants';
import { useManagePackageDetails } from './useManagePackageDetails';
import { buildPricingPayload } from './helpers/managePackageHelpers';
import styles from './ManagePackageModal.module.scss';

function createEmptyRowForVehicles(vehicleColumns) {
  const prices = {};
  const cols = Array.isArray(vehicleColumns) ? vehicleColumns : [];
  cols.forEach((col) => {
    const id = col?.id ?? col;
    if (id) prices[id] = '';
  });
  return { mileage: '', prices };
}

function ManagePackageModal({ open, onClose, package: pkg, onSubmit }) {
  const [rows, setRows] = useState([]);
  const [vehicleColumns, setVehicleColumns] = useState([]);
  const packageId = pkg?.package_id || pkg?._id || pkg?.id;
  const { packageDetails, isLoading } = useManagePackageDetails(packageId, open && !!pkg);

  useEffect(() => {
    if (open && packageDetails) {
      const cols = packageDetails.vehicleColumns || [];
      setVehicleColumns(cols);
      setRows(
        packageDetails.tableRows?.length
          ? packageDetails.tableRows
          : [createEmptyRowForVehicles(cols)]
      );
    } else if (open && pkg && !isLoading && !packageDetails) {
      const fallbackColumns = VEHICLE_MODELS.map((v) => ({ id: v.id, name: v.name }));
      setVehicleColumns(fallbackColumns);
      const pricing = pkg.pricing || pkg.pricingMatrix || [];
      const fallbackRows =
        pricing.length > 0
          ? pricing.map((r) => {
              const prices = {};
              fallbackColumns.forEach((c) => {
                const v = (r.vehicles || []).find(
                  (x) => (x.vehicle_Id || x.vehicle_id || x._id) === c.id
                );
                prices[c.id] = v?.price ?? r.prices?.[c.id] ?? '';
              });
              return { mileage: r.mileage ?? '', prices };
            })
          : [createEmptyRowForVehicles(fallbackColumns)];
      setRows(fallbackRows);
    }
  }, [open, packageDetails, isLoading, pkg]);

  const handleAddRow = (newRow) => {
    const effectiveCols =
      vehicleColumns.length > 0
        ? vehicleColumns
        : VEHICLE_MODELS.map((v) => ({ id: v.id, name: v.name }));
    setRows((prev) => [...prev, newRow || createEmptyRowForVehicles(effectiveCols)]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const effectiveColumns =
      vehicleColumns.length > 0
        ? vehicleColumns
        : VEHICLE_MODELS.map((v) => ({ id: v.id, name: v.name }));
    const payload = buildPricingPayload(rows, effectiveColumns);
    try {
      await onSubmit(packageId || pkg?.id, payload);
    } catch {
      // Error handled in parent; keep modal open
    }
  };

  if (!open || !pkg) return null;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="manage-package-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="manage-package-title" className={styles.title}>
            Manage Package — {pkg.name}
          </h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <FiX size={20} />
          </button>
        </div>
        <form className={styles.body} onSubmit={handleSubmit}>
          {isLoading ? (
            <p className={styles.loading}>Loading package details...</p>
          ) : (
            <ManagePackageTable
              rows={rows}
              onRowsChange={setRows}
              onAddRow={handleAddRow}
              vehicleColumns={vehicleColumns}
            />
          )}
          <div className={styles.actions}>
            <div className={styles.rightActions}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn}>
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManagePackageModal;
