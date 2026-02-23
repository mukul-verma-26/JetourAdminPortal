import { FiX, FiTruck } from 'react-icons/fi';
import { STATUS_OPTIONS } from './constants';
import styles from './ViewServiceVanModal.module.scss';

function getStatusLabel(value) {
  return STATUS_OPTIONS.find((o) => o.value === value)?.label || value;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatMileage(mileage) {
  return mileage.toLocaleString() + ' km';
}

const STATUS_CLASS_MAP = {
  active: 'statusActive',
  maintenance: 'statusMaintenance',
  inactive: 'statusInactive',
};

function ViewServiceVanModal({ open, onClose, van }) {
  if (!open || !van) return null;

  const statusClass = styles[STATUS_CLASS_MAP[van.status]] || styles.statusInactive;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-modal-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="view-modal-title" className={styles.title}>
            Vehicle Details
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
          <div className={styles.photoSection}>
            {van.photo ? (
              <img
                src={van.photo}
                alt={van.vehicleModel}
                className={styles.photoImage}
              />
            ) : (
              <div className={styles.photoPlaceholder}>
                <FiTruck size={48} />
              </div>
            )}
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Vehicle ID</span>
            <p className={styles.value}>{van.id}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Registration Number</span>
            <p className={styles.value}>{van.registrationNumber || van.registration_number || '—'}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Vehicle Model</span>
            <p className={styles.value}>{van.vehicleModel}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Mileage</span>
            <p className={styles.value}>{formatMileage(van.mileage)}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Last Service</span>
            <p className={styles.value}>{formatDate(van.lastService)}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Status</span>
            <p className={styles.value}>
              <span className={`${styles.statusBadge} ${statusClass}`}>
                {getStatusLabel(van.status)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewServiceVanModal;
