import { FiX } from 'react-icons/fi';
import {
  TRANSMISSION_OPTIONS,
  FUEL_TYPE_OPTIONS,
  SALES_LABEL_OPTIONS,
} from './constants';
import styles from './ViewSalesDataModal.module.scss';

function getTransmissionLabel(value) {
  return TRANSMISSION_OPTIONS.find((o) => o.value === value)?.label || value || '—';
}

function getFuelTypeLabel(value) {
  return FUEL_TYPE_OPTIONS.find((o) => o.value === value)?.label || value || '—';
}

function getSalesLabelLabel(value) {
  return SALES_LABEL_OPTIONS.find((o) => o.value === value)?.label || value || '—';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { dateStyle: 'medium' });
}

function ViewSalesDataModal({ open, onClose, salesData }) {
  if (!open || !salesData) return null;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-sales-data-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="view-sales-data-title" className={styles.title}>
            Sales Data Details
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.row}>
            <span className={styles.label}>Sales Data ID</span>
            <p className={styles.value}>{salesData.salesDataId}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Customer Name</span>
            <p className={styles.value}>{salesData.customerName || '—'}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Customer Contact</span>
            <p className={styles.value}>{salesData.customerContactNumber || '—'}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Vehicle</span>
            <p className={styles.value}>{salesData.vehicleName || '—'}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Color</span>
            <p className={styles.value}>{salesData.color || '—'}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>VIN</span>
            <p className={styles.value}>{salesData.vin || '—'}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Sold Date</span>
            <p className={styles.value}>{formatDate(salesData.soldDate)}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Model Year</span>
            <p className={styles.value}>{salesData.modelYear || '—'}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Variant Name</span>
            <p className={styles.value}>{salesData.variantName || '—'}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Last Service Date</span>
            <p className={styles.value}>{formatDate(salesData.lastServiceDate)}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Last Recorded Mileage</span>
            <p className={styles.value}>{salesData.lastRecordedMileage || '—'}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Transmission</span>
            <p className={styles.value}>{getTransmissionLabel(salesData.transmission)}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Fuel Type</span>
            <p className={styles.value}>{getFuelTypeLabel(salesData.fuelType)}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Sales Label</span>
            <p className={styles.value}>{getSalesLabelLabel(salesData.salesLabel)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewSalesDataModal;
