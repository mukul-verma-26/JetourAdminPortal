import styles from './ConfirmDeleteCustomerModal.module.scss';

function ConfirmDeleteCustomerModal({
  open,
  onClose,
  onConfirm,
  customer,
  isDeleting = false,
}) {
  if (!open || !customer) return null;

  const handleConfirm = async () => {
    await onConfirm(customer.id);
    onClose();
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-customer-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.body}>
          <h2 id="confirm-delete-customer-title" className={styles.message}>
            Are you sure you want to delete customer {customer.name} (
            {customer.customerId})?
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

export default ConfirmDeleteCustomerModal;
