export const ROUTE_TITLES = {
  '/': { title: 'Dashboard', subtitle: 'Today - Tuesday, January 27, 2026' },
  '/bookings': { title: 'Bookings', subtitle: null },
  '/customers': {
    title: 'Customer Management',
    subtitle: 'View and manage customer information',
  },
  '/customer-sales-data': {
    title: 'Customer Sales Data',
    subtitle: 'View and manage customer sales data',
  },
  '/technicians': { title: 'Technicians', subtitle: null },
  '/service-vans': { title: 'Service Vans', subtitle: null },
  '/inventory': { title: 'Inventory', subtitle: null },
  '/approve-inventory-parts': {
    title: 'Approve Inventory Parts',
    subtitle: 'Review and action technician part requests',
  },
  '/schedule': {
    title: 'Schedule Management',
    subtitle: 'Configure operating hours and time slots',
  },
  '/settings': {
    title: 'System Settings',
    subtitle: 'Configure system preferences and integrations',
  },
};

export function getRouteMeta(pathname) {
  return ROUTE_TITLES[pathname] || { title: 'Admin', subtitle: null };
}
