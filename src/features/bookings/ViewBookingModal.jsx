import { FiX, FiMapPin } from 'react-icons/fi';
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

function formatTime12h(time24) {
  if (!time24) return '—';
  const [h, m] = time24.split(':');
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12}:${m} ${period}`;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return dateStr;
  return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
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
          {/* Customer Details */}
          <h3 className={styles.sectionTitle}>Customer Details</h3>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <span className={styles.label}>Customer Name</span>
              <p className={styles.value}>{booking.name}</p>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Email</span>
              <p className={styles.value}>{booking.email}</p>
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <span className={styles.label}>Gender</span>
              <p className={styles.value}>{getGenderLabel(booking.gender)}</p>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Phone Number</span>
              <p className={styles.value}>
                {booking.phone ? `+965 ${booking.phone}` : '—'}
              </p>
            </div>
          </div>

          {/* Address */}
          <h3 className={styles.sectionTitle}>Address</h3>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <span className={styles.label}>Governorate</span>
              <p className={styles.value}>{booking.governorate || '—'}</p>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Area</span>
              <p className={styles.value}>{booking.area || '—'}</p>
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <span className={styles.label}>Block</span>
              <p className={styles.value}>{booking.block || '—'}</p>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Street</span>
              <p className={styles.value}>{booking.street || '—'}</p>
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <span className={styles.label}>Building No.</span>
              <p className={styles.value}>{booking.building_no || '—'}</p>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Floor No.</span>
              <p className={styles.value}>{booking.floor_no || '—'}</p>
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <span className={styles.label}>Flat No.</span>
              <p className={styles.value}>{booking.flat_no || '—'}</p>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>PACI Details</span>
              <p className={styles.value}>{booking.paci_details || '—'}</p>
            </div>
          </div>

          {booking.google_location ? (
            <div className={styles.field}>
              <span className={styles.label}>Customer Google Location</span>
              <p className={`${styles.value} ${styles.locationValue}`}>
                <FiMapPin size={14} className={styles.locationIcon} />
                {booking.google_location}
              </p>
            </div>
          ) : null}

          {/* Booking Details */}
          <h3 className={styles.sectionTitle}>Booking Details</h3>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <span className={styles.label}>Vehicle Model</span>
              <p className={styles.value}>{booking.vehicle_model}</p>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Vehicle Registration</span>
              <p className={styles.value}>{booking.vehicle_registration || '—'}</p>
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <span className={styles.label}>Vehicle Year</span>
              <p className={styles.value}>{booking.vehicle_year || '—'}</p>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Mileage</span>
              <p className={styles.value}>{booking.mileage || '—'}</p>
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <span className={styles.label}>Service Package</span>
              <p className={styles.value}>
                {booking.service_package?.name} — {booking.service_package?.amount === '0' ? 'Free' : `${booking.service_package?.amount} KD`}
              </p>
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <span className={styles.label}>Booking Date</span>
              <p className={styles.value}>{formatDate(booking.booking_date)}</p>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Booking Time</span>
              <p className={styles.value}>{formatTime12h(booking.booking_time)}</p>
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <span className={styles.label}>Status</span>
              <p className={styles.value}>
                <span className={`${styles.statusBadge} ${statusClass}`}>
                  {getStatusLabel(booking.status)}
                </span>
              </p>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Amount (KWD)</span>
              <p className={styles.value}>{booking.amount}</p>
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <span className={styles.label}>Driver</span>
              <p className={styles.value}>
                {booking.driver_detail
                  ? `${booking.driver_detail.name} (${booking.driver_detail.id})`
                  : '—'}
              </p>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Technician</span>
              <p className={styles.value}>
                {booking.technician_detail
                  ? `${booking.technician_detail.name} (${booking.technician_detail.id})`
                  : '—'}
              </p>
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <span className={styles.label}>Service Van</span>
              <p className={styles.value}>
                {booking.service_van
                  ? `${booking.service_van.name} (${booking.service_van.id})`
                  : '—'}
              </p>
            </div>
            <div className={styles.field} />
          </div>

          {/* Additional Notes */}
          {booking.additional_notes ? (
            <>
              <h3 className={styles.sectionTitle}>Additional Notes</h3>
              <div className={styles.field}>
                <p className={styles.notesValue}>{booking.additional_notes}</p>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ViewBookingModal;
