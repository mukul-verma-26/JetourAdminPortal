import { DAYS_OF_WEEK } from '../constants';
import DayCard from './DayCard';
import styles from './OperatingDaysSection.module.scss';

function OperatingDaysSection({
  operatingDays,
  error,
  onToggle,
}) {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>Operating Days</h3>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.dayCards}>
        {DAYS_OF_WEEK.map((d) => {
          const dayData = operatingDays.find((od) => od.day === d.key);
          return (
            <DayCard
              key={d.key}
              day={d.key}
              label={d.label}
              enabled={dayData?.enabled ?? false}
              onToggle={onToggle}
            />
          );
        })}
      </div>
    </section>
  );
}

export default OperatingDaysSection;
