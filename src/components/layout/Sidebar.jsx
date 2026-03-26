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
  FiClipboard,
  FiLogOut,
} from 'react-icons/fi';
import styles from './Sidebar.module.scss';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: FiBarChart2 },
  { to: '/admin/bookings', label: 'Bookings', icon: FiCalendar },
  { to: '/admin/customers', label: 'Customers', icon: FiUsers },
  { to: '/admin/customer-sales-data', label: 'Customer Sales Data', icon: FiDollarSign },
  { to: '/admin/technicians', label: 'Technicians', icon: FiTool },
  { to: '/admin/drivers', label: 'Drivers', icon: FiUser },
  { to: '/admin/service-vans', label: 'Service Vans', icon: FiTruck },
  { to: '/admin/vehicles', label: 'Vehicles', icon: FiNavigation },
  { to: '/admin/inventory', label: 'Inventory', icon: FiPackage },
  { to: '/admin/approve-inventory-parts', label: 'Approve Inventory Parts', icon: FiClipboard },
  { to: '/admin/schedule', label: 'Schedule', icon: FiClock },
  { to: '/admin/settings', label: 'Settings', icon: FiSettings },
];

function Sidebar({ isOpen, onClose, onLogout }) {
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
                  end={to === '/admin'}
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
            <li className={styles.navItem}>
              <button type="button" className={styles.logoutButton} onClick={onLogout}>
                <FiLogOut className={styles.icon} aria-hidden />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
