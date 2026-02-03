import { FiX } from 'react-icons/fi';
import { STATUS_OPTIONS } from './constants';
import styles from './CreateEditDriverModal.module.scss';

function CreateEditDriverModal({
  open,
  onClose,
  initialData,
  onSubmit,
}) {
  if (!open) return null;

  const isEdit = Boolean(initialData?.id);
  const title = isEdit ? 'Edit Driver' : 'Add Driver';

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      name: form.name.value.trim(),
      contact: form.contact.value.trim(),
      jobsCompleted: parseInt(form.jobsCompleted.value, 10) || 0,
      status: form.status.value,
    };
    if (isEdit) {
      onSubmit(initialData.id, payload);
    } else {
      onSubmit(payload);
    }
    onClose();
  };

  const defaultValues = initialData || {
    name: '',
    contact: '',
    jobsCompleted: 0,
    status: 'active',
  };

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
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={styles.input}
              placeholder="e.g. Ali Al-Mansoor"
              defaultValue={defaultValues.name}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="contact" className={styles.label}>
              Contact
            </label>
            <input
              id="contact"
              name="contact"
              type="tel"
              className={styles.input}
              placeholder="+965 1122 3344"
              defaultValue={defaultValues.contact}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="jobsCompleted" className={styles.label}>
              Jobs Completed
            </label>
            <input
              id="jobsCompleted"
              name="jobsCompleted"
              type="number"
              min="0"
              className={styles.input}
              placeholder="0"
              defaultValue={defaultValues.jobsCompleted}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="status" className={styles.label}>
              Status
            </label>
            <select
              id="status"
              name="status"
              className={styles.select}
              defaultValue={defaultValues.status}
              required
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
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

export default CreateEditDriverModal;
