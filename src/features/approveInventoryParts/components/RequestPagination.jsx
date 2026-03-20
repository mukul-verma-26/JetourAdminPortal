import styles from '../ApproveInventoryPartsScreen.module.scss';

function RequestPagination({
  currentPage,
  totalPages,
  totalRecords,
  isLoading,
  onPrevPage,
  onNextPage,
}) {
  return (
    <div className={styles.paginationRow}>
      <p className={styles.paginationInfo}>
        Page {currentPage} of {totalPages} ({totalRecords} total records)
      </p>
      <div className={styles.paginationActions}>
        <button
          type="button"
          className={styles.pageBtn}
          onClick={onPrevPage}
          disabled={isLoading || currentPage <= 1}
        >
          Previous
        </button>
        <button
          type="button"
          className={styles.pageBtn}
          onClick={onNextPage}
          disabled={isLoading || currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default RequestPagination;
