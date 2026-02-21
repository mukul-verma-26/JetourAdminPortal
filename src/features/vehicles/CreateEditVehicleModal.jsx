import { useRef } from 'react';
import { FiX } from 'react-icons/fi';
import { useVehicleForm } from './useVehicleForm';
import VehiclePhotoSection from './VehiclePhotoSection';
import { CATEGORY_OPTIONS } from './constants';
import styles from './CreateEditVehicleModal.module.scss';

function CreateEditVehicleModal({
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
    vehicle_image,
    imagePreview,
    setImageFromFile,
    setValue,
    setError,
    buildPayload,
    validationRules,
    isEdit,
  } = useVehicleForm(initialData, open);

  const onFormSubmit = (data) => {
    const hasImage = vehicle_image instanceof File || (vehicle_image && String(vehicle_image).trim());
    if (!hasImage) {
      setError('vehicle_image', { type: 'manual', message: 'Vehicle image is required' });
      return;
    }
    const payload = buildPayload({ ...data, vehicle_image });
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

  const handleRemoveImage = () => {
    setValue('vehicle_image', null, { shouldValidate: true });
  };

  if (!open) return null;

  const title = isEdit ? 'Edit Vehicle' : 'Add Vehicle';

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="vehicle-modal-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="vehicle-modal-title" className={styles.title}>
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
          <VehiclePhotoSection
            image={imagePreview}
            onImageClick={() => fileInputRef.current?.click()}
            onFileChange={handleFileChange}
            fileInputRef={fileInputRef}
            onRemove={handleRemoveImage}
            error={errors.vehicle_image?.message}
          />
          <div className={styles.field}>
            <label htmlFor="vehicle_category" className={styles.label}>
              Vehicle Category <span className={styles.required}>*</span>
            </label>
            <select
              id="vehicle_category"
              className={`${styles.select} ${errors.vehicle_category ? styles.inputError : ''}`}
              {...register('vehicle_category', validationRules.vehicle_category)}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.vehicle_category && (
              <div className={styles.errorMessage}>{errors.vehicle_category.message}</div>
            )}
          </div>
          <div className={styles.field}>
            <label htmlFor="vehicle_model" className={styles.label}>
              Model Name <span className={styles.required}>*</span>
            </label>
            <input
              id="vehicle_model"
              type="text"
              className={`${styles.input} ${errors.vehicle_model ? styles.inputError : ''}`}
              placeholder="e.g. Toyota Hiace"
              {...register('vehicle_model', validationRules.vehicle_model)}
            />
            {errors.vehicle_model && (
              <div className={styles.errorMessage}>{errors.vehicle_model.message}</div>
            )}
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
              {isSubmitting ? (isEdit ? 'Updating...' : 'Adding...') : isEdit ? 'Update' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEditVehicleModal;
