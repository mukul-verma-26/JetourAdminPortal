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
    worktime: '',
    details: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = Boolean(initialData?.id);

  useEffect(() => {
    if (initialData) {
      const rawDetails = initialData.details ?? [];
      const details = normalizeDetailsToItems(rawDetails, {});
      setFormData({
        name: initialData.name || '',
        status: initialData.status || 'active',
        worktime: String(initialData.worktime ?? initialData.work_time_minutes ?? initialData.workTimeMinutes ?? ''),
        details: details.length > 0 ? details : [],
      });
    } else {
      setFormData({ name: '', status: 'active', worktime: '', details: [] });
    }
    setErrors({});
    setIsSubmitting(false);
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
    const workTime = formData.worktime;
    if (workTime === '' || workTime == null) {
      newErrors.worktime = 'Work time is required';
    } else {
      const num = parseInt(String(workTime), 10);
      if (Number.isNaN(num) || num < 1) {
        newErrors.worktime = 'Work time must be at least 1 minute';
      }
    }
    const checkedDetails = formData.details.filter((d) => d.checked && (d.label || '').trim());
    if (checkedDetails.length === 0) newErrors.details = 'At least one package detail is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;
    const details = formData.details
      .filter((d) => d.checked && (d.label || '').trim())
      .map((d) => d.label.trim());
    const workTimeNum = parseInt(String(formData.worktime), 10);
    const payload = {
      name: formData.name.trim(),
      status: formData.status,
      worktime: workTimeNum,
      details,
    };
    try {
      setIsSubmitting(true);
      if (isEdit) {
        await onSubmit(initialData.id, payload);
      } else {
        await onSubmit(payload);
      }
    } catch {
      // Error handled in parent; keep modal open
    } finally {
      setIsSubmitting(false);
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
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
            disabled={isSubmitting}
          >
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
              Work Time (In Minutes) <span className={styles.required}>*</span>
            </label>
            <input
              id="pkg-work-time"
              name="worktime"
              type="number"
              min="1"
              inputMode="numeric"
              className={`${styles.input} ${errors.worktime ? styles.inputError : ''}`}
              placeholder="e.g. 60"
              value={formData.worktime}
              onChange={handleChange}
            />
            {errors.worktime && (
              <div className={styles.errorMessage}>{errors.worktime}</div>
            )}
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Package details <span className={styles.required}>*</span></span>
            <PackageDetailsList
              items={formData.details}
              onChange={handleDetailsChange}
            />
            {errors.details && <div className={styles.errorMessage}>{errors.details}</div>}
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEditPackageModal;
