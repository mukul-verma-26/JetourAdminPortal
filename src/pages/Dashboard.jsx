import MetricCard from '../features/dashboard/MetricCard';
import BookingTrendsChart from '../features/dashboard/BookingTrendsChart';
import ServiceDistributionChart from '../features/dashboard/ServiceDistributionChart';
import RecentBookings from '../features/dashboard/RecentBookings';
import ActiveAlerts from '../features/dashboard/ActiveAlerts';
import { DASHBOARD_METRICS } from '../features/dashboard/constants';
import styles from './Dashboard.module.scss';

function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <section className={styles.metrics}>
        {DASHBOARD_METRICS.map((metric) => (
          <MetricCard key={metric.id} {...metric} />
        ))}
      </section>
      <section className={styles.charts}>
        <BookingTrendsChart />
        <ServiceDistributionChart />
      </section>
      <section className={styles.sections}>
        <RecentBookings />
        <ActiveAlerts />
      </section>
    </div>
  );
}

export default Dashboard;
