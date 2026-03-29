import { bookingTimesEqual, normalizeBookingTime } from '../helpers/bookingTime';
import styles from './AvailableSlotsPicker.module.scss';

function AvailableSlotsPicker({
  slots,
  selectedTime,
  scheduledStartTime,
  isLoading,
  error,
  onSelect,
  isEnabled,
  readOnly = false,
}) {
  const normalizedScheduled = scheduledStartTime
    ? normalizeBookingTime(scheduledStartTime)
    : '';

  const matchingScheduledSlot = normalizedScheduled
    ? slots.find((s) => bookingTimesEqual(s.time, normalizedScheduled))
    : null;

  const slotsOtherThanScheduled = normalizedScheduled
    ? slots.filter((s) => !bookingTimesEqual(s.time, normalizedScheduled))
    : slots;

  if (readOnly) {
    const displayTime = selectedTime
      ? normalizeBookingTime(selectedTime)
      : '';
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <label className={styles.label}>Booking time</label>
        </div>
        {displayTime ? (
          <div className={styles.grid}>
            <div
              className={`${styles.slotBtn} ${styles.slotBtnReadOnly} ${styles.slotBtnActive}`}
            >
              <span>{displayTime}</span>
              <small>Scheduled</small>
            </div>
          </div>
        ) : (
          <p className={styles.readOnlyValue}>—</p>
        )}
      </div>
    );
  }

  const showScheduledBox = Boolean(normalizedScheduled);
  const hasSlotBoxes = showScheduledBox || slotsOtherThanScheduled.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>Available Slots</label>
      </div>

      {!isEnabled ? (
        <p className={styles.helper}>Select service package and booking date to view available slots.</p>
      ) : isLoading ? (
        <p className={styles.helper}>Loading available slots...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : !hasSlotBoxes ? (
        <p className={styles.helper}>No slots available for selected date and package.</p>
      ) : (
        <div className={styles.grid}>
          {showScheduledBox ? (
            <button
              key={`scheduled-${normalizedScheduled}`}
              type="button"
              className={`${styles.slotBtn} ${bookingTimesEqual(selectedTime, normalizedScheduled) ? styles.slotBtnActive : ''}`}
              onClick={() =>
                onSelect(matchingScheduledSlot?.time ?? normalizedScheduled)
              }
            >
              <span>{matchingScheduledSlot?.time ?? normalizedScheduled}</span>
              <small>
                {matchingScheduledSlot
                  ? `${matchingScheduledSlot.available_vans} van(s)`
                  : 'Current booking'}
              </small>
            </button>
          ) : null}
          {slotsOtherThanScheduled.map((slot) => (
            <button
              key={slot.time}
              type="button"
              className={`${styles.slotBtn} ${bookingTimesEqual(selectedTime, slot.time) ? styles.slotBtnActive : ''}`}
              onClick={() => onSelect(slot.time)}
            >
              <span>{slot.time}</span>
              <small>{slot.available_vans} van(s)</small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AvailableSlotsPicker;
