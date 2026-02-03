import { FiX } from 'react-icons/fi';
import { EXPERTISE_OPTIONS, STATUS_OPTIONS } from './constants';
import styles from './CreateEditTechnicianModal.module.scss';

function CreateEditTechnicianModal({
  open,
  onClose,
  initialData,
  onSubmit,
}) {
  if (!open) return null;

  const isEdit = Boolean(initialData?.id);
  const title = isEdit ? 'Edit Technician' : 'Add Technician';

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      name: form.name.value.trim(),
      contact: form.contact.value.trim(),
      expertise: form.expertise.value,
      jobsCompleted: parseInt(form.jobsCompleted.value, 10) || 0,
      rating: parseFloat(form.rating.value) || 0,
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
    expertise: 'all_services',
    jobsCompleted: 0,
    rating: 0,
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
              placeholder="e.g. Mohammed Al-Ahmad"
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
              placeholder="+965 1111 2222"
              defaultValue={defaultValues.contact}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="expertise" className={styles.label}>
              Expertise
            </label>
            <select
              id="expertise"
              name="expertise"
              className={styles.select}
              defaultValue={defaultValues.expertise}
              required
            >
              {EXPERTISE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
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
            <label htmlFor="rating" className={styles.label}>
              Rating
            </label>
            <input
              id="rating"
              name="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              className={styles.input}
              placeholder="0.0"
              defaultValue={defaultValues.rating}
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

export default CreateEditTechnicianModal;
