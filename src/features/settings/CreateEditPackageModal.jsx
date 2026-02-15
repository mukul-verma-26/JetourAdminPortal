import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { STATUS_OPTIONS, PACKAGE_DETAIL_OPTIONS } from './constants';
import { normalizeDetailsToItems } from './helpers';
import PackageDetailsList from './components/PackageDetailsList';
import styles from './CreateEditPackageModal.module.scss';

const DETAIL_OPTION_LOOKUP = Object.fromEntries(
  PACKAGE_DETAIL_OPTIONS.map((o) => [o.id, o.label])
);

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
      const rawDetails = initialData.details ?? [];
      const details = normalizeDetailsToItems(rawDetails, DETAIL_OPTION_LOOKUP);
      setFormData({
        name: initialData.name || '',
        status: initialData.status || 'active',
        details: details.length > 0 ? details : [],
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

  const handleDetailsChange = (details) => {
    setFormData((prev) => ({ ...prev, details }));
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
    const details = formData.details
      .filter((d) => d.checked && (d.label || '').trim())
      .map((d) => ({ id: d.id, label: d.label.trim() }));
    const payload = {
      name: formData.name.trim(),
      status: formData.status,
      details,
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
            <PackageDetailsList
              items={formData.details}
              onChange={handleDetailsChange}
            />
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
