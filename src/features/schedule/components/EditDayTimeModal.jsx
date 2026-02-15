import { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import TimePicker from '../../bookings/components/TimePicker';
import { DAYS_OF_WEEK } from '../constants';
import styles from './EditDayTimeModal.module.scss';

const MAX_RANGES = 4;

function EditDayTimeModal({ open, onClose, dayKey, timeRanges, onSubmit }) {
  const [ranges, setRanges] = useState([]);

  const dayLabel = DAYS_OF_WEEK.find((d) => d.key === dayKey)?.label || dayKey;

  useEffect(() => {
    if (open && timeRanges?.length) {
      setRanges(
        timeRanges.map((r) => ({
          id: r.id,
          startTime: r.startTime,
          endTime: r.endTime,
        }))
      );
    } else if (open) {
      setRanges([{ id: crypto.randomUUID(), startTime: '09:00', endTime: '20:00' }]);
    }
  }, [open, timeRanges]);

  const handleAdd = () => {
    if (ranges.length >= MAX_RANGES) return;
    setRanges((prev) => [
      ...prev,
      { id: crypto.randomUUID(), startTime: '14:00', endTime: '18:00' },
    ]);
  };

  const handleRemove = (id) => {
    if (ranges.length <= 1) return;
    setRanges((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdate = (id, field, value) => {
    setRanges((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleSubmit = () => {
    onSubmit(ranges);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-day-time-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="edit-day-time-title" className={styles.title}>
            Edit {dayLabel} Hours
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className={styles.body}>
          {ranges.map((range) => (
            <div key={range.id} className={styles.rangeRow}>
              <div className={styles.timeInputs}>
                <div className={styles.timeField}>
                  <label className={styles.label}>Start</label>
                  <TimePicker
                    value={range.startTime}
                    onChange={(e) =>
                      handleUpdate(range.id, 'startTime', e.target.value)
                    }
                  />
                </div>
                <span className={styles.toLabel}>to</span>
                <div className={styles.timeField}>
                  <label className={styles.label}>End</label>
                  <TimePicker
                    value={range.endTime}
                    onChange={(e) =>
                      handleUpdate(range.id, 'endTime', e.target.value)
                    }
                  />
                </div>
              </div>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => handleRemove(range.id)}
                disabled={ranges.length <= 1}
                aria-label="Remove time range"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
          {ranges.length < MAX_RANGES && (
            <button
              type="button"
              className={styles.addBtn}
              onClick={handleAdd}
            >
              <FiPlus size={18} />
              Add time slot
            </button>
          )}
        </div>
        <div className={styles.footer}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.saveBtn} onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditDayTimeModal;
