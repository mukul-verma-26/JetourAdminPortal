import { FiCalendar, FiCheck, FiClock, FiDollarSign } from 'react-icons/fi';
import styles from './MetricCard.module.scss';

const ICON_MAP = {
  calendar: FiCalendar,
  check: FiCheck,
  clock: FiClock,
  dollar: FiDollarSign,
};

const ICON_CLASS_MAP = {
  calendar: styles.iconWrapCalendar,
  check: styles.iconWrapCheck,
  clock: styles.iconWrapClock,
  dollar: styles.iconWrapDollar,
};

function MetricCard({ value, label, change, changePositive, iconName }) {
  const Icon = ICON_MAP[iconName] || FiCalendar;
  const iconWrapClass = ICON_CLASS_MAP[iconName] || styles.iconWrapCalendar;
  const changeClass =
    changePositive === true
      ? styles.changePositive
      : changePositive === false
        ? styles.changeNeutral
        : styles.changeNeutral;

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={`${styles.iconWrap} ${iconWrapClass}`}>
          <Icon size={20} aria-hidden />
        </div>
        <span className={`${styles.change} ${changeClass}`}>{change}</span>
      </div>
      <p className={styles.value}>{value}</p>
      <p className={styles.label}>{label}</p>
    </article>
  );
}

export default MetricCard;
