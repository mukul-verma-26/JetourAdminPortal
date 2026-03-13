import { useState } from 'react';
import DatePicker from './components/DatePicker';
import styles from './ExportCustomerSalesDataModal.module.scss';

function ExportCustomerSalesDataModal({ open, onClose, onSubmit, isExporting }) {
  const [from_date, setFromDate] = useState('');
  const [to_date, setToDate] = useState('');

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({ from_date, to_date });
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-sales-data-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 id="export-sales-data-title" className={styles.title}>
          Export report
        </h2>
        <p className={styles.subtitle}>Select date range to export sales data.</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="sales_export_from_date" className={styles.label}>
              From Date
            </label>
            <DatePicker
              id="sales_export_from_date"
              name="from_date"
              value={from_date}
              onChange={(e) => setFromDate(e.target.value)}
              placeholder="Select from date"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="sales_export_to_date" className={styles.label}>
              To Date
            </label>
            <DatePicker
              id="sales_export_to_date"
              name="to_date"
              value={to_date}
              onChange={(e) => setToDate(e.target.value)}
              placeholder="Select to date"
            />
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isExporting}>
              Cancel
            </button>
            <button type="submit" className={styles.exportBtn} disabled={isExporting}>
              {isExporting ? 'Downloading...' : 'Export'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExportCustomerSalesDataModal;
