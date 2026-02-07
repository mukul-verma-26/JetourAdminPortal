import styles from './ConfirmDeleteVehicleModal.module.scss';

function ConfirmDeleteVehicleModal({ open, onClose, onConfirm, vehicle }) {
  if (!open || !vehicle) return null;

  const handleConfirm = () => {
    onConfirm(vehicle.id);
    onClose();
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
            <strong>{vehicle.modelName}</strong> ({vehicle.modelYear})?
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

export default ConfirmDeleteVehicleModal;
