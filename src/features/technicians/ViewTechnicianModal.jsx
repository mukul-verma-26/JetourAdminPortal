import { FiX, FiStar } from 'react-icons/fi';
import { EXPERTISE_OPTIONS, STATUS_OPTIONS } from './constants';
import styles from './ViewTechnicianModal.module.scss';

function getExpertiseLabel(value) {
  return EXPERTISE_OPTIONS.find((o) => o.value === value)?.label || value;
}

function getStatusLabel(value) {
  return STATUS_OPTIONS.find((o) => o.value === value)?.label || value;
}

const STATUS_CLASS_MAP = {
  active: 'statusActive',
  off_duty: 'statusOffDuty',
  on_leave: 'statusOnLeave',
};

function ViewTechnicianModal({ open, onClose, technician }) {
  if (!open || !technician) return null;

  const statusClass = styles[STATUS_CLASS_MAP[technician.status]] || styles.statusOffDuty;

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
            Technician Details
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
            <span className={styles.label}>Technician ID</span>
            <p className={styles.value}>{technician.id}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Name</span>
            <p className={styles.value}>{technician.name}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Contact</span>
            <p className={styles.value}>{technician.contact}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Expertise</span>
            <p className={styles.value}>{getExpertiseLabel(technician.expertise)}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Jobs Completed</span>
            <p className={styles.value}>{technician.jobsCompleted}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Rating</span>
            <p className={styles.value}>
              <span className={styles.ratingValue}>
                {technician.rating}
                <FiStar className={styles.starIcon} size={14} />
              </span>
            </p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Status</span>
            <p className={styles.value}>
              <span className={`${styles.statusBadge} ${statusClass}`}>
                {getStatusLabel(technician.status)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewTechnicianModal;
