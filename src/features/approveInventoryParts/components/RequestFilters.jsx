import { REQUEST_STATUS_OPTIONS } from '../constants';
import styles from '../ApproveInventoryPartsScreen.module.scss';

function RequestFilters({
  technicianId,
  onTechnicianIdChange,
  statusValue,
  onStatusChange,
  onSearch,
  onClear,
  showClear,
}) {
  return (
    <form
      className={styles.filters}
      onSubmit={(event) => {
        event.preventDefault();
        onSearch();
      }}
    >
      <input
        type="text"
        className={styles.techIdInput}
        placeholder="Technician ID"
        value={technicianId}
        onChange={(event) => onTechnicianIdChange(event.target.value)}
        aria-label="Technician ID filter"
        autoComplete="off"
      />
      <select
        className={styles.statusSelect}
        value={statusValue}
        onChange={(event) => onStatusChange(event.target.value)}
        aria-label="Filter by request status"
      >
        {REQUEST_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button type="submit" className={styles.filterSearchBtn}>
        Search
      </button>
      {showClear ? (
        <button
          type="button"
          className={styles.filterClearBtn}
          onClick={onClear}
        >
          Clear filters
        </button>
      ) : null}
    </form>
  );
}

export default RequestFilters;
