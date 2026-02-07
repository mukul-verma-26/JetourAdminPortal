import { FiX, FiCheckCircle } from 'react-icons/fi';
import { BOOKING_AMOUNT } from './constants';
import styles from './ConfirmAmountModal.module.scss';

function ConfirmAmountModal({ open, onClose, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-amount-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onCancel}
          aria-label="Close"
        >
          <FiX size={18} />
        </button>

        <div className={styles.body}>
          <div className={styles.iconWrapper}>
            <FiCheckCircle size={40} />
          </div>

          <h2 id="confirm-amount-title" className={styles.title}>
            Booking Created
          </h2>
          <p className={styles.subtitle}>
            Your booking has been saved. Please review the amount below and confirm to proceed.
          </p>

          <div className={styles.amountCard}>
            <span className={styles.amountLabel}>Total Amount</span>
            <span className={styles.amountValue}>{BOOKING_AMOUNT} KWD</span>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.confirmBtn}
              onClick={onConfirm}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmAmountModal;
