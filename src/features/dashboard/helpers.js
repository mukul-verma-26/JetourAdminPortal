const DAY_ORDER = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_LABELS = {
  sunday: 'Sun',
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
};

const CHART_COLORS = ['#2196f3', '#1ba9a5', '#4caf50', '#ff9800', '#9c27b0', '#e91e63', '#00bcd4'];

export function transformBookingTrend(bookingTrend) {
  if (!bookingTrend || typeof bookingTrend !== 'object') {
    return DAY_ORDER.map((day) => ({ day: DAY_LABELS[day] || day, bookings: 0 }));
  }
  return DAY_ORDER.map((day) => ({
    day: DAY_LABELS[day] || day,
    bookings: Number(bookingTrend[day]) || 0,
  }));
}

export function transformServiceDistribution(serviceDistribution) {
  if (!Array.isArray(serviceDistribution) || serviceDistribution.length === 0) {
    return [];
  }
  return serviceDistribution.map((item, index) => ({
    name: item.package_name || 'Unknown',
    value: Number(item.percentage) || 0,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));
}
