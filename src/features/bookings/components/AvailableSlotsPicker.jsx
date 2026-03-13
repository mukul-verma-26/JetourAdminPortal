import styles from './AvailableSlotsPicker.module.scss';

function AvailableSlotsPicker({
  slots,
  selectedTime,
  isLoading,
  error,
  onSelect,
  isEnabled,
}) {
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
      ) : slots.length === 0 ? (
        <p className={styles.helper}>No slots available for selected date and package.</p>
      ) : (
        <div className={styles.grid}>
          {slots.map((slot) => (
            <button
              key={slot.time}
              type="button"
              className={`${styles.slotBtn} ${selectedTime === slot.time ? styles.slotBtnActive : ''}`}
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
