export const DASHBOARD_METRICS = [
  {
    id: 'bookings',
    value: '47',
    label: "Today's Bookings",
    change: '+12%',
    changePositive: true,
    iconName: 'calendar',
  },
  {
    id: 'completed',
    value: '32',
    label: 'Completed',
    change: '+8%',
    changePositive: true,
    iconName: 'check',
  },
  {
    id: 'in-progress',
    value: '15',
    label: 'In Progress',
    change: '--',
    changePositive: null,
    iconName: 'clock',
  },
  {
    id: 'revenue',
    value: '2.4K',
    label: 'Revenue (KWD)',
    change: '+15%',
    changePositive: true,
    iconName: 'dollar',
  },
];

export const BOOKING_TRENDS_DATA = [
  { day: 'Mon', bookings: 32 },
  { day: 'Tue', bookings: 38 },
  { day: 'Wed', bookings: 42 },
  { day: 'Thu', bookings: 45 },
  { day: 'Fri', bookings: 48 },
  { day: 'Sat', bookings: 52 },
  { day: 'Sun', bookings: 47 },
];

export const SERVICE_DISTRIBUTION_DATA = [
  { name: 'Standard', value: 45, color: '#2196f3' },
  { name: 'Premium', value: 30, color: '#1ba9a5' },
  { name: 'Basic', value: 25, color: '#4caf50' },
];
