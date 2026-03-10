import styles from './CreateEditTechnicianModal.module.scss';

function TechnicianEmailField({ register, errors, validationRules }) {
  return (
    <div className={styles.fieldRow}>
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email <span className={styles.required}>*</span>
        </label>
        <input
          id="email"
          type="email"
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          placeholder="e.g. john@test.com"
          {...register('email', validationRules.email)}
        />
        {errors.email && (
          <div className={styles.errorMessage}>{errors.email.message}</div>
        )}
      </div>
    </div>
  );
}

export default TechnicianEmailField;
