import { Link } from 'react-router-dom';
import styles from './RecentBookings.module.scss';

function RecentBookings() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Bookings</h3>
        <Link to="/bookings" className={styles.viewAll}>
          View All
        </Link>
      </div>
      <p className={styles.placeholder}>No recent bookings to display.</p>
    </section>
  );
}

export default RecentBookings;
