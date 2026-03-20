import { useApproveInventoryParts } from './useApproveInventoryParts';
import RequestFilters from './components/RequestFilters';
import RequestPagination from './components/RequestPagination';
import RequestsTable from './components/RequestsTable';
import styles from './ApproveInventoryPartsScreen.module.scss';

function ApproveInventoryPartsScreen() {
  const {
    requests,
    isLoading,
    fetchError,
    draftTechnicianId,
    setDraftTechnicianId,
    draftStatus,
    setDraftStatus,
    applyFilters,
    clearFilters,
    filtersActive,
    pagination,
    goToPage,
    approveRequest,
    rejectRequest,
    deleteRequest,
  } = useApproveInventoryParts();

  const handlePrevPage = () => {
    if (pagination.page <= 1 || isLoading) return;
    goToPage(pagination.page - 1);
  };

  const handleNextPage = () => {
    if (pagination.page >= pagination.totalPages || isLoading) return;
    goToPage(pagination.page + 1);
  };

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h2 className={styles.title}>Approve Inventory Parts</h2>
        <p className={styles.subtitle}>
          Review and action each requested part from technicians independently.
        </p>
      </div>

      <div className={styles.card}>
        {fetchError ? (
          <p className={styles.inlineMessage}>{fetchError}</p>
        ) : isLoading ? (
          <p className={styles.inlineMessage}>Loading requests…</p>
        ) : (
          <>
            <RequestFilters
              technicianId={draftTechnicianId}
              onTechnicianIdChange={setDraftTechnicianId}
              statusValue={draftStatus}
              onStatusChange={setDraftStatus}
              onSearch={applyFilters}
              onClear={clearFilters}
              showClear={filtersActive}
            />
            <RequestsTable
              requests={requests}
              onApprove={approveRequest}
              onReject={rejectRequest}
              onDelete={deleteRequest}
            />
            <RequestPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalRecords={pagination.total}
              isLoading={isLoading}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default ApproveInventoryPartsScreen;
