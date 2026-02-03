import { FiInfo, FiMenu } from 'react-icons/fi';
import styles from './TopBar.module.scss';

function TopBar({ title, subtitle, onMenuClick }) {
  return (
    <header className={styles.topBar}>
      <div className={styles.heading}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <FiMenu size={20} />
        </button>
        <button
          type="button"
          className={styles.infoButton}
          aria-label="Information"
        >
          <FiInfo size={20} />
        </button>
        <div className={styles.avatar} aria-hidden>AD</div>
      </div>
    </header>
  );
}

export default TopBar;
