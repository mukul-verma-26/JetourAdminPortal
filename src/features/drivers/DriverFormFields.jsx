import { GENDER_OPTIONS, STATUS_OPTIONS } from './constants';
import DriverPhotoSection from './DriverPhotoSection';
import styles from './CreateEditDriverModal.module.scss';

function DriverFormFields({
  register,
  errors,
  validationRules,
  image,
  onImageClick,
  onFileChange,
  fileInputRef,
}) {
  return (
    <>
      <DriverPhotoSection
        image={image}
        onImageClick={onImageClick}
        onFileChange={onFileChange}
        fileInputRef={fileInputRef}
        error={errors.image?.message}
      />
      <h3 className={styles.sectionTitle}>Driver Details</h3>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Name <span className={styles.required}>*</span>
          </label>
          <input
            id="name"
            type="text"
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
            placeholder="e.g. Ali Al-Mansoor"
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
    </>
  );
}

export default DriverFormFields;
