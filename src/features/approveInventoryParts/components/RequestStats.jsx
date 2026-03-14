import styles from '../ApproveInventoryPartsScreen.module.scss';

function RequestStats({ stats }) {
  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <span className={styles.statValue}>{stats.total}</span>
        <span className={styles.statLabel}>Total Parts</span>
      </div>
      <div className={styles.statCard}>
        <span className={`${styles.statValue} ${styles.pendingText}`}>
          {stats.pending}
        </span>
        <span className={styles.statLabel}>Pending</span>
      </div>
      <div className={styles.statCard}>
        <span className={`${styles.statValue} ${styles.approvedText}`}>
          {stats.approved}
        </span>
        <span className={styles.statLabel}>Approved</span>
      </div>
      <div className={styles.statCard}>
        <span className={`${styles.statValue} ${styles.rejectedText}`}>
          {stats.rejected}
        </span>
        <span className={styles.statLabel}>Rejected</span>
      </div>
    </div>
  );
}

export default RequestStats;
