import styles from './CreateEditTechnicianModal.module.scss';

function TechnicianNameContactFields({ register, errors, validationRules }) {
  return (
    <div className={styles.fieldRow}>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Name <span className={styles.required}>*</span>
        </label>
        <input
          id="name"
          type="text"
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          placeholder="e.g. Mohammed Al-Ahmad"
          {...register('name', validationRules.name)}
        />
        {errors.name && (
          <div className={styles.errorMessage}>{errors.name.message}</div>
        )}
      </div>
      <div className={styles.field}>
        <label htmlFor="contact" className={styles.label}>
          Contact <span className={styles.required}>*</span>
        </label>
        <div className={styles.phoneInputWrapper}>
          <span className={styles.phonePrefixInline} aria-hidden="true">+</span>
          <input
            id="contact"
            type="tel"
            inputMode="numeric"
            className={`${styles.input} ${styles.phoneInput} ${errors.contact ? styles.inputError : ''}`}
            placeholder="965 12345678"
            maxLength={15}
            {...register('contact', {
              ...validationRules.contact,
              onChange: (e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 15);
                e.target.value = v;
              },
            })}
          />
        </div>
        {errors.contact && (
          <div className={styles.errorMessage}>{errors.contact.message}</div>
        )}
      </div>
    </div>
  );
}

export default TechnicianNameContactFields;
