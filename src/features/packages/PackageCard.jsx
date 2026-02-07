import { FiEdit2, FiTrash2, FiPackage } from 'react-icons/fi';
import styles from './PackagesScreen.module.scss';

function formatPrice(t2, t1) {
  if (t2 === 0 && t1 === 0) return 'Free';
  if (t2 === t1) return `${t2} KD`;
  return `${Math.min(t2, t1)} – ${Math.max(t2, t1)} KD`;
}

function PackageCard({ pkg, onView, onEdit, onDelete }) {
  return (
    <div className={styles.packageCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}>
          <FiPackage size={22} />
        </div>
        <div className={styles.cardInfo}>
          <h3 className={styles.packageName}>{pkg.name}</h3>
          <span className={styles.priceTag}>
            {formatPrice(pkg.priceT2, pkg.priceT1)}
          </span>
        </div>
      </div>

      <ul className={styles.offeringsList}>
        {pkg.offerings.slice(0, 3).map((item) => (
          <li key={item} className={styles.offeringItem}>{item}</li>
        ))}
        {pkg.offerings.length > 3 && (
          <li className={styles.moreItems}>+{pkg.offerings.length - 3} more</li>
        )}
      </ul>

      <div className={styles.pricingRow}>
        <div className={styles.priceCell}>
          <span className={styles.priceLabel}>JETOUR T2</span>
          <span className={styles.priceValue}>
            {pkg.priceT2 === 0 ? 'Free' : `${pkg.priceT2} KD`}
          </span>
        </div>
        <div className={styles.priceCell}>
          <span className={styles.priceLabel}>JETOUR T1</span>
          <span className={styles.priceValue}>
            {pkg.priceT1 === 0 ? 'Free' : `${pkg.priceT1} KD`}
          </span>
        </div>
      </div>

      {pkg.mileageIntervals.length > 0 && (
        <p className={styles.mileageText}>
          {pkg.mileageIntervals.map((m) => m.toLocaleString()).join(' / ')} KM
        </p>
      )}

      <div className={styles.cardActions}>
        <button type="button" className={styles.viewBtn} onClick={() => onView(pkg)}>
          View Details
        </button>
        <button type="button" className={styles.editBtn} onClick={() => onEdit(pkg)} aria-label={`Edit ${pkg.name}`}>
          <FiEdit2 size={18} />
        </button>
        <button type="button" className={styles.deleteBtn} onClick={() => onDelete(pkg)} aria-label={`Delete ${pkg.name}`}>
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default PackageCard;
