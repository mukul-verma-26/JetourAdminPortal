import styles from './ConfirmDeletePackageModal.module.scss';

function ConfirmDeletePackageModal({ open, onClose, onConfirm, pkg }) {
  if (!open || !pkg) return null;

  const handleConfirm = () => {
    onConfirm(pkg.id);
    onClose();
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-pkg-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.body}>
          <h2 id="confirm-delete-pkg-title" className={styles.message}>
            Are you sure you want to delete <strong>{pkg.name}</strong>?
          </h2>
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="button" className={styles.deleteBtn} onClick={handleConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeletePackageModal;
