import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { STATUS_OPTIONS, PACKAGE_DETAIL_OPTIONS } from './constants';
import styles from './CreateEditPackageModal.module.scss';

function CreateEditPackageModal({ open, onClose, initialData, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    status: 'active',
    details: [],
  });
  const [errors, setErrors] = useState({});

  const isEdit = Boolean(initialData?.id);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        status: initialData.status || 'active',
        details: Array.isArray(initialData.details) ? [...initialData.details] : [],
      });
    } else {
      setFormData({ name: '', status: 'active', details: [] });
    }
    setErrors({});
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleDetailToggle = (id) => {
    setFormData((prev) => ({
      ...prev,
      details: prev.details.includes(id)
        ? prev.details.filter((d) => d !== id)
        : [...prev.details, id],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Package name is required';
    if (!formData.status) newErrors.status = 'Status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const payload = {
      name: formData.name.trim(),
      status: formData.status,
      details: formData.details,
    };
    if (isEdit) {
      onSubmit(initialData.id, payload);
    } else {
      onSubmit(payload);
    }
    onClose();
  };

  if (!open) return null;

  const title = isEdit ? 'Edit Package' : 'Add Package';

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="package-modal-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="package-modal-title" className={styles.title}>{title}</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <FiX size={20} />
          </button>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="pkg-name" className={styles.label}>
              Package name <span className={styles.required}>*</span>
            </label>
            <input
              id="pkg-name"
              name="name"
              type="text"
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="e.g. Basic Service"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
          </div>
          <div className={styles.field}>
            <label htmlFor="pkg-status" className={styles.label}>
              Status <span className={styles.required}>*</span>
            </label>
            <select
              id="pkg-status"
              name="status"
              className={`${styles.select} ${errors.status ? styles.inputError : ''}`}
              value={formData.status}
              onChange={handleChange}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.status && <div className={styles.errorMessage}>{errors.status}</div>}
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Package details</span>
            <div className={styles.checkboxGroup}>
              {PACKAGE_DETAIL_OPTIONS.map((opt) => (
                <label key={opt.id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.details.includes(opt.id)}
                    onChange={() => handleDetailToggle(opt.id)}
                    className={styles.checkbox}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              {isEdit ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEditPackageModal;
