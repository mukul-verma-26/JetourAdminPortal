import { FiX } from 'react-icons/fi';
import styles from './CreateEditPackageModal.module.scss';

function CreateEditPackageModal({ open, onClose, initialData, onSubmit }) {
  if (!open) return null;

  const isEdit = Boolean(initialData?.id);
  const title = isEdit ? 'Edit Package' : 'Add Package';
  const defaults = initialData || {
    name: '',
    offerings: [],
    priceT2: '',
    priceT1: '',
    mileageIntervals: [],
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const f = e.target;
    const payload = {
      name: f.packageName.value.trim(),
      offerings: f.offerings.value
        .trim()
        .split('\n')
        .filter(Boolean)
        .map((s) => s.trim()),
      priceT2: parseFloat(f.priceT2.value) || 0,
      priceT1: parseFloat(f.priceT1.value) || 0,
      mileageIntervals: f.mileageIntervals.value
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n)),
    };
    if (isEdit) {
      onSubmit(initialData.id, payload);
    } else {
      onSubmit(payload);
    }
    onClose();
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pkg-modal-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="pkg-modal-title" className={styles.title}>{title}</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <FiX size={20} />
          </button>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="packageName" className={styles.label}>Package Name</label>
            <input
              id="packageName"
              name="packageName"
              type="text"
              className={styles.input}
              placeholder="e.g. M1 - Basic Maintenance"
              defaultValue={defaults.name}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="offerings" className={styles.label}>Offerings (one per line)</label>
            <textarea
              id="offerings"
              name="offerings"
              className={styles.textarea}
              placeholder={'Engine oil change\nOil filter replacement\nBasic vehicle inspection'}
              defaultValue={defaults.offerings.join('\n')}
              required
              rows={5}
            />
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="priceT2" className={styles.label}>Price — JETOUR T2 (KD)</label>
              <input id="priceT2" name="priceT2" type="number" min="0" step="0.01" className={styles.input} placeholder="0" defaultValue={defaults.priceT2} required />
            </div>
            <div className={styles.field}>
              <label htmlFor="priceT1" className={styles.label}>Price — JETOUR T1 (KD)</label>
              <input id="priceT1" name="priceT1" type="number" min="0" step="0.01" className={styles.input} placeholder="0" defaultValue={defaults.priceT1} required />
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor="mileageIntervals" className={styles.label}>Mileage Intervals (KM, comma-separated)</label>
            <input
              id="mileageIntervals"
              name="mileageIntervals"
              type="text"
              className={styles.input}
              placeholder="e.g. 10000, 50000, 70000"
              defaultValue={defaults.mileageIntervals.join(', ')}
            />
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>{isEdit ? 'Update' : 'Add Package'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEditPackageModal;
