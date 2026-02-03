import { FiX } from 'react-icons/fi';
import { PART_STATUS_OPTIONS } from './constants';
import styles from './CreateEditInventoryModal.module.scss';

function CreateEditInventoryModal({ open, onClose, initialData, onSubmit }) {
  if (!open) return null;

  const isEdit = Boolean(initialData?.id);
  const title = isEdit ? 'Edit Item' : 'Add Item';

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      name: form.name.value.trim(),
      qtyInStock: parseInt(form.qtyInStock.value, 10) || 0,
      unitPrice: parseFloat(form.unitPrice.value) || 0,
      partStatus: form.partStatus.value,
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
    qtyInStock: 0,
    unitPrice: 0,
    partStatus: 'usable',
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="inventory-modal-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="inventory-modal-title" className={styles.title}>
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
            <label htmlFor="inventory-name" className={styles.label}>
              Item Name
            </label>
            <input
              id="inventory-name"
              name="name"
              type="text"
              className={styles.input}
              placeholder="e.g. Engine Oil Filter"
              defaultValue={defaultValues.name}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="inventory-qtyInStock" className={styles.label}>
              Quantity in Stock
            </label>
            <input
              id="inventory-qtyInStock"
              name="qtyInStock"
              type="number"
              min="0"
              className={styles.input}
              placeholder="0"
              defaultValue={defaultValues.qtyInStock}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="inventory-unitPrice" className={styles.label}>
              Unit Price (KWD)
            </label>
            <input
              id="inventory-unitPrice"
              name="unitPrice"
              type="number"
              min="0"
              step="0.001"
              className={styles.input}
              placeholder="0.000"
              defaultValue={defaultValues.unitPrice}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="inventory-partStatus" className={styles.label}>
              Part Status
            </label>
            <select
              id="inventory-partStatus"
              name="partStatus"
              className={styles.select}
              defaultValue={defaultValues.partStatus || 'usable'}
              required
            >
              {PART_STATUS_OPTIONS.map((opt) => (
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

export default CreateEditInventoryModal;
