import styles from './ExtraDetailsSection.module.scss';

function ExtraDetailsSection({
  bufferTimeMinutes,
  serviceFee,
  onBufferTimeChange,
  onServiceFeeChange,
  onUpdate,
}) {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>Extra details</h3>
      <div className={styles.row}>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label htmlFor="buffer-time" className={styles.label}>
              Buffer Time (Minutes)
            </label>
            <input
              id="buffer-time"
              type="number"
              min="0"
              inputMode="numeric"
              className={styles.inputStandalone}
              placeholder="e.g. 15"
              value={bufferTimeMinutes}
              onChange={(e) => onBufferTimeChange(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="service-fee" className={styles.label}>
              Service fee
            </label>
            <div className={styles.inputWithPrefix}>
              <span className={styles.prefix}>KWD</span>
              <input
                id="service-fee"
                type="number"
                min="0"
                inputMode="numeric"
                className={styles.input}
                placeholder="e.g. 7"
                value={serviceFee}
                onChange={(e) => onServiceFeeChange(e.target.value)}
              />
            </div>
          </div>
        </div>
        <button type="button" className={styles.updateBtn} onClick={onUpdate}>
          Update
        </button>
      </div>
    </section>
  );
}

export default ExtraDetailsSection;
