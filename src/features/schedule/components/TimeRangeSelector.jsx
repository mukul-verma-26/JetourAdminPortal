import { FiPlus, FiTrash2 } from 'react-icons/fi';
import TimePicker from '../../bookings/components/TimePicker';
import styles from './TimeRangeSelector.module.scss';

function TimeRangeSelector({
  timeRanges,
  onAdd,
  onRemove,
  onUpdate,
  canAdd,
  canRemove,
}) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.example}>
        Example: 9:00 AM - 12:00 PM, 2:00 PM - 6:00 PM
      </p>
      <div className={styles.ranges}>
        {timeRanges.map((range) => (
          <div key={range.id} className={styles.rangeRow}>
            <div className={styles.timeInputs}>
              <div className={styles.timeField}>
                <TimePicker
                  value={range.startTime}
                  onChange={(e) => onUpdate(range.id, 'startTime', e.target.value)}
                />
              </div>
              <span className={styles.toLabel}>to</span>
              <div className={styles.timeField}>
                <TimePicker
                  value={range.endTime}
                  onChange={(e) => onUpdate(range.id, 'endTime', e.target.value)}
                />
              </div>
            </div>
            {canRemove && (
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => onRemove(range.id)}
                aria-label="Remove time slot"
              >
                <FiTrash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
      {canAdd && (
        <button type="button" className={styles.addBtn} onClick={onAdd}>
          <FiPlus size={18} />
          Add time slot
        </button>
      )}
    </div>
  );
}

export default TimeRangeSelector;
