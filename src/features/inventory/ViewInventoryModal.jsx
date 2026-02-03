import { FiX } from 'react-icons/fi';
import { STOCK_STATUS_OPTIONS, PART_STATUS_OPTIONS } from './constants';
import styles from './ViewInventoryModal.module.scss';

function getStockStatusLabel(value) {
  return STOCK_STATUS_OPTIONS.find((o) => o.value === value)?.label || value;
}

function getPartStatusLabel(value) {
  return PART_STATUS_OPTIONS.find((o) => o.value === value)?.label || value;
}

function formatAddedDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatPrice(price) {
  if (price === undefined || price === null) return '—';
  return `${parseFloat(price).toFixed(3)} KWD`;
}

const STOCK_STATUS_CLASS_MAP = {
  in_stock: styles.statusInStock,
  low_stock: styles.statusLowStock,
  out_of_stock: styles.statusOutOfStock,
};

const PART_STATUS_CLASS_MAP = {
  usable: styles.partUsable,
  damaged: styles.partDamaged,
};

function ViewInventoryModal({ open, onClose, item }) {
  if (!open || !item) return null;

  const stockStatusClass =
    STOCK_STATUS_CLASS_MAP[item.stockStatus] || styles.statusInStock;
  const partStatusClass =
    PART_STATUS_CLASS_MAP[item.partStatus] || styles.partUsable;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-inventory-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="view-inventory-title" className={styles.title}>
            Item Details
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
        <div className={styles.body}>
          <div className={styles.row}>
            <span className={styles.label}>Item ID</span>
            <p className={styles.value}>{item.itemId}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Name</span>
            <p className={styles.value}>{item.name}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Quantity in Stock</span>
            <p className={styles.value}>{item.qtyInStock}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Unit Price</span>
            <p className={styles.value}>{formatPrice(item.unitPrice)}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Added Date</span>
            <p className={styles.value}>{formatAddedDate(item.addedDate)}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Stock Status</span>
            <p className={styles.value}>
              <span className={`${styles.statusBadge} ${stockStatusClass}`}>
                {getStockStatusLabel(item.stockStatus)}
              </span>
            </p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Part Status</span>
            <p className={styles.value}>
              <span className={`${styles.partBadge} ${partStatusClass}`}>
                {getPartStatusLabel(item.partStatus)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewInventoryModal;
