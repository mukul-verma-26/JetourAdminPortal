import styles from './ConfirmDeleteSalesDataModal.module.scss';

function ConfirmDeleteSalesDataModal({
  open,
  onClose,
  onConfirm,
  salesData,
}) {
  if (!open || !salesData) return null;

  const handleConfirm = () => {
    onConfirm(salesData.id);
    onClose();
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-sales-data-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.body}>
          <h2 id="confirm-delete-sales-data-title" className={styles.message}>
            Are you sure you want to delete sales data {salesData.salesDataId} (
            {salesData.vin || '—'})?
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

export default ConfirmDeleteSalesDataModal;
