import { FiX } from 'react-icons/fi';
import { STATUS_OPTIONS, GENDER_OPTIONS } from './constants';
import styles from './ViewBookingModal.module.scss';

function getStatusLabel(value) {
  return STATUS_OPTIONS.find((o) => o.value === value)?.label || value;
}

function getGenderLabel(value) {
  return GENDER_OPTIONS.find((o) => o.value === value)?.label || value;
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const STATUS_CLASS_MAP = {
  pending: 'statusPending',
  confirmed: 'statusConfirmed',
  in_progress: 'statusIn_progress',
  completed: 'statusCompleted',
  cancelled: 'statusCancelled',
};

function ViewBookingModal({ open, onClose, booking }) {
  if (!open || !booking) return null;

  const statusClass = styles[STATUS_CLASS_MAP[booking.status]] || styles.statusPending;

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
            Booking Details
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
            <span className={styles.label}>Customer Name</span>
            <p className={styles.value}>{booking.name}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Email</span>
            <p className={styles.value}>{booking.email}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Gender</span>
            <p className={styles.value}>{getGenderLabel(booking.gender)}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Vehicle Model</span>
            <p className={styles.value}>{booking.vehicle_model}</p>
          </div>
          {booking.address ? (
            <div className={styles.row}>
              <span className={styles.label}>Address</span>
              <p className={styles.value}>{booking.address}</p>
            </div>
          ) : null}
          <div className={styles.row}>
            <span className={styles.label}>Service Package</span>
            <p className={styles.value}>
              {capitalizeFirst(booking.service_package?.name)} - {booking.service_package?.amount} KWD
            </p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Booking Date</span>
            <p className={styles.value}>{booking.booking_date}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Booking Time</span>
            <p className={styles.value}>{booking.booking_time}</p>
          </div>
          {booking.booking_slot ? (
            <div className={styles.row}>
              <span className={styles.label}>Booking Slot</span>
              <p className={styles.value}>{booking.booking_slot}</p>
            </div>
          ) : null}
          <div className={styles.row}>
            <span className={styles.label}>Status</span>
            <p className={styles.value}>
              <span className={`${styles.statusBadge} ${statusClass}`}>
                {getStatusLabel(booking.status)}
              </span>
            </p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Amount (KWD)</span>
            <p className={styles.value}>{booking.amount}</p>
          </div>
          {booking.technician_detail ? (
            <div className={styles.row}>
              <span className={styles.label}>Technician</span>
              <p className={styles.value}>
                {booking.technician_detail.name} ({booking.technician_detail.id})
              </p>
            </div>
          ) : null}
          {booking.driver_detail ? (
            <div className={styles.row}>
              <span className={styles.label}>Driver</span>
              <p className={styles.value}>
                {booking.driver_detail.name} ({booking.driver_detail.id})
              </p>
            </div>
          ) : null}
          {booking.service_van ? (
            <div className={styles.row}>
              <span className={styles.label}>Service Van</span>
              <p className={styles.value}>
                {booking.service_van.name} ({booking.service_van.id})
              </p>
            </div>
          ) : null}
          {booking.additional_notes ? (
            <div className={styles.row}>
              <span className={styles.label}>Additional Notes</span>
              <p className={styles.value}>{booking.additional_notes}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ViewBookingModal;
