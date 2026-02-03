import { NavLink } from 'react-router-dom';
import {
  FiBarChart2,
  FiCalendar,
  FiUsers,
  FiTruck,
  FiPackage,
  FiClock,
  FiTrendingUp,
  FiSettings,
  FiTool,
  FiUser,
} from 'react-icons/fi';
import styles from './Sidebar.module.scss';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: FiBarChart2 },
  { to: '/bookings', label: 'Bookings', icon: FiCalendar, badge: 5 },
  { to: '/customers', label: 'Customers', icon: FiUsers },
  { to: '/technicians', label: 'Technicians', icon: FiTool },
  { to: '/drivers', label: 'Drivers', icon: FiUser },
  { to: '/service-vans', label: 'Service Vans', icon: FiTruck },
  { to: '/inventory', label: 'Inventory', icon: FiPackage },
  { to: '/schedule', label: 'Schedule', icon: FiClock },
  { to: '/reports', label: 'Reports', icon: FiTrendingUp },
  { to: '/settings', label: 'Settings', icon: FiSettings },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={-1}
        aria-hidden="true"
      />
      <aside
        className={`${styles.sidebar} ${!isOpen ? styles.sidebarHidden : ''}`}
        aria-label="Main navigation"
      >
        <div className={styles.logoBlock}>
          <h2 className={styles.logoText}>JETOUR</h2>
          <p className={styles.tagline}>Admin Portal</p>
        </div>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => (
              <li key={to} className={styles.navItem}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.linkActive : ''}`
                  }
                  onClick={onClose}
                >
                  <Icon className={styles.icon} aria-hidden />
                  <span>{label}</span>
                  {badge != null && (
                    <span className={styles.badgeWrap}>
                      <span className={styles.badge}>{badge}</span>
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
