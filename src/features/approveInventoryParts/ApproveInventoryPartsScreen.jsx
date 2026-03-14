import { useApproveInventoryParts } from './useApproveInventoryParts';
import RequestFilters from './components/RequestFilters';
import RequestStats from './components/RequestStats';
import RequestsTable from './components/RequestsTable';
import styles from './ApproveInventoryPartsScreen.module.scss';

function ApproveInventoryPartsScreen() {
  const {
    requests,
    stats,
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
    approveRequest,
    rejectRequest,
  } = useApproveInventoryParts();

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h2 className={styles.title}>Approve Inventory Parts</h2>
        <p className={styles.subtitle}>
          Review and action each requested part from technicians independently.
        </p>
      </div>

      <RequestStats stats={stats} />

      <div className={styles.card}>
        <RequestFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
        <RequestsTable
          requests={requests}
          onApprove={approveRequest}
          onReject={rejectRequest}
        />
      </div>
    </div>
  );
}

export default ApproveInventoryPartsScreen;
