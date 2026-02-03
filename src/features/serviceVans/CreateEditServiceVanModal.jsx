import { FiX } from 'react-icons/fi';
import { STATUS_OPTIONS } from './constants';
import styles from './CreateEditServiceVanModal.module.scss';

function CreateEditServiceVanModal({
  open,
  onClose,
  initialData,
  onSubmit,
}) {
  if (!open) return null;

  const isEdit = Boolean(initialData?.id);
  const title = isEdit ? 'Edit Vehicle' : 'Add Vehicle';

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      vehicleModel: form.vehicleModel.value.trim(),
      mileage: parseInt(form.mileage.value, 10) || 0,
      lastService: form.lastService.value,
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
    vehicleModel: '',
    mileage: 0,
    lastService: '',
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
            <label htmlFor="vehicleModel" className={styles.label}>
              Vehicle Model
            </label>
            <input
              id="vehicleModel"
              name="vehicleModel"
              type="text"
              className={styles.input}
              placeholder="e.g. Mercedes Sprinter"
              defaultValue={defaultValues.vehicleModel}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="mileage" className={styles.label}>
              Mileage (km)
            </label>
            <input
              id="mileage"
              name="mileage"
              type="number"
              min="0"
              className={styles.input}
              placeholder="0"
              defaultValue={defaultValues.mileage}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="lastService" className={styles.label}>
              Last Service Date
            </label>
            <input
              id="lastService"
              name="lastService"
              type="date"
              className={styles.input}
              defaultValue={defaultValues.lastService}
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

export default CreateEditServiceVanModal;
