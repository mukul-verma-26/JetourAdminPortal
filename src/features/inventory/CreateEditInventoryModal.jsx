import { FiX } from 'react-icons/fi';
import { PART_STATUS_OPTIONS } from './constants';
import styles from './CreateEditInventoryModal.module.scss';

function CreateEditInventoryModal({
  open,
  onClose,
  initialData,
  onSubmit,
  isSubmitting = false,
}) {
  if (!open) return null;

  const isEdit = Boolean(initialData?.id);
  const title = isEdit ? 'Edit Item' : 'Add Item';

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      name: form.name.value.trim(),
      quantity: parseInt(form.quantity.value, 10) || 0,
      unit_price: parseFloat(form.unit_price.value) || 0,
      part_status: form.part_status.value,
    };
    if (isEdit) {
      onSubmit(initialData.id, payload);
    } else {
      onSubmit(payload);
    }
  };

  const defaultValues = initialData
    ? {
        name: initialData.name || '',
        quantity: initialData.qtyInStock ?? initialData.quantity ?? 0,
        unit_price: initialData.unitPrice ?? initialData.unit_price ?? 0,
        part_status: initialData.partStatus ?? initialData.part_status ?? 'usable',
      }
    : {
        name: '',
        quantity: 0,
        unit_price: 0,
        part_status: 'usable',
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
            <label htmlFor="inventory-quantity" className={styles.label}>
              Quantity in Stock
            </label>
            <input
              id="inventory-quantity"
              name="quantity"
              type="number"
              min="0"
              className={styles.input}
              placeholder="0"
              defaultValue={defaultValues.quantity}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="inventory-unit_price" className={styles.label}>
              Unit Price (KWD)
            </label>
            <input
              id="inventory-unit_price"
              name="unit_price"
              type="number"
              min="0"
              step="0.001"
              className={styles.input}
              placeholder="0.000"
              defaultValue={defaultValues.unit_price}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="inventory-part_status" className={styles.label}>
              Part Status
            </label>
            <select
              id="inventory-part_status"
              name="part_status"
              className={styles.select}
              defaultValue={defaultValues.part_status || 'usable'}
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
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEdit
                  ? 'Updating...'
                  : 'Adding...'
                : isEdit
                  ? 'Update'
                  : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEditInventoryModal;
