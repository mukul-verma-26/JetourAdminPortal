import MetricCard from '../features/dashboard/MetricCard';
import BookingTrendsChart from '../features/dashboard/BookingTrendsChart';
import ServiceDistributionChart from '../features/dashboard/ServiceDistributionChart';
import RecentBookings from '../features/dashboard/RecentBookings';
import ActiveAlerts from '../features/dashboard/ActiveAlerts';
import { useDashboard } from '../features/dashboard/useDashboard';
import styles from './Dashboard.module.scss';

function Dashboard() {
  const {
    metrics,
    bookingTrendData,
    serviceDistributionData,
    isLoading,
  } = useDashboard();

  if (isLoading) {
    return (
      <div className={styles.dashboard}>
        <p className={styles.loading}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <section className={styles.metrics}>
        {metrics.map((metric) => (
          <MetricCard key={metric.id} {...metric} />
        ))}
      </section>
      <section className={styles.charts}>
        <BookingTrendsChart data={bookingTrendData} />
        <ServiceDistributionChart data={serviceDistributionData} />
      </section>
      <section className={styles.sections}>
        <RecentBookings />
        <ActiveAlerts />
      </section>
    </div>
  );
}

export default Dashboard;
