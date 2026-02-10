import { FiX, FiStar } from 'react-icons/fi';
import { GENDER_OPTIONS, STATUS_OPTIONS } from './constants';
import styles from './ViewDriverModal.module.scss';

function getGenderLabel(value) {
  return GENDER_OPTIONS.find((o) => o.value === value)?.label || value;
}

function getStatusLabel(value) {
  return STATUS_OPTIONS.find((o) => o.value === value)?.label || value;
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const STATUS_CLASS_MAP = {
  active: 'statusActive',
  inactive: 'statusInactive',
};

function ViewDriverModal({ open, onClose, driver }) {
  if (!open || !driver) return null;

  const statusClass = styles[STATUS_CLASS_MAP[driver.status]] || styles.statusInactive;

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
            Driver Details
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
            {driver.photo ? (
              <img
                src={driver.photo}
                alt={driver.name}
                className={styles.photoImage}
              />
            ) : (
              <div className={styles.photoPlaceholder}>
                {getInitials(driver.name)}
              </div>
            )}
          </div>
          <div className={styles.attributesGrid}>
            <div className={styles.attrItem}>
              <span className={styles.label}>Driver ID</span>
              <p className={styles.value}>{driver.id}</p>
            </div>
            <div className={styles.attrItem}>
              <span className={styles.label}>Name</span>
              <p className={styles.value}>{driver.name}</p>
            </div>
            <div className={styles.attrItem}>
              <span className={styles.label}>Contact</span>
              <p className={styles.value}>{driver.contact}</p>
            </div>
            <div className={styles.attrItem}>
              <span className={styles.label}>Civil ID</span>
              <p className={styles.value}>{driver.civilId || '-'}</p>
            </div>
            <div className={styles.attrItem}>
              <span className={styles.label}>Nationality</span>
              <p className={styles.value}>{driver.nationality || '-'}</p>
            </div>
            <div className={styles.attrItem}>
              <span className={styles.label}>Gender</span>
              <p className={styles.value}>{getGenderLabel(driver.gender)}</p>
            </div>
            <div className={styles.attrItem}>
              <span className={styles.label}>Rating</span>
              <p className={styles.value}>
                <span className={styles.ratingValue}>
                  {Math.round(driver.rating)}
                  <FiStar className={styles.starIcon} size={14} />
                </span>
              </p>
            </div>
            <div className={styles.attrItem}>
              <span className={styles.label}>Status</span>
              <p className={styles.value}>
                <span className={`${styles.statusBadge} ${statusClass}`}>
                  {getStatusLabel(driver.status)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewDriverModal;
