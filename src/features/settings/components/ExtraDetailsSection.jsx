import styles from './ExtraDetailsSection.module.scss';

function ExtraDetailsSection({
  bufferTimeMinutes,
  convenienceFee,
  onBufferTimeChange,
  onConvenienceFeeChange,
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
            <label htmlFor="convenience-fee" className={styles.label}>
              Convenience fee
            </label>
            <div className={styles.inputWithPrefix}>
              <span className={styles.prefix}>KWD</span>
              <input
                id="convenience-fee"
                type="number"
                min="0"
                inputMode="numeric"
                className={styles.input}
                placeholder="e.g. 50"
                value={convenienceFee}
                onChange={(e) => onConvenienceFeeChange(e.target.value)}
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
