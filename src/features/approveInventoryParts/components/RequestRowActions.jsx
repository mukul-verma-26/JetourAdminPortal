import styles from '../ApproveInventoryPartsScreen.module.scss';

function RequestRowActions({ request, onApprove, onReject, onDelete }) {
  const isPending = request.status === 'pending';

  return (
    <div className={styles.actions}>
      <button
        type="button"
        className={styles.approveBtn}
        onClick={() => onApprove(request)}
        disabled={!isPending}
        aria-label={`Approve ${request.partName}`}
      >
        Approve
      </button>
      <button
        type="button"
        className={styles.rejectBtn}
        onClick={() => onReject(request)}
        disabled={!isPending}
        aria-label={`Reject ${request.partName}`}
      >
        Reject
      </button>
      <button
        type="button"
        className={styles.deleteBtn}
        onClick={() => onDelete(request)}
        aria-label={`Delete ${request.partName}`}
      >
        Delete
      </button>
    </div>
  );
}

export default RequestRowActions;
