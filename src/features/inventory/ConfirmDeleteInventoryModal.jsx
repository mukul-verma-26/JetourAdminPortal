import styles from './ConfirmDeleteInventoryModal.module.scss';

function ConfirmDeleteInventoryModal({
  open,
  onClose,
  onConfirm,
  item,
  isDeleting = false,
}) {
  if (!open || !item) return null;

  const handleConfirm = () => {
    onConfirm(item.id);
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-inventory-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.body}>
          <h2 id="confirm-delete-inventory-title" className={styles.message}>
            Are you sure you want to delete {item.name} ({item.itemId})?
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

export default ConfirmDeleteInventoryModal;
