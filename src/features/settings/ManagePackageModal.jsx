import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import ManagePackageTable from './components/ManagePackageTable';
import { createEmptyPricingRow, VEHICLE_MODELS } from './constants';
import { useManagePackageDetails } from './useManagePackageDetails';
import styles from './ManagePackageModal.module.scss';

function createEmptyRowForVehicles(vehicleColumns) {
  const prices = {};
  vehicleColumns.forEach((col) => {
    const id = typeof col === 'object' ? col.id : col;
    prices[id] = '';
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
      setRows(packageDetails.tableRows?.length ? packageDetails.tableRows : [createEmptyRowForVehicles(cols)]);
      setVehicleColumns(cols.length ? cols : VEHICLE_MODELS.map((v) => ({ id: v.name, name: v.name })));
    } else if (open && pkg && !isLoading && !packageDetails) {
      const fallbackColumns = VEHICLE_MODELS.map((v) => ({ id: v.name, name: v.name }));
      setVehicleColumns(fallbackColumns);
      setRows(pkg.pricingMatrix?.length ? pkg.pricingMatrix.map((r) => ({
        mileage: r.mileage ?? '',
        prices: Object.fromEntries(fallbackColumns.map((c) => [c.id, r.prices?.[c.name] ?? ''])),
      })) : [createEmptyRowForVehicles(fallbackColumns)]);
    }
  }, [open, packageDetails, isLoading, pkg]);

  const handleAddRow = (newRow) => {
    setRows((prev) => [...prev, newRow || createEmptyPricingRow()]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pricing = rows.map((row) => {
      const vehicles = [];
      vehicleColumns.forEach((col) => {
        const vid = typeof col === 'object' ? col.id : col;
        const priceVal = row.prices?.[vid];
        if (vid && (priceVal !== '' && priceVal !== undefined && priceVal !== null)) {
          vehicles.push({ vehicle_Id: vid, price: Number(priceVal) });
        }
      });
      return { mileage: Number(row.mileage) || 0, vehicles };
    });
    const payload = { pricing };
    try {
      await onSubmit(pkg?.id, payload);
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
