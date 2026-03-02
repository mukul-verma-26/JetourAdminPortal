import { useState, useEffect } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';
import { CATEGORY_OPTIONS } from './constants';
import styles from './CreateEditVehicleModal.module.scss';

function CreateEditVehicleModal({ open, onClose, initialData, onSubmit }) {
  const [formData, setFormData] = useState({
    image: '',
    category: 'suv',
    modelName: '',
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  const isEdit = Boolean(initialData?.id);

  useEffect(() => {
    if (initialData) {
      setFormData({
        image: initialData.image || '',
        category: initialData.category || 'suv',
        modelName: initialData.modelName || '',
      });
      setImagePreview(initialData.image || '');
    } else {
      setFormData({ image: '', category: 'suv', modelName: '' });
      setImagePreview('');
    }
    setErrors({});
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
    if (errors.image) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.image;
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const hasImage =
      formData.image instanceof File ||
      (typeof formData.image === 'string' && formData.image.trim());
    if (!hasImage) {
      newErrors.image = 'Vehicle image is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.modelName.trim()) {
      newErrors.modelName = 'Model name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      image:
        formData.image instanceof File
          ? formData.image
          : formData.image.trim(),
      category: formData.category,
      modelName: formData.modelName.trim(),
    };

    if (isEdit) {
      onSubmit(initialData.id, payload);
    } else {
      onSubmit(payload);
    }
    onClose();
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
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>
              Vehicle Image <span className={styles.required}>*</span>
            </label>
            <div className={styles.imageUploadArea}>
              {imagePreview ? (
                <div className={styles.previewWrapper}>
                  <img
                    src={imagePreview}
                    alt="Vehicle preview"
                    className={styles.previewImage}
                  />
                  <button
                    type="button"
                    className={styles.removeImageBtn}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, image: '' }));
                      setImagePreview('');
                    }}
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <label className={styles.uploadPlaceholder} htmlFor="vehicleFileInput">
                  <FiUpload size={24} />
                  <span>Click to upload</span>
                </label>
              )}
              <input
                id="vehicleFileInput"
                type="file"
                accept="image/*"
                className={styles.fileInput}
                onChange={handleFileChange}
              />
            </div>
            <p className={styles.imageHint}>Image should not exceed 2MB</p>
            {errors.image && <div className={styles.errorMessage}>{errors.image}</div>}
          </div>

          <div className={styles.field}>
            <label htmlFor="category" className={styles.label}>
              Vehicle Category <span className={styles.required}>*</span>
            </label>
            <select
              id="category"
              name="category"
              className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
              value={formData.category}
              onChange={handleChange}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.category && <div className={styles.errorMessage}>{errors.category}</div>}
          </div>

          <div className={styles.field}>
            <label htmlFor="modelName" className={styles.label}>
              Model Name <span className={styles.required}>*</span>
            </label>
            <input
              id="modelName"
              name="modelName"
              type="text"
              className={`${styles.input} ${errors.modelName ? styles.inputError : ''}`}
              placeholder="e.g. JETOUR X70 Plus"
              value={formData.modelName}
              onChange={handleChange}
            />
            {errors.modelName && <div className={styles.errorMessage}>{errors.modelName}</div>}
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              {isEdit ? 'Update' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEditVehicleModal;
