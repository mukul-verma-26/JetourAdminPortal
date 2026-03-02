import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import ManagePackageTable from './components/ManagePackageTable';
import { createEmptyPricingRow, VEHICLE_MODELS } from './constants';
import styles from './ManagePackageModal.module.scss';

function normalizePricingMatrix(pricingMatrix, vehicleNames) {
  if (!Array.isArray(pricingMatrix) || pricingMatrix.length === 0) {
    return [createEmptyPricingRow()];
  }
  return pricingMatrix.map((row) => {
    const prices = {};
    vehicleNames.forEach((name) => {
      prices[name] = row.prices?.[name] ?? '';
    });
    return { mileage: row.mileage ?? '', prices };
  });
}

function ManagePackageModal({ open, onClose, package: pkg, onSubmit }) {
  const [rows, setRows] = useState([]);
  const [workTimeMinutes, setWorkTimeMinutes] = useState('');

  useEffect(() => {
    if (open && pkg) {
      const vehicleNames = VEHICLE_MODELS.map((v) => v.name);
      setRows(normalizePricingMatrix(pkg.pricingMatrix, vehicleNames));
      const wt = pkg.work_time_minutes ?? pkg.workTimeMinutes ?? '';
      setWorkTimeMinutes(wt !== '' && wt != null ? String(wt) : '');
    }
  }, [open, pkg]);

  const handleAddRow = (newRow) => {
    setRows((prev) => [...prev, newRow]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const workTimeNum = parseInt(String(workTimeMinutes || '0'), 10);
    const payload = {
      pricingMatrix: rows,
      work_time_minutes: Number.isNaN(workTimeNum) ? 0 : Math.max(0, workTimeNum),
    };
    try {
      await onSubmit(pkg.id, payload);
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
          <div className={styles.field}>
            <label htmlFor="manage-work-time" className={styles.label}>
              Worktime
            </label>
            <input
              id="manage-work-time"
              type="number"
              min="1"
              inputMode="numeric"
              className={styles.input}
              placeholder="e.g. 60"
              value={workTimeMinutes}
              onChange={(e) => setWorkTimeMinutes(e.target.value)}
            />
          </div>
          <ManagePackageTable
            rows={rows}
            onRowsChange={setRows}
            onAddRow={handleAddRow}
          />
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
