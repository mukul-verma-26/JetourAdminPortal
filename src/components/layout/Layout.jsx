import { useState } from 'react';
import { Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { getRouteMeta } from '../../constants/routeTitles';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import styles from './Layout.module.scss';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const { title, subtitle } = getRouteMeta(pathname);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  const isDashboard = pathname === '/';

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
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
