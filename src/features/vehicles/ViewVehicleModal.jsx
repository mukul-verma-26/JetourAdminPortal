import { FiX } from 'react-icons/fi';
import { CATEGORY_OPTIONS } from './constants';
import styles from './ViewVehicleModal.module.scss';

function getCategoryLabel(value) {
  return CATEGORY_OPTIONS.find((o) => o.value === value)?.label || value;
}

const CATEGORY_CLASS_MAP = {
  suv: 'categorySuv',
  sedan: 'categorySedan',
  hatchback: 'categoryHatchback',
};

function ViewVehicleModal({ open, onClose, vehicle }) {
  if (!open || !vehicle) return null;

  const categoryClass = styles[CATEGORY_CLASS_MAP[vehicle.category]] || '';

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-vehicle-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="view-vehicle-title" className={styles.title}>
            Vehicle Details
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

        <div className={styles.imageWrapper}>
          <img
            src={vehicle.image}
            alt={vehicle.modelName}
            className={styles.vehicleImage}
          />
        </div>

        <div className={styles.body}>
          <div className={styles.row}>
            <span className={styles.label}>Vehicle ID</span>
            <p className={styles.value}>{vehicle.id}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Model Name</span>
            <p className={styles.value}>{vehicle.modelName}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Category</span>
            <p className={styles.value}>
              <span className={`${styles.categoryBadge} ${categoryClass}`}>
                {getCategoryLabel(vehicle.category)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewVehicleModal;
