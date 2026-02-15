import { NavLink } from 'react-router-dom';
import logoJetour from '../../assets/logo-jetour.png';
import {
  FiBarChart2,
  FiCalendar,
  FiUsers,
  FiTruck,
  FiPackage,
  FiClock,
  FiSettings,
  FiTool,
  FiUser,
  FiNavigation,
  FiDollarSign,
} from 'react-icons/fi';
import styles from './Sidebar.module.scss';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: FiBarChart2 },
  { to: '/bookings', label: 'Bookings', icon: FiCalendar },
  { to: '/customers', label: 'Customers', icon: FiUsers },
  { to: '/customer-sales-data', label: 'Customer Sales Data', icon: FiDollarSign },
  { to: '/technicians', label: 'Technicians', icon: FiTool },
  { to: '/drivers', label: 'Drivers', icon: FiUser },
  { to: '/service-vans', label: 'Service Vans', icon: FiTruck },
  { to: '/vehicles', label: 'Vehicles', icon: FiNavigation },
  { to: '/inventory', label: 'Inventory', icon: FiPackage },
  { to: '/schedule', label: 'Schedule', icon: FiClock },
  { to: '/settings', label: 'Settings', icon: FiSettings },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className={`${styles.overlay} ${styles.overlayVisible}`}
          onClick={onClose}
          onKeyDown={(e) => e.key === 'Escape' && onClose()}
          role="button"
          tabIndex={-1}
          aria-hidden="true"
        />
      )}
      <aside
        className={`${styles.sidebar} ${!isOpen ? styles.sidebarHidden : ''}`}
        aria-label="Main navigation"
      >
        <div className={styles.logoBlock}>
          <img
            src={logoJetour}
            alt="Jetour"
            className={styles.logoImg}
          />
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
