import { FiX } from 'react-icons/fi';
import { formatDateDisplay } from '../helpers';
import styles from './HolidayChips.module.scss';

function HolidayChips({ holidays, onRemove }) {
  const sorted = [...holidays].sort((a, b) => {
    const da = typeof a === 'string' ? a : a.date;
    const db = typeof b === 'string' ? b : b.date;
    return da.localeCompare(db);
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.chips}>
        {sorted.length === 0 ? (
          <span className={styles.empty}>No holidays selected</span>
        ) : sorted.map((item) => {
          const id = typeof item === 'string' ? item : item.id;
          const dateStr = typeof item === 'string' ? item : item.date;
          return (
            <span key={id || dateStr} className={styles.chip}>
              <span className={styles.chipLabel}>{formatDateDisplay(dateStr)}</span>
              <button
                type="button"
                className={styles.chipRemove}
                onClick={() => onRemove(id || dateStr)}
                aria-label={`Remove ${dateStr}`}
              >
                <FiX size={14} />
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default HolidayChips;
