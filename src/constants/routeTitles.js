export const ROUTE_TITLES = {
  '/': { title: 'Dashboard', subtitle: 'Today - Tuesday, January 27, 2026' },
  '/bookings': { title: 'Bookings', subtitle: null },
  '/customers': {
    title: 'Customer Management',
    subtitle: 'View and manage customer information',
  },
  '/technicians': { title: 'Technicians', subtitle: null },
  '/service-vans': { title: 'Service Vans', subtitle: null },
  '/inventory': { title: 'Inventory', subtitle: null },
  '/schedule': { title: 'Schedule', subtitle: null },
  '/reports': { title: 'Reports', subtitle: null },
  '/settings': { title: 'Settings', subtitle: null },
};

export function getRouteMeta(pathname) {
  return ROUTE_TITLES[pathname] || { title: 'Admin', subtitle: null };
}
