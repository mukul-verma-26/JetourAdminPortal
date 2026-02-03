import styles from './ConfirmDeleteServiceVanModal.module.scss';

function ConfirmDeleteServiceVanModal({ open, onClose, onConfirm, van }) {
  if (!open || !van) return null;

  const handleConfirm = () => {
    onConfirm(van.id);
    onClose();
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
            Are you sure you want to delete service van{' '}
            <strong>{van.vehicleModel}</strong> ({van.id})?
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
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteServiceVanModal;
