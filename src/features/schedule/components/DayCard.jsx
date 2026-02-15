import { FiCheck } from 'react-icons/fi';
import styles from './DayCard.module.scss';

function DayCard({ day, label, enabled, onToggle }) {
  return (
    <div
      className={`${styles.card} ${enabled ? styles.cardEnabled : styles.cardDisabled}`}
      role="group"
      aria-label={`${label} operating day`}
    >
      <div className={styles.header}>
        <span className={styles.dayName}>{label}</span>
        <button
          type="button"
          className={styles.checkbox}
          onClick={() => onToggle(day)}
          aria-pressed={enabled}
          aria-label={`${enabled ? 'Disable' : 'Enable'} ${label}`}
        >
          {enabled && <FiCheck size={14} className={styles.checkIcon} />}
        </button>
      </div>
    </div>
  );
}

export default DayCard;
