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

function getImageUrl(van) {
  return van?.photo || van?.image || van?.vehicle_image || '';
}

function ViewServiceVanModal({ open, onClose, van }) {
  if (!open || !van) return null;

  const statusClass = styles[STATUS_CLASS_MAP[van.status]] || styles.statusInactive;
  const imageUrl = getImageUrl(van);
  const needsBase64 = imageUrl && !imageUrl.startsWith('data:') && !imageUrl.startsWith('http');
  const displayUrl = needsBase64 ? `data:image/png;base64,${imageUrl}` : imageUrl;

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
            <span className={styles.photoLabel}>Image</span>
            {displayUrl ? (
              <img
                src={displayUrl}
                alt={van.vehicleModel || 'Service van'}
                className={styles.photoImage}
              />
            ) : (
              <div className={styles.photoPlaceholder}>
                <FiTruck size={48} />
                <span className={styles.placeholderText}>No image</span>
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
