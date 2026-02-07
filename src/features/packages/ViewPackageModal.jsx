import { FiX } from 'react-icons/fi';
import styles from './ViewPackageModal.module.scss';

function ViewPackageModal({ open, onClose, pkg }) {
  if (!open || !pkg) return null;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-pkg-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="view-pkg-title" className={styles.title}>Package Details</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <FiX size={20} />
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.row}>
            <span className={styles.label}>Package ID</span>
            <p className={styles.value}>{pkg.id}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Package Name</span>
            <p className={styles.value}>{pkg.name}</p>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Offerings</span>
            <ul className={styles.offeringsList}>
              {pkg.offerings.map((item) => (
                <li key={item} className={styles.offeringItem}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={styles.pricingGrid}>
            <div className={styles.priceBlock}>
              <span className={styles.label}>JETOUR T2</span>
              <p className={styles.priceValue}>
                {pkg.priceT2 === 0 ? 'Free' : `${pkg.priceT2} KD`}
              </p>
            </div>
            <div className={styles.priceBlock}>
              <span className={styles.label}>JETOUR T1</span>
              <p className={styles.priceValue}>
                {pkg.priceT1 === 0 ? 'Free' : `${pkg.priceT1} KD`}
              </p>
            </div>
          </div>
          {pkg.mileageIntervals.length > 0 && (
            <div className={styles.row}>
              <span className={styles.label}>Mileage Intervals</span>
              <p className={styles.value}>
                {pkg.mileageIntervals.map((m) => m.toLocaleString() + ' KM').join('  /  ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewPackageModal;
