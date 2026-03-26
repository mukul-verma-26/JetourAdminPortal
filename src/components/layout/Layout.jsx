import { useState } from 'react';
import { Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { useAdminSession } from '../../features/adminAuth/hooks/useAdminSession';
import { getRouteMeta } from '../../constants/routeTitles';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import styles from './Layout.module.scss';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAdminSession();
  const { pathname } = useLocation();
  const { title, subtitle } = getRouteMeta(pathname);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  const isDashboard = pathname === '/admin';

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} onLogout={logout} />
      <div className={styles.mainWrapper}>
        {isDashboard && (
          <TopBar
            title={title}
            subtitle={subtitle}
            onMenuClick={openSidebar}
          />
        )}
        <main className={styles.main}>
          <Outlet context={{ setSidebarOpen: closeSidebar }} />
        </main>
      </div>
    </div>
  );
}

export function useLayoutContext() {
  return useOutletContext();
}

export default Layout;
