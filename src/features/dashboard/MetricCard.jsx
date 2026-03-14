import { FiCalendar, FiCheck, FiClock } from 'react-icons/fi';
import { FaMoneyBillWave } from 'react-icons/fa';
import styles from './MetricCard.module.scss';

const ICON_MAP = {
  calendar: FiCalendar,
  check: FiCheck,
  clock: FiClock,
  money: FaMoneyBillWave,
};

const ICON_CLASS_MAP = {
  calendar: styles.iconWrapCalendar,
  check: styles.iconWrapCheck,
  clock: styles.iconWrapClock,
  money: styles.iconWrapDollar,
};

function MetricCard({ value, label, iconName, tag }) {
  const Icon = iconName ? ICON_MAP[iconName] || FiCalendar : null;
  const iconWrapClass = iconName
    ? ICON_CLASS_MAP[iconName] || styles.iconWrapCalendar
    : '';

  return (
    <article className={styles.card}>
      {Icon ? (
        <div className={styles.header}>
          <div className={`${styles.iconWrap} ${iconWrapClass}`}>
            <Icon size={20} aria-hidden />
          </div>
        </div>
      ) : null}
      <p className={styles.value}>{value}</p>
      <p className={styles.label}>
        <span>{label}</span>
        {tag ? <span className={`${styles.badge} _badge_lfh32_28`}>{tag}</span> : null}
      </p>
    </article>
  );
}

export default MetricCard;
