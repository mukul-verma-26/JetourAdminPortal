import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { STATUS_OPTIONS } from './constants';
import { normalizeDetailsToItems } from './helpers';
import PackageDetailsList from './components/PackageDetailsList';
import styles from './CreateEditPackageModal.module.scss';

function CreateEditPackageModal({ open, onClose, initialData, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    status: 'active',
    work_time_minutes: '',
    details: [],
  });
  const [errors, setErrors] = useState({});

  const isEdit = Boolean(initialData?.id);

  useEffect(() => {
    if (initialData) {
      const rawDetails = initialData.details ?? [];
      const details = normalizeDetailsToItems(rawDetails, {});
      setFormData({
        name: initialData.name || '',
        status: initialData.status || 'active',
        work_time_minutes: String(initialData.work_time_minutes ?? initialData.workTimeMinutes ?? ''),
        details: details.length > 0 ? details : [],
      });
    } else {
      setFormData({ name: '', status: 'active', work_time_minutes: '', details: [] });
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
    const workTime = formData.work_time_minutes;
    if (workTime === '' || workTime == null) {
      newErrors.work_time_minutes = 'Worktime is required';
    } else {
      const num = parseInt(String(workTime), 10);
      if (Number.isNaN(num) || num < 1) {
        newErrors.work_time_minutes = 'Worktime must be at least 1 minute';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const details = formData.details
      .filter((d) => d.checked && (d.label || '').trim())
      .map((d) => d.label.trim());
    const workTimeNum = parseInt(String(formData.work_time_minutes || '0'), 10);
    const payload = {
      name: formData.name.trim(),
      status: formData.status,
      work_time_minutes: Number.isNaN(workTimeNum) ? 0 : Math.max(0, workTimeNum),
      details,
    };
    try {
      if (isEdit) {
        await onSubmit(initialData.id, payload);
      } else {
        await onSubmit(payload);
      }
    } catch {
      // Error handled in parent; keep modal open
    }
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
            <label htmlFor="pkg-work-time" className={styles.label}>
              Worktime <span className={styles.required}>*</span>
            </label>
            <input
              id="pkg-work-time"
              name="work_time_minutes"
              type="number"
              min="1"
              inputMode="numeric"
              className={`${styles.input} ${errors.work_time_minutes ? styles.inputError : ''}`}
              placeholder="e.g. 60"
              value={formData.work_time_minutes}
              onChange={handleChange}
            />
            {errors.work_time_minutes && (
              <div className={styles.errorMessage}>{errors.work_time_minutes}</div>
            )}
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
