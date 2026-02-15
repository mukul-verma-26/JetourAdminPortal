import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import MultiDatePicker from './MultiDatePicker';
import styles from './PublicHolidaysSection.module.scss';

function PublicHolidaysSection({
  publicHolidays,
  onToggleDate,
  onRemoveHoliday,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className={styles.section}>
      <button
        type="button"
        className={styles.accordionHeader}
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        aria-controls="holidays-content"
      >
        <span id="holidays-heading" className={styles.accordionTitle}>Holidays</span>
        <FiChevronDown
          size={20}
          className={`${styles.accordionIcon} ${isExpanded ? styles.accordionIconOpen : ''}`}
          aria-hidden
        />
      </button>
      <div
        id="holidays-content"
        className={`${styles.accordionContent} ${isExpanded ? styles.accordionContentOpen : ''}`}
        role="region"
        aria-labelledby="holidays-heading"
      >
        <div className={styles.calendarCard}>
          <MultiDatePicker
            selectedDates={publicHolidays}
            onToggleDate={onToggleDate}
            onRemoveHoliday={onRemoveHoliday}
          />
        </div>
      </div>
    </section>
  );
}

export default PublicHolidaysSection;
