import { FiX } from 'react-icons/fi';
import {
  CUSTOMER_STATUS_OPTIONS,
  GENDER_OPTIONS,
  PREFERRED_LANGUAGE_OPTIONS,
} from './constants';
import styles from './ViewCustomerModal.module.scss';

function getStatusLabel(value) {
  return (
    CUSTOMER_STATUS_OPTIONS.find((o) => o.value === value)?.label || value
  );
}

function getGenderLabel(value) {
  return GENDER_OPTIONS.find((o) => o.value === value)?.label || value;
}

function getLanguageLabel(value) {
  return (
    PREFERRED_LANGUAGE_OPTIONS.find((o) => o.value === value)?.label || value
  );
}

function formatJoined(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  });
}

function formatDob(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { dateStyle: 'medium' });
}

const STATUS_CLASS_MAP = {
  active: styles.statusActive,
  inactive: styles.statusInactive,
};

function ViewCustomerModal({ open, onClose, customer }) {
  if (!open || !customer) return null;

  const statusClass =
    STATUS_CLASS_MAP[customer.status] || styles.statusActive;
  const joiningDate = customer.joiningDate || customer.joined;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-customer-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="view-customer-title" className={styles.title}>
            Customer Details
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
            <span className={styles.label}>Customer ID</span>
            <p className={styles.value}>{customer.customerId}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Name</span>
            <p className={styles.value}>{customer.name}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Gender</span>
            <p className={styles.value}>{getGenderLabel(customer.gender)}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>DOB</span>
            <p className={styles.value}>{formatDob(customer.dob)}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Address</span>
            <p className={styles.value}>{customer.address || '—'}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Nationality</span>
            <p className={styles.value}>{customer.nationality || '—'}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Phone</span>
            <p className={styles.value}>{customer.phone}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Civil ID number</span>
            <p className={styles.value}>{customer.civilId || '—'}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Passport number</span>
            <p className={styles.value}>{customer.passportNumber || '—'}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Joining date</span>
            <p className={styles.value}>{formatJoined(joiningDate)}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Preferred language</span>
            <p className={styles.value}>
              {getLanguageLabel(customer.preferredLanguage)}
            </p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Status</span>
            <p className={styles.value}>
              <span className={`${styles.statusBadge} ${statusClass}`}>
                {getStatusLabel(customer.status)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewCustomerModal;
