export const ROUTE_TITLES = {
  '/admin': { title: 'Dashboard', subtitle: 'Today - Tuesday, January 27, 2026' },
  '/admin/bookings': { title: 'Bookings', subtitle: null },
  '/admin/customers': {
    title: 'Customer Management',
    subtitle: 'View and manage customer information',
  },
  '/admin/customer-sales-data': {
    title: 'Customer Sales Data',
    subtitle: 'View and manage customer sales data',
  },
  '/admin/technicians': { title: 'Technicians', subtitle: null },
  '/admin/service-vans': { title: 'Service Vans', subtitle: null },
  '/admin/inventory': { title: 'Inventory', subtitle: null },
  '/admin/approve-inventory-parts': {
    title: 'Approve Inventory Parts',
    subtitle: 'Review and action technician part requests',
  },
  '/admin/schedule': {
    title: 'Schedule Management',
    subtitle: 'Configure operating hours and time slots',
  },
  '/admin/settings': {
    title: 'System Settings',
    subtitle: 'Configure system preferences and integrations',
  },
};

export function getRouteMeta(pathname) {
  return ROUTE_TITLES[pathname] || { title: 'Admin', subtitle: null };
}
