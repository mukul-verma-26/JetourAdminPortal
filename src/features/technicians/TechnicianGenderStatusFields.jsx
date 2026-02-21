import { GENDER_OPTIONS, STATUS_OPTIONS } from './constants';
import styles from './CreateEditTechnicianModal.module.scss';

function TechnicianGenderStatusFields({ register, errors, validationRules }) {
  return (
    <div className={styles.fieldRow}>
      <div className={styles.field}>
        <label htmlFor="gender" className={styles.label}>
          Gender <span className={styles.required}>*</span>
        </label>
        <select
          id="gender"
          className={`${styles.select} ${errors.gender ? styles.inputError : ''}`}
          {...register('gender', validationRules.gender)}
        >
          {GENDER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.gender && (
          <div className={styles.errorMessage}>{errors.gender.message}</div>
        )}
      </div>
      <div className={styles.field}>
        <label htmlFor="status" className={styles.label}>
          Status <span className={styles.required}>*</span>
        </label>
        <select
          id="status"
          className={`${styles.select} ${errors.status ? styles.inputError : ''}`}
          {...register('status', validationRules.status)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.status && (
          <div className={styles.errorMessage}>{errors.status.message}</div>
        )}
      </div>
    </div>
  );
}

export default TechnicianGenderStatusFields;
