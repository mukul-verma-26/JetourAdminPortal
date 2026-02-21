import styles from './CreateEditTechnicianModal.module.scss';

function TechnicianCivilIdNationalityFields({ register, errors, validationRules }) {
  return (
    <div className={styles.fieldRow}>
      <div className={styles.field}>
        <label htmlFor="civil_id" className={styles.label}>
          Civil ID <span className={styles.required}>*</span>
        </label>
        <input
          id="civil_id"
          type="text"
          className={`${styles.input} ${errors.civil_id ? styles.inputError : ''}`}
          placeholder="Enter Civil ID"
          {...register('civil_id', validationRules.civil_id)}
        />
        {errors.civil_id && (
          <div className={styles.errorMessage}>{errors.civil_id.message}</div>
        )}
      </div>
      <div className={styles.field}>
        <label htmlFor="nationality" className={styles.label}>
          Nationality
        </label>
        <input
          id="nationality"
          type="text"
          className={styles.input}
          placeholder="e.g. Kuwaiti"
          {...register('nationality')}
        />
      </div>
    </div>
  );
}

export default TechnicianCivilIdNationalityFields;
