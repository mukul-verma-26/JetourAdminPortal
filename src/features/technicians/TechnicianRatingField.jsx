import styles from './CreateEditTechnicianModal.module.scss';

function TechnicianRatingField({ register, errors, validationRules }) {
  return (
    <div className={styles.fieldRow}>
      <div className={styles.field}>
        <label htmlFor="rating" className={styles.label}>
          Rating <span className={styles.required}>*</span>
        </label>
        <input
          id="rating"
          type="number"
          min="0"
          max="5"
          step="1"
          inputMode="numeric"
          className={`${styles.input} ${errors.rating ? styles.inputError : ''}`}
          placeholder="0"
          {...register('rating', {
            ...validationRules.rating,
            onChange: (e) => {
              const v = e.target.value.replace(/\D/g, '');
              const num = v === '' ? '' : Math.min(5, Math.max(0, parseInt(v, 10) || 0));
              e.target.value = num;
            },
          })}
        />
        {errors.rating && (
          <div className={styles.errorMessage}>{errors.rating.message}</div>
        )}
      </div>
    </div>
  );
}

export default TechnicianRatingField;
