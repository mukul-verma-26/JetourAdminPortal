import { Link } from 'react-router-dom';
import styles from './ActiveAlerts.module.scss';

function ActiveAlerts() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>Active Alerts</h3>
        <Link to="/reports" className={styles.viewAll}>
          View All
        </Link>
      </div>
      <p className={styles.placeholder}>No active alerts.</p>
    </section>
  );
}

export default ActiveAlerts;
