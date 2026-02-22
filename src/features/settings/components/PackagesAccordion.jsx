import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import ServicePackageCard from './ServicePackageCard';
import styles from './PackagesAccordion.module.scss';

function PackagesAccordion({
  packages,
  isLoading,
  onAddPackage,
  onConfigurePackage,
  onManagePackage,
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <section className={styles.section}>
      <div className={styles.accordionHeader}>
        <button
          type="button"
          className={styles.accordionTrigger}
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-controls="packages-content"
        >
          <span id="packages-heading" className={styles.accordionTitle}>
            Packages
          </span>
          <FiChevronDown
            size={20}
            className={`${styles.accordionIcon} ${isExpanded ? styles.accordionIconOpen : ''}`}
            aria-hidden
          />
        </button>
        <button
          type="button"
          className={styles.addBtn}
          onClick={onAddPackage}
          aria-label="Add package"
        >
          Add Package
        </button>
      </div>
      <div
        id="packages-content"
        className={`${styles.accordionContent} ${isExpanded ? styles.accordionContentOpen : ''}`}
        role="region"
        aria-labelledby="packages-heading"
      >
        <div className={styles.contentInner}>
          {isLoading ? (
            <div className={styles.emptyState}>
              <p>Loading packages...</p>
            </div>
          ) : packages.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No packages yet. Add one to get started.</p>
            </div>
          ) : (
            <div className={styles.cardsList}>
              {packages.map((pkg) => (
                <ServicePackageCard
                  key={pkg.id}
                  name={pkg.name}
                  description={pkg.description}
                  onConfigure={() => onConfigurePackage(pkg.id)}
                  onManage={() => onManagePackage(pkg.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default PackagesAccordion;
