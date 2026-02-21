import styles from './ConfirmDeleteDriverModal.module.scss';

function ConfirmDeleteDriverModal({ open, onClose, onConfirm, driver, isDeleting = false }) {
  if (!open || !driver) return null;

  const handleConfirm = async () => {
    await onConfirm(driver.id);
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.body}>
          <h2 id="confirm-delete-title" className={styles.message}>
            Are you sure you want to delete driver{' '}
            <strong>{driver.name}</strong> ({driver.id})?
          </h2>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={handleConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteDriverModal;
