import { useState, useEffect, useCallback, useMemo } from 'react';
import { getDashboard } from '../../api/dashboard';
import { transformBookingTrend, transformServiceDistribution } from './helpers';

const DEFAULT_DATA = {
  today_bookings: { total_count: 0, completed: 0, in_progress: 0 },
  revenue: 0,
  booking_trend: {},
  service_distribution: [],
};

export function useDashboard() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getDashboard();
      setData(result || DEFAULT_DATA);
    } catch (err) {
      console.log('useDashboard', 'Failed to fetch dashboard', err);
      setError(err);
      if (typeof window?.showToast === 'function') {
        window.showToast('Failed to load dashboard', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const metrics = useMemo(() => {
    const tb = data.today_bookings || {};
    return [
      {
        id: 'bookings',
        value: String(tb.total_count ?? 0),
        label: "Today's Bookings",
        iconName: 'calendar',
      },
      {
        id: 'completed',
        value: String(tb.completed ?? 0),
        label: 'Completed',
        iconName: 'check',
      },
      {
        id: 'in-progress',
        value: String(tb.in_progress ?? 0),
        label: 'In Progress',
        iconName: 'clock',
      },
      {
        id: 'revenue',
        value: String(data.revenue ?? 0),
        label: 'Revenue (KWD)',
        iconName: 'money',
      },
    ];
  }, [data.today_bookings, data.revenue]);

  const bookingTrendData = useMemo(
    () => transformBookingTrend(data.booking_trend),
    [data.booking_trend]
  );

  const serviceDistributionData = useMemo(
    () => transformServiceDistribution(data.service_distribution),
    [data.service_distribution]
  );

  return {
    data,
    metrics,
    bookingTrendData,
    serviceDistributionData,
    isLoading,
    error,
    refetch: fetchDashboard,
  };
}
