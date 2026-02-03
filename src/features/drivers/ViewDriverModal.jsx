import { FiX } from 'react-icons/fi';
import { STATUS_OPTIONS } from './constants';
import styles from './ViewDriverModal.module.scss';

function getStatusLabel(value) {
  return STATUS_OPTIONS.find((o) => o.value === value)?.label || value;
}

const STATUS_CLASS_MAP = {
  active: 'statusActive',
  off_duty: 'statusOffDuty',
  on_leave: 'statusOnLeave',
};

function ViewDriverModal({ open, onClose, driver }) {
  if (!open || !driver) return null;

  const statusClass = styles[STATUS_CLASS_MAP[driver.status]] || styles.statusOffDuty;

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
          <div className={styles.row}>
            <span className={styles.label}>Driver ID</span>
            <p className={styles.value}>{driver.id}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Name</span>
            <p className={styles.value}>{driver.name}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Contact</span>
            <p className={styles.value}>{driver.contact}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Jobs Completed</span>
            <p className={styles.value}>{driver.jobsCompleted}</p>
          </div>
          <div className={styles.row}>
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
  );
}

export default ViewDriverModal;
