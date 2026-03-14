import { FiSearch } from 'react-icons/fi';
import { REQUEST_STATUS_OPTIONS } from '../constants';
import styles from '../ApproveInventoryPartsScreen.module.scss';

function RequestFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}) {
  return (
    <div className={styles.filters}>
      <div className={styles.searchWrap}>
        <FiSearch className={styles.searchIcon} size={18} aria-hidden />
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search by part, request ID, or technician..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Search parts approvals"
        />
      </div>
      <select
        className={styles.statusSelect}
        value={statusFilter}
        onChange={(event) => onStatusChange(event.target.value)}
        aria-label="Filter by request status"
      >
        {REQUEST_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default RequestFilters;
