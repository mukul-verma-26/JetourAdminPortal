import { useRef } from 'react';
import { FiX } from 'react-icons/fi';
import { useTechnicianForm } from './useTechnicianForm';
import TechnicianFormFields from './TechnicianFormFields';
import styles from './CreateEditTechnicianModal.module.scss';

function CreateEditTechnicianModal({
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
  } = useTechnicianForm(initialData, open);

  const onFormSubmit = (data) => {
    if (!isEdit) {
      const hasImage = image instanceof File || (image && String(image).trim());
      if (!hasImage) {
        setError('image', { type: 'manual', message: 'Image is required' });
        return;
      }
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

  const title = isEdit ? 'Edit Technician' : 'Add Technician';

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
          <TechnicianFormFields
            register={register}
            errors={errors}
            validationRules={validationRules}
            image={imagePreview}
            onImageClick={() => fileInputRef.current?.click()}
            onFileChange={handleFileChange}
            fileInputRef={fileInputRef}
            isEdit={isEdit}
          />
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

export default CreateEditTechnicianModal;
