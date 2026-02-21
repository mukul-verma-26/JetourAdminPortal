import styles from './ConfirmDeleteVehicleModal.module.scss';

function ConfirmDeleteVehicleModal({ open, onClose, onConfirm, vehicle, isDeleting = false }) {
  if (!open || !vehicle) return null;

  const handleConfirm = async () => {
    await onConfirm(vehicle.id);
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-vehicle-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.body}>
          <h2 id="confirm-delete-vehicle-title" className={styles.message}>
            Are you sure you want to delete{' '}
            <strong>{vehicle.modelName}</strong>?
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

export default ConfirmDeleteVehicleModal;
