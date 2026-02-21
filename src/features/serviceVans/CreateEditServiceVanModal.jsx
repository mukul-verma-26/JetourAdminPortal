import { useRef } from 'react';
import { FiX } from 'react-icons/fi';
import { useServiceVanForm } from './useServiceVanForm';
import ServiceVanPhotoSection from './ServiceVanPhotoSection';
import { STATUS_OPTIONS } from './constants';
import styles from './CreateEditServiceVanModal.module.scss';

function CreateEditServiceVanModal({
  open,
  onClose,
  initialData,
  onSubmit,
  isSubmitting = false,
}) {
  const fileInputRef = useRef(null);
  const {
    register,
    handleSubmit,
    errors,
    image,
    imagePreview,
    setImageFromFile,
    buildPayload,
    validationRules,
    isEdit,
    setError,
  } = useServiceVanForm(initialData, open);

  const onFormSubmit = (data) => {
    const hasImage = image instanceof File || (image && String(image).trim());
    if (!hasImage) {
      setError('image', { type: 'manual', message: 'Image is required' });
      return;
    }
    const payload = buildPayload({ ...data, image });
    if (isEdit) {
      onSubmit(initialData.id, payload);
    } else {
      onSubmit(payload);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setImageFromFile(file);
    e.target.value = '';
  };

  if (!open) return null;

  const title = isEdit ? 'Edit Vehicle' : 'Add Vehicle';

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>
        <form className={styles.form} onSubmit={handleSubmit(onFormSubmit)}>
          <ServiceVanPhotoSection
            image={imagePreview}
            onImageClick={() => fileInputRef.current?.click()}
            onFileChange={handleFileChange}
            fileInputRef={fileInputRef}
            error={errors.image?.message}
          />
          <h3 className={styles.sectionTitle}>Vehicle Details</h3>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="vehicle_model" className={styles.label}>
                Vehicle Model <span className={styles.required}>*</span>
              </label>
              <input
                id="vehicle_model"
                type="text"
                className={`${styles.input} ${errors.vehicle_model ? styles.inputError : ''}`}
                placeholder="e.g. Toyota Hiace 2024"
                {...register('vehicle_model', validationRules.vehicle_model)}
              />
              {errors.vehicle_model && (
                <div className={styles.errorMessage}>{errors.vehicle_model.message}</div>
              )}
            </div>
            <div className={styles.field}>
              <label htmlFor="mileage" className={styles.label}>
                Mileage (km) <span className={styles.required}>*</span>
              </label>
              <input
                id="mileage"
                type="number"
                min="0"
                inputMode="numeric"
                className={`${styles.input} ${errors.mileage ? styles.inputError : ''}`}
                placeholder="0"
                {...register('mileage', validationRules.mileage)}
              />
              {errors.mileage && (
                <div className={styles.errorMessage}>{errors.mileage.message}</div>
              )}
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="last_service_date" className={styles.label}>
                Last Service Date
              </label>
              <input
                id="last_service_date"
                type="date"
                className={styles.input}
                {...register('last_service_date')}
              />
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
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? (isEdit ? 'Updating...' : 'Adding...') : isEdit ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEditServiceVanModal;
