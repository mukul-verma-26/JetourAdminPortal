import { formatTime12h } from '../helpers';
import styles from './SchedulePreview.module.scss';

function SchedulePreview({ scheduleRanges, isClosed }) {
  if (isClosed) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.closed}>
          <p className={styles.closedText}>Closed today</p>
        </div>
      </div>
    );
  }

  if (!scheduleRanges || scheduleRanges.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.empty}>
          <p className={styles.emptyText}>No slots available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <ul className={styles.rangeList}>
        {scheduleRanges.map((range, idx) => (
          <li key={idx} className={styles.rangeItem}>
            <span className={styles.timeRange}>
              {formatTime12h(range.startTime)} - {formatTime12h(range.endTime)}
            </span>
            <span className={styles.bookingCount}>
              {range.bookedCount}/{range.maxBookings} bookings
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SchedulePreview;
